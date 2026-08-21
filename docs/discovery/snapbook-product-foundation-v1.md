# SnapBook product foundation v1

- Date: 2026-08-21
- Starting commit: `d34426a`
- Branch: `main`
- Status: discovery baseline; implementation not started
- Scope: reusable booking journey, embeddable client, React PWA, shared multi-tenant service, and future operator workflow

## Discovery outcome

SnapBook should become a separately deployable product rather than additional state inside the 808 marketing site. The production product will have one shared booking domain and two customer-facing delivery surfaces:

1. an isolated widget embedded in a client's website; and
2. a full-page, installable React PWA for repeat visits and booking management.

Both surfaces must use the same journey rules, tenant configuration, validation, availability service, and booking API. The existing `apps/web` demo remains illustrative marketing content and must not become the production booking client.

The reusable product is defined by stable workflow rules and a configurable tenant boundary. It is not defined by separate salon, clinic, guesthouse, or professional-services applications. Industry-specific differences should be expressed through services, resources, policies, wording, and explicitly approved capabilities rather than copied applications or conditionals scattered through the UI.

Confidential strategy and client-journey material informed this discovery. Its qualification logic, commercial reasoning, internal scripts, and private operating assumptions are not reproduced here.

## Current-state evidence

- The repository has independently deployable `apps/web` and `apps/admin` Next.js 16 applications. It does not yet have a SnapBook application or shared packages directory.
- Supabase currently contains the LTV Edge Function and its rate-limit migration only. No booking schema, tenant model, RLS policy, customer identity, availability service, or booking function exists.
- The landing-page SnapBook demo has six fixture-backed states: services, times, review, confirmation, returning-customer home, and rescheduling.
- The demo has a useful configuration boundary for business identity, theme, services, provider, prices, and time fixtures, but it deliberately has no network, persistence, identity, reminders, payments, calendar connection, or PWA behavior.
- The approved product direction is a single shared multi-tenant booking service. The client-facing website remains independently handover-capable; the shared booking platform does not fork per client.
- SnapBook inherits 808's accessible forest, ivory, and amber baseline. Tenant colours and identity may override the product theme without changing interaction order or accessibility requirements.
- Public copy currently describes the standard flow as choosing a service and requesting a time. Instant confirmation is therefore a capability decision, not an assumption.

## Product principles

### Frictionless first booking

- Do not require an account, PWA installation, calendar view, provider decision, or long intake form before a customer can see useful availability.
- Ask for contact details only after the customer has selected a service and viable time.
- Prefer a short set of recommended slots. `See more dates` is the calendar escape hatch when suggestions do not work.
- Preserve the customer's valid choices when a conditional screen, validation error, or recoverable conflict occurs.

### Progressive complexity

- A simple business should receive the simple journey.
- Provider choice appears only when the tenant enables it and the choice materially affects the service.
- Location choice appears only for multi-location tenants.
- Policies appear at the decision they affect, not as a wall of terms at the beginning.
- Additional verification should be risk-based and placed as late as safely possible.

### Reusable, not generic

- The workflow and domain rules remain stable across tenants.
- Tenant configuration controls identity, theme, location, services, prices, durations, resources, wording, booking mode, availability, lead time, buffers, horizon, and change policies.
- Tenant configuration must not inject arbitrary executable code, markup, URLs, or unreviewed CSS.
- A client-specific workflow that changes domain behavior is a scoped capability decision, not a hidden theme option.

### Minimal data

- SnapBook does not ask for symptoms, medical history, case details, legal facts, free-form appointment reasons, or other sensitive context.
- The standard booking record contains only what is necessary to identify the service, time, tenant, location/resource when applicable, booking state, and a minimal reply channel.
- If additional context is required, the interface may direct the customer to an independently controlled business contact channel after the booking step. SnapBook must not imply that an external channel is appropriate for sensitive information without a separate compliance decision.

