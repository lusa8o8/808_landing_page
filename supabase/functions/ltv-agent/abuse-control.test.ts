import assert from 'node:assert/strict'
import test from 'node:test'

import {
  consumeRateLimit,
  getClientAddress,
  getSupabaseSecretKey,
  hashClientAddress,
  isOriginAllowed,
  readAllowedOrigins,
  readRateLimitConfig,
} from './abuse-control.ts'

test('uses bounded defaults for missing or invalid quota configuration', () => {
  const values: Record<string, string> = {
    LTV_RATE_LIMIT_BURST: '-1',
    LTV_RATE_LIMIT_BURST_SECONDS: '999999',
    LTV_RATE_LIMIT_DAILY: 'not-a-number',
    LTV_RATE_LIMIT_GLOBAL_DAILY: '750',
  }

  assert.deepEqual(readRateLimitConfig((name) => values[name]), {
    clientBurstLimit: 20,
    clientBurstSeconds: 600,
    clientDailyLimit: 60,
    globalDailyLimit: 750,
  })
})

test('allows only configured browser origins while preserving non-browser clients', () => {
  const origins = readAllowedOrigins('https://808.example, http://localhost:3000')
  assert.equal(isOriginAllowed('https://808.example', origins), true)
  assert.equal(isOriginAllowed('https://embed.attacker', origins), false)
  assert.equal(isOriginAllowed(null, origins), true)
})

test('extracts the first forwarded address and hashes it without retaining the address', async () => {
  const request = new Request('https://example.test', {
    headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
  })
  const address = getClientAddress(request)
  const first = await hashClientAddress(address, 'test-salt')
  const second = await hashClientAddress(address, 'test-salt')

  assert.equal(address, '203.0.113.7')
  assert.equal(first, second)
  assert.match(first, /^[a-f0-9]{64}$/)
  assert.equal(first.includes(address), false)
})

test('prefers a named Supabase secret and falls back to the legacy server key', () => {
  assert.equal(getSupabaseSecretKey('{"default":"sb_secret_test"}', 'legacy'), 'sb_secret_test')
  assert.equal(getSupabaseSecretKey('invalid', 'legacy'), 'legacy')
})

test('maps the atomic quota RPC response and sends only the client hash', async () => {
  let requestBody = ''
  const fetcher: typeof fetch = async (_input, init) => {
    requestBody = String(init?.body)
    return Response.json([
      { allowed: false, retry_after_seconds: 42.1, scope: 'client_burst' },
    ])
  }

  const decision = await consumeRateLimit({
    supabaseUrl: 'https://project.supabase.co',
    supabaseSecretKey: 'server-only',
    clientHash: 'a'.repeat(64),
    config: {
      clientBurstLimit: 20,
      clientBurstSeconds: 600,
      clientDailyLimit: 60,
      globalDailyLimit: 500,
    },
    fetcher,
  })

  assert.deepEqual(decision, {
    allowed: false,
    retryAfterSeconds: 43,
    scope: 'client_burst',
  })
  assert.deepEqual(JSON.parse(requestBody), {
    p_client_hash: 'a'.repeat(64),
    p_client_burst_limit: 20,
    p_client_burst_seconds: 600,
    p_client_daily_limit: 60,
    p_global_daily_limit: 500,
  })
})

test('fails closed when the quota RPC is unavailable', async () => {
  const fetcher: typeof fetch = async () =>
    Response.json({ message: 'unavailable' }, { status: 503 })

  await assert.rejects(
    consumeRateLimit({
      supabaseUrl: 'https://project.supabase.co',
      supabaseSecretKey: 'server-only',
      clientHash: 'b'.repeat(64),
      config: {
        clientBurstLimit: 20,
        clientBurstSeconds: 600,
        clientDailyLimit: 60,
        globalDailyLimit: 500,
      },
      fetcher,
    }),
    /Rate-limit RPC returned 503/,
  )
})
