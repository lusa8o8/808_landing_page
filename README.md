
# 808 Digital Systems

This repository is migrating from a Vite landing page to a pnpm monorepo with separate public and admin Next.js applications. The original design is available in [Figma](https://www.figma.com/design/Olek2N5fVQIEjGSB3tMU3D/Landing-Page-for-808-Digital-Systems).

## Requirements

- Node.js 20.9 or newer. Node.js 24 is used in CI.
- pnpm 10.12.4.

## Install

```bash
pnpm install
```

`pnpm-lock.yaml` is the only supported dependency lockfile.

## Applications

| Application | Package | Development command | Default URL |
| --- | --- | --- | --- |
| Public Next.js site | `@808/web` | `pnpm dev:web` | `http://localhost:3000` |
| Admin Next.js site | `@808/admin` | `pnpm dev:admin` | `http://localhost:3001` |
| Legacy Vite reference | `@808/legacy-web` | `pnpm dev:legacy` | Vite-assigned URL |

The public landing page now runs in the Next.js application. The legacy application remains at the repository root as a parity reference until production cutover.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The root build validates the public app, admin app, and legacy Vite reference.

The LTV agent also has a versioned 40-case evaluation package. Evaluation commands are dry-run by default; see [the evaluation guide](evaluations/ltv-agent/README.md) before making live calls.

## Environment variables

The public Next.js application recognizes:

- `NEXT_PUBLIC_SUPABASE_FUNCTION_URL`: optional browser-visible URL for the existing LTV Edge Function. Copy `apps/web/.env.example` to `apps/web/.env.local` for local configuration.

The legacy reference recognizes:

- `VITE_SUPABASE_FUNCTION_URL`: optional browser-visible URL for the LTV Edge Function.

The Supabase Edge Function requires the server-only `GROQ_API_KEY` credential. Do not add provider secrets to either Next.js application's public environment variables.

Environment files are local and must not be committed.

## Migration documentation

- [Phased migration plan](docs/MIGRATION_PLAN.md)
- Phase discovery and handoff records are stored under `docs/discovery/`.
