# Azure Function App — Required Portal Configuration

The Function App host may run (default landing page) while **all `/api/*` routes return 404** if the worker runtime is misconfigured or code was not deployed correctly.

## Required Application Settings

**Azure Portal → DigitalTwin → Settings → Environment variables**

| Name | Value | Required |
|---|---|---|
| `FUNCTIONS_WORKER_RUNTIME` | `dotnet-isolated` | **Yes** |
| `FUNCTIONS_EXTENSION_VERSION` | `~4` | **Yes** |
| `AzureWebJobsStorage` | Storage connection string | **Yes** (auto-set) |
| `OPENAI_API_KEY` | Your OpenAI key | **Yes** (chat) |
| `OPENAI_MODEL` | `gpt-4o-mini` | No |
| `ALLOWED_ORIGINS` | `https://manibuildsai.com,https://proud-smoke-089604410.2.azurestaticapps.net` | **Yes** |
| `CONTACT_EMAIL` | `mani.ainml@gmail.com` | Contact form |
| `SENDGRID_API_KEY` | SendGrid key | Contact form |
| `SENDGRID_FROM_EMAIL` | Verified sender | Contact form |

## Required General Settings

**Azure Portal → DigitalTwin → Configuration → General settings**

| Setting | Required value |
|---|---|
| **Stack** | `.NET` |
| **Version** | **`.NET 8 Isolated`** (must match `net8.0` in csproj — **not .NET 10**) |
| **SCM Basic Auth Publishing Credentials** | **On** (required for CI/CD zip deploy) |

Save → **Restart** the Function App.

## Verify endpoints

After deploy, these must work:

| URL | Expected |
|---|---|
| `GET /api/health` | HTTP 200 JSON `{ "status": "healthy" }` |
| `GET /api/docs` | HTTP 200 HTML test page |
| `GET /api/swagger` | HTTP 200 OpenAPI JSON |
| `POST /api/chat` | HTTP 200 assistant reply |

Base URL: `https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net`

## If `/api/health` returns 404

1. Confirm zip deploy succeeded in GitHub Actions (health check step)
2. Set `FUNCTIONS_WORKER_RUNTIME=dotnet-isolated` and stack to **.NET 8 Isolated**
3. Restart the Function App
4. Re-run **Deploy Backend — Azure Functions** workflow (`workflow_dispatch`)

## If `/api/chat` returns 503

`OPENAI_API_KEY` is missing or invalid in Application Settings.
