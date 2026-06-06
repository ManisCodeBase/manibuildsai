# manibuildsai.com — Back-end

.NET 8 Azure Functions (Isolated Worker) serving the API layer for **manibuildsai.com**.

## Functions

| Route | Method | Description |
|---|---|---|
| `/api/contact` | POST | Contact form → SendGrid email |
| `/api/chat` | POST | Digital Twin AI chat (stub — LLM integration pending) |

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

### Environment variables

Copy `local.settings.json` and fill in your real values (already pre-filled with dev keys):

| Variable | Description |
|---|---|
| `SENDGRID_API_KEY` | Your SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Verified sender email in SendGrid |
| `CONTACT_EMAIL` | Email address to receive contact form submissions |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

> `local.settings.json` is gitignored and never deployed.

## Deployment

Deploy to an **Azure Function App** (Consumption or Flex Consumption plan):

```bash
dotnet publish -c Release
func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
```

After deploying, set all environment variables in **Azure Portal → Function App → Configuration → Application settings**.

Then in **Azure Static Web Apps → Settings → Linked backends**, link this Function App so the front-end can call `/api/*` without CORS issues.

## Digital Twin — LLM Integration

`Functions/DigitalTwinFunction.cs` is the entry point. To wire a real LLM:

1. Add NuGet: `Microsoft.SemanticKernel` or `Azure.AI.OpenAI`
2. Inject `Kernel` (Semantic Kernel) or `OpenAIClient` via `Program.cs`
3. Replace the stub response in `DigitalTwinFunction.cs` with a streaming or single-turn LLM call
4. Add `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_KEY` to app settings
