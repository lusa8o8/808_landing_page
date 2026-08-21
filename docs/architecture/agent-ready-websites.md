# Agent-ready website standard

- Status: internal architecture direction
- Recorded: 2026-08-21
- Scope: websites designed and delivered by 808 Digital Systems
- Public positioning: deferred; not approved as a website claim
- Editorial status: possible future article topic; no blog or article is currently planned

## Position

808 websites should work for customers today while being structured so search engines and future AI agents can understand the business accurately.

This is an engineering standard, not the primary sales pitch. Most prospective clients first need a reliable website, clear business information and a practical way for customers to call, message or book. Public copy should continue to lead with those immediate needs.

Do not add `agent-ready`, `AI-ready`, `built for the agent economy` or similar language to the public site until 808 has:

- a versioned technical definition;
- repeatable validation evidence from delivered websites;
- a clear explanation of the customer benefit; and
- real implementation experience worth discussing publicly.

## What agent-ready means

An agent-ready website makes verified public business information easy for both people and software to find, interpret and act on safely.

It has three layers:

1. **Discoverable** — important public pages can be crawled at stable URLs under an intentional indexing policy.
2. **Understandable** — services, prices or quote instructions, hours, locations and contact options are expressed clearly in rendered HTML and supported by accurate metadata.
3. **Safely actionable** — calls, messages and booking paths are explicit, but no automated agent receives privileged access or bypasses confirmation, consent, validation or abuse controls.

## Required website characteristics

### Rendered content

- Critical business information is present in server-rendered or statically rendered HTML.
- A visitor or crawler does not need client-side JavaScript to learn what the business offers, where it operates or how to make contact.
- Headings, landmarks, links, buttons, lists and form labels use semantic HTML.
- Mobile and keyboard access remain first-class requirements; machine readability must not reduce human accessibility.

### Stable information

- Public pages use stable, descriptive URLs and correct canonical links.
- Page titles and descriptions accurately match visible content.
- Services, prices, hours, locations, phone numbers, email addresses and booking instructions use consistent wording across the website.
- Business owners confirm commercial and location facts before publication and have a documented way to correct them.
- The site does not invent reviews, ratings, availability, outcomes, locations or prices for structured data or visible copy.

### Structured meaning

- Structured data is added only when it represents information visible on the page and supported by evidence.
- Suitable schema types may include `Organization`, an appropriate `LocalBusiness` subtype, `Service`, `BreadcrumbList` and other types justified by the page.
- Structured data identifiers, URLs, business names and contact details stay consistent across pages.
- Schema validation is necessary but not sufficient; the rendered page must remain the primary source of truth.

### Crawler policy

- Production, preview and administrative environments have explicit and separate robots policies.
- Public indexing is enabled only after content and launch checks pass.
- Search, answer-agent and model-training access are treated as separate policy decisions where the platform supports that distinction.
- A robots rule is not treated as proof that every crawler will comply.
- Emerging conventions such as `llms.txt` may be evaluated later, but they are not a substitute for semantic HTML, metadata, structured data or a clear crawler policy.

### Safe actions

- Contact and booking actions identify what will happen before a visitor submits information.
- Automated actions use the same validation, rate limits, authorization and audit boundaries as human-triggered actions.
- An AI agent must not confirm a booking, take payment, change business data or access private customer information unless a separately designed and authorized interface supports that exact action.
- Regulated or sensitive information remains outside general marketing and booking flows unless an approved system is designed for it.
- Payment accounts belong to the client business; 808 does not become an unnecessary handler of customer funds.

### Operational quality

- Important public routes have automated build and link checks.
- Errors in analytics, AI providers or optional third parties do not remove essential business information.
- Content changes can be traced to an approved source and corrected without rewriting unrelated parts of the site.
- Performance, accessibility, metadata and structured-data checks are part of release verification.

## Current 808 landing-page position

The current public application already provides part of this foundation:

- statically rendered marketing routes;
- semantic page structure and accessible controls;
- stable service URLs and canonical metadata;
- visible, typed service content;
- direct email, WhatsApp and illustrative booking paths; and
- an LTV endpoint with validation and abuse controls.

It is not yet appropriate to market the site as proof of a complete agent-ready standard. Remaining work includes:

- an environment-aware production robots policy;
- sitemap generation;
- reviewed structured data based only on verified public facts;
- social-preview metadata and assets;
- a documented policy for search, answer-agent and training crawlers;
- repeatable validation reports; and
- a separately designed action contract if external agents are ever allowed to use SnapBook beyond normal browser interaction.

## Public-content boundary

For now:

- Do not add this positioning to the home page, services pages, metadata or sales calculator.
- Do not create an empty blog, insights route or placeholder article about agent readiness.
- Do not imply that an AI agent can already book, pay or manage business information autonomously.
- Keep this document available as architecture context for future proposals, product decisions and brand work.

A future article becomes worthwhile only when 808 can show concrete implementation decisions, validation evidence and lessons from real delivery. The article should then explain the practical benefit to service businesses rather than leading with speculative AI terminology.

## Relationship to the migration plan

The immediate technical foundation belongs to Phase 3 SEO work and Phase 4 production hardening:

- Phase 3 establishes crawlable routes, metadata, sitemap, robots behavior and evidence-backed structured data.
- Phase 4 establishes performance, monitoring, security headers, abuse protection and reliable public actions.
- Later SnapBook architecture may define safe machine-action interfaces, but the current illustrative demo does not justify building them now.
