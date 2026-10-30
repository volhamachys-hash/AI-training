# Medusa Store — API Tests (Playwright)

Automated API tests for the Medusa Store QA Sandbox using **Playwright APIRequestContext** and **TypeScript**.
The framework for the practical task **6. API Automation**: the infrastructure and one reference endpoint are ready, the rest is your task.

## 🎯 Target

| Key          | Value                                                              |
|--------------|--------------------------------------------------------------------|
| **Stand**    | Your own Medusa Store, issued with your task (own DB, own bugs)    |
| **Entry**    | `SESSION_URL`: the session link of your stand (a secret)           |
| **APIs**     | Store API `/store/*`, Admin API `/admin/*`, Auth `/auth/*` — on the host of `SESSION_URL` |
| **Contract** | Medusa v2 [Store API](https://docs.medusajs.com/api/store) and [Admin API](https://docs.medusajs.com/api/admin) reference; OpenAPI sources in [`medusajs/medusa`](https://github.com/medusajs/medusa/tree/develop/www/apps/api-reference/specs) |

> The reference tests show the **code style and architecture**, not a green run: your stand may contain defects in any area. The spec may also disagree with the stand: record such discrepancies, don't pick a side silently.

---

## 📝 Your task

| Artifact | Where | Ready in the framework |
|----------|-------|------------------------|
| API tests for 2–3 endpoints of your choice | `api/<area>/*.client.ts`, `tests/<area>/*.spec.ts` | Reference: `tests/store/regions.spec.ts` — pick **other** endpoints |
| JSON Schema validation (at least one endpoint) | `schemas/<area>/*.schema.ts` + `toMatchSchema` | Validator and matcher; reference schema `schemas/store/region.schema.ts` |
| Reusable auth component | `api/auth/` | **No** — see [`api/auth/README.md`](api/auth/README.md) |
| Boundary cases, scenarios, verify results, fixes table, reflection | [`docs/`](docs/README.md) | Empty templates |
| Optional: your own Skill | `.claude/skills/api-test-generation/SKILL.md` | Base version, adapt it |

Proving that the schema fails on a controlled contract violation (mock/stub or changed response) is part of Verify: build it yourself.

---

## 🛠 Tech Stack

| Layer         | Choice                                   |
|---------------|------------------------------------------|
| Framework     | Playwright Test (`request` fixture, no browser) |
| Language      | TypeScript (strict)                      |
| Pattern       | API clients (one method per endpoint) + fixtures |
| Schemas       | JSON Schema draft-07, `ajv` + `ajv-formats` |
| Stand access  | Stand cookie from `SESSION_URL`, saved once in setup (`storageState`) |
| Config        | `.env` via dotenv                        |
| Lint          | ESLint + `eslint-plugin-playwright`      |
| Reporter      | HTML + JSON (`test-results/results.json`) |

---

## 📁 Project Structure

```
AI-training/
├── .claude/skills/
│   └── api-test-generation/SKILL.md  # Skill for Claude Code, tuned to this repo
├── api/                              # API clients — endpoint paths live ONLY here
│   ├── base.client.ts                # Wrapper over APIRequestContext, default headers
│   ├── error.types.ts                # Error body of the Medusa API
│   ├── auth/                         # YOUR auth component goes here
│   └── store/
│       ├── store.client.ts           # Base of Store API clients: x-publishable-api-key
│       ├── regions.client.ts         # Reference client
│       └── regions.types.ts          # Response DTOs
├── schemas/
│   └── store/region.schema.ts        # Reference JSON Schema
├── config/
│   └── env.ts                        # Env variables + storageState path
├── data/
│   └── customer.ts                   # Test data factory (unique customer)
├── helpers/
│   ├── session.helper.ts             # Opens the session link, clear errors for 403/5xx
│   └── schema.helper.ts              # ajv validation
├── fixtures/
│   └── index.ts                      # Clients as fixtures + toMatchSchema: import test/expect from here
├── tests/
│   ├── setup/session.setup.ts        # Saves the stand cookie
│   └── store/regions.spec.ts         # Reference tests
├── docs/                             # Templates of the task deliverables
├── playwright/.auth/                 # Saved stand cookie (gitignored)
├── .env.example
├── eslint.config.mjs
├── playwright.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))

### Installation

```powershell
npm install

# Create your local env file and fill in the values of YOUR stand (from your task)
Copy-Item .env.example .env
```

`PUBLISHABLE_API_KEY`: Medusa Admin of your stand → **Settings → Publishable API Keys**. No browser install is needed.

> Work in a **private** repository of your own (never a public fork): your solutions must not be visible to others. Keep `.env` out of git: `SESSION_URL` and the credentials are secrets. Fill `.env`, never `.env.example`.

### Running

| Command               | What it does                               |
|-----------------------|--------------------------------------------|
| `npm test`            | Run all tests                              |
| `npm run test:ui`     | Playwright UI mode (requests and responses in the trace) |
| `npm run report`      | Open the last HTML report                  |
| `npm run lint`        | ESLint                                     |
| `npm run typecheck`   | TypeScript check without emitting          |

```powershell
# Run a single file
npx playwright test tests/store/regions.spec.ts

# Run twice in a row: tests must be independent and stable
npx playwright test --repeat-each=2
```

---

## 🔐 Stand access

The stand is selected by a **cookie** that the session link sets; all stands share one host.

1. The `setup` project opens `SESSION_URL` with the `request` fixture and saves the stand cookie to `playwright/.auth/session.json`.
2. The `api` project loads it into the `request` fixture of every test, with `baseURL` = host of `SESSION_URL`. Without the cookie the stand answers `403 A session link is required`.
3. The Store API additionally requires the `x-publishable-api-key` header: `StoreClient` adds it from `PUBLISHABLE_API_KEY`. Pass `null` to test a request without it (see `REG-04`).

Customer and admin auth is **not** set up: building it is part of the task (`api/auth/`).

> ⚠️ `.env` and `playwright/.auth/` are **gitignored**. In CI the values come from GitHub Secrets `SESSION_URL`, `PUBLISHABLE_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` of your own repository; without `SESSION_URL` only lint and typecheck run.

---

## 🏗 Architecture Rules

| Rule | Description |
|------|-------------|
| **API clients** | Every endpoint is a method of a client in `api/`. Paths, headers and query building live only there; tests call client methods, not `request.get()` directly. |
| **Raw response to the test** | Clients return `APIResponse`; status, headers and body are asserted in the spec. |
| **More than status** | Check status **and** body (and headers where the contract defines them). Expected codes come from the contract: not one code for every negative, never 5xx as an "expected negative". |
| **Schemas follow the contract** | Required fields from the spec, not from one sample response. `additionalProperties` stays open. Spec vs stand discrepancies are commented and recorded. |
| **Auth via fixtures** | Tokens and keys come from `config/env.ts` through clients and fixtures, never hardcoded. No refresh logic the stand does not have. |
| **Test isolation** | Each test runs on its own, in any order. State-changing tests create their own data and clean it up. |
| **Unique test data** | Stand data persists between runs: create data through `data/` factories with unique values. Read-only checks take existing ids from the API instead of hardcoding them. |
| **Naming** | `ID: what is expected`, e.g. `REG-03: unknown region id returns 404`. |

---

## 📋 Test Cases

| ID     | Description                                          | File                          | Status |
|--------|------------------------------------------------------|-------------------------------|--------|
| REG-01 | List of regions matches the contract                 | `tests/store/regions.spec.ts` | ✅     |
| REG-02 | Region is retrieved by id                            | `tests/store/regions.spec.ts` | ✅     |
| REG-03 | Unknown region id returns 404                        | `tests/store/regions.spec.ts` | ✅     |
| REG-04 | Request without the publishable API key is rejected  | `tests/store/regions.spec.ts` | ✅     |

---

## ⚙️ Configuration

Key settings in `playwright.config.ts`:

| Setting      | Value                                   |
|--------------|-----------------------------------------|
| `testDir`    | `./tests`                               |
| `baseURL`    | Host of `SESSION_URL` from `.env`       |
| `projects`   | `setup` (stand cookie) → `api`          |
| `retries`    | 1 on CI, 0 locally                      |
| `workers`    | 1 (one stand = one database)            |
| `reporter`   | HTML + JSON (`test-results/results.json`) |
| `trace`      | On first retry                          |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Missing env variable ...` | Copy `.env.example` to `.env` and fill it in |
| `The stand rejected SESSION_URL (403)` or `403 A session link is required` | The link was revoked (new link, stand handed over or released). Take a fresh link from your task, update `.env`, rerun |
| `The stand does not respond (HTTP 502)` | The link is valid but the stand services are down or still starting. Wait a minute and rerun; if it persists, contact the support of your task |
| `400 not_allowed: Publishable API key required` | `PUBLISHABLE_API_KEY` is empty or the client does not extend `StoreClient` |
| `400 not_allowed: A valid publishable key is required` | The key is wrong or revoked: copy it again from Admin → Settings → Publishable API Keys |
| `401 Unauthorized` on `/admin/*` | The request has no valid admin token: that is your auth component's job |
| `ENOENT: session.json` | Run `npx playwright test --project=setup` first |
| PowerShell script error | Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## 📄 License

Private — QA Sandbox project.
