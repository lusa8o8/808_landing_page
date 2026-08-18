export interface LtvEstimate {
  businessType: string;
  avgValue: number;
  visitsPerYear: number;
  total: number;
  salesPitch?: string;
  isCalculation?: boolean;
}

export type LtvMessage =
  | { kind: "bot"; text: string }
  | { kind: "user"; text: string }
  | { kind: "result"; data: LtvEstimate };

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

const LOCAL_FUNCTION_URL = "http://localhost:54321/functions/v1/ltv-agent";

function isLtvEstimate(value: unknown): value is LtvEstimate {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<LtvEstimate>;
  return (
    typeof candidate.businessType === "string" &&
    typeof candidate.avgValue === "number" &&
    typeof candidate.visitsPerYear === "number" &&
    typeof candidate.total === "number" &&
    typeof candidate.salesPitch === "string" &&
    typeof candidate.isCalculation === "boolean"
  );
}

export function isDuplicateResult(
  estimate: LtvEstimate,
  history: LtvMessage[],
) {
  const previous = history.findLast(
    (message): message is Extract<LtvMessage, { kind: "result" }> =>
      message.kind === "result",
  );

  return Boolean(
    previous &&
      previous.data.businessType.trim().toLocaleLowerCase() ===
        estimate.businessType.trim().toLocaleLowerCase() &&
      previous.data.avgValue === estimate.avgValue &&
      previous.data.visitsPerYear === estimate.visitsPerYear &&
      previous.data.total === estimate.total,
  );
}

async function getErrorMessage(response: Response) {
  const fallback = response.statusText || "Unknown error";
  const body = await response.text();

  if (!body) return fallback;

  try {
    const parsed = JSON.parse(body) as { error?: unknown };
    return typeof parsed.error === "string" ? parsed.error : body;
  } catch {
    return body;
  }
}

export async function requestLtvEstimate(
  message: string,
  history: LtvMessage[],
  options: {
    endpoint?: string;
    fetcher?: FetchLike;
  } = {},
): Promise<LtvEstimate> {
  const endpoint = options.endpoint || LOCAL_FUNCTION_URL;
  const fetcher = options.fetcher || fetch;
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await getErrorMessage(response)}`);
  }

  const data: unknown = await response.json();
  if (!isLtvEstimate(data)) {
    throw new Error("The LTV service returned an invalid response.");
  }

  return data;
}
