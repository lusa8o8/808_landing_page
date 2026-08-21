# Phase 3 discovery: commercial copy update

- Date: 2026-08-21
- Baseline commit: `e39f015`
- Status: discovery complete; copy implementation ready for owner review
- Scope: public home page, shared service content, service index/detail pages, shared metadata, and footer CTA

## Purpose

Prepare the public copy to express the commercial offer recorded in `docs/architecture/commercial-offer-v1.md` without redesigning the page, cluttering the calculator hero, publishing incomplete tier comparisons, or inventing proof.

This is a copy and content-hierarchy change. It is not permission to add pricing cards, urgency claims, testimonials, client counts, guarantees, new routes, or a standalone SnapBook subscription.

## Fresh-discovery evidence

- The repository was clean on `main` and synchronized with `origin/main` at `e39f015`.
- The deployed home page at `https://www.eightzeroeight.online/` matches the current source hierarchy and copy.
- The page renders, in order: calculator hero, customer path, core services, SnapBook demonstration, Lusaka/Kwacha/WhatsApp grounding, process, and footer CTA.
- The hero contains only the calculator proposition and interaction. There is no pricing, free-year language, warning block, or secondary product demo in the hero.
- Landing and service pages are visually marked as the core offer, but booking systems and local search are still described as adjacent optional services.
- SnapBook is demonstrated but is not identified as an inclusion in every website tier.
- No public page states the approved starting price or the first-year hosting and maintenance inclusion.
- The shared process copy still refers generically to an ongoing platform service, support, or handover.
- The landing/service-page FAQ says the future update and support path is agreed with the client, but it does not reflect the approved first-year maintenance boundary.
- Site metadata still leads with "booking and discovery systems" rather than the website offer.
- Production currently emits `noindex, nofollow`. That is an existing Phase 3 SEO/launch issue and is outside this copy slice.

## Baseline verification

The first restricted run could not spawn Node workers and returned `EPERM`; this was an execution-sandbox limitation, not a repository failure. Re-running with normal process permissions passed:

- 14 web and abuse-control tests.
- Web lint.
- Web type-check.
- Production web build.
- Static generation of `/`, `/calculator`, `/services`, and all three service detail routes.

## Approved source material

The implementation must follow these records:

- `docs/architecture/commercial-offer-v1.md` for prices, inclusions, renewal restraint, and public wording.
- `docs/architecture/brand-foundation.md` for the studied, grounded, quietly premium, and practical voice.
- `docs/discovery/phase-3-routing-content-seo.md` for verified contact details, route names, claims discipline, and direct-outreach context.
- `docs/discovery/phase-3-snapbook-demo.md` for the safe illustrative-demo boundary.

Confidential internal strategy files are context only. Their private reasoning must not appear in public copy or public source comments.

## Message hierarchy

The page should communicate the offer in this order:

1. One returning client has measurable annual value.
2. A client can only create that value if they can find, understand, and act on the business offer.
3. 808 builds the website that gives that journey one clear home.
4. SnapBook and relevant local-discovery work support the website rather than competing with it as unrelated products.
5. Website projects start at K12,000.
6. Every website includes SnapBook, hosting, and routine maintenance for the first 365 days at no additional cost.
7. The visitor can try the safe SnapBook demonstration and then begin a direct WhatsApp conversation.

## Copy rules

- Preserve the current hero headline, short instruction, and calculator-only composition in this slice.
- Do not put commercial terms, caveats, warnings, price cards, or the SnapBook demo inside the hero.
- Lead with websites in headings and metadata. Booking and local discovery support that paid core.
- Use "starts at K12,000" rather than publishing all tier ranges before their deliverables are settled.
- Use the approved first-year sentence substantially as written; do not shorten it to "free booking" where the duration or scope disappears.
- Do not describe routine maintenance as unlimited support.
- Do not publish a SnapBook standalone price or a year-two price.
- Do not imply automatic renewal.
- Do not disclose behavioural-data, experimentation, or internal-learning rationale.
- Do not claim rankings, recovered revenue, client outcomes, client counts, scarcity, or market leadership without evidence.
- Keep the safe-demo statement that nothing is submitted, stored, or booked.
- Prefer plain terms such as website, booking, business information, customer, and conversation over abstract phrases such as digital infrastructure or system where a concrete term works.

## Implementation-ready copy direction

The wording below is a working draft for the implementation pass. It should be evaluated in the rendered page and may be tightened for rhythm without changing the approved claims.

### Calculator hero

Keep:

- Eyebrow: `808 Digital Systems · Lusaka`
- Heading: `What is one client really worth to you?`
- Supporting copy: `Describe your business in plain language. We’ll do the math.`

The result-card CTA and WhatsApp handoff may be lightly edited for tone, but the calculation, data contract, and agent prompt are out of scope.

### Customer path

- Label: `From value to action`
- Heading: `A valuable client still needs a clear path to your business.`
- Supporting copy: `Your website should help the right customer find you, understand your offer, and take the next step.`
- Step 1: `Be found` — `Give nearby customers accurate information when they search for what you do.`
- Step 2: `Be understood` — `Make your services, pricing approach, location, and next step easy to understand.`
- Step 3: `Be contacted or booked` — `Give an interested customer one clear path to act without chasing scattered details.`

The three step descriptions are already accurate; only the bridge into them needs to become more direct.

### Core offer

- Label: `The 808 website`
- Heading: `One clear place for customers to understand your business and act.`
- Commercial bridge: `Website projects start at K12,000. Every 808 website includes SnapBook, hosting and routine maintenance for the first 365 days at no additional cost.`

Service-card direction:

- `Landing and service pages` remains the core card and paid foundation.
- `Booking systems` must explain that SnapBook is included with every website; it must not read like an independently priced add-on.
- `Local search and maps` remains supporting work and retains the existing no-ranking-guarantee boundary on its detail page.

### SnapBook demonstration

- Label: `SnapBook, included`
- Heading: `Let customers move from interest to appointment.`
- Supporting copy: `Try the booking path using a fictional Lusaka salon, then preview repeat booking and rescheduling. This demo does not submit, store or book anything.`

Retain the current first-time default state and reset control. Do not add lead capture to the demonstration.

### Grounding bar

Retain the three evidence-based points:

- Based in Lusaka.
- Numbers in Kwacha.
- Direct on WhatsApp.

This is grounding, not social proof. It must not be rewritten to imply an existing client base.

### Process

- Step 1: `We start with the numbers` — establish commercial fit before scope.
- Step 2: `We define and build the right website` — use approved business facts and the real customer journey.
- Step 3: `You launch with a supported first year` — state that domain and content remain the client's, and that SnapBook, hosting, and routine maintenance are included for 365 days.

The final wording must avoid implying that new features, redesigns, or unlimited content work are routine maintenance.

### Footer CTA

- Heading direction: `Tell us what your business needs to make clearer.`
- Supporting line: `We’ll start with the numbers, then recommend the right scope.`
- Button: `Start a WhatsApp conversation`

No fake deadline or capacity claim should be added.

### Shared service content and metadata

- Update the site title and description so websites lead the proposition and SnapBook remains an included capability.
- Update the services index introduction to describe one customer journey rather than three unrelated service products.
- Add the approved starting price and first-year inclusion once on the services index; avoid repeating a sales banner on every detail page.
- Update booking copy to distinguish included SnapBook configuration from separately scoped deeper integrations or workflow changes.
- Update the landing/service-page maintenance FAQ to match the documented routine-maintenance boundary.
- Preserve the existing regulated-data, payment-provider, listing-approval, and search-ranking boundaries.

## Expected file scope

- `apps/web/src/components/landing-page.tsx`
- `apps/web/src/components/snapbook-demo.tsx`
- `apps/web/src/components/marketing-footer.tsx`
- `apps/web/src/content/marketing.ts`
- `apps/web/src/content/site.ts`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/(marketing)/services/page.tsx`
- Tests only if a content shape or content invariant changes.

The page structure and styling should remain stable unless rendered copy creates a small spacing or wrapping problem. No new package or shared abstraction is justified.

## Risks and review points

- `K12,000` is a starting price, not a promise that every project fits Starter scope.
- "Included" must stay tied to every website and the first 365 days; separating those phrases can create a misleading promise.
- The public claim is clear enough for marketing, but every proposal still needs to state the exact event that begins its 365-day period.
- The phrase "routine maintenance" needs a nearby plain-language boundary on detailed service content even if the homepage stays concise.
- Repeating the full commercial sentence too often will make the page feel defensive. Use one complete statement in the core-offer section and one shorter contextual reference in the SnapBook/process copy.
- The production `noindex` policy must be resolved separately before an intentional search launch.

## Acceptance checks for the implementation pass

- The calculator remains the only hero interaction and the hero height/composition does not materially change.
- A text search of rendered HTML finds `K12,000`, `SnapBook`, and `365 days` on the home page.
- The home page never says or implies `free forever`, `unlimited maintenance`, a year-two price, or automatic renewal.
- SnapBook is presented as included in all website projects, not as a separately priced fourth offer.
- The safe demo still starts at service selection and states that it does not submit, store, or book anything.
- Service metadata and visible headings lead with websites without breaking existing URLs.
- Existing contact destinations remain `lusa@eightzeroeight.online` and `https://wa.me/260969538047`.
- Tests, lint, type-check, production build, mobile/desktop scroll review, and link checks pass.

## Recommended implementation sequence

1. Update shared content and metadata.
2. Update the homepage bridges, core-offer copy, process, and footer CTA.
3. Update the SnapBook demonstration introduction without changing its state machine.
4. Render desktop and mobile pages and tighten only copy-related wrapping or spacing.
5. Run automated checks and inspect the generated HTML for approved and prohibited claims.
6. Commit the copy implementation separately from this discovery record.

## Implementation handoff

- Implemented: 2026-08-21
- The calculator hero and LTV interaction were left unchanged.
- The homepage now connects annual client value to the customer journey and presents the website as the paid core offer.
- The homepage and services index now state that website projects start at K12,000 and include SnapBook, hosting, and routine maintenance for the first 365 days at no additional cost.
- SnapBook is described as an inclusion in every website rather than a separately priced product.
- The SnapBook demonstration still starts with first-time service selection and retains its non-submission statement and existing interaction logic.
- The services index now orders landing and service pages before booking and local-search support.
- Booking boundaries now distinguish included standard SnapBook configuration from separately scoped custom workflows and integrations.
- The landing/service-page FAQ now distinguishes routine first-year corrections from new pages, redesigns, integrations, and substantial feature or content work.
- Shared metadata, process copy, and the footer CTA now lead with websites and the approved customer journey.

Verification passed:

- 14 web and abuse-control tests.
- Web lint.
- Web type-check.
- Production web build and static generation of all public routes.
- Generated home and services HTML review for message order, approved claims, contact destinations, service-card order, and prohibited commercial language.

No new dependency, route, pricing tier card, social-proof claim, urgency claim, or agent-contract change was introduced. A manual mobile and desktop viewport check remains part of the deployment smoke test because the change increases text length in the core-offer and process sections.
