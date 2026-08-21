# Phase 3 discovery: plain-language copy pass

- Date: 2026-08-21
- Baseline commit: `e8599e6`
- Status: discovery complete; implementation plan ready
- Scope: visitor-facing copy on the home page, services index, three service pages, calculator page, shared footer, and supporting SnapBook demo text

## Objective

Rewrite the public site so a service-business owner can understand the offer in one read without needing 808 to explain terms such as scope, workflow, customer journey, infrastructure, configuration, discovery, handoff, or approved business facts.

The rewrite must remain specific, calm, and credible. Plain language is not permission to promise rankings, bookings, revenue, response times, or results that 808 cannot control.

## Agreed constraints

- Keep the current section order.
- Keep the trust bar in its current position below the SnapBook demonstration.
- Keep the calculator as the only hero interaction.
- Keep the K12,000 starting price and the approved first-365-days statement.
- Keep SnapBook included in every website tier.
- Keep the fictional demonstration clearly labelled and non-submitting.
- Do not add Work, Results, Reviews, testimonials, client counters, urgency, or case studies without real evidence.
- Do not add a new page, component architecture, content schema, dependency, or service tier.
- Do not change the LTV agent prompt, request contract, response contract, calculation, or abuse controls in this pass.

## Fresh-discovery evidence

- `main` was clean and synchronized with `origin/main` at `e8599e6` before discovery.
- The deployed home page at `https://www.eightzeroeight.online/` contains the current K12,000 offer, SnapBook inclusion, footer CTA, and current metadata from `main`.
- Production and source therefore expose the same copy baseline to visitors.
- The current home-page hierarchy is calculator, customer path, website offer, SnapBook demonstration, trust bar, process, and footer CTA.
- The strongest plain-language copy is already in the hero, price statement, service-card summaries, and SnapBook demonstration instructions.
- The highest concentration of consulting language is in `apps/web/src/content/marketing.ts`, the shared service-detail template, the calculator explanation, the process descriptions, and the footer support line.
- The page structure does not need to change to solve the language problem.
- Production still emits `noindex, nofollow`; that is an existing search-launch decision and is outside this copy pass.

## Baseline verification

The fresh baseline passed:

- 14 web and abuse-control tests.
- Web lint.
- Web type-check.
- Production web build.
- Static generation of `/`, `/calculator`, `/services`, and all three service detail routes.

## Voice standard

### The salon-owner test

Every public sentence should pass four questions:

1. Can a salon owner understand it on the first read without asking what a term means?
2. Does it name something concrete the owner or customer can see or do?
3. Does it say who acts: 808, the business, or the customer?
4. Does it avoid promising an outcome controlled by customers, Google, or another platform?

### Preferred language

- Use `website`, `page`, `booking`, `service`, `price`, `hours`, `location`, `contact details`, `call`, `message`, and `customer`.
- Use `what we will build` instead of `scope` when speaking to visitors.
- Use `how your business takes bookings` instead of `workflow`.
- Use `booking setup` instead of `configuration`.
- Use `the services, prices, hours and contact details you confirm` instead of `approved business facts`.
- Use `how customers find you and book` instead of `customer journey`.
- Use `public business information` or name Google Maps directly where appropriate instead of `local discovery`.
- Use short sentences with one main idea.
- Prefer a concrete example only when it is illustrative and clearly labelled.

### Terms that may remain

- `Routine maintenance` must remain where it defines the approved commercial offer, but nearby copy should explain what it covers.
- `Payment provider`, `regulated records`, and `integration` may remain in detailed boundaries where precision matters.
- `Booking systems` and `Local search and maps` remain approved service names and route labels.
- `Scope` may remain in proposals and internal records; it should rarely appear in marketing copy.

## Current-language findings

### Home page

| Current phrase | Problem | Direction |
| --- | --- | --- |
| `A valuable client still needs a clear path to your business.` | Understandable but conceptual. | Lead with the practical job: make the business easy to find, understand and book. |
| `pricing approach` | Sounds like sales consulting. | Say `prices or how to ask for a quote`. |
| `one clear path to act` | Vague action. | Name `book, call or send a message`. |
| `Commercial conversations in familiar terms.` | Formal and indirect. | Say `Prices and estimates in Kwacha.` |
| `A practical path from the page to a conversation.` | Abstract. | Say `Message us directly when you are ready.` |
| `decide whether a website project makes financial sense before defining the scope` | Accurate but formal. | Say `check whether the website is worth the investment before we decide what to build`. |
| `approved business facts` | Internal governance language. | Name the services, prices, hours, location and contact details the owner confirms. |
| `recommend the right scope` | Consultant language. | Say `tell you what we think is worth building`. |

The K12,000 starting price and complete 365-day inclusion sentence should remain materially unchanged.

### Services index and shared template

