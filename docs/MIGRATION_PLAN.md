# 808 Digital Systems Migration Plan

## Objective

Migrate the current Vite landing page into a production-ready pnpm monorepo with:

- A public Next.js App Router application.
- A separately deployable Next.js admin application for an admin subdomain.
- A separately deployable SnapBook React application with iframe and full-page/PWA shells.
- Shared, deliberately bounded packages.
- Supabase as the data, authentication, storage, and Edge Function platform.
- A hardened and measurable LTV agent.
- An incremental cutover that preserves the existing landing page until the replacement is verified.

This plan is phased intentionally. A phase is not complete because its files exist; it is complete only when its exit criteria are verified.

## Operating rule: rediscover before every phase

Every phase begins with a fresh discovery pass. Previous plans, chat summaries, and phase reports are context, not authoritative descriptions of the repository or deployed system.

Before implementation in each phase:

1. Inspect the current Git branch, status, recent commits, and relevant diffs.
2. Re-enumerate the relevant files and read the current configuration and entry points.
3. Recheck installed dependency versions and official documentation for version-sensitive behavior.
4. Inspect the current environment-variable names without printing secret values.
5. Inspect the current Supabase migrations, generated types, policies, functions, and configuration when relevant.
6. Run the existing build, lint, type-check, and tests that are available at that point.
7. Compare the evidence with this plan and the previous phase handoff.
8. Write `docs/discovery/phase-N-<name>.md` containing:
   - Date and commit SHA.
   - Current-state facts.
   - Drift since the preceding phase.
   - Constraints and open decisions.
   - Risks.
   - The exact scope accepted for the phase.
9. Amend the phase scope before coding if discovery invalidates an assumption.

Each phase ends with:

- Automated verification appropriate to its risk.
- A manual smoke test of changed user journeys.
- A concise handoff appended to its discovery record.
- A clean explanation of any remaining warnings or deferred work.
- A rollback point, normally a focused commit or pull request.

## Target repository shape

