# Phase 3 discovery: public routing, content model, and SEO foundation

- Date: 2026-08-18
- Starting commit: `ddb98fa`
- Starting branch: `main`
- Canonical production origin: `https://www.eightzeroeight.online`
- Future origin: `https://808digital.com` only after purchase, deployment, redirects, and explicit configuration review

## Discovery outcome

Phase 3 should launch a small set of complete, useful routes and keep content-poor route families out of the public index. The current repository supports a strong home page, an operational calculator, three service summaries, a three-step process, and six audience labels. It does not contain the distinct industry copy, verified case-study evidence, articles, company story, or confirmed contact details needed to publish the full aspirational route tree responsibly.

The recommended first release is:

```text
/
/services
/calculator
/about       # after owner copy is approved
/contact     # after contact details are confirmed
```

Service detail routes should follow as soon as each page has enough distinct content to answer a visitor's buying questions. Industry details, case studies, and insights should be content-gated rather than launched as empty indexes or thin pages.

## Current-state evidence

### Repository and application

- The worktree was clean and synchronized with `origin/main` at discovery start.
- `apps/web` uses Next.js 16.3.1 and the App Router.
- The public application currently has one route, `/`, implemented by `app/page.tsx`.
- Static marketing content is embedded directly in `components/landing-page.tsx`; there is no content module, MDX pipeline, CMS client, analytics integration, or shared marketing layout.
- The only intentional client island is the LTV calculator.
- The separate admin application remains a scaffold and is not ready to own public content.

### Live production site

- `https://www.eightzeroeight.online/` renders the expected landing page and operational calculator.
- There is no header, primary navigation, or internal route navigation.
- `/robots.txt` and `/sitemap.xml` both return the default Next.js 404 experience.
- The live page uses the global title `Landing Page for 808 Digital Systems` and remains `noindex, nofollow`.
- The default framework 404 is exposed; there is no branded not-found experience.
- The production calculator endpoint and custom-domain CORS path are working after correcting the Vercel public endpoint value.

### Available content

The following material is usable now, subject to copy review:

- Positioning: practical booking and discovery infrastructure for Lusaka businesses.
- Core promise: make businesses findable, bookable, and clear about services and pricing.
- Service summaries: booking systems, local maps/discovery, and services/pricing presentation.
- Process: assess the numbers, build the system, hand it over operationally.
- Audience labels: clinics, law firms, guesthouses, salons, schools, and franchises.
- Interactive annual client value calculator.

The following material is absent or unverified:

- Distinct industry problems, solutions, FAQs, and proof.
- Named or anonymized projects with permission, measurable outcomes, dates, and attribution.
- Articles or an editorial owner and publishing cadence.
- Founder/team story, legal business identity, operating history, and approved brand narrative.
- The current source still contains the placeholder WhatsApp number `260977000000`; implementation must replace it with the approved public number `+260 969 538 047` (`https://wa.me/260969538047`).
- Confirmation that Cloudflare routing for `lusa@eightzeroeight.online` is active and monitored. The private forwarding destination must not be published or committed.
- Business hours, expected response time, physical address, or service-area boundaries beyond Lusaka.
- Approved logo/social-share artwork and owned replacement photography for the Unsplash placeholders.
- Analytics provider, consent policy, and conversion-event ownership.

## Proposed information architecture

### Primary navigation

```text
Logo -> /
Services -> /services
Calculator -> /calculator
About -> /about
Contact -> /contact
Primary CTA -> /contact (label: Book a call)
```

Do not add Industries, Case studies, or Insights to the primary navigation until their index routes contain publishable entries. Footer navigation can grow with those route families when they launch.

### Route launch matrix

| Route | Recommendation | Readiness | Required before publication |
| --- | --- | --- | --- |
| `/` | Keep and refactor into the shared marketing shell | Ready | Replace placeholder contact links; approve final title and description |
| `/services` | Launch in the first route release | Mostly ready | Expand the three current summaries into outcomes, deliverables, process, and FAQs |
| `/services/booking-systems` | Prepare next | Partial | Define supported booking flow, integrations, handover, exclusions, and CTA |
| `/services/local-search-and-maps` | Prepare next | Partial | Confirm the exact Google/Maps work offered and avoid unsupported ranking promises |
| `/services/service-and-pricing-pages` | Prepare next | Partial | Define deliverables, update ownership, and relationship to a broader website build |
| `/calculator` | Launch in the first route release | Ready | Give the existing calculator standalone explanatory copy and retain the home-page version |
| `/about` | Launch after owner input | Blocked on copy | Company story, owner/team representation, operating model, values, and approved claims |
| `/contact` | Launch after remaining owner input | Partial | Working `lusa@eightzeroeight.online` routing, response expectations, and form delivery/abuse controls; WhatsApp is approved |
| `/industries` | Hold until at least three entries are complete | Thin | Prioritize industries and provide distinct, useful copy for each |
| `/industries/[slug]` | Content-gated | Not ready | Industry-specific problems, recommended systems, FAQs, boundaries, and proof where available |
| `/case-studies` | Do not publish empty | Not ready | At least one approved case study with evidence and disclosure/consent decisions |
| `/case-studies/[slug]` | Content-gated | Not ready | Verifiable challenge, intervention, outcome, dates, and attribution status |
| `/insights` | Do not publish empty | Not ready | Editorial owner, at least two useful articles, taxonomy, dates, and review process |
| `/insights/[slug]` | Content-gated | Not ready | Authored article content, publication metadata, and update policy |