### Simple for customers, guarded operationally

- Low visual friction must not mean weak tenant isolation, unlimited slot enumeration, duplicate submissions, unbounded holds, or unaudited booking changes.
- Abuse controls should be quiet by default and escalate only when risk signals justify more friction.

## Initial product boundary

### Included in the first reusable template

- One tenant with one active location.
- One IANA timezone, initially `Africa/Lusaka`.
- Service catalogue with public label, optional public price, duration, and buffers.
- Optional resource/provider assignment, with `any available` as the low-friction default.
- Weekly availability rules and dated exceptions.
- A small recommended-slot response plus a later date browser.
- Request mode as the provisional launch default.
- Minimal customer name and mobile contact at the final details step; exact required fields remain a pilot decision.
- Idempotent booking submission and an expiring slot hold.
- Confirmation/request-received result with accurate status language.
- Signed booking-management access for rescheduling and cancellation.
- Tenant policies for lead time, booking horizon, rescheduling, and cancellation.
- Booking-event audit history.
- Configurable, accessibility-checked tenant theme.

### Explicitly deferred from the first template

- Native iOS or Android applications.
- Payments, deposits, refunds, or custody of client funds.
- Sensitive notes, attachments, intake questionnaires, or regulated records.
- Group classes, capacity-based events, recurring appointments, packages, memberships, or waitlists.
- Google, Microsoft, Apple, or third-party calendar synchronization.
- Automated reminders until a messaging provider, consent model, delivery policy, and cost owner are approved.
- Multi-location selection and cross-location availability.
- Arbitrary tenant workflow builders.
- Offline booking, rescheduling, or cancellation mutations.
- External-agent booking APIs beyond the normal browser interaction.

## Actors and surfaces

### Customer

Uses the embedded widget or full PWA to find a service and time, submit a booking request, view a result, and later manage or repeat a booking through authorized access.

### Tenant operator

Uses the separately deployed admin application to manage business configuration, services, resources, availability exceptions, policies, and bookings. Operator work is required for a viable pilot even though the complete admin product follows later.

### 808 platform operator

Provisions tenants, manages feature eligibility and safe theme configuration, handles support, reviews audit evidence, and cannot bypass tenant boundaries merely through client-side UI.

## Customer journey contract

### Journey A: first-time booking

```text
Tenant context
  -> Choose service
  -> [Choose location, only if enabled later]
  -> [Choose provider, only if the customer opts out of any available]
  -> Suggested times
  -> [More dates, only when needed]
  -> Minimal contact details
  -> Review service, time, price/status and policy
  -> Submit with idempotency key and slot hold
  -> Confirmed OR request received
```

Screen requirements:

1. **Tenant context** establishes the business name, location, brand, timezone context, and whether the customer is booking or sending a request. A tenant mismatch or disabled tenant fails before customer data is requested.
2. **Service selection** shows only bookable services. Price wording must distinguish fixed price, starting price, quote required, or hidden price.
3. **Provider selection** is skipped by default. `Any available` remains selected unless provider preference is enabled and deliberately chosen.
4. **Suggested times** presents a small, ordered set of real server-generated options. The interface must not label a slot scarce, popular, or available unless that state is backed by current data.
5. **More dates** provides a simple date browser only after suggested times fail the customer. It is not the entry screen.
6. **Contact details** asks for the minimum approved reply channel. It must not contain a general notes field.
7. **Review** states the service, location/resource if applicable, time, duration, displayed price meaning, booking mode, and relevant change policy before submission.
8. **Result** distinguishes `confirmed` from `request received`. It gives the customer an authorized management path without claiming a reminder will be sent unless reminder delivery is operational.

### Journey B: returning customer

```text
Signed management link or established first-party session
  -> Upcoming booking or recent service
  -> Book again
  -> Suggested times
  -> Review changed details
  -> Submit
  -> Accurate result
```