```text
.
|-- apps/
|   |-- web/                       # Public Next.js application
|   |-- admin/                     # Admin-subdomain Next.js application
|   `-- snapbook/                  # Embed and customer PWA shells
|-- packages/
|   |-- brand/                     # Tokens, fonts, logos, shared assets
|   |-- contracts/                 # Runtime schemas and transport types
|   |-- database/                  # Supabase types and client factories
|   |-- snapbook-core/             # Booking states and domain rules
|   |-- ui/                        # Reusable presentational primitives
|   |-- eslint-config/
|   `-- typescript-config/
|-- supabase/
|   |-- functions/
|   |-- migrations/
|   `-- seed.sql
|-- docs/
|   |-- architecture/
|   `-- discovery/
|-- package.json
|-- pnpm-lock.yaml
`-- pnpm-workspace.yaml
```

Packages are introduced only when at least two consumers or a clear security/type boundary justify them. The target tree is a direction, not permission to create empty abstractions.

The SnapBook product track uses `S0`-`S6` identifiers so the existing public-site, admin, agent, and deployment phases do not need to be renumbered. Its current discovery baseline is `docs/discovery/snapbook-product-foundation-v1.md`. SnapBook work may proceed alongside the remaining website release gate, but no operational booking endpoint may accept real customer data until the applicable Phase 4 hardening and SnapBook trust-boundary checks pass.

## Phase 0: Baseline and architectural decisions

### Discovery focus

- Reconstruct the current Vite rendering path and LTV request flow.
- Inventory dependencies, unused generated UI, remote assets, placeholders, and encoding issues.
- Confirm the current deployment provider, domains, DNS ownership, and Supabase environments.
- Determine whether any production traffic or external integration already depends on existing URLs.
- Establish current Lighthouse, bundle, accessibility, and build baselines.

### Deliverables

- Record architecture decisions for:
  - pnpm monorepo structure.
  - Two independently deployed Next.js applications.
  - Hosting and preview environments.
  - Public content source for the first release.
  - Supabase environment strategy.
  - Authentication and admin-role model.
  - API ownership: Next.js Route Handlers versus Supabase Edge Functions.
- Create an environment-variable matrix containing names, owners, visibility, and environment placement, but no values.
- Create a route inventory and redirect map.
- Record measurable parity and launch criteria.
- Rotate any credential considered exposed and adopt server-only names such as `ANTHROPIC_API_KEY`.

### Exit criteria

- Material architectural choices are recorded rather than implicit.
- Existing production behavior and URLs are documented.
- Baseline build and quality measurements are reproducible.
- No unresolved decision blocks the monorepo scaffold.

## Phase 1: Monorepo and tooling foundation

### Discovery focus

- Recheck package-manager state, lockfiles, Node requirements, and current Next.js/pnpm guidance.
- Confirm which current dependencies are actually imported.
- Inspect CI and hosting configuration for root-directory assumptions.

### Deliverables

- Make pnpm the single package manager and establish one lockfile.
- Add root scripts for build, lint, type-check, test, and development.
- Scaffold `apps/web` and `apps/admin` as independent Next.js App Router applications.
- Add minimal shared TypeScript and lint configuration only where it removes real duplication.
- Preserve the existing Vite application temporarily as the reference implementation.
- Document local commands and required environment-variable names.
- Configure CI to validate both applications and any shared packages they consume.

### Verification

- A clean install succeeds from the lockfile.
- Both applications build independently from the repository root.
- A change isolated to one app does not require the other app to run locally.
- No existing landing-page source is deleted during this phase.

### Exit criteria

- The monorepo is reproducible on a clean machine or clean CI worker.
- Both deployment units are identifiable and independently buildable.
- The legacy Vite app remains available for parity comparison.

## Phase 2: Public home-page migration and visual parity

### Discovery focus

- Re-read the live `App.tsx`, styles, asset sources, current copy, and active component imports.
- Capture current desktop and mobile screenshots and interactive behavior.
- Re-run the legacy build and record any warnings.

### Deliverables

- Move the public home page into `apps/web`.
- Keep static sections as Server Components.
- Isolate the LTV chat as a small Client Component.
- Split page-specific sections from reusable UI primitives.
- Move brand tokens, fonts, and assets into appropriate locations without premature generalization.
- Replace remote placeholder asset mechanics where approved, while preserving visual intent.
- Correct visible encoding problems during migration.
- Preserve the current Supabase Edge Function contract initially.

### Verification

- Visual comparison at agreed mobile, tablet, and desktop viewports.
- Keyboard and screen-reader smoke tests for the calculator and calls to action.
- LTV conversation success and failure flows work against the existing function.
- No full-page client boundary is introduced merely to support the calculator.

### Exit criteria

- The Next.js home page meets the agreed parity threshold.
- The page is statically renderable except for intentionally interactive islands.
- The legacy site can still be restored until cutover.

## Phase 3: Public routing, content model, and SEO foundation

### 2026-08-20 scope amendment

Phase 3 now includes a landing-page narrative and conversion pass before any public product-demo work. The migrated home page achieved framework and visual parity, but parity preserved a weak sequence: the working calculator was followed by disconnected positioning, problem, service, proof, audience, and process sections. The next release must form one continuous path from calculated client value to customer-journey friction, the core landing-page offer, supporting discovery/booking systems, the engagement process, and direct contact.

This amendment also supersedes the earlier recommendation to implement industry routes next. Industry pages, case studies, and broad audience claims remain content-gated until real client insight or approved evidence makes them useful. They are not required for the current direct-outreach acquisition model.

Implementation order within the remainder of Phase 3:

1. Refactor the home-page hierarchy and copy without adding invented proof, calculator warnings, or unapproved commercial promises.
2. Verify the revised page as a complete desktop and mobile scroll journey.
3. Convert the SnapBook HTML prototype into a safe fixture-backed demo component and place it below the core offer, not inside the calculator hero.
4. Finalize the remaining approved route and SEO work only when its content and operating decisions are ready.

The proposed free-year booking offer is intentionally excluded from public copy in the first step. Its duration, eligibility, included capability, support boundary, transition terms, and availability must be approved as one coherent public promise before it appears on the site.

### Discovery focus

- Reassess business priorities, available copy, search intent, and route ownership.
- Inspect actual content readiness rather than assuming every proposed route can launch.
- Recheck Next.js metadata, sitemap, caching, and structured-data guidance.

### Initial route model

```text
/
/services
/services/[slug]
/industries
/industries/[slug]
/case-studies
/case-studies/[slug]
/insights
/insights/[slug]
/about
/contact
/calculator
```

### Deliverables

- Implement the approved routes and shared marketing layout.
- Define runtime-validated content shapes for services, industries, case studies, and articles.
- Begin with typed local content or MDX unless discovery confirms the admin CMS is ready.
- Add route-level metadata, canonical URLs, Open Graph assets, sitemap, robots policy, and structured data.
- Add intentional not-found, loading, and error experiences where appropriate.
- Create redirects for any replaced public URLs.
- Remove `noindex` only in the production environment and only when launch criteria are satisfied.

### Verification

- Every indexable route has unique title, description, canonical URL, and meaningful rendered HTML.
- Sitemap and robots outputs match the environment.
- Structured data validates for the selected schema types.
- Internal links have no known broken destinations.

### Exit criteria

- Approved routes are content-complete enough to publish.
- Search and social metadata are correct without requiring client JavaScript.
- Preview environments remain non-indexable.

## Parallel product track: SnapBook S0-S6

SnapBook is a separately deployable product track, not an extension of the marketing-site component. Its detailed journey contract, architecture direction, trust boundaries, decisions, and exit criteria are versioned in `docs/discovery/snapbook-product-foundation-v1.md`.

The track is ordered as follows. Status was last reconciled on 2026-08-21:

1. `S0` - reusable product and journey contract. **Complete.**
2. `S1` - fixture-backed booking core plus embed and full-page/PWA shells. **Complete.** See `docs/discovery/snapbook-s1-reusable-shells.md`.
3. `S2` - tenant, availability, RLS, transactional hold, and booking data foundation. **Next; fresh discovery required.**
4. `S3` - operational booking, management links, rescheduling, cancellation, validation, idempotency, and abuse controls.
5. `S4` - production iframe loader and versioned host-page integration contract.
6. `S5` - installable PWA and first-party returning-customer experience.
7. `S6` - minimum operator workflow in `apps/admin`, pilot hardening, and controlled launch.

Track guardrails:

- No native mobile application is planned in this track.
- The first screen uses services and suggested slots rather than a calendar.
- One shared multi-tenant service supports every tenant; industry-specific application forks are not allowed.
- Embed and PWA shells use the same domain rules and runtime-validated configuration.
- The standard booking flow excludes sensitive and free-form customer context.
- No operational endpoint accepts real customer data until tenant isolation, validation, concurrency, audit, and abuse boundaries pass review.
- Each `S` slice begins with the same fresh-discovery operating rule as the numbered migration phases and ends with a focused commit and handoff.

Dependencies remain explicit: `S4` must coordinate with the Phase 4 CSP and public-site hardening work, and the authenticated tenant workflow in `S6` depends on the Phase 5 admin/authentication foundation. `S1` can begin before those phases because it is fixture-backed and accepts no real customer data.

## Phase 4: Public-site production hardening

### Discovery focus

- Measure the migrated site rather than reusing Vite-era baselines.
- Inspect runtime logs, bundle composition, asset behavior, headers, and third-party requests.
- Threat-model public forms and the calculator endpoint.

### Deliverables

- Optimize images, fonts, caching, and client JavaScript.
- Add analytics with documented conversion events and privacy behavior.
- Add error monitoring and useful request correlation.
- Add security headers and a tested Content Security Policy.
- Add validation, rate limiting, abuse controls, and graceful degradation to public submissions.
- Establish accessibility and supported-browser checks.
- Add unit, integration, and end-to-end coverage for critical public journeys.

### Exit criteria

- Agreed performance and accessibility budgets pass on representative devices.
- Failures in analytics, AI, or third-party services do not break core page content.
- Public endpoints have documented validation and abuse protection.
- Monitoring can distinguish frontend, Next.js server, and Supabase failures.

## Phase 5: Admin application and authentication foundation

### Discovery focus

- Confirm real administrator roles, workflows, and least-privilege requirements.
- Inspect the current Supabase Auth configuration, schemas, RLS state, and redirect allow-list.
- Recheck official Supabase SSR guidance for the installed package versions.

### Deliverables

- Implement admin login, logout, callback, session refresh, and protected layouts.
- Use cookie-based Supabase SSR clients with explicit browser/server separation.
- Create administrator profiles and roles through migrations.
- Enforce authorization with database RLS and server-side checks, not UI hiding.
- Configure the admin subdomain as a separate deployment with separate environment settings.
- Add an audit-event model before privileged content mutations are introduced.

### Verification

- Anonymous, authenticated non-admin, and authorized admin scenarios are tested separately.
- Direct URL and direct API access cannot bypass authorization.
- Session expiry, revoked access, and logout behave correctly.
- Service-role credentials cannot enter a client bundle.

### Exit criteria

- The admin shell is independently deployable and securely gated.
- The role model and RLS policies are reviewed against concrete workflows.
- No content mutation is enabled without an audit path.

## Phase 6: Content platform and admin workflows

### Discovery focus

- Revisit which content genuinely needs non-developer editing.
- Observe the intended editorial workflow, states, media requirements, and approval rules.
- Inspect any content created in Phase 3 and plan deterministic migration.

### Deliverables

- Add migrations for the approved content entities.
- Generate and consume Supabase database types.
- Implement draft, preview, publish, unpublish, and archive behavior as required.
- Add admin CRUD workflows with runtime validation and audit events.
- Add media storage policies and lifecycle rules if media management is in scope.
- Migrate local content only after database-backed rendering reaches parity.
- Define cache invalidation/revalidation when content is published.

### Verification

- Content state transitions and permissions have integration coverage.
- Preview content cannot leak into public indexing or unauthenticated APIs.
- Published updates appear within the agreed freshness window.
- Rollback to a prior content revision is possible or explicitly deferred with approval.

### Exit criteria

- Editors can complete the approved workflows without database-console access.
- Public rendering remains stable when content is missing or malformed.
- RLS, storage policies, and audit events cover all enabled mutations.

## Phase 7: LTV agent redesign and hardening

### Discovery focus

- Start from the current function, prompt, model, request history, observed failures, cost, and latency.
- Inspect the newly installed `python-agents-toolkit` skills at the start of this phase and follow their current instructions; do not rely on assumptions about what the plugin contains.
- Recheck current provider SDKs, model availability, structured-output support, and Supabase runtime constraints.
- Gather representative anonymized conversations and define success criteria before redesigning the prompt or orchestration.

### Deliverables

- Define versioned request and response contracts with runtime validation.
- Separate calculation logic from conversational extraction so arithmetic is deterministic.
- Prevent prompt output from directly deciding privileged actions.
- Add input limits, rate limits, timeout/retry policy, error taxonomy, and safe fallbacks.
- Add prompt/version tracking, redacted telemetry, latency, usage, and cost measurements.
- Build an evaluation set for extraction accuracy, conversation quality, edge cases, injection resistance, and sales-claim safety.
- Decide provider abstraction only after discovery demonstrates its value.
- Keep provider secrets server-only and rotate the currently used credential as necessary.

### Verification

- Deterministic calculations are covered independently of model calls.
- Contract, adversarial, regression, timeout, and malformed-output tests pass.
- The evaluation report meets explicitly recorded quality and cost thresholds.
- Logs and analytics do not expose secrets or unnecessary personal data.

### Exit criteria

- The agent can be released and rolled back by prompt/contract version.
- Quality, latency, failures, and cost are observable.
- The public UI degrades gracefully when the model provider is unavailable.

## Phase 8: Deployment, data, and operational readiness

### Discovery focus

- Inspect the actual hosting projects, DNS, Supabase projects, secrets, CI, backups, and monitoring.
- Verify domain and redirect behavior in preview before changing production.
- Rehearse migrations and rollback using production-like data where safe.

### Deliverables

- Establish development, preview, and production environment ownership.
- Configure public and admin deployments from their respective app roots.
- Configure root/www and admin domains, TLS, redirects, and allowed auth origins.
- Add migration checks, deployment checks, smoke tests, and rollback instructions.
- Document backup, recovery, incident response, and credential-rotation procedures.
- Prepare a launch checklist with named evidence for each gate.

### Exit criteria

- Both applications pass production-like smoke tests.
- Database migration and application rollback are rehearsed.
- Monitoring and alert routing are live before traffic cutover.
- DNS and authentication changes have an approved rollback procedure.

## Phase 9: Cutover and legacy retirement

### Discovery focus

- Recheck launch criteria, current production behavior, outstanding incidents, content completeness, and traffic risk on the intended cutover date.
- Confirm backups, rollback artifacts, DNS access, and responsible operators.

### Deliverables

- Deploy the public application and map production traffic.
- Deploy the admin application without publicly advertising it.
- Run post-deployment functional, SEO, analytics, authentication, and LTV smoke tests.
- Monitor errors, conversions, performance, and agent behavior through the agreed observation window.
- Remove the Vite application and obsolete dependencies only after the rollback window closes.
- Update repository documentation to describe the final system rather than the migration state.

### Exit criteria

- Production traffic is stable through the agreed observation window.
- No critical regression remains open.
- The legacy implementation is removed in a dedicated, recoverable change.
- Architecture and operational documentation match the deployed system.

## Cross-phase rules

### Security

- Never expose service-role or model-provider credentials to browser code.
- Treat the admin subdomain as an operational separation, not an authorization control.
- Put authorization in RLS and trusted server code.
- Validate data at every external boundary.
- Never print secret values during discovery or verification.

### Scope control

- Do not combine a framework migration with an unmeasured agent rewrite.
- Do not create a shared package for code used by only one app without a clear boundary reason.
- Do not move content into the database until the editorial workflow and schema are agreed.
- Do not delete the legacy implementation before parity and rollback gates pass.

### Quality

- Prefer focused commits and pull requests aligned with phase deliverables.
- Keep the repository buildable at phase boundaries.
- Add tests at the layer where a regression would occur.
- Record accepted debt explicitly rather than leaving unexplained warnings.

## Plan-change policy

This plan is expected to change as discovery produces evidence. A change is acceptable when the relevant discovery record explains:

- What assumption changed.
- What evidence changed it.
- Which phases or exit criteria are affected.
- Whether the change introduces migration, security, cost, or rollback risk.

The phase order may be adjusted, but public cutover must not precede its production-readiness gates, and content/admin mutations must not precede authentication and authorization gates.
