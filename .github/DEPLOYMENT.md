# Deployment Configuration — manibuildsai.com

## Azure Function App (Digital Twin API)

| Setting | Value |
|---|---|
| **App name** | `DigitalTwin` |
| **URL** | `https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net` |
| **Region** | Canada Central |
| **Routes** | `/api/chat`, `/api/contact` |
| **Runtime (required)** | **`.NET 8 Isolated`** — must match `net8.0` in the csproj |

> If you selected **.NET 10** when creating the Function App, change it:  
> **Azure Portal → DigitalTwin → Settings → Configuration → General settings → Stack → .NET → Version → `.NET 8 Isolated`**  
> Otherwise the app will fail at runtime even if deploy succeeds.

---

## GitHub Actions — troubleshooting

### "Repository access blocked"

Some GitHub organizations block third-party Marketplace actions (e.g. `Azure/functions-action`).  
This workflow deploys via **Kudu Zip Deploy** using only GitHub-owned actions (`checkout`, `setup-dotnet`, `upload-artifact`, `download-artifact`).

If the error persists, check **GitHub → Organization Settings → Actions → General → Policies** and ensure GitHub-owned actions are allowed.

### Zip deploy "401 Unauthorized"

1. **Azure Portal → DigitalTwin → Configuration → General settings**
2. Set **SCM Basic Auth Publishing Credentials** → **On**
3. **Save** and **restart** the Function App
4. **Download a new publish profile** (Overview → Get publish profile)
5. Update GitHub secret **`AZURE_FUNCTIONAPP_PUBLISH_PROFILE`** with the full new XML

Also confirm the Function App is **Running** and not restricted by networking rules blocking the GitHub Actions runner.

### All `/api/*` endpoints return 404

The Function App host is running but **no functions are loaded**. See **[back-end/AZURE-SETUP.md](../back-end/AZURE-SETUP.md)**.

Quick fix checklist:

1. Set **`FUNCTIONS_WORKER_RUNTIME`** = `dotnet-isolated`
2. Set **Stack** = **`.NET 8 Isolated`** (not .NET 10)
3. Restart the app
4. Re-run **Deploy Backend — Azure Functions** (Actions → Run workflow)

---

## GitHub Actions — required configuration

Go to **GitHub → repo → Settings → Secrets and variables → Actions**.

### Secrets (Sensitive)

| Secret name | How to set |
|---|---|
| `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Paste the **entire contents** of `DigitalTwin.PublishSettings` (XML file from Azure Portal → Function App → Get publish profile) |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Portal → Static Web App → Deployment token |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | web3forms.com access key |

### Variables (Non-sensitive)

| Variable name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://manibuildsai.com` |
| `GITHUB_USERNAME` | `maniscodebase` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net` | **Required for Digital Twin** — SWA static host returns 405 for POST `/api/chat` unless the Function App is linked |

> `AZURE_FUNCTIONAPP_NAME` is no longer required — the workflow uses `DigitalTwin` directly.

---

## Azure Function App — Application Settings

Configure in **Azure Portal → DigitalTwin → Settings → Environment variables**.

| Setting | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | **Yes** | OpenAI API key (Digital Twin) |
| `OPENAI_MODEL` | No | Default: `gpt-4o-mini` |
| `SENDGRID_API_KEY` | Contact form | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Contact form | Verified sender |
| `CONTACT_EMAIL` | Contact form | `mani.ainml@gmail.com` |
| `ALLOWED_ORIGINS` | Yes | `https://manibuildsai.com,https://proud-smoke-089604410.2.azurestaticapps.net` |
| `FUNCTIONS_WORKER_RUNTIME` | Yes | `dotnet-isolated` |
| `AzureWebJobsStorage` | Yes | Auto-configured by Azure |

### Set via Azure CLI (after `az login`)

Replace `<resource-group>` with your Function App resource group:

```powershell
az functionapp config appsettings set `
  --name DigitalTwin `
  --resource-group <resource-group> `
  --settings `
    OPENAI_API_KEY="<your-openai-key>" `
    OPENAI_MODEL="gpt-4o-mini" `
    ALLOWED_ORIGINS="https://manibuildsai.com,https://proud-smoke-089604410.2.azurestaticapps.net" `
    CONTACT_EMAIL="mani.ainml@gmail.com"
```

---

## Link Function App to Static Web App

**Azure Portal → Static Web App → Settings → APIs → Link existing function app**

- Select **DigitalTwin**
- This proxies `/api/chat` and `/api/contact` through the SWA (same origin, no CORS)

---

## Local development

| File | Key settings |
|---|---|
| `back-end/local.settings.json` | `OPENAI_API_KEY`, `OPENAI_MODEL` |
| `front-end/.env.local` | `NEXT_PUBLIC_BACKEND_URL=http://localhost:7071` |

Run:

```bash
cd back-end && func start          # http://localhost:7071/api/chat
cd front-end && npm run dev        # http://localhost:3000
```

---

## Verify deployment

1. **Chat endpoint** (after deploy + app settings):
   ```bash
   curl -X POST https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net/api/chat \
     -H "Content-Type: application/json" \
     -d "{\"messages\":[{\"role\":\"user\",\"content\":\"What AI projects has Mani built?\"}]}"
   ```

2. **Via SWA** (after linking backend):
   ```bash
   curl -X POST https://manibuildsai.com/api/chat \
     -H "Content-Type: application/json" \
     -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Tell me about Mani's experience\"}]}"
   ```

3. Check Function App logs for `cached_tokens` to confirm OpenAI prompt caching.
