# Phase 2 discovery: public home-page migration

- Date: 2026-08-18
- Starting commit: `2be78df`
- Starting branch: `main`
- Starting state: Phase 1 changes are present but uncommitted; no unrelated tracked edits were detected.

## Repository and build baseline

- The legacy page remains a single React client component at `src/app/App.tsx` with eight rendered sections.
- Only React, Lucide icons, the existing style entrypoint, and the LTV endpoint are active dependencies of that page. The generated shadcn component inventory is not part of the rendered page.
- The legacy build still passes with no warnings, transforms 1,599 modules, and produces 0.81 kB HTML, 94.37 kB CSS, and 162.17 kB JavaScript before gzip.
- The public Next.js app is still the Phase 1 placeholder and has no application dependencies beyond Next.js, React, and React DOM.
- The only local environment key found is `VITE_ANTHROPIC_API_KEY`; its value was not read or recorded. It belongs to the Supabase function and must not be exposed to Next.js.

## Rendered baseline

- Browser captures were taken at 1440 x 900 and 390 x 844. The desktop page uses a three-column presentation for service and process sections; the mobile page collapses those sections to one column.
- The hero occupies at least one viewport height and renders six remote Unsplash placeholders in a dense four-column, three-row mosaic with a dark scrim.
- The calculator starts empty with its submit control disabled. Enter submits a non-empty prompt and Shift+Enter remains available for a newline.
- Once a message is submitted, the hero scrim darkens and applies a 12 px blur.
- The local Supabase function was not running during discovery. Submitting a sample prompt correctly exercised the existing failure state and rendered the legacy `Failed to fetch` message.
- The page exposes booking, email, and WhatsApp links. The phone number and contact details are explicitly marked as placeholders in source.

## Content and encoding

- Browser-rendered punctuation is correct, including em dashes, multiplication signs, bullets, and the 1–5 range.
- Several of those characters are mojibake in `App.tsx`; migration will encode the intended Unicode characters directly.
- Existing metadata is `noindex, nofollow`, with the title `Landing Page for 808 Digital Systems` and the current Lusaka-business description.

## Component mapping

- Server-rendered page sections: hero shell and mosaic, “Built to be found,” problem, services, proof, audience, process, and footer CTA.
- Client island: LTV conversation state, request lifecycle, keyboard behavior, response cards, and hero blur-state callback.
- Shared-within-page data: brand values, mosaic entries, service entries, audience categories, and process steps. These remain local to `apps/web` until another route proves a shared package is warranted.

## Accessibility baseline and intended corrections

- The legacy textarea has placeholder text but no explicit accessible label.
- The icon-only attachment and submit controls have no accessible names; the attachment control has no behavior.
- The migrated island will add a real label, named controls, visible focus treatment, live status semantics, and a disabled explanation for the unavailable attachment action while preserving the visual treatment.

## Constraints and risks

- Preserve the Supabase request contract `{ message, history }` and response shape during this phase.
- Translate the public endpoint variable to `NEXT_PUBLIC_SUPABASE_FUNCTION_URL`; keep the Anthropic key server-side in Supabase.
- Success against the live function cannot be claimed without a running/configured function. Contract tests will cover success, conversational, malformed-error, and network-failure paths locally.
- Remote Unsplash imagery is still placeholder content. It will be represented with framework image configuration for parity, not silently replaced with invented brand photography.
- The legacy site must remain buildable until cutover.

## Accepted scope

- Replace the `apps/web` placeholder with the migrated public homepage.
- Keep static content server-rendered and isolate client state to the calculator/hero interaction.
- Preserve visual intent and responsive behavior, correct encoding defects, improve accessible control semantics, and retain existing outbound destinations.
- Add focused contract tests for the LTV request layer.
- Do not add routes, change the agent prompt or model, implement admin features, deploy, or remove the legacy application.

## Phase handoff

