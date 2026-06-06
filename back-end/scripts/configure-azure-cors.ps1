# Configure Azure Function App CORS (optional)

Only needed if you call the Function App URL **directly** from the browser (e.g. `/api/docs` on azurewebsites.net from another site).

**Production chat on manibuildsai.com uses `/api/chat` via SWA proxy — no browser CORS required.**

## Azure Portal

**DigitalTwin → API → CORS** — add:

- `https://manibuildsai.com`
- `https://www.manibuildsai.com`
- `http://localhost:3000`

Click **Save**.

## Azure CLI

```powershell
$rg = "<your-resource-group>"

az functionapp cors remove -g $rg -n DigitalTwin --allowed-origins "*" 2>$null
az functionapp cors add   -g $rg -n DigitalTwin --allowed-origins "https://manibuildsai.com"
az functionapp cors add   -g $rg -n DigitalTwin --allowed-origins "https://www.manibuildsai.com"
az functionapp cors add   -g $rg -n DigitalTwin --allowed-origins "http://localhost:3000"
az functionapp cors show  -g $rg -n DigitalTwin
```

## Verify platform CORS (direct Function App URL)

```powershell
curl.exe -X OPTIONS "https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net/api/chat" `
  -H "Origin: https://manibuildsai.com" `
  -H "Access-Control-Request-Method: POST" `
  -H "Access-Control-Request-Headers: content-type" -i
```

Should return **204/200** with `Access-Control-Allow-Origin: https://manibuildsai.com` — not `400 The origin is not allowed`.

## Verify SWA proxy (production — recommended)

```powershell
curl.exe -X POST "https://manibuildsai.com/api/chat" `
  -H "Content-Type: application/json" `
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"hello\"}]}" -i
```

Should return **200** with assistant JSON (no CORS involved — same origin).
