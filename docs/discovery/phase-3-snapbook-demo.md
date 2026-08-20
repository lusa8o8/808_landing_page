# Phase 3 discovery: SnapBook interactive demo

- Date: 2026-08-20
- Starting commit: `b7231dd`
- Starting branch: `main`
- Source prototype: `C:\Users\lusam\Downloads\snapbook-widget-v3.html`
- Source SHA-256: `935E836B47A90DBE679FAC133D9F9CCA432FB748F849E54FC258064C97D35D8E`

## Discovery outcome

The standalone HTML is a useful interaction prototype, not an embeddable production widget. Its strongest product story is the full customer lifecycle: selecting a service and time, reviewing a booking, seeing a confirmation, returning to book a usual service, and rescheduling an upcoming appointment.

The public landing page should demonstrate that lifecycle through one fixture-backed React component below the core offer. It must not compete with the LTV calculator in the hero, imply that three vertical products already exist, or connect to a booking backend during this slice.

## Current prototype facts

- Six screens are implemented with global inline event handlers and direct DOM mutation.
- Services, prices, providers, openings, ratings, scarcity, reminders, recurrence, and recent bookings are hard-coded.
- The details screen requests a mobile number and optional first name.
- Guest data is written to browser `localStorage` under `sb_guest` and changes the initial screen on later visits.
- There is no API request, booking persistence, real availability, reminder delivery, calendar integration, share action, service worker, manifest, iframe boundary, or post-message contract.
- CSS is mostly scoped with an `sbw-` prefix, but the document still owns global page markup, fonts, scripts, and state.

## Accepted scope

Build one client-side React demo that:

1. Uses fictional salon-style business, service, provider, time, history, and appointment fixtures.
2. Preserves six useful states: services, times, review, confirmation, returning-customer home, and rescheduling.
3. Uses React state and native buttons rather than global functions or direct DOM mutation.
4. Performs no network calls and reads or writes no browser storage.
5. Collects no name, phone number, email address, notes, or other visitor data.
6. Does not claim that an actual booking, reminder, calendar event, recurrence, scarcity state, or provider rating exists.
7. Identifies completion and rescheduling as demo outcomes rather than operational actions.
8. Keeps business identity, fixtures, and theme values in a replaceable configuration boundary.
9. Works with keyboard navigation and communicates selected states accessibly.
10. Appears after the home-page core offer and before the local grounding band.

## Explicit deferrals

- A real booking API, database schema, tenant resolution, authentication, customer identity, reminders, payments, calendar sync, analytics, PWA manifest, offline behavior, and install experience.
- Three industry demos or three simultaneous widget instances.
- Publishing the proposed free-year booking offer.
- Reusing visitor-entered data to simulate a returning customer.
- Presenting the Downloads screenshots as 808 client work or portfolio evidence.

## Architecture direction

The demo configuration will model the future tenant-controlled surface—business name, location, colour tokens, services, provider and fixture appointments—without creating a shared package prematurely. A production widget and a future PWA may later consume the same tenant-scoped booking API, but they remain separate clients. This slice does not settle the backend implementation beyond the existing strategy decision that it will be a shared multi-tenant service.

## Verification

- Repository lint, tests, type-check, and production web build.
- Static-render verification for the home page with the demo isolated as a client component.
- Keyboard traversal through the complete demo lifecycle.
- Desktop and mobile inspection for overflow, sticky controls, legibility, and section rhythm.
- Rendered-content check confirming the old mock's phone input, storage key, scarcity, rating, and reminder claims are absent.

## Exit criteria

- A visitor can complete and reset the full fictional flow without transmitting or persisting data.
- The component is visibly and programmatically identified as a demonstration.
- The LTV calculator remains the only hero interaction.
- No backend or operational booking capability is implied.
- Verification evidence and remaining visual/copy debt are recorded before the implementation commit.

## Implementation handoff

- Added one isolated React client component below the core offer and before the local grounding band.
- Preserved six fixture-backed states: service selection, time selection, review, demo confirmation, returning-customer view, and rescheduling.
- Added a configuration boundary for the illustrative business identity, theme tokens, services, provider, times, prices, and appointment fixtures.
- Removed all contact inputs, browser storage, network access, ratings, scarcity, reminder, calendar, recurrence, and real-booking claims from the prototype path.
- Added native button interactions, accessible selected states, keyboard focus treatments, a polite reschedule status, reset behavior, and explicit demo/no-booking language.
- Verification passed: 14 web/agent tests, web lint, web type-check, production web build, and a live local rendered-content check. `/` remains statically prerendered; the SnapBook interaction is the intentional client island.
- The live rendered page contains the product-preview heading and contains no telephone input, `sb_guest` storage key, or Unsplash dependency. Source inspection found no storage, network, scarcity, rating, reminder-delivery, or calendar-action implementation.
- Desktop/mobile interaction and visual acceptance were completed by the owner on 2026-08-20. The six-state flow, simplicity, usefulness, and forest/amber product-preview colours were approved for release.