- PWA installation is offered after value has been delivered, never as a prerequisite.
- A remembered browser can reduce repeated entry, but browser storage is not authoritative customer identity.
- Third-party iframe cookie restrictions mean the embed must not depend on silent cross-site recognition. The full-page PWA or a signed management link is the reliable return path.
- `Book again` preselects the prior service and, only when still valid, the prior location/provider preference. It never reuses an old time.

### Journey C: reschedule

```text
Authorized booking access
  -> Current booking
  -> Suggested replacement times
  -> [More dates]
  -> Review policy and new time
  -> Atomic reschedule
  -> Updated booking result
```

- Authorization must be checked server-side on every read and mutation.
- The original booking remains valid until the replacement is committed atomically.
- A replacement slot receives an expiring hold. The old slot is released only when the change succeeds.
- A conflict returns the customer to time selection with fresh alternatives and preserves other valid choices.

### Journey D: cancellation

```text
Authorized booking access
  -> Current booking
  -> Cancellation policy and consequence
  -> Explicit confirmation
  -> Atomic cancellation
  -> Cancelled result and contact path
```

- Cancellation is never hidden behind support when the tenant policy permits self-service.
- The confirmation control names the action clearly and is not preselected.
- Payment/refund language remains absent until payments exist.

### Journey E: no useful availability

- Show the next useful date range when one exists.
- Offer `See more dates` and a direct business contact path.
- Preserve the chosen service and provider preference.
- Do not invent a waitlist, overbook, or collect contact details for a feature that is not operational.

### Journey F: conflict, failure, and offline behavior

- A slot conflict returns new suggestions instead of a generic fatal error.
- Idempotency ensures a retry cannot create a second booking.
- A network failure leaves the customer selection locally in memory and provides a safe retry.
- The PWA may cache its shell and public tenant catalogue, but availability and mutations require a live connection.
- Errors use a public correlation reference without exposing database, tenant, or provider internals.

## Booking state and action model

Initial booking states:

```text
requested -> confirmed -> completed
    |            |
    +----------> cancelled

requested -> declined
confirmed -> no_show
```

Rescheduling is an audited action that changes the scheduled interval; it is not a terminal booking state. Every mutation records actor class, timestamp, prior state, new state or changed fields, and a safe correlation identifier.

The API must reject impossible transitions even when called outside the user interface.

## Reusable tenant configuration

The first configuration contract should contain:

- public tenant slug and status;
- business display name and safe public description;
- location label, timezone, contact destinations, and booking mode;
- theme tokens selected from a constrained schema;
- services, public price presentation, duration, buffers, and active state;
- optional resources/providers and their service eligibility;
- weekly availability, dated closures, and overrides;
- booking lead time, booking horizon, slot interval, and hold duration;
- reschedule and cancellation cutoffs;
- approved customer-contact fields;
- explicitly enabled capabilities.

The UI consumes one normalized configuration shape. It must not branch on industry names such as `salon` or `clinic`.

## Target application architecture

```text
apps/web
  Marketing site and safe fictional demo only

apps/snapbook
  /book/[tenantSlug]       Full customer web/PWA shell
  /embed/[tenantSlug]      Isolated iframe shell
  Shared workflow screens, accessibility and theme renderer
  Server-side tenant resolution and booking API boundary

apps/admin
  Authenticated tenant/operator workflows

packages/snapbook-core
  Booking states, transition rules, availability inputs,
  configuration types, validation and provider-neutral use cases

packages/contracts
  Runtime-validated request/response contracts shared by
  SnapBook, admin and server handlers

supabase
  Tenant-scoped records, RLS, transactional booking functions,
  audit events and migrations
```

`packages/snapbook-core` is justified when both embed and PWA shells begin consuming the same tested workflow. A general shared UI package remains deferred until a second application genuinely needs the same presentational components.

### Multi-tenant service boundary

