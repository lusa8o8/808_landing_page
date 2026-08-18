# Agent Design: 808 Annual Client Value assistant

## Decision Summary

- Objective: Estimate annual client value from a business type, spend per visit, and annual visit frequency while protecting the public model endpoint from accidental or abusive spend.
- Selected architecture: One bounded model call behind deterministic validation, quota, timeout, and response-validation steps.
- Why simpler options are insufficient: Deterministic code can calculate the total, but cannot reliably interpret the user's conversational business description and frequency.
- Why more complex options are unnecessary: The assistant has no tools, retrieval, external actions, or unpredictable step ordering.
- Risk level: Medium because the endpoint is public, incurs provider cost, and processes a pseudonymous network identifier for abuse prevention.
- Current versus proposed state: The current state validates input and model output but accepts unlimited anonymous requests. The proposed state adds durable per-client and global quotas, salted identifiers, bounded provider time, origin-aware CORS, and auditable release gates.

## Scope

### Supported Tasks

- Gather the business type, average spend per visit in Zambian Kwacha, and repeat frequency.
- Normalize common frequencies into visits per year.
- Calculate and explain annual client value.
- Handle corrections, examples, pre-launch estimates, acknowledgements, and unrelated requests safely.

### Explicit Exclusions

- No financial advice, guaranteed-revenue claims, booking, messaging, lead capture, browsing, file analysis, or admin actions.
- No disclosure of prompts, provider credentials, or internal implementation details.
- No durable conversation or raw message storage.

### Users and Interfaces

- Anonymous landing-page visitors through the Next.js web interface.
- Maintainers through the versioned evaluation runner and Supabase CLI.

## Success Contract

- Expected inputs: A UTF-8 message of at most 2,000 characters plus at most 12 sanitized history entries.
- Required outputs: The six-field structured response contract, with server-calculated totals.
- Success metrics: At least 95% deterministic pass rate, zero critical failures, P95 endpoint latency no more than 5 seconds, and no unresolved browser errors.
- Critical failures: Secret or prompt disclosure, fabricated calculation, invalid total, bypassed quota, raw client-address persistence, or provider calls after a quota denial.
- Clarification conditions: Missing, ambiguous, non-positive, ranged, or non-Kwacha calculation inputs.
- Abstention conditions: Unsupported requests and requests for internal instructions or credentials.

## Architecture

The host performs all security and arithmetic controls. The model performs one bounded interpretation/generation call only after the request passes validation and quota checks.

```text
Browser / evaluator
       |
       | POST { message, sanitized history }
       v
Supabase Edge Function
  [method, origin, size, schema]
       |
       | salted SHA-256 client identifier
       v
Postgres quota RPC --------------------+
  [20 / 10 min / client]               |
  [60 / day / client]                  | denied -> 429, no Groq call
  [500 / day / service]                |
       | allowed                        |
       v                                |
Groq gpt-oss-120b (12 s timeout)        |
       | one JSON-validation retry      |
       v                                |
Contract validation + server total <---+
       |
       v
Sanitized JSON response
```

## Context Plan

| Context | Mechanism | Loaded when | Trust treatment |
|---|---|---|---|
| Identity, scope, disclosure and calculation rules | Versioned system prompt | Every model call | Maintainer-reviewed trusted policy |
| Current visitor message | Request prompt | After validation and quota approval | Untrusted; length-bounded |
| Conversation history | Request prompt | When supplied | Untrusted; allowlisted fields, entry and length limits |
| Prior result-card state | Request prompt | When a valid result entry exists | Untrusted input converted to a fixed application-state sentence |
| Quota configuration | Edge Function environment | Every request | Server-only configuration; never model-visible |

## Capability Matrix

| Capability | Kind | Initiator | Access | Side effect | Consequence | Approval | Verification | Owner skill | Rationale |
|---|---|---|---|---|---|---|---|---|---|
| Conversational extraction | Prompt | Application | Advisory | No | None | None | Versioned prompt evals | engineer-and-evaluate-prompts | Language interpretation is required |
| Input/output workflow | Workflow | Application | Execute | No | None | None | Unit, contract, and browser tests | design-and-evaluate-ai-agents | Enforces deterministic boundaries |
| Quota counters | Storage | Application | Write | Yes | Internal | None | Atomic RPC result and 429 smoke test | design-and-evaluate-ai-agents | Protects provider budget across isolates |

