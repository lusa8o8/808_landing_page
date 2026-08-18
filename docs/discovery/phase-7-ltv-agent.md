# Phase 7 discovery: LTV agent redesign and hardening

- Date: 2026-08-18
- Starting commit: `2be78df`
- Starting branch: `main`
- Sequencing note: Phase 7 was pulled forward during Phase 2 because the public calculator was already live-facing and its reliability, cost, and abuse exposure had to be resolved before broader route work.

## Current-state facts discovered

- The public calculator is a bounded conversational extractor, not an open-ended autonomous agent. It needs no tools, browsing, RAG, files, or subagents.
- The browser sends `{ message, history }` to a public Supabase Edge Function. The function validates structured model output and owns arithmetic deterministically.
- Groq `openai/gpt-oss-120b` materially reduces provider cost for this task, but strict structured output can intermittently return `json_validate_failed`; one bounded retry is required.
- The deployed prompt is versioned as `conversation-state-v4`. Result-card state is represented in sanitized conversation history so acknowledgements and corrections behave predictably.
- The endpoint is intentionally anonymous and has `verify_jwt = false`. Durable, atomic quotas are therefore required before any provider call.
- The confirmed canonical production origin is `https://www.eightzeroeight.online`. The future `808digital.com` domain is not purchased or allowlisted.

## Drift from the original plan

- Provider selection changed from Anthropic Claude to Groq after live evaluation showed the smaller bounded workflow did not justify Sonnet pricing.
- Prompt evaluation grew from six smoke cases into versioned development, held-out, regression, and human-review evidence.
- Abuse controls were implemented within the pulled-forward Phase 7 scope instead of waiting for the broader Phase 4 hardening pass.
- A private Supabase quota table and service-role-only atomic RPC were added through migration `20260818150000_ltv_rate_limits.sql`.

## Constraints and decisions

- Keep provider credentials, rate-limit salt, and service-role access server-only.
- Store no conversation text. Store only salted SHA-256 client-address hashes and counters, expiring after 48 hours.
- Enforce 20 requests per 10 minutes and 60 per day per client hash, plus 500 requests per day service-wide.
- Fail closed when quota state is unavailable; return generic public errors and retain useful request correlation.
- Keep calculation deterministic and never allow model output to authorize privileged actions.
- Add `808digital.com` only after purchase, deployment, and explicit origin review.

## Risks retained

- Distributed callers can rotate addresses until the global daily ceiling is reached.
- Legitimate visitors behind a shared network can share a client quota.
- Forwarded-address integrity depends on the Supabase edge gateway.
- Provider and platform logs have retention outside application-controlled storage.
- Site-wide monitoring, Content Security Policy, accessibility budgets, and deployment rollback remain Phase 4 and Phase 8 concerns.

## Accepted scope

- Version the prompt and deterministic response contract.
- Add schema validation, bounded history, deterministic arithmetic, timeout, retry, body limits, origin-aware CORS, safe errors, and durable quotas.
- Build reviewed development and held-out datasets, deterministic graders, immutable results, HTML reports, and release selection records.
- Validate the deployed function, its abuse behavior, and the browser result-card journey.
- Do not add authentication, saved conversations, privileged actions, tools, RAG, or admin workflows.

## Phase handoff

- `conversation-state-v4` on Groq `openai/gpt-oss-120b` is deployed to Supabase project `zrazabyjvjxpnuhwfoaf`.
- The post-control regression passes 7/7 after a documented offline grader correction; development passes 24/24 and fresh held-out passes 12/12, with zero critical or operational failures.
- Eleven local function tests pass, including quota parsing, hashing, malformed data, retry behavior, and duplicate-result handling.
- Live abuse checks verified allowed and denied origins, a 32 KiB body ceiling, `200, 200, 429` burst behavior with `Retry-After`, restored production quotas, and fail-closed behavior.
- A production-browser replay completed a salon estimate, rendered one correct result card, and produced no browser errors or warnings.
- The production dependency audit reports no known vulnerabilities, and web, admin, and legacy builds pass.
- Site owner Lusa Malungisha approved the bounded LTV agent for production traffic on 2026-08-18.
- Prompt/model rollback is available through the preserved versioned prompt and selection evidence. The database migration is additive.
- The phase is technically complete, but its repository rollback point has not been created because the full migration worktree remains uncommitted.
