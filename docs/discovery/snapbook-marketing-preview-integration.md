# SnapBook marketing preview integration

- Date: 2026-08-21
- Starting commit: `9af2532`
- Status: implemented and verified

## Outcome

Replace the legacy, separately implemented homepage demo with the actual fixture-backed SnapBook experience. Until the separately deployed SnapBook origin and S4 embed contract exist, the public web application will expose a same-origin, non-indexable preview route and render it in an iframe on the homepage.

```text
apps/web homepage
  -> same-origin iframe: /snapbook-preview/studio-808
  -> shared fixture-only SnapBook package

apps/snapbook book/embed routes
  -> same shared fixture-only SnapBook package
```

This makes the reviewed product journey visible to leads without turning the marketing site into an operational booking client.

## Shared-package boundary

The second consumer now justifies extracting the reusable fixture domain and interface from `apps/snapbook` into `packages/snapbook-prototype`.

The package may contain:

- runtime-validated fictional tenant configuration;
- the deterministic in-memory booking state machine;
- the fixture-backed booking interface and its scoped styles; and
- unit tests for the fixture contract and journey transitions.

It must not contain Supabase clients, API calls, environment variables, customer fields, storage, cookies, secrets, cross-window messaging, analytics, or production tenant resolution.

## Main-site route

- Route: `/snapbook-preview/studio-808`
- Purpose: same-origin iframe document for the homepage product preview.
- Indexing: always `noindex, nofollow`; excluded from the sitemap.
- Framing: same-origin only.
- Tenant: reviewed fictional `studio-808` fixture only.
- Data behavior: no submission, storage, request, booking, reminder, or calendar mutation.
- Presentation: internal fixture-scenario controls remain available in `apps/snapbook` but are hidden from the lead-facing frame.

The homepage iframe receives an accessible title, uses native iframe scrolling while S4 resizing is deferred, and is lazy-loaded because it appears below the initial viewport. It is not treated as an untrusted-code sandbox: both documents are the same reviewed application origin, and the preview route contains no secrets or customer data. The production cross-origin sandbox policy remains an S4 decision.

## Explicit exclusions

- Deploying `apps/snapbook` or selecting its production domain.
- Loading a cross-origin SnapBook iframe.
- A loader script, `postMessage`, automatic resizing, analytics events, arbitrary tenant slugs, or an origin registry.
- Connecting either preview to operational endpoints or real tenant/customer data.
- Service workers, installation prompts, notifications, authentication, or admin operations.

## Verification

- Both applications render the same component and fixture contract.
- The legacy homepage demo implementation is removed.
- The main-site preview route is non-indexable and same-origin frameable only.
- Desktop and narrow browser passes complete a multi-service journey inside the homepage iframe.
- Package, web, SnapBook, and repository lint, type-check, tests, and production builds pass.
- Static inspection confirms the shared package remains fixture-only.

## S4 handoff

S4 must replace the same-origin preview URL with the separately deployed SnapBook embed origin and define the loader, exact allowed host origins, CSP, resizing messages, versioned message schemas, failure fallback, release compatibility, and approved non-personal analytics events. This interim route is evidence for interaction and layout only; it is not the production embed protocol.