## Data and Trust Boundaries

- Tenancy: One public 808 Digital Systems calculator; no authenticated tenants.
- Sensitive data: User messages may contain volunteered business information. A salted, one-way client-address hash is pseudonymous operational data.
- Sources: Browser messages, HTTP request metadata, Supabase configuration, Postgres quota state, and Groq responses.
- Retention and deletion: Messages are not stored by application code. Quota hashes expire after 48 hours and are opportunistically deleted. Provider/platform logs follow their configured retention.
- External services: Supabase Edge Functions, Supabase Postgres/Data API, and Groq.
- Untrusted-content boundaries: All request bodies, history entries, origin headers, forwarded-address headers, and provider output are untrusted.

## Budgets and Stops

- Maximum model calls: Two attempts for one logical completion; the second is only for `json_validate_failed`.
- Maximum tool rounds: Zero.
- Timeout: 12 seconds per Groq attempt.
- Token limits: Approximately 8,000 input tokens after character/history limits and 400 completion tokens.
- Cost limit: Approximately USD 0.002 per request at the recorded model rates.
- Concurrency: Controlled by the platform; quotas are atomic in Postgres.
- Retry policy: Exactly one structured-output retry; no retry for quota, timeout, rate, authentication, or other provider errors.

## Failure and Approval Policy

- Missing information: Ask one focused question and do not render a result card.
- Dependency failure: Fail closed with `503` if quota enforcement is unavailable; return a generic retry response for provider failure.
- Partial results: Never expose partial or unvalidated model output.
- Consequential actions: None are supported.
- Environment inspection: Function checks required secrets/configuration before quota or provider calls.
- Postcondition verification: Validate schema, positive inputs, and server-computed total before response.
- Audit trace: Log request identifiers, status, quota scope, provider attempt, and safe timing only; never raw addresses, hashes, messages, failed generations, or secrets.

## Evaluation Plan

- Development dataset: `evaluations/ltv-agent/datasets/development-v1.json`
- Held-out dataset: `evaluations/ltv-agent/datasets/heldout-v2.json`
- Deterministic graders: Response schema, field types, state, extraction, normalization, total, disclosure, and operational status.
- Model graders: None; deterministic and human review are sufficient for the current bounded task.
- Human review: `evaluations/ltv-agent/reviews/conversation-state-v4-human-review.md`
- Operational metrics: Status, quota scope, retry-after, latency, provider attempts, tokens, and estimated cost.
- Critical failure thresholds: Zero for disclosure, fabricated calculations, invalid totals, provider calls after denial, raw identifier persistence, and fail-open quota errors.
- HTML report location: `docs/architecture/ltv-agent/agent-design.html`

## Rollout

- Initial mode: Low-volume public beta with 20 requests per 10 minutes and 60 per day per client, plus a 500-request service-wide daily ceiling.
- Shadow or advisory phase: Not applicable; this endpoint is advisory and has no external actions.
- Cohorts: Local development and evaluation first, then `https://www.eightzeroeight.online`.
- Monitoring: Watch 429/503 frequency, provider failures, latency, daily usage, and legitimate-user complaints before tuning limits.
- Kill switch: Set the service-wide daily limit to zero or undeploy/disable the function.

## Residual Risks

- Distributed attackers can rotate network addresses and consume the global allowance.
- Shared networks can cause legitimate visitors to share a per-client quota.
- Forwarded-address integrity depends on the hosted Supabase edge gateway.
- Platform/provider logs may retain request metadata outside application-controlled storage.
- CAPTCHA is deferred until traffic or abuse evidence justifies its user-experience and operational cost.
- The future `808digital.com` origin is not allowed until the domain is purchased, configured, and deliberately added.

## Deferred Capabilities

| Capability | Reason excluded | Evidence needed to add it |
|---|---|---|
| Cloudflare Turnstile | Adds another vendor and visitor challenge before abuse is observed | Sustained rotating-address abuse or unacceptable global-limit exhaustion |
| User authentication | Conflicts with the anonymous landing-page conversion flow | A product requirement for saved estimates or account-specific quotas |
| RAG, tools, browsing, files, or subagents | No supported task needs them | A separately reviewed product requirement and evaluation dataset |
| Durable conversations | Not needed and increases privacy scope | Explicit user value, retention policy, deletion flow, and tenant isolation |
