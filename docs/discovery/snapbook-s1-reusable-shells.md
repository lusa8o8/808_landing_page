# SnapBook S1 discovery: reusable fixture-backed shells

- Date: 2026-08-21
- Starting commit: `60b5cf3`
- Starting branch: `main`
- Status: implementation scope accepted

## Discovery outcome

S1 will add `apps/snapbook` as the third independently buildable Next.js application. It will prove one runtime-validated tenant configuration and one deterministic booking state machine through two route shells:

```text
/book/[tenantSlug]    full-page customer/PWA shell
/embed/[tenantSlug]   compact iframe shell
```

The application is a product prototype, not an operational booking system. It will use fictional tenant fixtures, keep every interaction in browser memory, collect no visitor contact values, make no network requests, and remain non-indexable.

## Fresh evidence

- The worktree was clean and synchronized with `origin/main` at discovery start.
- The repository uses pnpm 10.12.4 and Node 20.9 or newer.
- `pnpm-workspace.yaml` already includes `apps/*`; a new application needs no workspace-pattern change.
- `apps/web` and `apps/admin` use Next.js 16.3.1 and React 19.2.8 with independent package scripts and ports 3000 and 3001.
- Root CI runs the root lint, type-check, test, and build scripts. Root scripts currently enumerate only web and admin and must explicitly include SnapBook.
- No shared packages directory exists. Creating general UI, database, or contract packages in S1 would establish APIs before the fixture journey is proven.
- Supabase contains no booking schema or tenant model. S1 does not change Supabase.
- The pre-change repository baseline passed 19 tests, repository lint, repository type-check, and the full web/admin/legacy production build.

## Version-sensitive framework findings

- Next.js App Router dynamic `params` are promises in the installed version and must be awaited.
- `generateStaticParams` plus `dynamicParams = false` can restrict the fixture routes to reviewed tenant slugs and produce deterministic static output.
- The App Router supports a generated manifest, but the tenant-specific identity required here is better proven with a tenant-path manifest route referenced by the full-page route metadata.
- A PWA manifest should declare stable `id`, `start_url`, and `scope` values. S1 will prove those values for fixture tenants but will not add a service worker, push, background sync, or offline mutations.
- Async Server Components are better covered through build or end-to-end checks; the deterministic domain and configuration modules remain directly unit-testable with Node's test runner.

Primary references:

