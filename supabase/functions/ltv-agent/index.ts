import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {
  consumeRateLimit,
  getClientAddress,
  getSupabaseSecretKey,
  hashClientAddress,
  isOriginAllowed,
  readAllowedOrigins,
  readRateLimitConfig,
} from './abuse-control.ts'
import { PROMPT_VERSION, SYSTEM_PROMPT } from './prompts/conversation-state-v4.ts'

const MODEL = 'openai/gpt-oss-120b'
const MAX_BODY_BYTES = 32_768
const PROVIDER_TIMEOUT_MS = 12_000

function getCorsHeaders(origin: string | null, allowedOrigins: Set<string>) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Expose-Headers':
      'retry-after, x-ltv-model, x-ltv-prompt-version, x-ltv-provider-attempts, x-ltv-rate-limit-scope, x-ltv-input-tokens, x-ltv-output-tokens, x-ltv-reasoning-tokens, server-timing',
    Vary: 'Origin',
  }
  if (origin && allowedOrigins.has(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

const responseSchema = {
  type: 'object',
  properties: {
    businessType: { type: 'string' },
    avgValue: { type: 'number' },
    visitsPerYear: { type: 'number' },
    total: { type: 'number' },
    salesPitch: { type: 'string' },
    isCalculation: { type: 'boolean' },
  },
  required: [
    'businessType',
    'avgValue',
    'visitsPerYear',
    'total',
    'salesPitch',
    'isCalculation',
  ],
  additionalProperties: false,
}

type HistoryMessage = {
  kind?: unknown
  text?: unknown
  data?: unknown
}

type LtvResponse = {
  businessType: string
  avgValue: number
  visitsPerYear: number
  total: number
  salesPitch: string
  isCalculation: boolean
}

function errorResponse(
  error: string,
  status: number,
  corsHeaders: Record<string, string>,
  extraHeaders?: Record<string, string>,
) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extraHeaders },
  })
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function validateModelResponse(value: unknown): LtvResponse {
  if (!value || typeof value !== 'object') {
    throw new Error('Model response is not an object')
  }

  const candidate = value as Partial<LtvResponse>
  if (
    typeof candidate.businessType !== 'string' ||
    typeof candidate.salesPitch !== 'string' ||
    typeof candidate.isCalculation !== 'boolean' ||
    !isNonNegativeFiniteNumber(candidate.avgValue) ||
    !isNonNegativeFiniteNumber(candidate.visitsPerYear) ||
    !isNonNegativeFiniteNumber(candidate.total)
  ) {
    throw new Error('Model response does not match the LTV contract')
  }

  if (!candidate.isCalculation) {
    return {
      businessType: candidate.businessType.trim(),
      avgValue: 0,
      visitsPerYear: 0,
      total: 0,
      salesPitch: candidate.salesPitch.trim(),
      isCalculation: false,
    }
  }

  if (
    !candidate.businessType.trim() ||
    !candidate.salesPitch.trim() ||
    candidate.avgValue <= 0 ||
    candidate.visitsPerYear <= 0
  ) {
    throw new Error('Calculation inputs must be greater than zero')
  }

  return {
    businessType: candidate.businessType.trim(),
    avgValue: candidate.avgValue,
    visitsPerYear: candidate.visitsPerYear,
    total: candidate.avgValue * candidate.visitsPerYear,
    salesPitch: candidate.salesPitch.trim(),
    isCalculation: true,
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin')
  const allowedOrigins = readAllowedOrigins(Deno.env.get('LTV_ALLOWED_ORIGINS'))
  const corsHeaders = getCorsHeaders(origin, allowedOrigins)

  if (!isOriginAllowed(origin, allowedOrigins)) {
    return errorResponse('Origin not allowed', 403, corsHeaders)
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405, corsHeaders)
  }

  try {
    const declaredLength = Number(req.headers.get('content-length') || 0)
    if (declaredLength > MAX_BODY_BYTES) {
      return errorResponse('Request body is too large', 413, corsHeaders)
    }

    const requestText = await req.text()
    if (new TextEncoder().encode(requestText).byteLength > MAX_BODY_BYTES) {
      return errorResponse('Request body is too large', 413, corsHeaders)
    }

    let decoded: unknown
    try {
      decoded = JSON.parse(requestText)
    } catch {
      return errorResponse('Request body must be valid JSON', 400, corsHeaders)
    }

    const payload = decoded && typeof decoded === 'object'
      ? decoded as { message?: unknown; history?: unknown }
      : {}

    const message = typeof payload?.message === 'string' ? payload.message.trim() : ''

    if (!message) {
      return errorResponse('A message is required', 400, corsHeaders)
    }

    if (message.length > 2_000) {
      return errorResponse('Message is too long', 400, corsHeaders)
    }

    const apiKey = Deno.env.get('GROQ_API_KEY')
    const rateLimitSalt = Deno.env.get('LTV_RATE_LIMIT_SALT')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseSecretKey = getSupabaseSecretKey(
      Deno.env.get('SUPABASE_SECRET_KEYS'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    )
    if (!apiKey || !rateLimitSalt || !supabaseUrl || !supabaseSecretKey) {
      console.error('LTV function is missing required server configuration')
      return errorResponse('The LTV service is temporarily unavailable', 503, corsHeaders)
    }

    let rateLimitDecision
    try {
      const clientHash = await hashClientAddress(getClientAddress(req), rateLimitSalt)
      rateLimitDecision = await consumeRateLimit({
        supabaseUrl,
        supabaseSecretKey,
        clientHash,
        config: readRateLimitConfig((name) => Deno.env.get(name)),
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error(`LTV rate limiter unavailable: ${message}`)
      return errorResponse('The LTV service is temporarily unavailable', 503, corsHeaders)
    }

    if (!rateLimitDecision.allowed) {
      console.warn(`LTV quota denied scope=${rateLimitDecision.scope}`)
      return errorResponse('Too many requests; please try again later', 429, corsHeaders, {
        'Retry-After': String(rateLimitDecision.retryAfterSeconds),
        'x-ltv-rate-limit-scope': rateLimitDecision.scope,
      })
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    if (Array.isArray(payload.history)) {
      const history = (payload.history as HistoryMessage[]).slice(-12)

      for (const entry of history) {
        if (
          (entry?.kind === 'user' || entry?.kind === 'bot') &&
          typeof entry.text === 'string' &&
          entry.text.trim().length > 0
        ) {
          messages.push({
            role: entry.kind === 'user' ? 'user' : 'assistant',
            content: entry.text.trim().slice(0, 2_000),
          })
          continue
        }

        if (entry?.kind === 'result' && entry.data && typeof entry.data === 'object') {
          const result = entry.data as Partial<LtvResponse>
          if (
            typeof result.businessType === 'string' &&
            result.businessType.trim() &&
            isNonNegativeFiniteNumber(result.avgValue) &&
            isNonNegativeFiniteNumber(result.visitsPerYear) &&
            isNonNegativeFiniteNumber(result.total)
          ) {
            messages.push({
              role: 'assistant',
              content: `Application state: a result card was shown with ${JSON.stringify({
                businessType: result.businessType.trim().slice(0, 200),
                avgValue: result.avgValue,
                visitsPerYear: result.visitsPerYear,
                total: result.total,
              })}.`,
            })
          }
        }
      }
    }

    messages.push({ role: 'user', content: message })

    const requestBody = JSON.stringify({
      model: MODEL,
      messages,
      max_completion_tokens: 400,
      reasoning_effort: 'low',
      include_reasoning: false,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ltv_response',
          strict: true,
          schema: responseSchema,
        },
      },
    })

    const providerStartedAt = performance.now()
    let response: Response | undefined
    let providerAttempts = 0
    let providerErrorText = ''

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      providerAttempts = attempt
      try {
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: requestBody,
          signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
        })
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          console.error(`Groq request timed out attempt=${attempt}`)
          return errorResponse('The LTV service timed out; please retry shortly', 504, corsHeaders)
        }
        throw error
      }

      if (response.ok) break

      providerErrorText = await response.text()
      let providerErrorCode = ''
      let providerRequestId = ''
      try {
        const providerError = JSON.parse(providerErrorText)
        providerErrorCode = providerError?.error?.code ?? ''
        providerRequestId = providerError?.request_id ?? ''
      } catch {
        // The public response remains generic even if the provider returns a non-JSON error.
      }

      console.error(
        `Groq API error ${response.status} code=${providerErrorCode || 'unknown'} request=${providerRequestId || 'unknown'} attempt=${attempt}`,
      )

      if (attempt === 1 && response.status === 400 && providerErrorCode === 'json_validate_failed') {
        continue
      }
      break
    }

    if (!response) {
      throw new Error('Groq request did not produce a response')
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after')
        return errorResponse(
          'The LTV service is busy; please retry shortly',
          429,
          corsHeaders,
          retryAfter ? { 'Retry-After': retryAfter } : undefined,
        )
      }
      return errorResponse('The LTV service is temporarily unavailable', 502, corsHeaders)
    }

    const completion = await response.json()
    const content = completion?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content) {
      throw new Error('Groq response did not contain message content')
    }

    const result = validateModelResponse(JSON.parse(content))
    const usage = completion?.usage ?? {}
    const responseHeaders = new Headers({
      ...corsHeaders,
      'Content-Type': 'application/json',
    })
    responseHeaders.set('x-ltv-model', MODEL)
    responseHeaders.set('x-ltv-prompt-version', PROMPT_VERSION)
    responseHeaders.set('x-ltv-provider-attempts', String(providerAttempts))
    responseHeaders.set('x-ltv-rate-limit-scope', rateLimitDecision.scope)
    responseHeaders.set('x-ltv-input-tokens', String(usage.prompt_tokens ?? ''))
    responseHeaders.set('x-ltv-output-tokens', String(usage.completion_tokens ?? ''))
    responseHeaders.set(
      'x-ltv-reasoning-tokens',
      String(usage.completion_tokens_details?.reasoning_tokens ?? ''),
    )
    responseHeaders.set('server-timing', `groq;dur=${(performance.now() - providerStartedAt).toFixed(1)}`)

    return new Response(JSON.stringify(result), { headers: responseHeaders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`LTV function error: ${message}`)
    return errorResponse('The LTV service returned an invalid response', 502, corsHeaders)
  }
})
