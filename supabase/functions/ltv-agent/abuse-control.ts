export const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

export type RateLimitConfig = {
  clientBurstLimit: number
  clientBurstSeconds: number
  clientDailyLimit: number
  globalDailyLimit: number
}

export type RateLimitDecision = {
  allowed: boolean
  retryAfterSeconds: number
  scope: string
}

export function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  maximum: number,
) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 && parsed <= maximum ? parsed : fallback
}

export function readRateLimitConfig(
  read: (name: string) => string | undefined,
): RateLimitConfig {
  return {
    clientBurstLimit: parsePositiveInteger(read('LTV_RATE_LIMIT_BURST'), 20, 1_000),
    clientBurstSeconds: parsePositiveInteger(
      read('LTV_RATE_LIMIT_BURST_SECONDS'),
      600,
      86_400,
    ),
    clientDailyLimit: parsePositiveInteger(read('LTV_RATE_LIMIT_DAILY'), 60, 10_000),
    globalDailyLimit: parsePositiveInteger(
      read('LTV_RATE_LIMIT_GLOBAL_DAILY'),
      500,
      1_000_000,
    ),
  }
}

export function readAllowedOrigins(value: string | undefined) {
  const configured = value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return new Set(configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS)
}

export function isOriginAllowed(origin: string | null, allowedOrigins: Set<string>) {
  return origin === null || allowedOrigins.has(origin)
}

export function getClientAddress(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip')?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

export async function hashClientAddress(address: string, salt: string) {
  const bytes = new TextEncoder().encode(`${salt}\n${address}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function getSupabaseSecretKey(
  namedSecrets: string | undefined,
  legacySecret: string | undefined,
) {
  if (namedSecrets) {
    try {
      const parsed = JSON.parse(namedSecrets) as Record<string, unknown>
      if (typeof parsed.default === 'string' && parsed.default) return parsed.default
    } catch {
      // Fall through to the legacy secret during the key migration period.
    }
  }
  return legacySecret || ''
}

export async function consumeRateLimit(options: {
  supabaseUrl: string
  supabaseSecretKey: string
  clientHash: string
  config: RateLimitConfig
  fetcher?: typeof fetch
}): Promise<RateLimitDecision> {
  const fetcher = options.fetcher || fetch
  const response = await fetcher(
    `${options.supabaseUrl}/rest/v1/rpc/consume_ltv_rate_limit`,
    {
      method: 'POST',
      headers: {
        apikey: options.supabaseSecretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_client_hash: options.clientHash,
        p_client_burst_limit: options.config.clientBurstLimit,
        p_client_burst_seconds: options.config.clientBurstSeconds,
        p_client_daily_limit: options.config.clientDailyLimit,
        p_global_daily_limit: options.config.globalDailyLimit,
      }),
      signal: AbortSignal.timeout(3_000),
    },
  )

  if (!response.ok) throw new Error(`Rate-limit RPC returned ${response.status}`)

  const body: unknown = await response.json()
  const decision = Array.isArray(body) ? body[0] : undefined
  if (
    !decision ||
    typeof decision !== 'object' ||
    typeof decision.allowed !== 'boolean' ||
    typeof decision.retry_after_seconds !== 'number' ||
    typeof decision.scope !== 'string'
  ) {
    throw new Error('Rate-limit RPC returned an invalid response')
  }

  return {
    allowed: decision.allowed,
    retryAfterSeconds: Math.max(0, Math.ceil(decision.retry_after_seconds)),
    scope: decision.scope,
  }
}