| Current phrase | Problem | Direction |
| --- | --- | --- |
| `Websites built around the customer journey.` | Familiar to marketers, not necessarily owners. | Say what customers do: find the business, understand the services and make contact. |
| `without unnecessary friction` | Generic product language. | Name the avoided work: old posts, repeated questions, missed calls or back-and-forth messages. |
| `booking configuration and project scope` | Technical and contractual. | Say `booking setup and what we will build`. |
| `Customer outcomes` | Consultancy label. | Use `What this helps with`. |
| `Typical scope` | Internal delivery label. | Use `What we can build`. |
| `Scope without surprises` | Clear intention, formal wording. | Use `What is and is not included`. |
| `The right system depends on your workflow.` | Abstract and technical. | Say `What you need depends on how your business takes bookings and speaks to customers.` |
| `Before we define the scope` | Internal process language. | Use `Questions business owners ask`. |

The shared template headings can change without changing the content schema or route structure.

### Booking systems content

High-priority phrases include `workflow justifies them`, `capacity to grow`, `consistent handoff`, `project scope`, `configuration`, and `agreed in scope`.

Plain-language direction:

- Explain that SnapBook lets a customer choose a service and request a time without back-and-forth messages.
- Explain that the exact booking steps depend on how the business confirms appointments.
- Separate the included standard booking setup from custom payment, calendar, or business-system connections.
- Keep the current payment ownership and regulated-record boundaries.
- Do not promise that an appointment request is automatically accepted unless the product supports that mode.

### Local search and maps content

High-priority phrases include `discovery to contact`, `service area`, `structured details`, `business-controlled listing information`, `organic or map position`, `eligibility`, and `agreed scope`.

Plain-language direction:

- Name the information customers look for: services, hours, location, directions, phone number and website.
- Explain that 808 can help the business keep those details clear and consistent on its website and relevant profiles.
- Keep the explicit statement that 808 cannot guarantee Google or map rankings.
- Keep platform verification and eligibility decisions outside 808's control, but explain them in ordinary sentences.

### Landing and service pages content

High-priority phrases include `customer-facing service catalogue`, `source of truth`, `structured service catalogue`, `commercial fact`, `complex quotations`, and `scoped separately`.

Plain-language direction:

- Explain that the page puts services, prices or quote instructions, location and contact options in one place.
- Explain that the owner supplies and confirms the business details before publication.
- Explain that routine first-year maintenance covers reasonable corrections to existing details.
- Explain that new pages, redesigns and large feature changes require a separate quote.

### Calculator page and result UI

High-priority phrases include `customer-booking friction`, `organize the numbers`, `annual visit frequency`, `performed deterministically`, `frame a conversation`, and the result CTA phrase `capturing this`.

Plain-language direction:

- State that the calculator multiplies average spend by visits per year.
- Explain that the result is an estimate of one customer's annual value, not promised revenue.
- Add one quiet mechanic line to the home-page calculator: `Answer three short questions to estimate what one returning client is worth each year.`
- Replace `capturing this` with a direct invitation to discuss making the business easier to find, contact or book.
- Keep the calculator result on the page; do not turn it into WhatsApp lead capture.

### SnapBook supporting copy

The booking controls themselves are already direct. Supporting phrases such as `reusable return experience`, `client branding without redesigning the workflow`, and `client-approved contact details` should become concrete descriptions of booking again, matching the business's colours and details, and asking only for necessary contact information.

The demonstration state machine, fixtures, non-submission boundary, and first-time default must not change.

## Claim-safety rules

The rewrite must not say or imply:

- that 808 guarantees more customers, bookings, revenue, Google visibility, or a payback period;
- that most Lusaka businesses share a quantified problem without evidence;
- that the fictional Studio 808 salon is a real client;
- that a real person replies within a particular time unless that service level is approved and operational;
- that SnapBook automatically confirms appointments when the agreed setup may use requests and follow-up;
- that hosting, maintenance, or SnapBook is free forever;
- that year-two continuation has a published price or happens automatically; or
- that the project starts below the approved K12,000 entry price.

## Implementation plan

### Slice 1: Home-page clarity

Files:

- `apps/web/src/components/landing-page.tsx`
- `apps/web/src/components/marketing-footer.tsx`
- `apps/web/src/content/marketing.ts` for the three process steps and home-card summaries

Work:

- Add the single calculator mechanic line without adding a new CTA or warning block.
- Rewrite the customer-path introduction and three descriptions using find, understand, book, call and message language.
- Simplify the grounding-bar descriptions while keeping the bar in its current position.
- Rewrite the process steps to check the numbers, build the agreed website, and launch ready for customers.
- Replace `recommend the right scope` in the footer.
- Preserve the commercial sentence exactly enough that price, inclusion and duration remain inseparable.

Commit boundary: one focused home-page copy commit.

### Slice 2: Services in owner language

Files:

- `apps/web/src/content/marketing.ts`
- `apps/web/src/app/(marketing)/services/page.tsx`
- `apps/web/src/app/(marketing)/services/[slug]/page.tsx`

Work:

- Rewrite the services-index hero and commercial explanation.
- Replace consulting-style shared labels in the service template.
- Rewrite every service intro, best-for statement, outcome, deliverable, boundary and FAQ answer in concrete language.
- Preserve service slugs, schema fields, route metadata behavior, commercial terms, payment ownership, regulated-data boundary and ranking disclaimer.

Commit boundary: one focused service-copy commit.

### Slice 3: Calculator and SnapBook supporting language

