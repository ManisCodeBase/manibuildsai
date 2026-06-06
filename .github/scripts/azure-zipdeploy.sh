#!/usr/bin/env bash
set -euo pipefail

ZIP_FILE="${1:-deploy.zip}"

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
deploy_url = f"https://{publish_url}/api/zipdeploy?isAsync=true"

netrc_path = "/tmp/azure-scm.netrc"
with open(netrc_path, "w", encoding="utf-8") as netrc:
    netrc.write(f"machine {host}\n")
    netrc.write(f"login {username}\n")
    netrc.write(f"password {password}\n")
os.chmod(netrc_path, 0o600)

with open("/tmp/azure-deploy.env", "w", encoding="utf-8") as env_file:
    env_file.write(f"DEPLOY_URL={deploy_url}\n")
    env_file.write(f"NETRC_PATH={netrc_path}\n")
    env_file.write(f"SCM_HOST={host}\n")
    env_file.write(f"SCM_USER={username}\n")

print(f"Deploy target: https://{publish_url}/api/zipdeploy")
print(f"SCM user: {username[:2]}***")
PY

# shellcheck disable=SC1091
source /tmp/azure-deploy.env

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

echo "Deploy HTTP status: $HTTP_CODE"
if [[ -s /tmp/deploy-response.txt ]]; then
  head -c 1000 /tmp/deploy-response.txt || true
  echo ""
fi

if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -ge 400 ]]; then
  echo "::error::Zip deploy failed with HTTP $HTTP_CODE."
  echo "::error::Fix in Azure Portal -> DigitalTwin -> Configuration -> General settings:"
  echo "::error::  1. Set 'SCM Basic Auth Publishing Credentials' to ON"
  echo "::error::  2. Save and restart the Function App"
  echo "::error::  3. Download a NEW publish profile"
  echo "::error::  4. Update GitHub secret AZURE_FUNCTIONAPP_PUBLISH_PROFILE"
  exit 1
fi

echo "Zip deploy completed successfully."
