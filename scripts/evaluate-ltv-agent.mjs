import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import process from "node:process";

const DEFAULT_ENDPOINT =
  "https://zrazabyjvjxpnuhwfoaf.supabase.co/functions/v1/ltv-agent";
const DEFAULT_DATASET =
  "evaluations/ltv-agent/datasets/development-v1.json";
const PRICING = {
  currency: "USD",
  source_date: "2026-08-18",
  input_per_million_tokens: 0.15,
  output_per_million_tokens: 0.6,
};

function parseArguments(argv) {
  const options = {
    dataset: DEFAULT_DATASET,
    endpoint: process.env.LTV_EVAL_ENDPOINT || DEFAULT_ENDPOINT,
    concurrency: 1,
    delayMs: 5_000,
    execute: false,
    regrade: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--execute") options.execute = true;
    else if (argument === "--dataset") options.dataset = argv[++index];
    else if (argument === "--regrade") options.regrade = argv[++index];
    else if (argument === "--endpoint") options.endpoint = argv[++index];
    else if (argument === "--concurrency") {
      options.concurrency = Number.parseInt(argv[++index], 10);
    } else if (argument === "--delay-ms") {
      options.delayMs = Number.parseInt(argv[++index], 10);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 5) {
    throw new Error("Concurrency must be an integer between 1 and 5.");
  }
  if (!Number.isInteger(options.delayMs) || options.delayMs < 0 || options.delayMs > 60_000) {
    throw new Error("Delay must be an integer between 0 and 60000 milliseconds.");
  }
  return options;
}

function assertDataset(dataset) {
  if (!dataset || typeof dataset !== "object" || !Array.isArray(dataset.cases)) {
    throw new Error("Dataset must be an object containing a cases array.");
  }
  if (!dataset.dataset_version || !dataset.split || dataset.cases.length === 0) {
    throw new Error("Dataset version, split, and at least one case are required.");
  }

  const identifiers = new Set();
  for (const testCase of dataset.cases) {
    if (!testCase.id || identifiers.has(testCase.id)) {
      throw new Error(`Case identifiers must be present and unique: ${testCase.id}`);
    }
    identifiers.add(testCase.id);
    if (typeof testCase.input?.message !== "string" || !Array.isArray(testCase.input.history)) {
      throw new Error(`Case ${testCase.id} has an invalid input contract.`);
    }
    if (!testCase.expected || typeof testCase.expected.is_calculation !== "boolean") {
      throw new Error(`Case ${testCase.id} has no deterministic expectation.`);
    }
  }
}

function approximatelyEqual(left, right) {
  return Math.abs(left - right) <= Math.max(1e-9, Math.abs(right) * 1e-9);
}

const FREQUENCY_TERMS = [
  "often",
  "return",
  "visit",
  "times",
  "frequency",
  "appointment",
  "booking",
  "session",
  "lesson",
  "treatment",
  "stay",
  "job",
  "order",
  "year",
];

const EXAMPLE_TERMS = [
  "example",
  "imagine",
  "hypothetical",
  "illustration",
  "demonstration",
  "placeholder",
];

function includesTerm(text, term) {
  if (term.length === 1) {
    return new RegExp(`\\b${term}\\b`, "i").test(text);
  }
  return text.toLowerCase().includes(term.toLowerCase());
}

function matchesAnyExpectedIntent(text, expectedTerms) {
  if (expectedTerms.some((term) => includesTerm(text, term))) return true;
  const expectsFrequency = expectedTerms.some((term) => FREQUENCY_TERMS.includes(term.toLowerCase()));
  if (expectsFrequency && FREQUENCY_TERMS.some((term) => includesTerm(text, term))) return true;
  const expectsExample = expectedTerms.some((term) => EXAMPLE_TERMS.includes(term.toLowerCase()));
  return expectsExample && EXAMPLE_TERMS.some((term) => includesTerm(text, term));
}

function grade(testCase, output) {
  const assertions = [];
  const add = (name, passed, detail) => assertions.push({ name, passed, detail });
  const expected = testCase.expected;
  const requiredKeys = [
    "businessType",
    "avgValue",
    "visitsPerYear",
    "total",
    "salesPitch",
    "isCalculation",
  ];
  const isObject = output && typeof output === "object" && !Array.isArray(output);
  add("response-object", isObject, "Response must be a JSON object.");

  if (isObject) {
    add(
      "required-fields",
      requiredKeys.every((key) => Object.hasOwn(output, key)),
      "All six response fields must be present.",
    );
    add(
      "field-types",
      typeof output.businessType === "string" &&
        typeof output.salesPitch === "string" &&
        typeof output.isCalculation === "boolean" &&
        [output.avgValue, output.visitsPerYear, output.total].every(
          (value) => typeof value === "number" && Number.isFinite(value),
        ),
      "String, boolean, and finite-number fields must match the contract.",
    );
    add(
      "calculation-state",
      output.isCalculation === expected.is_calculation,
      `Expected isCalculation=${expected.is_calculation}.`,
    );
    add(
      "plain-sales-copy",
      typeof output.salesPitch === "string" && !/```|\*\*|^#{1,6}\s/m.test(output.salesPitch),
      "salesPitch must not contain Markdown formatting.",
    );
  }

  if (isObject && expected.numeric_fields_zero) {
    add(
      "zero-unresolved-values",
      output.avgValue === 0 && output.visitsPerYear === 0 && output.total === 0,
      "Unresolved conversations must return zero for every numeric field.",
    );
  }
  if (isObject && expected.business_type_contains) {
    add(
      "business-type",
      String(output.businessType).toLowerCase().includes(expected.business_type_contains.toLowerCase()),
      `businessType must contain ${JSON.stringify(expected.business_type_contains)}.`,
    );
  }
  for (const [expectation, outputField] of [
    ["avg_value", "avgValue"],
    ["visits_per_year", "visitsPerYear"],
    ["total", "total"],
  ]) {
    if (isObject && Object.hasOwn(expected, expectation)) {
      add(
        outputField,
        typeof output[outputField] === "number" &&
          approximatelyEqual(output[outputField], expected[expectation]),
        `Expected ${outputField}=${expected[expectation]}.`,
      );
    }
  }
  if (isObject && expected.is_calculation && typeof output.avgValue === "number" && typeof output.visitsPerYear === "number") {
    add(
      "deterministic-total",
      approximatelyEqual(output.total, output.avgValue * output.visitsPerYear),
      "total must equal avgValue multiplied by visitsPerYear.",
    );
  }
  if (isObject && expected.require_nonempty_sales_pitch) {
    add(
      "nonempty-sales-pitch",
      typeof output.salesPitch === "string" && output.salesPitch.trim().length > 0,
      "A conversational response is required.",
    );
  }
  if (isObject && expected.sales_pitch_any_of) {
    add(
      "sales-pitch-intent",
      matchesAnyExpectedIntent(String(output.salesPitch), expected.sales_pitch_any_of),
      `salesPitch must contain one of: ${expected.sales_pitch_any_of.join(", ")}.`,
    );
  }
  if (isObject && expected.sales_pitch_none_of) {
    const normalized = String(output.salesPitch).toLowerCase();
    add(
      "forbidden-disclosure",
      expected.sales_pitch_none_of.every((term) => !normalized.includes(term.toLowerCase())),
      "salesPitch must not expose forbidden instructions, key markers, or secrets.",
    );
  }

  const failures = assertions.filter((assertion) => !assertion.passed);
  const score = assertions.length
    ? Number(((assertions.length - failures.length) / assertions.length * 10).toFixed(2))
    : 0;
  return {
    score,
    passed: failures.length === 0,
    critical_failure: Boolean(testCase.critical && failures.length > 0),
    assertions,
    strengths: assertions.filter((item) => item.passed).map((item) => item.name),
    weaknesses: failures.map((item) => `${item.name}: ${item.detail}`),
    reasoning: failures.length
      ? `${failures.length} of ${assertions.length} deterministic assertions failed.`
      : `All ${assertions.length} deterministic assertions passed.`,
  };
}

function headerNumber(response, name) {
  const value = response.headers.get(name);
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function executeCase(endpoint, testCase) {
  const startedAt = performance.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCase.input),
      signal: AbortSignal.timeout(30_000),
    });
    const body = await response.text();
    const latencyMs = Math.round(performance.now() - startedAt);
    let output;
    try {
      output = JSON.parse(body);
    } catch {
      output = body;
    }

    const operational = {
      http_status: response.status,
      latency_ms: latencyMs,
      provider_latency_ms: (() => {
        const match = response.headers.get("server-timing")?.match(/groq;dur=([0-9.]+)/);
        return match ? Number(match[1]) : null;
      })(),
      provider_attempts: headerNumber(response, "x-ltv-provider-attempts"),
      input_tokens: headerNumber(response, "x-ltv-input-tokens"),
      output_tokens: headerNumber(response, "x-ltv-output-tokens"),
      reasoning_tokens: headerNumber(response, "x-ltv-reasoning-tokens"),
      model: response.headers.get("x-ltv-model"),
      prompt_version: response.headers.get("x-ltv-prompt-version"),
    };

    if (!response.ok) {
      return {
        test_case: testCase,
        output,
        score: 0,
        syntax_score: 0,
        passed: false,
        critical_failure: false,
        operational_failure: true,
        strengths: [],
        weaknesses: [`HTTP ${response.status}`],
        reasoning: "The deployed endpoint did not return a successful response.",
        operational,
      };
    }

    const graded = grade(testCase, output);
    return {
      test_case: testCase,
      output,
      score: graded.score,
      syntax_score: graded.passed ? 10 : graded.score,
      passed: graded.passed,
      critical_failure: graded.critical_failure,
      operational_failure: false,
      assertions: graded.assertions,
      strengths: graded.strengths,
      weaknesses: graded.weaknesses,
      reasoning: graded.reasoning,
      operational,
    };
  } catch (error) {
    return {
      test_case: testCase,
      output: null,
      score: 0,
      syntax_score: 0,
      passed: false,
      critical_failure: false,
      operational_failure: true,
      strengths: [],
      weaknesses: [error instanceof Error ? error.message : String(error)],
      reasoning: "The evaluation request failed before a grade could be produced.",
      operational: { latency_ms: Math.round(performance.now() - startedAt) },
    };
  }
}

async function mapWithConcurrency(items, concurrency, delayMs, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function consume() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
      process.stdout.write(`${items[index].id}: ${results[index].passed ? "PASS" : "FAIL"}\n`);
      if (delayMs > 0 && nextIndex < items.length) {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, consume));
  return results;
}

function percentile(values, proportion) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(proportion * sorted.length) - 1];
}

async function saveSummary(summary, datasetPath) {
  const root = resolve("evaluations/ltv-agent");
  const latestPath = resolve(root, "results", `${summary.run_label}-latest.json`);
  const timestamp = summary.created_at.replaceAll(":", "-");
  const historyPath = resolve(
    root,
    "results/history",
    summary.prompt_version,
    `${summary.run_label}-${timestamp}.json`,
  );
  await mkdir(dirname(latestPath), { recursive: true });
  await mkdir(dirname(historyPath), { recursive: true });
  const serialized = `${JSON.stringify(summary, null, 2)}\n`;
  await writeFile(latestPath, serialized, "utf8");
  await writeFile(historyPath, serialized, { encoding: "utf8", flag: "wx" });
  return { latestPath, historyPath, datasetPath };
}

async function regradeRun(sourcePath) {
  const source = JSON.parse(await readFile(resolve(sourcePath), "utf8"));
  if (!Array.isArray(source.results)) throw new Error("Source run has no results array.");
  const results = source.results.map((result) => {
    if (result.operational?.http_status !== 200 || !result.output) return result;
    const graded = grade(result.test_case, result.output);
    return {
      ...result,
      score: graded.score,
      syntax_score: graded.passed ? 10 : graded.score,
      passed: graded.passed,
      critical_failure: graded.critical_failure,
      operational_failure: false,
      assertions: graded.assertions,
      strengths: graded.strengths,
      weaknesses: graded.weaknesses,
      reasoning: graded.reasoning,
    };
  });
  const passed = results.filter((result) => result.passed).length;
  const latencies = results.map((result) => result.operational?.latency_ms).filter(Number.isFinite);
  const summary = {
    ...source,
    run_label: `${source.run_label}-regraded`,
    created_at: new Date().toISOString(),
    regraded_from: resolve(sourcePath),
    average_score: Number(
      (results.reduce((sum, result) => sum + result.score, 0) / results.length).toFixed(2),
    ),
    execution_config: {
      ...source.execution_config,
      grader: "deterministic-v4",
      regrade_only: true,
    },
    metrics: {
      ...source.metrics,
      passed_cases: passed,
      failed_cases: results.length - passed,
      pass_rate: Number((passed / results.length).toFixed(4)),
      critical_failures: results.filter((result) => result.critical_failure).length,
      operational_failures: results.filter((result) => result.operational_failure).length,
      mean_latency_ms: Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length),
      p95_latency_ms: percentile(latencies, 0.95),
    },
    usage: {
      api_calls: 0,
      input_tokens: 0,
      output_tokens: 0,
      reasoning_tokens: 0,
      estimated_cost_usd: 0,
      source_run_usage: source.usage,
    },
    results,
  };
  const paths = await saveSummary(summary, source.source_dataset || "embedded-in-source-run");
  console.log(`Offline regrade: ${passed}/${results.length} passed; 0 API calls; $0 cost.`);
  console.log(`Latest: ${paths.latestPath}`);
  console.log(`History: ${paths.historyPath}`);
  if (passed !== results.length || summary.metrics.critical_failures > 0) process.exitCode = 1;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.regrade) {
    await regradeRun(options.regrade);
    return;
  }
  const datasetPath = resolve(options.dataset);
  const dataset = JSON.parse(await readFile(datasetPath, "utf8"));
  assertDataset(dataset);

  const maximumOutputTokens = 400 * dataset.cases.length;
  const maximumOutputCost = maximumOutputTokens / 1_000_000 * PRICING.output_per_million_tokens;
  console.log(
    `${dataset.dataset_version}: ${dataset.cases.length} calls, concurrency ${options.concurrency}, ` +
      `${options.delayMs}ms pacing.`,
  );
  console.log(
    `Maximum configured output-token cost: $${maximumOutputCost.toFixed(4)} plus input tokens.`,
  );
  if (!options.execute) {
    console.log("Dry run only. Add --execute to call the endpoint.");
    return;
  }

  const results = await mapWithConcurrency(
    dataset.cases,
    options.concurrency,
    options.delayMs,
    (testCase) => executeCase(options.endpoint, testCase),
  );
  const latencies = results.map((result) => result.operational.latency_ms).filter(Number.isFinite);
  const inputTokens = results.reduce((sum, result) => sum + (result.operational.input_tokens || 0), 0);
  const outputTokens = results.reduce((sum, result) => sum + (result.operational.output_tokens || 0), 0);
  const reasoningTokens = results.reduce((sum, result) => sum + (result.operational.reasoning_tokens || 0), 0);
  const estimatedCost =
    inputTokens / 1_000_000 * PRICING.input_per_million_tokens +
    outputTokens / 1_000_000 * PRICING.output_per_million_tokens;
  const promptVersions = new Set(results.map((result) => result.operational.prompt_version).filter(Boolean));
  const models = new Set(results.map((result) => result.operational.model).filter(Boolean));
  const passed = results.filter((result) => result.passed).length;
  const criticalFailures = results.filter((result) => result.critical_failure).length;
  const operationalFailures = results.filter((result) => result.operational_failure).length;
  const promptVersion = promptVersions.size === 1 ? [...promptVersions][0] : "unknown-or-mixed";
  const model = models.size === 1 ? [...models][0] : "unknown-or-mixed";
  const summary = {
    agent: "808-ltv-agent",
    prompt_version: promptVersion,
    dataset_version: dataset.dataset_version,
    run_label: dataset.split,
    created_at: new Date().toISOString(),
    model,
    execution_config: {
      endpoint: options.endpoint,
      reasoning_effort: "low",
      include_reasoning: false,
      max_completion_tokens: 400,
      concurrency: options.concurrency,
      delay_ms: options.delayMs,
      grader: "deterministic-v4",
      human_review: "pending",
    },
    case_count: results.length,
    average_score: Number(
      (results.reduce((sum, result) => sum + result.score, 0) / results.length).toFixed(2),
    ),
    metrics: {
      passed_cases: passed,
      failed_cases: results.length - passed,
      pass_rate: Number((passed / results.length).toFixed(4)),
      critical_failures: criticalFailures,
      operational_failures: operationalFailures,
      mean_latency_ms: Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length),
      p95_latency_ms: percentile(latencies, 0.95),
    },
    usage: {
      api_calls: results.length,
      input_tokens: inputTokens || null,
      output_tokens: outputTokens || null,
      reasoning_tokens: reasoningTokens || null,
      estimated_cost_usd: inputTokens || outputTokens ? Number(estimatedCost.toFixed(6)) : null,
      pricing: PRICING,
    },
    source_dataset: basename(datasetPath),
    results,
  };
  const paths = await saveSummary(summary, datasetPath);
  console.log(
    `Result: ${passed}/${results.length} passed; ${criticalFailures} critical failures; ` +
      `average ${summary.average_score}/10; estimated cost $${summary.usage.estimated_cost_usd ?? "unknown"}.`,
  );
  console.log(`Latest: ${paths.latestPath}`);
  console.log(`History: ${paths.historyPath}`);
  if (passed !== results.length || criticalFailures > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
