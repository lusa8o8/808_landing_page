import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [designPath, manifestPath, outputPath] = process.argv.slice(2);
if (!designPath || !manifestPath || !outputPath) {
  throw new Error("Usage: render-agent-design.mjs <design.md> <manifest.json> <output.html>");
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const [design, manifestText] = await Promise.all([
  readFile(resolve(designPath), "utf8"),
  readFile(resolve(manifestPath), "utf8"),
]);
const manifest = JSON.parse(manifestText);

const cards = Object.entries(manifest.budgets)
  .map(([key, value]) => `<article><small>${escapeHtml(key.replaceAll("_", " "))}</small><strong>${escapeHtml(value)}</strong></article>`)
  .join("");
const capabilities = manifest.capabilities
  .map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.kind)}</td><td>${escapeHtml(item.access)}</td><td>${escapeHtml(item.consequence)}</td><td>${escapeHtml(item.verification)}</td></tr>`)
  .join("");
const risks = manifest.residual_risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
const failures = manifest.evaluation.critical_failures.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
const flow = `[Anonymous visitor]\n        |\n        v\n[Edge validation] -> [Atomic Postgres quota] -- denied --> [429]\n        | allowed\n        v\n[One bounded Groq call]\n        |\n        v\n[Schema + server arithmetic] -> [JSON response]`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>808 LTV Agent Design</title><style>
:root{--ink:#17211b;--muted:#58655d;--paper:#f4f0e7;--panel:#fffdf8;--line:#c9c1b2;--accent:#0f6a52;--danger:#8b2635}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 Georgia,serif}main{width:min(1120px,calc(100% - 32px));margin:32px auto 64px}.hero,section{background:var(--panel);border:1px solid var(--line);padding:26px;margin-top:18px}.hero{border-top:8px solid var(--accent)}h1{font-size:clamp(2.2rem,5vw,4.2rem);line-height:1;margin:.2rem 0}h2{margin-top:0}small{display:block;color:var(--accent);font:700 .72rem/1.2 system-ui;text-transform:uppercase;letter-spacing:.08em}strong{display:block;margin-top:.35rem}.meta,.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-top:20px}article{border:1px solid var(--line);padding:15px;background:white}.badge{display:inline-block;border-radius:999px;background:#a14d22;color:#fff;padding:4px 10px;font:700 .8rem system-ui;text-transform:uppercase}pre{overflow:auto;background:#17251f;color:#e3f5eb;border-left:5px solid var(--accent);padding:18px;white-space:pre-wrap}.source{background:#f1eee5;color:var(--ink);border-left-color:var(--line)}table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{padding:9px;border:1px solid var(--line);text-align:left;vertical-align:top}th{background:#254b3f;color:white;font-family:system-ui}.critical{border-left:6px solid var(--danger)}.table{overflow:auto}p.lead{max-width:78ch;color:var(--muted);font-size:1.08rem}@media print{body{background:white}.hero,section{break-inside:avoid}main{width:100%;margin:0}}@media(max-width:650px){main{width:calc(100% - 16px);margin-top:8px}.hero,section{padding:18px}}
</style></head><body><main>
<header class="hero"><small>AI agent architecture and release review</small><h1>808 LTV assistant</h1><p class="lead">${escapeHtml(manifest.objective)}</p><div class="meta"><div><small>Version</small><strong>${escapeHtml(manifest.version)}</strong></div><div><small>Architecture</small><strong>${escapeHtml(manifest.architecture.type)}</strong></div><div><small>Risk</small><strong><span class="badge">${escapeHtml(manifest.risk_level)}</span></strong></div></div></header>
<section><h2>Decision</h2><p>${escapeHtml(manifest.architecture.rationale)}</p><pre>${escapeHtml(flow)}</pre></section>
<section><h2>Budgets and stops</h2><div class="grid">${cards}</div></section>
<section><h2>Capability matrix</h2><div class="table"><table><thead><tr><th>Capability</th><th>Kind</th><th>Access</th><th>Consequence</th><th>Verification</th></tr></thead><tbody>${capabilities}</tbody></table></div></section>
<section class="critical"><h2>Critical failures</h2><ul>${failures}</ul></section>
<section><h2>Residual risks</h2><ul>${risks}</ul></section>
<section><h2>Human-readable design source</h2><pre class="source">${escapeHtml(design)}</pre></section>
</main></body></html>`;

await writeFile(resolve(outputPath), html, "utf8");
console.log(`Rendered agent design report: ${resolve(outputPath)}`);
