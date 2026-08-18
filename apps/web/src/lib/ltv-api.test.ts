import assert from "node:assert/strict";
import test from "node:test";

import {
  isDuplicateResult,
  requestLtvEstimate,
  type FetchLike,
  type LtvEstimate,
  type LtvMessage,
} from "./ltv-api.ts";

test("preserves the existing request contract and returns a calculation", async () => {
  let requestBody = "";
  const fetcher: FetchLike = async (_input, init) => {
    requestBody = String(init?.body);
    return Response.json({
      businessType: "Dental clinic",
      avgValue: 350,
      visitsPerYear: 3,
      total: 1050,
      salesPitch: "A retained patient is worth K 1,050 each year.",
      isCalculation: true,
    });
  };

  const result = await requestLtvEstimate(
    "Patients pay K350 and visit three times a year.",
    [{ kind: "bot", text: "Tell me about your business." }],
    { endpoint: "https://example.test/ltv-agent", fetcher },
  );

  assert.equal(result.total, 1050);
  assert.deepEqual(JSON.parse(requestBody), {
    message: "Patients pay K350 and visit three times a year.",
    history: [{ kind: "bot", text: "Tell me about your business." }],
  });
});

test("accepts a conversational response while the agent gathers details", async () => {
  const fetcher: FetchLike = async () =>
    Response.json({
      businessType: "",
      avgValue: 0,
      visitsPerYear: 0,
      total: 0,
      salesPitch: "How often does a customer return?",
      isCalculation: false,
    });

  const result = await requestLtvEstimate("I run a salon.", [], { fetcher });
  assert.equal(result.isCalculation, false);
  assert.equal(result.salesPitch, "How often does a customer return?");
});

test("surfaces the Edge Function error body without consuming it twice", async () => {
  const fetcher: FetchLike = async () =>
    Response.json({ error: "Missing server credential" }, { status: 500 });

  await assert.rejects(
    requestLtvEstimate("Hello", [], { fetcher }),
    /API error 500: Missing server credential/,
  );
});

test("rejects malformed successful responses", async () => {
  const fetcher: FetchLike = async () => Response.json({ total: "1050" });

  await assert.rejects(
    requestLtvEstimate("Hello", [], { fetcher }),
    /invalid response/,
  );
});

test("recognizes a repeated result so acknowledgements cannot duplicate its card", () => {
  const estimate: LtvEstimate = {
    businessType: "Barbershop",
    avgValue: 50,
    visitsPerYear: 12,
    total: 600,
    salesPitch: "That is K600 per year.",
    isCalculation: true,
  };
  const history: LtvMessage[] = [
    { kind: "user", text: "I run a barbershop and customers visit monthly." },
    { kind: "result", data: { ...estimate, businessType: "barbershop" } },
    { kind: "user", text: "Nice" },
  ];

  assert.equal(isDuplicateResult(estimate, history), true);
  assert.equal(
    isDuplicateResult({ ...estimate, visitsPerYear: 24, total: 1200 }, history),
    false,
  );
});