- Phase 2 is complete locally. `apps/web` now renders the migrated landing page at `/`; the Phase 1 scaffold has been removed.
- All static sections remain Server Components. The only `use client` boundary is `src/components/ltv-chat.tsx`; the hero blur state is coupled through a CSS `:has()` selector rather than lifting the whole hero into client state.
- The six placeholder Unsplash images retain the legacy crop and treatment through `next/image` plus a narrowly scoped `images.unsplash.com/photo-*` remote pattern.
- Metadata retains the legacy title, description, and `noindex, nofollow` behavior.
- The client now reads `NEXT_PUBLIC_SUPABASE_FUNCTION_URL`, falling back to the same local function URL. The request body and response shape remain unchanged.
- Four Node tests cover the calculation contract, conversational response, structured Edge Function error, and malformed-success response.
- Browser verification passed at 390 x 844, 768 x 1024, and 1440 x 900. The page has no horizontal overflow, the service/process grids switch at the intended breakpoint, and the hero remains one viewport tall.
- Desktop and mobile visual captures closely match the legacy structure, type scale, spacing, mosaic, colors, and section ordering. The migrated mobile service cards add subtle separators to clarify the stacked layout.
- Keyboard checks passed for Enter-to-submit and Shift+Enter newline entry. The textarea, attachment state, and submit action now expose accessible names; conversation updates use a polite live region and loading uses status semantics.
- The unavailable-service browser path renders `I encountered an error: Failed to fetch` and activates the 12 px hero blur with the expected 82% scrim.
- A temporary in-memory HTTP stub exercised the successful browser path and rendered the sales reply, `Dental clinic` result card, `K 350 × 3`, `K 1,050` annual value, contact anchor, and encoded WhatsApp link. The stub was stopped and did not modify the repository.
- Deployment follow-up on 2026-08-18: `ltv-agent` was deployed to Supabase project `zrazabyjvjxpnuhwfoaf`. The retired Claude 3.5 Sonnet snapshot was first replaced by `claude-sonnet-4-6`, then the bounded calculator workflow was migrated to Groq's `openai/gpt-oss-120b` to reduce per-request cost.
- The Groq implementation uses strict JSON Schema output, low reasoning effort, bounded input history, server-side response validation, and deterministic server-side multiplication. The provider credential is stored as the server-only Supabase secret `GROQ_API_KEY`.
- Six live hosted requests verified one-shot calculation, greeting, multi-turn extraction, monthly-to-annual frequency conversion, negative-value clarification, and instruction-injection resistance. Observed end-to-end response times ranged from approximately 0.9 to 2.5 seconds. The function is intentionally public (`verify_jwt = false`) for the landing-page calculator, so abuse controls remain a production-readiness requirement.
- Production-readiness follow-up added a versioned 40-case evaluation package: 24 development cases and 16 held-out release-gate cases. The immutable `baseline-v1` development run passed 21/24 cases (87.5%) with zero critical failures, two operationally surfaced invalid-response failures, p95 latency of 1.784 seconds, and an estimated Groq cost of $0.003258. It is retained as a diagnostic baseline and does not meet the documented 95% release threshold.
- `explicit-input-rules-v2` was selected and deployed after two development runs each passed 23/24 cases (95.83%) with zero critical or operational failures. A more prescriptive v3 candidate was rejected because it did not improve reliability and cost more tokens. The held-out v2 run passed 15/16 under the original deterministic grader and 16/16 after an offline, zero-call grader correction recognized `appointment` as valid frequency language. Human tone and sales-copy review remains the final model-quality release gate.
- Final local checks passed: frozen offline install, lint, type checking, four web tests, aggregate web/admin/legacy build, and production browser smoke testing. The Next.js `/` route is statically prerendered.
- The legacy Vite application still builds with its Phase 1 baseline output and remains available as the rollback reference.
- Phase 7 was subsequently pulled forward to close the public calculator's reliability and abuse risks. Its current prompt, evaluation, deployed controls, and owner approval are recorded in `phase-7-ltv-agent.md`; that later evidence supersedes the pending human-review note above.
- Before Phase 3, run a fresh discovery pass for route requirements, navigation information architecture, metadata per route, analytics expectations, content ownership, and repository drift since this handoff.