Files:

- `apps/web/src/app/(marketing)/calculator/page.tsx`
- `apps/web/src/components/ltv-chat.tsx`
- `apps/web/src/components/snapbook-demo.tsx`
- `apps/web/src/content/site.ts` only if metadata needs a final wording adjustment

Work:

- Rewrite the calculator explanation and result CTA without changing the API or arithmetic.
- Simplify SnapBook's explanatory bullets and privacy/demo wording without changing interaction behavior.
- Review metadata for the same plain-language standard.

Commit boundary: one focused calculator/demo copy commit.

### Slice 4: Full-site review and handoff

Work:

- Build every static route and extract rendered visible text in page order.
- Check that approved price, first-year inclusion, contact details, ranking disclaimer and demo disclaimer remain present.
- Search rendered output for the identified jargon and review every intentional remainder.
- Search for prohibited claims and invented proof.
- Review home, services, service-detail and calculator pages at mobile and desktop widths for wrapping and scan order.
- Run keyboard smoke checks for the calculator, service links, FAQ controls, SnapBook demo, WhatsApp links and mobile navigation.
- Run tests, lint, type-check and production build.
- Append the verification evidence and any accepted exceptions to this record.

Commit boundary: only a small verification fix if required; otherwise documentation handoff with the preceding slice.

## Expected implementation file scope

- `apps/web/src/components/landing-page.tsx`
- `apps/web/src/components/marketing-footer.tsx`
- `apps/web/src/components/ltv-chat.tsx`
- `apps/web/src/components/snapbook-demo.tsx`
- `apps/web/src/content/marketing.ts`
- `apps/web/src/content/site.ts`
- `apps/web/src/app/(marketing)/calculator/page.tsx`
- `apps/web/src/app/(marketing)/services/page.tsx`
- `apps/web/src/app/(marketing)/services/[slug]/page.tsx`
- This discovery record for the final handoff

Error and not-found pages are already direct and require no planned rewrite. Content schemas and tests should change only if discovery during implementation exposes a real invariant, not merely to accommodate new wording.

## Acceptance criteria

- A service-business owner can identify what 808 builds, what it costs to start, what is included for 365 days, and how to respond without interpreting technical terms.
- The calculator explains its input, arithmetic and output in ordinary language.
- The hero remains visually restrained and has no secondary CTA.
- The trust bar remains in its current position.
- Service pages use concrete examples of business information and customer actions.
- Necessary boundaries remain accurate but are explained without contract-style phrasing.
- The page contains no fabricated proof, outcome guarantee, response-time promise or conflicting price.
- SnapBook remains clearly illustrative and does not collect or submit data.
- Existing URLs, metadata structure, contact destinations and interactive behavior remain stable.
- All automated and manual verification in Slice 4 passes before the phase is signed off.

## Implementation handoff

- Implemented: 2026-08-21
- Homepage copy commit: `d9a0c5b`
- Service-page copy commit: `c180b2c`
- Calculator and SnapBook copy commit: `7e44e63`

### Delivered

- Added one quiet line explaining that the calculator asks three short questions and estimates one returning client's annual value.
- Rewrote the home-page path, service summaries, trust-bar descriptions, process and footer using find, call, message, book, services, prices, hours, location and contact details.
- Kept the trust bar in its existing position and left the hero, section order and commercial sentence structurally unchanged.
- Rewrote all three service records, the services index and the shared service-page labels in concrete owner language.
- Preserved the included SnapBook statement, K12,000 starting price, first-365-days terms, payment ownership, regulated-record boundary and no-ranking-guarantee language.
- Rewrote the calculator explanation so it states the inputs, multiplication and limits directly.
- Replaced the result-card phrase `capturing this` with a direct invitation to discuss making the business easier to find and book.
- Simplified SnapBook's supporting bullets, review message, repeat-booking button and rescheduling labels without changing the demo state machine.
- Did not change the LTV prompt, API contract, arithmetic, routes, content schema, dependencies or public contact destinations.

### Verification

Passed:

- 14 web and abuse-control tests.
- Web lint.
- Web type-check.
- Production web build.
- Static generation of the home page, calculator, services index and all three service routes.
- Rendered HTML checks for section order, service-card order, K12,000 starting price, first-year inclusion, SnapBook demo disclaimer, email and WhatsApp destinations.
- Rendered boundary checks for Google ranking, customer-payment ownership and regulated records.
- Rendered prohibited-claim checks covering invented proof, response-time promises, conflicting pricing, guaranteed bookings and free-forever language.
- Targeted rendered jargon checks for the phrases identified during discovery.
- Local HTTP smoke checks returned `200` for all six public routes.
- The running local page contained the updated home-page path, commercial statement, SnapBook introduction and launch wording.

The terms `routine maintenance`, `payment account`, `regulated records`, `Booking systems`, and `Local search and maps` remain intentionally where commercial or technical precision requires them.

Automated browser viewport capture was unavailable in the current tool runtime. No layout hierarchy or interaction was changed, but mobile and desktop text wrapping should receive a final human smoke check on the Vercel deployment before this copy pass is treated as visually signed off.
