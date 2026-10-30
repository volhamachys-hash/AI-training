---
name: api-test-generation
description: Design and generate API autotests for the Medusa Store/Admin API of the QA sandbox with Playwright APIRequestContext + TypeScript, following this repository's conventions (API clients in api/, JSON Schemas in schemas/, fixtures, custom toMatchSchema matcher). Use when the user shares a Medusa OpenAPI fragment, request/response examples, auth details or existing API tests and asks to plan test scenarios, generate API tests, build a JSON Schema check, set up auth handling, or refactor the API test suite.
---

# API Test Generation

Goal: produce API tests that verify the actual contract and business rules, fit the existing project architecture, and can be run and reviewed right away.

## Core rules
- The contract (spec + real request/response examples + requirements) is the source of truth. Add no scenarios that don't follow from it.
- If the spec and real examples disagree, don't pick one silently. List the discrepancy in Gaps.
- One response example is not a contract. Never mark a field as required based on a single example.
- Expected status codes come from the contract. Don't use one code for all negatives. Never treat 5xx as an expected negative result unless the requirements define it.
- Implement auth exactly as the project's scheme works. No refresh-token logic unless the scheme actually provides it.
- Check more than the status code: headers, response body and business rules where the requirements call for it.
- Reuse the existing API client, request builders, DTOs and fixtures. Never create a parallel architecture.
- Tests that change state must create their own data and clean it up. No dependency on execution order or leftovers from other runs.
- Never put real tokens, passwords, API keys or personal data into code, test data or output. Use the project's env/secret mechanism.

## Project specifics
- Stack: Playwright Test `APIRequestContext` + TypeScript (strict). No browser.
- Stand: the host and the stand cookie come from `SESSION_URL`; the `setup` project saves the cookie, the `api` project's `request` fixture carries it. Every request goes to `baseURL` with a relative path.
- Contract: Medusa v2 Store API https://docs.medusajs.com/api/store and Admin API https://docs.medusajs.com/api/admin (OpenAPI sources: `medusajs/medusa`, `www/apps/api-reference/specs/`). The stand may contain planted defects: a red test is a finding to analyse, not something to "fix" by weakening the assertion.
- API clients: `api/`. Extend `BaseApiClient` (`api/base.client.ts`); Store API clients extend `StoreClient` (publishable key header). One method per endpoint, returning the raw `APIResponse`.
- DTOs: `*.types.ts` next to the client; error body: `api/error.types.ts`.
- JSON Schemas: `schemas/<area>/<entity>.schema.ts`, plain draft-07 objects, `additionalProperties` left open. Assert with `expect(body).toMatchSchema(schema)` (ajv, `helpers/schema.helper.ts`).
- Auth component: `api/auth/` (see its README). Exposed to tests as a fixture.
- Fixtures: `fixtures/index.ts`. Tests import `test` and `expect` only from there.
- Config and secrets: `config/env.ts` reads `.env` (local) or GitHub Secrets (CI). Unique data: factories in `data/`.
- Naming: `tests/<area>/<entity>.spec.ts`, test titles `ID: what is expected` (e.g. `REG-03: unknown region id returns 404`).
- Reference test: `tests/store/regions.spec.ts` with `schemas/store/region.schema.ts`. Match its style.
- Run: `npm test`, `npx playwright test tests/<file>`, `npm run lint`, `npm run typecheck`.
- Deliverables of the task: tables in `docs/` (scenarios, boundary cases, verify, fixes, reflection).

## Workflow

### 1. Research
Check the input: contract (OpenAPI or Postman), real request/response examples, auth scheme (type, token source, lifetime, refresh), existing tests and helper code. If the contract or auth details are missing, list what's needed and ask before generating code.

### 2. Plan
Build a scenario list for this specific endpoint, not a generic CRUD template: positive, required/optional params, boundaries, invalid formats, auth/roles, conflicting states, pagination/filtering/sorting, idempotency, known errors, rate limits — only where applicable. Mark checks that belong to UI rather than API. Show the plan before writing code.

### 3. Implement
Generate tests in the project's style, with parameterization where the framework supports it. Add schema validation only if the contract requires it.

### 4. Verify
Self-review the code against the Core rules, then give the user a checklist for running and verifying the tests.

## Output format
1. Test plan: table with scenario, input, expected status, key response checks, preconditions/dependencies.
2. Test code: ready to paste into the repo, using existing project layers.
3. Schema (if requested): the schema plus a short list of required vs optional fields with the reason for each.
4. Gaps: missing contract details, spec vs implementation discrepancies, unclear auth behavior, open questions.
5. Verify checklist: run on the test environment; confirm tests fail on broken responses (use mock/stub); check cleanup; run twice to confirm independence and stability; code review in a branch.

Keep explanations short. Tables and code over prose.