- [Next.js layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Next.js dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Next.js generated static params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Web Application Manifest specification](https://www.w3.org/TR/appmanifest/)

## Exact S1 scope

### Application and routes

- Add `apps/snapbook` with port 3002 and its own build, lint, type-check, test, and start commands.
- Add a small prototype index linking to reviewed fictional fixtures.
- Add full-page and embed routes for each fixture slug.
- Add branded non-indexable metadata, an app icon, a not-found experience, and tenant-specific manifest responses for full-page routes only.
- Add route headers that prevent framing of full-page booking routes while allowing the fixture embed to be framed only by the same origin. Production client-origin policy remains S4.

### Reusable domain

- Add a runtime-validated tenant configuration model.
- Add one pure booking transition function with explicit events and impossible-transition rejection.
- Support services, optional provider choice, suggested slots, later dates, a skipped contact-value screen, review, request received, returning home, book again, rescheduling, cancellation, no availability, conflict, failure, retry, back, and reset.
- Keep the domain module inside `apps/snapbook` until a server or admin consumer justifies a workspace package and the S1 state contract has passed review.

### Fixtures

- Use two clearly fictional tenants to prove configuration rather than industry forks.
- One fixture enables provider preference and fixed prices.
- One fixture skips provider choice and uses different price presentation.
- Both use the same component and state machine.

### Interface

- Keep the first screen focused on services.
- Show a small set of suggested times before `See more dates`.
- Render provider preference only when configured.
- Explain the future minimal-contact step without presenting editable contact fields.
- Use accurate request-mode language; no booking, reminder, calendar event, or message is created.
- Include explicit fixture scenario controls for returning, unavailable, conflict, and failure states. These controls are prototype-only and must not be confused with customer actions.
- Keep all controls keyboard reachable, expose selected states, announce state outcomes, preserve visible focus, and support narrow iframe widths.

## Explicit S1 exclusions

- Database migrations, Supabase clients, API routes, server actions, RLS, authentication, cookies, customer records, booking persistence, or availability computation.
- Editable name, phone, email, notes, or sensitive information fields.
- Production iframe loader, arbitrary client origins, resize messaging, or analytics events.
- Service worker, install prompt, push, reminders, offline queue, payment, calendar integration, or native app.
- Admin/operator workflows.
- Deploying the new package or choosing its production domain.
- Changing the landing-page demo.

## Security and privacy boundary

- Every route and response remains `noindex`.
- Only fixture slugs returned by `generateStaticParams` render; unknown slugs return not found.
- Fixture configuration accepts constrained colour tokens and internal paths, not executable markup or arbitrary URLs.
- The embed route is same-origin frameable only for S1 inspection. It must not be advertised as a production embed contract.
- The application contains no secret or environment variable and performs no fetch, storage, cookie, messaging, or mutation action.

## Verification plan

- Unit tests cover tenant validation, duplicate and cross-reference rejection, conditional provider behavior, the first-time flow, more dates, returning/book-again, reschedule, cancellation, unavailable, conflict/retry, failure/retry, reset, and impossible events.
- Manifest tests verify tenant-specific `id`, `start_url`, and `scope` values.
- App lint, type-check, tests, and production build pass independently.
- Root lint, type-check, tests, and full build include SnapBook and remain green.
- Generated route inventory contains only the index, fixture book/embed routes, fixture manifest routes, icon, and not-found output.
- Rendered-source inspection confirms no contact inputs, network/storage calls, or operational booking claims.
- Manual desktop, mobile, and narrow-embed review covers both fixture configurations and every scenario state.

## Exit criteria

- Both shells consume the same runtime-validated fixture and state machine.
- Provider choice appears only for the configured fixture.
- A user can preview every accepted S1 journey without entering or transmitting data.
- The full-page fixture has a tenant-specific manifest identity; the embed does not advertise installation.
- Unknown tenant slugs fail closed.
- Root CI commands validate the third application.
- The handoff records visual debt, behavior debt, and the exact S2 boundary before commit.

## Implementation handoff

- Completed: 2026-08-21
- Application: `apps/snapbook`
- Local command: `pnpm dev:snapbook`
- Local index: `http://localhost:3002`

S1 now ships one runtime-validated configuration model and one pure transition function through both route shells. The two fictional tenants prove that provider choice, pricing presentation, palette, services, and slots are configuration—not separate industry applications. The full-page route advertises a tenant-specific manifest identity; the embed route uses the same component without advertising installation.

The prototype begins with service selection and offers only a few suggested times before later dates. It includes the first-time request preview, a deliberately empty contact-value step, returning home, book again, reschedule, cancel, unavailable, conflict, failure, retry, back, and reset paths. Fixture scenario controls remain visibly labelled and separate from customer actions.

### Verification evidence

- SnapBook unit tests: 17 passed.
- Repository tests: 36 passed in total; 19 existing web tests, 0 admin tests, and 17 SnapBook tests.
- Repository lint and type-check: passed with no warnings.
- Full production build: passed for web, admin, SnapBook, and legacy web.
- Generated SnapBook output: index and not-found, two full-page routes, two embed routes, and two tenant manifest routes.
- Desktop browser pass: Studio 808 first-time flow, truthful result, and returning state passed with no browser warnings or errors.
- Narrow browser pass at 360 px: Northstar Advisory skipped provider choice, kept readable controls, and passed reschedule selection and confirmation with no browser warnings or errors.
- Static inspection found no `fetch`, Supabase client, customer input, form, browser storage, cookie, or cross-window messaging call in the application.

### Deliberate debt

- Visual: S1 establishes hierarchy, theming, focus states, and narrow-width behavior. It is not a final client brand system and has no tenant-supplied fonts, imagery, or logo asset pipeline.
- Behavior: times are reviewed fixture labels rather than dates, time zones, capacity, duration-aware availability, holds, or booking records.
- PWA: manifest identity is proven, but service workers, offline behavior, install prompts, updates, notifications, and background actions are excluded.
- Embed: S1 permits only same-origin framing. It does not define a client-origin registry, loader script, resizing protocol, integrity policy, or analytics contract.
- Accessibility: native semantics, visible focus, selected state, status announcements, reduced motion, and narrow layouts are present. Formal screen-reader and automated accessibility audits remain S2/S4 validation work.

### Exact S2 boundary

Begin S2 with fresh discovery of real booking-domain invariants. Define tenant, location, service, provider, availability rule, slot, customer, booking request, appointment, and lifecycle-event contracts before selecting database tables or API handlers. Add the smallest persistence seam behind the existing transition vocabulary; keep fixture mode available for product review and tests. Do not add production embedding, admin operations, reminders, payments, health-data collection, or a broad calendar UI during S2.