- Tenant resolution occurs on the server from an approved public slug or host mapping. A browser-supplied internal tenant identifier is not trusted as authorization.
- Public catalogue reads expose only published tenant configuration.
- Booking availability and mutations go through controlled server endpoints or transactional database functions rather than unrestricted direct table access.
- Every tenant-owned table carries a tenant key and an explicit RLS policy.
- Service-role credentials never enter either customer shell.
- All timestamps are stored unambiguously and rendered using the tenant's IANA timezone.

### Initial domain records

- `tenants`
- `tenant_hosts`
- `locations`
- `services`
- `resources`
- `resource_services`
- `availability_rules`
- `availability_exceptions`
- `booking_policies`
- `customers` with minimal contact fields
- `bookings`
- `booking_events`
- `slot_holds`
- idempotency records

This list is a discovery model, not authorization to write migrations before the transactional and RLS design is reviewed.

## Embed architecture

The production embed should use a versioned, iframe-based boundary loaded by a small script owned by SnapBook.

The loader may:

- create the iframe with an explicit accessible title;
- pass the approved tenant slug and embed version;
- resize the iframe from validated `postMessage` events;
- expose a normal link to the full booking page as fallback; and
- emit a small allowlisted set of non-personal lifecycle events when the host page has approved analytics behavior.

The loader must not:

- inject the SnapBook React tree into arbitrary client DOM;
- accept arbitrary HTML, JavaScript, CSS, redirect URLs, or database identifiers;
- receive customer contact details or booking payloads through `postMessage`; or
- trust messages without exact origin, source-window, schema, and version checks.

Initial message names should be namespaced and versioned, for example:

```text
snapbook:v1:ready
snapbook:v1:resize
snapbook:v1:open-full-page
snapbook:v1:journey-completed
```

`journey-completed` carries no name, phone number, service notes, or raw booking object.

## React PWA boundary

- The PWA is the full-page customer surface, not a native-app substitute and not an account wall.
- Each tenant installation needs a stable manifest identity and start URL. Path-based tenancy on a dedicated SnapBook origin is the provisional MVP direction; wildcard tenant subdomains remain a later operational choice.
- A service worker may cache versioned static assets and safe public catalogue responses. It must not cache private booking responses or queue booking mutations offline.
- Signed management links and first-party, HTTP-only sessions are preferred over storing customer identity or bearer tokens in `localStorage`.
- Install prompts appear after confirmation or during a return journey, when the benefit is understandable.
- Push notifications remain deferred until identity, consent, provider, revocation, and tenant-policy decisions are complete.

## Availability and concurrency rules

- Availability is generated server-side from service duration, buffers, resource eligibility, weekly rules, dated exceptions, existing holds, and active bookings.
- Suggested slots are a presentation of the same availability engine used by the later date browser.
- Generated availability is not a promise until the server creates a bounded hold or commits the booking.
- Holds have short, server-enforced expiry and cannot be extended indefinitely by refreshing the UI.
- Booking and rescheduling mutations are transactional and idempotent.
- Time comparisons use server time; clients do not decide whether a hold or policy deadline remains valid.

## Customer access and abuse controls

The first pilot should use progressive assurance:

- request mode can begin with server validation, per-tenant/IP/contact-hash limits, idempotency, bounded holds, and operator review;
- instant confirmation requires stronger contact verification or equivalent assurance before it is enabled;
- suspicious patterns may trigger a challenge or verification step without adding that step to every normal journey;
- signed management tokens are scoped to one tenant/customer action context, expire or rotate, and are never logged in full;
- enumeration endpoints return bounded results and use rate limits independent from mutation limits;
- raw contact details are excluded from application logs, analytics events, error reports, and embed messages.

Abuse-control thresholds and verification providers require a separate, versioned implementation review.

## Operator workflow required for a pilot

The smallest useful operator surface must allow an authorized tenant operator to:

