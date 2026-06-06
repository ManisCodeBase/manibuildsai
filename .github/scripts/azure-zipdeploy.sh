#!/usr/bin/env bash
set -euo pipefail

ZIP_FILE="${1:-deploy.zip}"
HEALTH_URL="${2:-https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net/api/health}"

if [[ ! -f "$ZIP_FILE" ]]; then
  echo "::error::Package not found: $ZIP_FILE"
  exit 1
fi

if [[ -z "${PUBLISH_PROFILE:-}" ]]; then
  echo "::error::AZURE_FUNCTIONAPP_PUBLISH_PROFILE secret is not set."
  exit 1
fi

python3 <<'PY'
import html
import os
import shlex
import sys
import xml.etree.ElementTree as ET

profile_xml = os.environ.get("PUBLISH_PROFILE", "").strip()
if profile_xml.startswith("\ufeff"):
    profile_xml = profile_xml.lstrip("\ufeff")

if not profile_xml.startswith("<"):
    print("::error::Publish profile must be the full XML from Azure (Download publish profile).")
    sys.exit(1)

try:
    root = ET.fromstring(profile_xml)
except ET.ParseError as exc:
    print(f"::error::Publish profile XML is invalid: {exc}")
    sys.exit(1)

zip_profile = next(
    (node for node in root.findall("publishProfile") if node.get("publishMethod") == "ZipDeploy"),
    None,
)
if zip_profile is None:
    print("::error::ZipDeploy profile not found in publish settings.")
    sys.exit(1)

publish_url = zip_profile.get("publishUrl", "").replace(":443", "")
username = html.unescape(zip_profile.get("userName", "")).strip()
password = html.unescape(zip_profile.get("userPWD", "")).strip()

if not publish_url or not username or not password:
    print("::error::Publish profile is missing publishUrl, userName, or userPWD.")
    sys.exit(1)

host = publish_url.split("/")[0]
scm_base = f"https://{publish_url}"
deploy_url = f"{scm_base}/api/zipdeploy?isAsync=true"

netrc_path = "/tmp/azure-scm.netrc"
with open(netrc_path, "w", encoding="utf-8") as netrc:
    netrc.write(f"machine {host}\n")
    netrc.write(f"login {username}\n")
    netrc.write(f"password {password}\n")
os.chmod(netrc_path, 0o600)

with open("/tmp/azure-deploy.env", "w", encoding="utf-8") as env_file:
    env_file.write(f"DEPLOY_URL={shlex.quote(deploy_url)}\n")
    env_file.write(f"NETRC_PATH={shlex.quote(netrc_path)}\n")
    env_file.write(f"SCM_BASE={shlex.quote(scm_base)}\n")

print(f"Deploy target: {scm_base}/api/zipdeploy")
print(f"SCM user: {username[:2]}***")
PY

set -a
# shellcheck disable=SC1091
source /tmp/azure-deploy.env
set +a

echo "Zip package size: $(du -h "$ZIP_FILE" | cut -f1)"

HTTP_CODE="$(curl \
  --silent \
  --show-error \
  --netrc-file "$NETRC_PATH" \
  --request POST \
  --data-binary @"$ZIP_FILE" \
  --header "Content-Type: application/zip" \
  --write-out "%{http_code}" \
  --output /tmp/deploy-response.txt \
  "$DEPLOY_URL")"

echo "Zip deploy HTTP status: $HTTP_CODE"
if [[ -s /tmp/deploy-response.txt ]]; then
  head -c 1000 /tmp/deploy-response.txt || true
  echo ""
fi

if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -ge 400 ]]; then
  echo "::error::Zip deploy failed with HTTP $HTTP_CODE."
  echo "::error::Enable SCM Basic Auth, restart the app, refresh publish profile secret."
  exit 1
fi

echo "Waiting for deployment to finish..."
for _ in $(seq 1 36); do
  DEPLOY_STATUS="$(curl \
    --silent \
    --show-error \
    --netrc-file "$NETRC_PATH" \
    "${SCM_BASE}/api/deployments/latest" \
    | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status',''))")"

  DEPLOY_TEXT="$(curl \
    --silent \
    --show-error \
    --netrc-file "$NETRC_PATH" \
    "${SCM_BASE}/api/deployments/latest" \
    | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status_text',''))")"

  echo "Deployment status: $DEPLOY_STATUS ($DEPLOY_TEXT)"

  if [[ "$DEPLOY_STATUS" == "4" ]]; then
    break
  fi

  if [[ "$DEPLOY_STATUS" == "3" ]]; then
    echo "::error::Azure deployment failed: $DEPLOY_TEXT"
    exit 1
  fi

  sleep 5
done

echo "Syncing function triggers..."
SYNC_CODE="$(curl \
  --silent \
  --show-error \
  --netrc-file "$NETRC_PATH" \
  --request POST \
  --write-out "%{http_code}" \
  --output /tmp/sync-response.txt \
  "${SCM_BASE}/api/functions/sync")"
echo "Function sync HTTP status: $SYNC_CODE"

echo "Verifying health endpoint: $HEALTH_URL"
for attempt in $(seq 1 18); do
  HEALTH_CODE="$(curl \
    --silent \
    --show-error \
    --write-out "%{http_code}" \
    --output /tmp/health-response.txt \
    "$HEALTH_URL")"

  if [[ "$HEALTH_CODE" == "200" ]]; then
    echo "Health check passed on attempt $attempt."
    head -c 500 /tmp/health-response.txt || true
    echo ""
    echo "Zip deploy completed successfully."
    exit 0
  fi

  echo "Attempt $attempt: health returned HTTP $HEALTH_CODE (retrying in 10s)..."
  sleep 10
done

echo "::error::Deploy finished but $HEALTH_URL returned HTTP $HEALTH_CODE."
echo "::error::Check Azure Portal -> DigitalTwin -> Configuration:"
echo "::error::  FUNCTIONS_WORKER_RUNTIME = dotnet-isolated"
echo "::error::  FUNCTIONS_EXTENSION_VERSION = ~4"
echo "::error::  Stack = .NET 8 Isolated (not .NET 10)"
if [[ -s /tmp/health-response.txt ]]; then
  head -c 500 /tmp/health-response.txt || true
  echo ""
fi
exit 1
