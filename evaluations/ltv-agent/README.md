# LTV agent evaluation

This package evaluates the public Annual Client Value assistant independently from the browser UI. It keeps prompt changes measurable and prevents a small smoke test from being mistaken for production evidence.

## Versioned assets

- Deployed prompt baseline: `supabase/functions/ltv-agent/prompts/baseline-v1.ts`
- Development dataset: `datasets/development-v1.json` (24 cases)
- Held-out dataset: `datasets/heldout-v1.json` (16 cases)
- Deterministic runner and grader: `scripts/evaluate-ltv-agent.mjs`
- Latest and immutable results: `results/` and `results/history/`
- Self-contained reports: `reports/` and `reports/history/`

The development split is for prompt diagnosis and iteration. Do not inspect, copy, or paraphrase held-out cases into a candidate prompt. Run the held-out split only after selecting a candidate on development data.

## Coverage

The 40 cases cover complete and incomplete inputs, yearly/monthly/weekly/quarterly/fortnightly frequency normalization, approximate and decimal values, multi-turn state, user corrections, ambiguous ranges, invalid values, non-Kwacha inputs, terse and local phrasing, unrelated requests, and instruction-injection attempts.

Deterministic grading checks the response schema, field types, calculation state, zero-value behavior, extraction, frequency normalization, server-calculated totals, conversational intent keywords, Markdown exclusion, and forbidden disclosures. Tone and sales-copy quality remain a required human-review dimension; they are not reduced to a misleading keyword score.

## Running evaluations

Commands are dry-run by default and print the call count and maximum configured output-token cost before making network requests:

```powershell
pnpm eval:ltv
pnpm eval:ltv -- --execute
pnpm eval:ltv -- --dataset evaluations/ltv-agent/datasets/heldout-v1.json
pnpm eval:ltv -- --dataset evaluations/ltv-agent/datasets/heldout-v1.json --execute
```

The default one-request concurrency and five-second pacing are intentional for low Groq account limits. Override them only after checking the active provider limits:

```powershell
pnpm eval:ltv -- --execute --concurrency 2 --delay-ms 3000
```

Every executed run writes a convenient `*-latest.json` and an immutable timestamped history file. Provider telemetry is collected from safe response headers; no API credential is required by the runner or written to artifacts.

Render a self-contained report with the repository's dependency-free Node renderer:

```powershell
pnpm eval:ltv:report evaluations/ltv-agent/results/development-latest.json evaluations/ltv-agent/reports/development-latest.html
```

Regrade a preserved raw run after a versioned deterministic-grader correction without making new model calls:

```powershell
pnpm eval:ltv -- --regrade evaluations/ltv-agent/results/history/<prompt-version>/<run>.json
```

Compare two immutable runs by case identifier:

```powershell
pnpm eval:ltv:compare <baseline.json> <candidate.json> <comparison.json>
```

## Prompt-change procedure

1. Preserve the deployed prompt file; never edit an accepted prompt version in place.
2. Copy it to a new semantic label such as `clear-frequency-v2.ts`.
3. Change one major prompt property at a time.
4. Point the function import at the candidate and deploy it.
5. Run the complete development split with unchanged model settings and grader.
6. Compare case-level failures, latency, tokens, and cost against the baseline.
7. Reject any candidate that introduces a critical failure, even if its average improves.
8. Run the held-out split only for the selected candidate, followed by human review.

## Release gates

A prompt/model configuration is eligible for production only when:

- Schema, type, and deterministic-total assertions pass in every case.
- There are zero critical safety or fabricated-calculation failures.
- Development and held-out deterministic pass rates are at least 95%.
- There are no unresolved operational failures in the recorded run.
- P95 endpoint latency is no more than 5 seconds under the documented execution configuration.
- A human reviewer approves tone, clarity, factual framing, and non-coercive sales copy for every flagged conversational sample.
- The result records prompt version, dataset version, model, reasoning configuration, call count, token usage, latency, and estimated cost.

The first 24-case execution on 2026-08-18 was a calibration run, not release evidence: it identified non-observable grader expectations and then crossed the account's short-window provider limit. Its immutable raw result remains under `results/history/` for auditability.

## Current selection

The first structured live review reopened the earlier v2 decision after observing intermittent Groq `json_validate_failed` responses, a duplicate result card after an acknowledgement, and a currency spelling defect. That superseded decision remains preserved in `selection/explicit-input-rules-v2.json`.

`conversation-state-v4` is now the deployed candidate. It passed the post-deployment live regression suite 7/7, the original development suite 24/24, and a newly written held-out suite 12/12, with zero critical or operational failures. A clean browser replay of a K50 monthly barbershop calculation followed by “Nice” retained exactly one result card and produced no browser errors or warnings.

Provider resilience and UI rendering are code-level controls rather than prompt behavior: the function retries Groq once on `json_validate_failed`, preserves generic public errors, sends sanitized result-card state in conversation history, and the client suppresses identical repeated cards.

`abuse-controls-v1` adds an atomic Supabase-backed quota before every provider call: 20 requests per 10 minutes and 60 per day per salted client-address hash, plus a 500-request service-wide daily ceiling. It also adds a 32 KiB request limit, explicit browser-origin allowlisting, a 12-second provider timeout, generic public errors, and fail-closed quota dependency handling. The controlled live check observed `200, 200, 429`, returned `Retry-After`, rejected an unapproved origin with `403`, rejected an oversized body with `413`, and preserved a clean browser calculation. See `results/abuse-controls-v1.json`.

The prompt/model and technical abuse-control gates pass. On 2026-08-18, site owner Lusa Malungisha approved the bounded LTV agent for production traffic at the confirmed canonical origin `https://www.eightzeroeight.online`.

See `selection/conversation-state-v4.json` for the machine-readable decision and `reviews/conversation-state-v4-human-review.md` for the signed review record. Site-wide hardening and deployment readiness remain governed by Phases 4 and 8 of the migration plan.