- view bookings by date and status;
- accept or decline requests when request mode is active;
- create a dated closure or availability exception;
- change service active status and basic scheduling facts;
- reschedule or cancel with an audit reason; and
- copy a safe customer contact destination without exposing cross-tenant records.

Full visual customization, reporting, bulk operations, staff role delegation, and content-platform workflows are later scope.

## Decisions established by this discovery

- No native mobile application in the current roadmap.
- A React PWA and iframe embed are the two customer surfaces.
- No calendar on the first screen; suggested slots precede the optional date browser.
- One reusable workflow is configured per tenant; industry forks are rejected.
- The booking backend remains one shared multi-tenant service.
- The marketing demo remains separate from the operational product.
- Tenant brand configuration may change presentation but not validation, security, or core journey rules.
- Sensitive and free-form context is excluded from the standard booking record.
- The initial product is single-location, network-required, payment-free, and integration-light.
- Request mode is the provisional pilot default until real operating requirements justify instant confirmation.

## Decisions still requiring evidence

1. Exact required customer fields and whether the first pilot can operate without contact verification.
2. Messaging provider, WhatsApp/SMS ownership, consent wording, delivery receipts, and cost responsibility.
3. Pilot tenant booking mode and operator response expectations.
4. Exact cancellation/rescheduling cutoff defaults.
5. Dedicated SnapBook production origin and tenant URL format.
6. PWA co-branding, tenant icons, and install identity.
7. Data-region and legal review before any regulated-sector pilot.
8. Retention, export, deletion, suspension, and end-of-service behavior.
9. Minimum admin roles and whether 808 operators may support a tenant through impersonation-free tooling.

These are inputs to later slices. None blocks building a fixture-backed journey state machine and runtime-validated tenant configuration next.

## SnapBook delivery track

### S0: product and journey contract

This document is the baseline. Exit when the journey, boundaries, provisional defaults, open decisions, and repository direction are reviewed and amended by the owner.

### S1: reusable booking core and prototype shells

- Scaffold `apps/snapbook` only after fresh framework and workspace discovery.
- Implement runtime-validated tenant fixtures and the deterministic booking state machine.
- Render first-time, returning, reschedule, cancellation, no-availability, conflict, and failure paths in both embed and full-page shells without a backend.
- Add accessibility, responsive, and state-transition tests before extracting general UI packages.

### S2: tenant and availability foundation

- Review Supabase architecture, data-region implications, RLS, transactions, and generated types.
- Add the minimal tenant, service, resource, availability, policy, hold, booking, and event records.
- Implement tenant resolution and deterministic availability generation with concurrency tests.

### S3: operational booking slice

- Connect the customer details, review, request submission, result, signed management access, rescheduling, and cancellation paths.
- Add validation, idempotency, rate limits, audit events, correlation, and safe failure behavior.
- Keep messaging and reminders out until their provider contract is approved.

### S4: production embed

- Add the tiny loader, iframe isolation, versioned message contract, resize behavior, fallback link, CSP/frame policy, and client-site integration guide.
- Test against representative plain HTML, WordPress-like, React, and restrictive-CSP host pages.

### S5: installable PWA and returning journey

- Add tenant-aware manifest behavior, safe service-worker caching, install entry points, first-party session restoration, and full-page management links.
- Verify that the PWA adds convenience without becoming necessary for booking access.

### S6: pilot operator surface and hardening

- Add the minimum tenant-operator workflows in `apps/admin` behind reviewed authentication and RLS.
- Run tenant-isolation, concurrency, abuse, accessibility, performance, recovery, and operational support exercises.
- Launch with one deliberately simple service-business pilot before enabling broader capabilities.

## Immediate next slice

After owner review of this discovery baseline, begin S1 with another fresh repository and framework discovery. S1 must not create database migrations, collect real customer data, or connect the marketing demo to operational endpoints. Its purpose is to prove the reusable journey and configuration contract in two real delivery shells before the backend makes those decisions expensive to change.