Unknown dynamic slugs should call `notFound()`. Locally controlled collections should use `generateStaticParams()` and reject unrecognized slugs rather than creating arbitrary runtime pages.

### Recommended first industry archetypes

808 should remain positioned for service businesses rather than presenting itself as a vertical-only agency. The first industry pages should represent three common service-business operating models:

1. **Clinics** (`/industries/clinics`) — appointment-led, locally discovered, repeat-client businesses where one retained client can have meaningful annual value. Copy must avoid medical or compliance claims, and 808 must not imply that a public booking layer is a clinical records system.
2. **Salons and barbershops** (`/industries/salons-and-barbershops`) — frequent repeat visits, mobile-first customers, clear services/pricing, and direct booking make this the simplest demonstration of the current offer.
3. **Professional services** (`/industries/professional-services`) — law firms, accountants, consultants, and similar appointment/lead-driven firms benefit from local trust, clear service presentation, and structured enquiries. Copy should not force public pricing where the work requires consultation.

These are go-to-market entry points, not product boundaries. Guesthouses should follow after accommodation inventory, OTA, payment, and availability-integration scope is clear. Schools have a different admissions/enquiry workflow, and franchises introduce multi-location governance that should not be implied by the initial offer.

## Content architecture proposal

Keep Phase 3 content local to `apps/web`; the admin application is not yet a trusted CMS. Use structured TypeScript records for services, industries, and case-study metadata. Introduce MDX only when long-form insights actually exist.

```text
apps/web/src/
|-- content/
|   |-- site.ts
|   |-- services.ts
|   |-- industries.ts
|   |-- case-studies.ts
|   `-- insights/             # add with the first approved article
|-- content-schema/
|   |-- common.ts
|   |-- service.ts
|   |-- industry.ts
|   |-- case-study.ts
|   `-- article.ts
`-- app/
    |-- (marketing)/
    |   |-- layout.tsx
    |   |-- page.tsx
    |   |-- services/
    |   |-- calculator/
    |   |-- about/
    |   `-- contact/
    |-- robots.ts
    |-- sitemap.ts
    |-- not-found.tsx
    `-- error.tsx
```

Each publishable content record should include:

- Stable `slug`, title, summary, publication status, and last meaningful update date.
- Explicit SEO title and description rather than mechanically copying the page heading.
- Optional social image reference and canonical override only when justified.
- Route-specific fields validated at build time with a small runtime schema library.
- A publication state that prevents drafts from entering route params, navigation, or the sitemap.

Recommended route-specific fields:

- Service: visitor problem, outcomes, deliverables, process, exclusions, FAQs, and CTA.
- Industry: common operational problems, applicable services, example workflow, FAQs, and evidence references.
- Case study: client disclosure level, challenge, intervention, evidence-backed outcomes, dates, permission status, and CTA.
- Article: excerpt, author, published/updated dates, tags, body, and review status.

This content boundary can later be backed by Supabase/admin workflows without coupling Phase 3 to unauthenticated admin code.

## SEO and discovery foundation

### Canonical identity

- Centralize the current site origin as `https://www.eightzeroeight.online` in server-only site configuration and set `metadataBase` from it.
- Canonical URLs, sitemap entries, JSON-LD identifiers, and social metadata must all use that origin.
- Treat `808digital.com` as a future migration, not an alternate canonical. Its cutover will require redirect mapping, canonical replacement, sitemap replacement, analytics/Search Console changes, and Supabase origin review.

### Metadata

- Replace the generic `Landing Page for...` title with an approved brand/search title.
- Give every published route a unique title, description, canonical URL, Open Graph type, and social image.
- Use static `metadata` for fixed pages and `generateMetadata()` for slug-backed content.
- Keep metadata generation in Server Components and ensure content-backed pages remain prerenderable.

### Indexing policy

- Production stays `noindex` until the first route release passes content and technical review.
- Preview deployments stay `noindex, nofollow` regardless of content readiness.
- Generate `robots.ts` and `sitemap.ts`; include only canonical, published routes in the sitemap.
- Add host-aware protection or equivalent deployment controls so the public Vercel alias does not compete with the canonical custom domain.
- Revisit Cloudflare bot policy at launch: legitimate search crawlers must be allowed if organic discovery is a business goal. AI training/agent crawler policy is a separate choice.

### Structured data

Start conservatively:

