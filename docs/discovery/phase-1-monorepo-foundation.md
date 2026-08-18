# Phase 1 discovery: monorepo and tooling foundation

- Date: 2026-08-17
- Starting commit: `2be78df`
- Starting branch: `main`
- Discovery state: the migration plan under `docs/` was untracked; no application changes were present.

## Current-state facts

- The legacy application is a Vite 6.3.5 React 18 single-page application at the repository root.
- The root contains `package-lock.json`, while `pnpm-workspace.yaml` initially includes only the root package.
- Installed tooling reports Node 24.18.0, npm 11.16.0, and pnpm 10.12.4.
- There is no GitHub Actions workflow or provider-specific hosting configuration in the repository.
- The original pnpm workspace restricted optional dependencies to Linux/glibc, which excluded Next.js's native Windows SWC package. The restriction is removed so each development or CI platform can install its matching optional binary.
- The active legacy page imports React and Lucide directly. The generated `src/app/components/ui` tree accounts for most of the much larger dependency inventory but is not imported by the active page.
- The only discovered local environment-variable name is `VITE_ANTHROPIC_API_KEY`. Its value was not recorded.
- The Supabase Edge Function remains at `supabase/functions/ltv-agent/index.ts` and is outside this phase's implementation scope.
- No `AGENTS.md` file was found in the repository.

## Version-sensitive checks

- Current Next.js documentation requires Node 20.9 or newer.
- Registry versions observed during discovery were Next.js 16.3.1, React 19.2.8, React DOM 19.2.8, Tailwind CSS 4.3.3, and eslint-config-next 16.3.1.
- The official `create-next-app` TypeScript template currently selects TypeScript `^5`, ESLint `^9`, React types `^19`, and Tailwind `^4`. The scaffold will follow those compatibility ranges rather than selecting registry-latest TypeScript 7 or ESLint 10 independently.

## Baseline verification

- The first sandboxed Vite build failed because Windows blocked esbuild process creation with `spawn EPERM`.
- The same build succeeded in the host execution context.
- The successful legacy build transformed 1,599 modules and produced:
  - HTML: 0.81 kB, 0.46 kB gzip.
  - CSS: 94.37 kB, 15.22 kB gzip.
  - JavaScript: 162.17 kB, 51.83 kB gzip.

## Drift and constraints

- This is the first implementation phase, so there is no preceding phase handoff to compare.
- Hosting provider, production domains, CMS source, Supabase environment topology, and admin authorization model are not yet recorded as final decisions.
- Those open decisions do not block a framework-standard monorepo scaffold and will not be guessed or encoded as provider-specific configuration in this phase.
- The legacy application must remain runnable and buildable for Phase 2 parity work.

## Accepted scope

- Adopt pnpm as the only repository package manager and generate one lockfile.
- Keep the legacy Vite application at the root temporarily as `@808/legacy-web`.
- Add independent `apps/web` and `apps/admin` Next.js App Router applications.
- Add root orchestration scripts, minimal app-local lint/TypeScript configuration, CI validation, and local-development documentation.
- Do not migrate the landing page, add authentication, create shared product packages, change the LTV contract, or add provider-specific deployment configuration.

## Risks

- React 18 in the legacy root and React 19 in the Next.js applications must remain isolated by workspace package boundaries.
- A mixed npm/pnpm `node_modules` directory can hide reproducibility issues until a pnpm install normalizes it.
- The workspace's long Windows path caused pnpm's default `node_modules/.pnpm` virtual store to spend excessive time linking and produced long-path cleanup failures. The managed environment also failed to finalize isolated importer links, while copying the large Next.js package was prohibitively slow. Phase 1 therefore uses pnpm's documented root `.pnpm` virtual-store mitigation, a shorter virtual-store entry limit, hard-link imports, and the supported hoisted linker that produces a flat tree without dependency symlinks.
- Creating shared configuration packages before shared requirements are known would add abstraction without a stable contract, so those packages are deferred.

## Phase handoff

- Phase 1 is complete locally. The repository now has one pnpm workspace and one `pnpm-lock.yaml`; the npm lockfile was removed.
- `apps/web` and `apps/admin` are independent Next.js 16 App Router packages. Their placeholder routes intentionally contain no migrated production UI.
- The legacy Vite application remains at the repository root as `@808/legacy-web` and still builds with its baseline asset sizes.
- Root commands orchestrate development, linting, type checking, tests, and independent or aggregate builds. The default `pnpm dev` starts the public web app; the admin and legacy apps have explicit commands.
- GitHub Actions now validates frozen installation, linting, type checking, tests, and all builds on Node 24 with pnpm 10.12.4. The workflow exists locally but has not run on GitHub yet.
- Local verification passed for `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:web`, `pnpm build:admin`, `pnpm build:legacy`, and the aggregate `pnpm build`.
- Both production Next.js servers returned HTTP 200 and their expected scaffold content on ports 3000 and 3001.
- The test commands currently exercise no test cases; test infrastructure and coverage belong to later feature phases.
- A pre-existing legacy development server was stopped while normalizing the mixed npm/pnpm installation. Restart it with `pnpm dev:legacy` when needed.
- Before Phase 2, perform a new discovery pass covering the rendered legacy page, responsive states, assets, content, interactions, route behavior, metadata, and any repository drift since this handoff.
