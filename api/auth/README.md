# Auth component — your part of the task

This folder is intentionally empty: the reusable auth component is one of the artifacts of the task.

Put it here (for example `api/auth/admin-auth.ts`, `api/auth/customer-auth.ts`) and expose it to tests
through `fixtures/index.ts`, the same way the reference clients are exposed.

Before writing code, research how auth actually works on your stand (and record it in `docs/scenarios.md`):

- which auth types the Admin API and the Store API use;
- where credentials or the token are sent;
- how the token is obtained;
- how long it lives;
- whether a refresh mechanism exists. Do not add refresh logic the stand does not provide.

Credentials come only from `config/env.ts` (`.env` locally, GitHub Secrets in CI). Never hardcode them.
