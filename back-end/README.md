# manibuildsai.com — Back-end



.NET 8 Azure Functions (Isolated Worker) serving the API layer for **manibuildsai.com**.



## Functions



| Route | Method | Description |

|---|---|---|

| `/api/contact` | POST | Contact form → SendGrid email |

| `/api/chat` | POST | Digital Twin AI chat (OpenAI gpt-4o-mini, system-prompt grounded) |

| `/api/health` | GET | Health check |

| `/api/swagger` | GET | OpenAPI 3.0 JSON spec |

| `/api/docs` | GET | Interactive API test page |



## Local Development



### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

- [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)

  ```bash

  npm install -g azure-functions-core-tools@4 --unsafe-perm true

  ```

- [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite) (local storage emulator) or set `AzureWebJobsStorage` to a real connection string



### Run locally



```bash

cd back-end

func start

```



Functions will be available at `http://localhost:7071/api/`.



Set `NEXT_PUBLIC_BACKEND_URL=http://localhost:7071` in `front-end/.env.local` so the Digital Twin chat calls the local function.



### Environment variables



Copy `local.settings.json` and fill in your real values:



| Variable | Description | Required |

|---|---|---|

| `SENDGRID_API_KEY` | SendGrid API key | For contact form |

| `SENDGRID_FROM_EMAIL` | Verified sender email in SendGrid | For contact form |

| `CONTACT_EMAIL` | Email to receive contact form submissions | For contact form |

| `ALLOWED_ORIGINS` | Comma-separated CORS origins | Yes (local/direct calls) |

| `OPENAI_API_KEY` | OpenAI API key | **Yes** (Digital Twin) |

| `OPENAI_MODEL` | Chat model (default: `gpt-4o-mini`) | No |

| `AzureWebJobsStorage` | Storage connection string | Yes (Functions runtime) |

| `FUNCTIONS_WORKER_RUNTIME` | `dotnet-isolated` | Yes (auto-set) |



> `local.settings.json` is gitignored and never deployed.



## Digital Twin Architecture



Static resume/profile content lives in `Prompts/digital-twin-system.txt` (embedded resource). Every request sends:



1. **System message** — full profile (static, eligible for OpenAI prompt caching ≥1024 tokens)

2. **User/assistant history** — last 10 turns from the client



No embeddings, vector DB, or RAG pipeline. OpenAI prompt caching is automatic when the system prefix is identical across requests.



## Deployment



### CI/CD (recommended)



Push to `main` triggers `.github/workflows/azure-functions.yml`:



1. `dotnet build` + `dotnet publish`

2. Deploy artifact to Azure Function App via publish profile



### Manual deploy



```bash

cd back-end

dotnet publish -c Release

func azure functionapp publish DigitalTwin

```



### Azure Function App — Application Settings



Configure in **Azure Portal → DigitalTwin → Settings → Environment variables**:



| Setting | Example | Secret? |

|---|---|---|

| `OPENAI_API_KEY` | `sk-...` | **Yes** |

| `OPENAI_MODEL` | `gpt-4o-mini` | No |

| `SENDGRID_API_KEY` | `SG....` | **Yes** |

| `SENDGRID_FROM_EMAIL` | `noreply@manibuildsai.com` | No |

| `CONTACT_EMAIL` | `mani.ainml@gmail.com` | No |

| `ALLOWED_ORIGINS` | `https://manibuildsai.com` | No |



### GitHub Actions — Pipeline configuration



**Repository secret** (Settings → Secrets and variables → Actions → Secrets):



| Secret | Description |

|---|---|

| `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Paste entire `DigitalTwin.PublishSettings` XML |



**Function App:** `DigitalTwin`  
**URL:** `https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net`

> App name is hardcoded in the workflow — `AZURE_FUNCTIONAPP_NAME` is not required.

> OpenAI and SendGrid keys are **not** stored in GitHub Actions. Set `OPENAI_API_KEY` in Azure Function App Application Settings. See [`.github/DEPLOYMENT.md`](../.github/DEPLOYMENT.md).



Link the Function App to the SWA:

**Azure Portal → SWA → Settings → APIs → Link an existing function app**



This proxies `/api/*` through the SWA — no CORS issues in production.

