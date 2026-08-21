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

## Slice 2 implementation handoff

- Completed on 2026-08-18 in commits `bf50a51`, `166ec44`, and `def4fa0`.
- Expanded the validated service content model with public-facing introductions, best-fit guidance, customer outcomes, typical deliverables, explicit boundaries, FAQs, and publication status. Nested content and slug uniqueness are checked at startup and covered by 14 tests.
- Added the statically rendered `/services` index and the three approved detail routes: `/services/booking-systems`, `/services/local-search-and-maps`, and `/services/service-and-pricing-pages`.
- Restricted dynamic service params to published records and added route-specific titles and descriptions through `generateMetadata()`. Full canonical, social, structured-data, sitemap, and robots work remains in the later SEO slice.
- Added the standalone `/calculator` route with the existing guarded LTV agent, deterministic calculation display, transparent formula explanation, and a planning-estimate disclaimer.
- Switched primary navigation to the verified `/services` and `/calculator` routes. Contact intentionally remains `/#contact` until the dedicated contact route and its operating decisions are complete.
- Preserved production `noindex, nofollow`; this slice does not authorize search indexing.
- Verification passed: 14 web/agent tests, web type-check, web lint, production web build, desktop service-index inspection, all three service detail pages, route metadata, mobile navigation, invalid-slug handling, and a live standalone-calculator conversation. The live salon case correctly returned K3,000 from K250 multiplied by 12 annual visits, with no application warnings.

## 2026-08-20 discovery amendment: home-page narrative before product demo

Fresh inspection found that the migrated home page still follows the parity-era sequence: calculator hero, positioning statement, isolated problem statement, three equally weighted service cards, a duplicate “Your numbers” section, broad audience pills, and the engagement process. The sections are individually understandable but do not form a strong progression after the calculator result.

The next Phase 3 slice is therefore the home-page narrative and conversion pass, not the industry route family. It will:

- Keep the calculator as the uncluttered hero interaction and remove the stock-photo mosaic so the working mechanism becomes the visual focus.
- Connect the calculated client value to a simple customer path: found, understood, contacted or booked.
- Present landing and service pages as the core offer, with booking and local discovery as supporting systems selected according to the business.
- Remove the duplicate numbers section, unsupported social-proof substitutes, and broad industry pills.
- Retain the existing numbers-first engagement process and direct WhatsApp/email contact path.
- Avoid adding calculator warnings or the free-year booking promise in this slice.

After this page passes build, accessibility, desktop, and mobile checks, the following slice may adapt the reviewed SnapBook HTML mock into one safe, fixture-backed interactive demo below the offer. It must not collect or persist real contact details, simulate a real booking, or compete with the calculator in the hero.

Industry pages remain deferred until real customer research or approved evidence supports useful, differentiated content. `/about` and `/contact` remain gated by the owner facts, response expectation, and contact-form delivery decisions recorded below.

### Home-page narrative implementation handoff

- Replaced the stock-photo mosaic with a restrained brand-colour grid so the calculator is the hero's visual focus.
- Replaced the disconnected positioning/problem sequence with a three-part customer path: found, understood, contacted or booked.
- Reframed landing and service pages as the core offer and retained booking and local-search work as supporting systems.
- Removed the duplicate numbers block and broad industry pills. Added only verifiable grounding statements: Lusaka, Kwacha, and direct WhatsApp contact.
- Preserved the calculator copy without adding warnings or publishing the proposed free-year offer.
- Corrected the calculator input's Enter-key path to use native form submission without an `any` cast.
- Verification passed: 14 web/agent tests, repository-wide lint, web/admin type-check, production web build, and a live local HTTP/rendered-content smoke check. `/` remains statically prerendered.
- Manual desktop/mobile inspection was completed and accepted by the owner on 2026-08-20. The restrained design and current copy are approved as a temporary baseline; both may be refined later using observed visitor behaviour rather than delaying the next product-demo slice.

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

## 2026-08-21 discovery amendment: SEO foundation and indexing release gate

This amendment replaces the stale SEO assumptions above with a fresh repository and production inspection at commit `44f63a3`. It prepares the next implementation slice but does not authorize search indexing.