- Site-wide `Organization` or `LocalBusiness` only after legal name, contact details, URL, logo, and address/service-area facts are approved.
- `Service` on complete service detail pages.
- `Article` on published insights.
- `BreadcrumbList` on nested published routes.
- Do not add review ratings, prices, outcomes, or location facts that are not supported by page-visible evidence.

Render JSON-LD as a native script tag, sanitize serialized content, and validate output with Schema.org and Google tools before indexation.

### Error and loading behavior

- Add a branded root `not-found.tsx` with useful navigation back to real routes.
- Add a restrained route error boundary for unexpected failures.
- Do not add decorative loading screens to fully static routes. Introduce segment loading UI only when a route gains meaningful asynchronous work.

## Analytics boundary

Analytics implementation remains Phase 4 production hardening. Phase 3 should make routes and CTAs observable without selecting a provider prematurely. Proposed future conversion names are:

```text
calculator_started
calculator_completed
contact_cta_clicked
whatsapp_cta_clicked
email_cta_clicked
```

Do not send calculator message text, business descriptions, contact content, or other volunteered personal data to analytics. Provider selection, consent behavior, retention, and ownership require a separate Phase 4 decision.

## Implementation slices after approval

1. Establish centralized site configuration, content schemas, shared marketing layout, header, footer, and branded not-found/error states.
2. Refactor `/` to consume shared site/service content without changing its approved visual character.
3. Implement `/services` and `/calculator`; add detail routes only for approved complete service records.
4. Implement `/about` and `/contact` after owner facts and contact destinations are confirmed.
5. Add metadata, canonical URLs, social assets, JSON-LD, `robots.ts`, and `sitemap.ts` with environment-aware index controls.
6. Verify builds, static rendering, metadata, structured data, internal links, mobile navigation, accessibility, and custom-domain behavior.
7. Enable production indexing only through an explicit owner sign-off checkpoint.

Each slice is a key change and should be committed separately after its checks pass.

## Slice 1 implementation handoff

- Completed on 2026-08-18 in commits `1d8bc24`, `da1073a`, and `b4f86ca`.
- Added runtime-validated public site configuration, service summaries, audience labels, and process content without adding a new runtime dependency.
- Centralized the canonical production origin, public email alias, WhatsApp display number, WhatsApp URL, location, description, and active navigation data.
- Added a shared marketing route-group layout with responsive header, mobile menu, and shared footer.
- Kept navigation on existing home-page anchors until the approved routes exist, preventing automatic `main` deployments from exposing broken links.
- Replaced the placeholder email and WhatsApp destinations throughout the shared footer and calculator result flow.
- Removed fixed public payback language and replaced the ambiguous ownership statement with individualized commercial and terms-aware language. Confidential internal source material was not copied into the repository.
- Added branded root not-found and route error experiences with usable recovery actions.
- Preserved production `noindex, nofollow`; sitemap, robots, canonical-route metadata, and index enablement remain later Phase 3 work.
- Verification passed: 13 web/agent tests, web type-check, web lint, production web build, desktop/mobile browser inspection, mobile-menu interaction, contact-link inspection, and branded 404 inspection. `/` and `/_not-found` remain statically prerendered.

The next implementation slice is the approved services route family and standalone calculator route. Primary navigation should switch from temporary section anchors only when the corresponding route is present and verified.

## Decision log and remaining approvals

Approved on 2026-08-18:

- Launch `/`, `/services`, `/calculator`, `/about`, and `/contact`; hold incomplete route families back.
- Use the service names and slugs `booking-systems`, `local-search-and-maps`, and `service-and-pricing-pages`.
- Publish `lusa@eightzeroeight.online` as the email alias after Cloudflare routing is verified. Keep its private forwarding destination out of the site and repository.
- Use `+260 969 538 047` as the public WhatsApp contact and normalize links to `https://wa.me/260969538047`.
- Make a contact form available as an optional secondary channel rather than the only way to contact 808. Direct email and WhatsApp actions remain visible.
- Keep the broad market position focused on service businesses; industry pages are examples and search entry points, not exclusions.
- Prioritize `/industries/clinics`, `/industries/salons-and-barbershops`, and `/industries/professional-services` as the first three industry pages.

Still required before implementation sign-off:

1. **Contact operations:** confirm the Cloudflare email route is live and approve a response expectation.
2. **Contact form:** choose its delivery path. It should collect only the minimum reply details and short enquiry, remain optional, and ship with server-side validation, rate limiting, anti-automation controls, and a clear privacy notice.
3. **Company facts:** provide the approved short company story, who should be represented on the About page, service area, and any legal/business identity that may be published.
4. **Indexing:** approve keeping production `noindex` until the route/content/SEO release gate passes, followed by a deliberate Cloudflare and application indexing change.

## Phase 3 discovery sign-off condition

Discovery is complete when the owner confirms email routing and response expectations, supplies the remaining company facts, chooses the form delivery path, and approves the indexing checkpoint. Implementation can then proceed without inventing business facts or publishing thin pages.
