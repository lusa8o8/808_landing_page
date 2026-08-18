import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [inputArgument, outputArgument] = process.argv.slice(2);
if (!inputArgument || !outputArgument) {
  throw new Error("Usage: node scripts/render-ltv-eval.mjs <result.json> <report.html>");
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const json = (value) => escapeHtml(JSON.stringify(value, null, 2));
const inputPath = resolve(inputArgument);
const outputPath = resolve(outputArgument);
const summary = JSON.parse(await readFile(inputPath, "utf8"));

if (!summary.agent || !Array.isArray(summary.results) || typeof summary.average_score !== "number") {
  throw new Error("Input does not match the LTV evaluation summary contract.");
}

const cases = summary.results.map((result) => `
  <article class="case ${result.passed ? "pass" : "fail"}">
    <header><div><small>${escapeHtml(result.test_case.id)} · ${escapeHtml(result.test_case.category)}</small><h2>${escapeHtml(result.test_case.input.message)}</h2></div><strong>${result.score}/10</strong></header>
    <div class="grid">
      <section><h3>Expected behavior</h3><p>${escapeHtml(result.test_case.expected_behavior)}</p><pre>${json(result.test_case.expected)}</pre></section>
      <section><h3>Complete output</h3><pre>${json(result.output)}</pre></section>
      <section><h3>Grade</h3><p>${escapeHtml(result.reasoning)}</p><pre>${json(result.assertions || result.weaknesses)}</pre></section>
      <section><h3>Operational trace</h3><pre>${json(result.operational)}</pre></section>
    </div>
  </article>`).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(summary.agent)} evaluation</title>
<style>
:root{--ink:#17241f;--paper:#f4efe5;--card:#fffdf7;--line:#d7cfbf;--green:#176b4d;--red:#a83232;--muted:#65716c}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,sans-serif}main{width:min(1120px,calc(100% - 32px));margin:auto;padding:36px 0 72px}.hero{padding:30px;border-radius:22px 22px 6px;background:var(--ink);color:white}h1,h2{font-family:Georgia,serif}h1{margin:0;font-size:clamp(2rem,6vw,4rem)}.meta,.stats{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}.meta span,.stat{padding:10px 12px;border:1px solid #ffffff30;border-radius:10px}.stats{display:grid;grid-template-columns:repeat(4,1fr)}.stat b{display:block;font-size:1.5rem}.case{margin-top:22px;padding:24px;border:1px solid var(--line);border-left:6px solid var(--green);border-radius:8px 20px 20px;background:var(--card)}.case.fail{border-left-color:var(--red)}.case>header{display:flex;justify-content:space-between;gap:24px}.case h2{margin:6px 0 16px}.case>header strong{white-space:nowrap;font-size:1.4rem}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}section{border-top:1px solid var(--line);padding-top:14px}h3{color:var(--muted);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase}p,pre{line-height:1.5}pre{max-height:360px;overflow:auto;white-space:pre-wrap;padding:14px;border-radius:9px;background:#eee8db}@media(max-width:720px){.stats,.grid{grid-template-columns:1fr}.case>header{display:block}}@media print{body{background:white}.case{break-inside:avoid}}
</style></head><body><main><section class="hero"><h1>${escapeHtml(summary.agent)}</h1><div class="meta"><span>Prompt: ${escapeHtml(summary.prompt_version)}</span><span>Dataset: ${escapeHtml(summary.dataset_version)}</span><span>Model: ${escapeHtml(summary.model)}</span></div><div class="stats"><div class="stat"><small>Cases</small><b>${summary.case_count}</b></div><div class="stat"><small>Average</small><b>${summary.average_score}/10</b></div><div class="stat"><small>Pass rate</small><b>${Math.round(summary.metrics.pass_rate * 100)}%</b></div><div class="stat"><small>Critical failures</small><b>${summary.metrics.critical_failures}</b></div></div></section><section><h3>Execution configuration</h3><pre>${json(summary.execution_config)}</pre></section><section><h3>Metrics and usage</h3><pre>${json({ metrics: summary.metrics, usage: summary.usage })}</pre></section>${cases}</main></body></html>`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
console.log(`Saved report to ${outputPath}`);
