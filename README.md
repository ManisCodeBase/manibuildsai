# manibuildsai.com

Personal branding website for **Manikanta Neerukattu (Mani N)** — Senior Software Engineer & Applied AI Engineer.

**Live site:** [https://manibuildsai.com](https://manibuildsai.com)

---

## Architecture

```
ExpertAIEngineer/
├── front-end/          Next.js 15 (App Router) — static export for Azure SWA
├── back-end/           .NET 8 Azure Functions — contact form + Digital Twin API
└── .github/workflows/  CI/CD — azure-swa.yml (front-end) + azure-functions.yml (back-end)
```

The front-end is deployed as a **static export** to Azure Static Web Apps.
API calls (`/api/contact`, `/api/chat`) are handled by the **back-end Azure Function App**
linked to the SWA via the Azure portal.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, App Router, Turbopack |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Animations | Framer Motion |
| Back-end | .NET 8 Azure Functions (Isolated Worker) |
| Email | SendGrid (via Azure Function) |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions |

---

## Local Development

### Front-end

**Prerequisites:** Node.js 22+

```bash
cd front-end

# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables section below

# 3. Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> In dev mode, the Next.js API routes (`/api/contact`, `/api/github`) serve directly
> from `front-end/src/app/api/`. The back-end Azure Function is not required for local dev.

---

### Back-end (Azure Functions)

**Prerequisites:**
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)

```bash
# Install Functions Core Tools (once)
npm install -g azure-functions-core-tools@4 --unsafe-perm true

cd back-end

# Start the function host
func start
```

Functions will be available at `http://localhost:7071/api/`.

Set the front-end's `NEXT_PUBLIC_BACKEND_URL=http://localhost:7071` in `.env.local`
to route contact form submissions through the .NET function locally.

---

## Project Structure

```
front-end/src/
├── app/
│   ├── layout.tsx              Root layout — SEO, fonts, navbar, digital twin
│   ├── page.tsx                Home page (all sections composed here)
│   ├── globals.css             Design tokens, glass morphism, neon effects
│   └── api/
│       ├── contact/route.ts    Contact form (Resend) — used in dev/SSR mode
│       └── github/route.ts     GitHub repos API with 1h cache
├── components/
│   ├── layout/Navbar.tsx       Sticky navbar with active-section tracking
│   ├── sections/
│   │   ├── Hero.tsx            Particle field + TypeAnimation + glow orbs
│   │   ├── About.tsx           Stats + strength cards + quote
│   │   ├── Projects.tsx        Filterable cards (AI / Fullstack / Tools)
│   │   ├── Skills.tsx          Animated skill bars + tag cloud
│   │   ├── Experience.tsx      Vertical timeline (4 companies)
│   │   ├── Education.tsx       Degrees + certifications
│   │   ├── GitHubShowcase.tsx  Live GitHub repos (via /api/github)
│   │   ├── Contact.tsx         Contact form (calls /api/contact)
│   │   └── Footer.tsx          Footer with social links
│   └── features/
│       ├── DigitalTwin.tsx     AI chat UI (mock responses, LLM-ready)
│       └── DigitalTwinButton.tsx  Floating chat button
├── data/
│   ├── projects.ts             6 AI/Fullstack/Tools projects
│   ├── skills.ts               Skills by category with levels
│   ├── experience.ts           4 work experiences (Insightsoftware, Philips, ADP, Option Matrix)
│   └── education.ts            Degrees + certifications
├── hooks/useGitHubRepos.ts     Client-side GitHub API hook
├── lib/utils.ts                cn(), animation variants (stagger, fadeUp, scale)
└── types/index.ts              Shared TypeScript interfaces
```

---

## Environment Variables

### Front-end (`front-end/.env.local`)

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL — used for SEO/OpenGraph metadata | **Yes** (production) |
| `NEXT_PUBLIC_BACKEND_URL` | Azure Function App URL for contact form in production | **Yes** (production) |
| `GITHUB_USERNAME` | GitHub username for the Showcase section | No (defaults to `maniscodebase`) |
| `GITHUB_TOKEN` | GitHub PAT for higher API rate limits | No |
| `RESEND_API_KEY` | Resend key — only used in SSR/dev mode for `/api/contact` | No |
| `CONTACT_EMAIL` | Email to receive contact form submissions | No (defaults to `mani.ainml@gmail.com`) |

### Back-end (`back-end/local.settings.json`)

| Variable | Description |
|---|---|
| `SENDGRID_API_KEY` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Verified sender address in SendGrid |
| `CONTACT_EMAIL` | Email to receive contact form submissions |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (e.g. `https://manibuildsai.com`) |
| `OPENAI_API_KEY` | OpenAI API key for Digital Twin chat |
| `OPENAI_MODEL` | Chat model (default: `gpt-4o-mini`) |

---

## Deployment — Azure Static Web Apps

### One-time Azure setup

#### 1. Create the SWA resource

```bash
# Azure CLI
az staticwebapp create \
  --name manibuildsai \
  --resource-group <your-rg> \
  --location "East Asia" \
  --sku Free \
  --source https://github.com/<you>/ExpertAIEngineer \
  --branch main \
  --app-location "front-end" \
  --output-location "out" \
  --login-with-github
```

Or create it in the **Azure Portal**:
1. Search → **Static Web Apps** → Create
2. Set **App location** = `front-end`, **Output location** = `out`
3. Connect to your GitHub repository

#### 2. Copy the deployment token

After creation, go to:
**Azure Portal → your SWA → Settings → Deployment token**

Copy the token and add it as a **GitHub repository secret**:

**GitHub → repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | (paste token from Azure portal) |
| `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Paste entire `DigitalTwin.PublishSettings` XML (Azure Portal → **DigitalTwin** → Get publish profile) |

#### 3b. Function App details (Digital Twin API)

| Setting | Value |
|---|---|
| App name | `DigitalTwin` |
| URL | `https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net` |

#### 3. Add GitHub Actions variables (front-end)

**GitHub → repo → Settings → Secrets and variables → Actions → Variables tab**

| Variable name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://manibuildsai.com` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net` |
| `GITHUB_USERNAME` | `maniscodebase` |

#### 4. Configure custom domain (optional)

**Azure Portal → your SWA → Custom domains → Add**

Enter `manibuildsai.com` and follow the DNS validation steps (CNAME or TXT record).

---

### Automated deployment (CI/CD)

Every push to `main` triggers two workflows:

**Front-end** (`.github/workflows/azure-swa.yml`):

1. Installs Node.js 22 dependencies
2. Runs `npm run build:static` — Next.js static export → `front-end/out/`
3. Uploads `out/` to Azure SWA via the `Azure/static-web-apps-deploy@v1` action

**Back-end** (`.github/workflows/azure-functions.yml`):

1. `dotnet build` + `dotnet publish` the Functions project
2. Deploys to Azure Function App via publish profile (main branch only)
3. PRs run build only — no deploy

Pull requests get **preview environments** for the front-end automatically — each PR gets its own temporary URL.
Preview environments are cleaned up when the PR is closed.

```
push to main  →  build:static  →  deploy to https://manibuildsai.com
              →  dotnet publish →  deploy Function App
open PR       →  build:static  →  deploy to https://<preview>.azurestaticapps.net
close PR      →  preview environment deleted
```

---

### Manual deployment (without GitHub Actions)

```bash
cd front-end

# 1. Build static export
npm run build:static
# Output: front-end/out/

# 2. Deploy using SWA CLI
npm install -g @azure/static-web-apps-cli

swa deploy ./out \
  --deployment-token <your-token> \
  --env production
```

Or use the Azure CLI:

```bash
az staticwebapp environment upload \
  --name manibuildsai \
  --resource-group <your-rg> \
  --source front-end/out
```

---

### Deploy back-end Azure Function

```bash
cd back-end

# Publish release build
dotnet publish -c Release

# Deploy to your Function App
func azure functionapp publish DigitalTwin
```

After deploying, set environment variables in:
**Azure Portal → Function App → Settings → Environment variables**

```
SENDGRID_API_KEY       = <your key>
SENDGRID_FROM_EMAIL    = noreply@manibuildsai.com
CONTACT_EMAIL          = mani.ainml@gmail.com
ALLOWED_ORIGINS        = https://manibuildsai.com
OPENAI_API_KEY         = <your OpenAI key>
OPENAI_MODEL           = gpt-4o-mini
```

Then link the Function App to the SWA:
**Azure Portal → SWA → Settings → APIs → Link an existing function app**

This removes the need for CORS headers — the SWA proxies `/api/*` directly to the Function App.

---

## Build Scripts Reference

All commands run from the `front-end/` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack at `localhost:3000` |
| `npm run build` | Standard Next.js build (SSR + API routes — for local testing) |
| `npm run build:static` | Static export to `out/` — what CI/CD uses for Azure SWA |
| `npm run start` | Serve the SSR build locally |
| `npm run lint` | Run ESLint |
| `npm run clean` | Delete `.next/` cache |

> **`build` vs `build:static`**
>
> `npm run build` produces a full SSR build with working API routes — use this for local `npm start` testing.
> `npm run build:static` temporarily removes API routes, runs `next build` with `output: "export"`,
> restores API routes, and outputs a static `out/` folder. This is what Azure SWA serves.
> In production, API calls go to the linked Azure Function App instead.

---

## Features

| Section | What it does |
|---|---|
| **Hero** | Animated particle field, typewriter role animation, live status badge |
| **About** | Professional summary, key stats, 4 strength cards |
| **Projects** | 6 production AI projects, filterable by category, tech badges |
| **Skills** | Animated skill bars across AI Engineering / Backend / Cloud / Data & Frontend |
| **Experience** | Vertical timeline — Insightsoftware, Philips, ADP, Option Matrix |
| **Education** | LJMU MSc (in-progress), IIIT Bangalore PG Diploma, JNTU B.Tech + certs |
| **GitHub** | Live repo cards fetched from GitHub API with star counts |
| **Digital Twin** | Floating AI chat UI powered by OpenAI gpt-4o-mini via `/api/chat` |
| **Contact** | Validated form, SendGrid email via Azure Function |

---

## AI Digital Twin

The Digital Twin uses a **static system prompt** (full resume/profile in `back-end/Prompts/digital-twin-system.txt`) with **OpenAI gpt-4o-mini** — no embeddings or RAG. OpenAI prompt caching applies automatically when the system prefix is identical across requests.

**Flow:** `DigitalTwin.tsx` → `POST /api/chat` → `DigitalTwinFunction.cs` → `DigitalTwinChatService` → OpenAI API

**Local dev:** run `func start` in `back-end/` and set `NEXT_PUBLIC_BACKEND_URL=http://localhost:7071` in `front-end/.env.local`.

**Production:** SWA proxies `/api/chat` to the linked Function App (same origin, no CORS).

Configure in Azure Function App Application Settings:

```
OPENAI_API_KEY   = sk-...
OPENAI_MODEL     = gpt-4o-mini
```

---

## License

MIT