### Current launch surface

The public application now has a complete, statically generated six-route launch set:

```text
/
/calculator
/services
/services/service-and-pricing-pages
/services/booking-systems
/services/local-search-and-maps
```

The branded not-found and error experiences are operational but are not indexable routes. `/about`, `/contact`, industry routes, case studies, and a blog remain intentionally deferred. Publishing them without distinct facts, evidence, or an operating need would create avoidable work and thin content.

The earlier route matrix and sign-off condition are therefore historical context rather than current blockers. Direct WhatsApp and email contact are already available, and Phase 3 does not depend on a contact form or About page.

### Source and live-domain findings

- `apps/web` is on Next.js 16.3.1 and uses the App Router Metadata API.
- The root layout still hard-codes `noindex, nofollow` for every environment. This remains the primary protection against accidental indexing.
- The home page has a title and description but no explicit canonical URL. The calculator, services index, and service detail routes already declare canonical paths.
- There is no `app/robots.ts`, `app/sitemap.ts`, Open Graph or Twitter share image, complete social metadata, or JSON-LD.
- The site configuration correctly identifies `https://www.eightzeroeight.online` as the canonical production origin.
- On 2026-08-21, `https://www.eightzeroeight.online/` returned `200` with `noindex, nofollow`; `/robots.txt` and `/sitemap.xml` returned `404`.
- `https://eightzeroeight.online/` correctly returned a permanent redirect to the `www` origin.
- `https://808-landing-page-web.vercel.app/` still returned the production page directly. Canonical metadata will reduce ambiguity, but a host-level permanent redirect to the custom domain is the stronger canonical signal and should be configured in Vercel if the platform permits it.
- No `X-Robots-Tag` was observed on the public HTML response. The current HTML meta directive is sufficient for the page, but downloadable non-HTML assets are outside this launch slice.

### Evidence-based constraints

- Google does not support `noindex` in `robots.txt`. A crawler must be allowed to fetch a page to observe its HTML `noindex` directive. The application metadata remains the indexing control; `robots.txt` is a crawl-preference and discovery file, not a confidentiality boundary.
- Canonical redirects, HTML canonical annotations, and sitemap inclusion are complementary signals. Only canonical `www` URLs should appear in the sitemap.
- A sitemap is a discovery hint, not an indexing guarantee. It should list only the six approved public routes.
- Structured data must describe visible, verified page content. This site does not yet have an approved public street address, logo asset, opening hours, reviews, or client evidence, so none may be invented for markup.
- Cloudflare's managed `robots.txt` can prepend AI-crawler directives to the application's file. Its dashboard policy and the final served file must be reviewed together. `robots.txt` compliance is voluntary; Cloudflare AI Crawl Control or another enforcement rule is required when blocking must be enforced.

Primary references:

- [Next.js metadata and Open Graph images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google: block indexing with `noindex`](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: canonical URL signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Cloudflare managed `robots.txt`](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
- [Cloudflare AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/)

### Proposed implementation design

1. Add one server/build-time policy flag, `SITE_INDEXING_ENABLED`, with a fail-closed default. Only the Vercel Production environment may eventually set it to `true`; Preview and Development must leave it unset or `false`.
2. Centralize the policy so root metadata and `robots.ts` cannot drift. A false policy emits `noindex, nofollow`, permits crawlers to read that directive, and omits the sitemap; a true policy emits index/follow metadata and advertises the approved public surface.
3. Add an explicit home canonical and complete inherited Open Graph and Twitter metadata using the canonical origin, public brand name, current description, and `en_ZM` locale.
4. Add a brand-native 1200x630 generated Open Graph image using the approved colour and typography direction. It must not introduce an unapproved logo, testimonial, client claim, or offer.
5. Add `sitemap.ts` with only the six approved canonical URLs. Avoid synthetic `lastModified` values and speculative priorities; add dates later only when backed by content records.
6. Add a minimal home-page `Organization` JSON-LD object using only public facts already visible on the site: name, canonical URL, email, telephone, and Lusaka service area. Do not use `LocalBusiness`, a street address, opening hours, reviews, ratings, or a logo until those facts and assets are approved. Sanitize serialized JSON-LD as required by the Next.js guidance.
7. Cover both policy states and the exact sitemap allowlist with deterministic tests. The build must continue to statically generate the public pages and metadata routes.
8. Keep `SITE_INDEXING_ENABLED=false` through code review, local verification, deployment, custom-domain verification, share-card inspection, structured-data validation, and the Cloudflare crawler-policy review.

### Release gate for enabling indexing

Indexing can be enabled only after all of the following pass on the deployed custom domain:

- The six public pages return `200`, contain self-referencing canonical URLs on the `www` origin, and have unique titles and descriptions.
- `/robots.txt` and `/sitemap.xml` return valid content and reference only the canonical origin.
- Preview deployments remain `noindex, nofollow` and do not advertise a public sitemap.
- The apex redirects to `www`; the Vercel production alias is configured to redirect to the canonical domain or is otherwise verified not to compete as an indexable host.
- Open Graph/Twitter output renders correctly when shared and contains no unsupported claims.
- JSON-LD passes syntax and rich-result validation and matches visible public facts.
- Cloudflare's final served `robots.txt` and crawler controls preserve ordinary search discovery while applying the owner's separate choices for AI search, agent access, and model training.
- The owner explicitly approves changing only the Vercel Production `SITE_INDEXING_ENABLED` value to `true`.

After enablement, verify the live meta directives, robots file, sitemap, canonical redirects, and all six routes again. Google Search Console property verification and sitemap submission are the operational handoff; they are not prerequisites for building the foundation.

### Next implementation slice

Implement the environment-safe metadata foundation, generated share image, robots route, sitemap route, minimal verified Organization JSON-LD, and regression tests as one cohesive SEO-foundation change. Deploy it in the fail-closed state. Enabling indexing remains a separate configuration change and explicit sign-off checkpoint.

### SEO-foundation implementation handoff

- Completed on 2026-08-21 without enabling production indexing.
- Added a centralized, fail-closed `SITE_INDEXING_ENABLED` policy. Only the exact value `true` enables indexing; missing, malformed, local, and preview values remain disabled.
- Added self-referencing canonical metadata and route-specific Open Graph and Twitter metadata across all six public routes.
- Added brand-native 1200x630 Open Graph and Twitter images using only the approved palette, public positioning, and Lusaka location.
- Added a generated `robots.txt`. In the disabled state it permits crawlers to read the page-level `noindex` directive but does not advertise a sitemap. In the enabled state it adds the canonical host and sitemap location.
- Added a generated sitemap that is empty while indexing is disabled and contains exactly the six approved canonical URLs when enabled.
- Added minimal `Organization` JSON-LD to the home page only, using the public name, canonical URL, email, telephone, and Lusaka service area. It does not claim an address, opening hours, reviews, ratings, logo, or client evidence.
- Documented the Vercel environment variable in `apps/web/.env.example`; no production or preview environment value was changed.
- Added regression coverage for the fail-closed parser, both robots states, the exact sitemap allowlist, approved Organization facts, and safe JSON-LD serialization.
- Verification passed: 19 tests, repository-wide lint and type-check, repository-wide production build, a separate indexing-enabled integration build, a restored fail-closed production build, generated metadata inspection for all six routes, and visual inspection of the generated share image.

The remaining Phase 3 work is deployment and custom-domain verification in the disabled state, followed by the separate indexing release gate. Production must not receive `SITE_INDEXING_ENABLED=true` until that verification is complete and the owner explicitly approves the switch.

The fail-closed deployment was spot-checked on the custom domain on 2026-08-21. The home page returned `200` with `noindex, nofollow`, its canonical URL, social image metadata, and the approved Organization JSON-LD. `/robots.txt` allowed crawling without advertising a sitemap, `/sitemap.xml` returned a valid empty URL set, and the generated Open Graph image returned `200` as a PNG. Intermittent outbound connection timeouts prevented one clean live sweep of all six routes, so the complete custom-domain route sweep, Vercel alias handling, Cloudflare policy review, and enabled-state verification remain part of the indexing release gate.
