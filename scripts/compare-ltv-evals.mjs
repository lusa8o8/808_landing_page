import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [baselineArgument, candidateArgument, outputArgument] = process.argv.slice(2);
if (!baselineArgument || !candidateArgument) {
  throw new Error("Usage: node scripts/compare-ltv-evals.mjs <baseline.json> <candidate.json> [output.json]");
}

const load = async (path) => JSON.parse(await readFile(resolve(path), "utf8"));
const baseline = await load(baselineArgument);
const candidate = await load(candidateArgument);
const scores = (run) => new Map(run.results.map((result) => [result.test_case.id, result]));
const before = scores(baseline);
const after = scores(candidate);
const ids = [...new Set([...before.keys(), ...after.keys()])].sort();
const cases = ids.map((id) => {
  const baselineResult = before.get(id);
  const candidateResult = after.get(id);
  return {
    id,
    category: candidateResult?.test_case.category || baselineResult?.test_case.category,
    baseline_score: baselineResult?.score ?? null,
    candidate_score: candidateResult?.score ?? null,
    delta:
      baselineResult && candidateResult
        ? Number((candidateResult.score - baselineResult.score).toFixed(2))
        : null,
    baseline_passed: baselineResult?.passed ?? null,
    candidate_passed: candidateResult?.passed ?? null,
    newly_failing: Boolean(baselineResult?.passed && candidateResult && !candidateResult.passed),
    newly_passing: Boolean(baselineResult && !baselineResult.passed && candidateResult?.passed),
  };
});
const comparison = {
  agent: candidate.agent,
  baseline: {
    prompt_version: baseline.prompt_version,
    dataset_version: baseline.dataset_version,
    average_score: baseline.average_score,
    metrics: baseline.metrics,
    usage: baseline.usage,
  },
  candidate: {
    prompt_version: candidate.prompt_version,
    dataset_version: candidate.dataset_version,
    average_score: candidate.average_score,
    metrics: candidate.metrics,
    usage: candidate.usage,
  },
  deltas: {
    average_score: Number((candidate.average_score - baseline.average_score).toFixed(2)),
    pass_rate: Number((candidate.metrics.pass_rate - baseline.metrics.pass_rate).toFixed(4)),
    mean_latency_ms: candidate.metrics.mean_latency_ms - baseline.metrics.mean_latency_ms,
    p95_latency_ms: candidate.metrics.p95_latency_ms - baseline.metrics.p95_latency_ms,
    estimated_cost_usd: Number(
      ((candidate.usage.estimated_cost_usd || 0) - (baseline.usage.estimated_cost_usd || 0)).toFixed(6),
    ),
  },
  newly_passing: cases.filter((item) => item.newly_passing).map((item) => item.id),
  newly_failing: cases.filter((item) => item.newly_failing).map((item) => item.id),
  cases,
};

const serialized = `${JSON.stringify(comparison, null, 2)}\n`;
if (outputArgument) {
  const outputPath = resolve(outputArgument);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, "utf8");
  console.log(`Saved comparison to ${outputPath}`);
}
console.log(
  `${baseline.prompt_version} -> ${candidate.prompt_version}: ` +
    `${Math.round(baseline.metrics.pass_rate * 10000) / 100}% -> ` +
    `${Math.round(candidate.metrics.pass_rate * 10000) / 100}%, ` +
    `average ${baseline.average_score} -> ${candidate.average_score}.`,
);
console.log(`Newly passing: ${comparison.newly_passing.join(", ") || "none"}`);
console.log(`Newly failing: ${comparison.newly_failing.join(", ") || "none"}`);
