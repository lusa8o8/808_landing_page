import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()
    const apiKey = Deno.env.get('VITE_ANTHROPIC_API_KEY')

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing VITE_ANTHROPIC_API_KEY secret' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = `You are an expert sales consultant for "808 Digital Systems", an agency in Lusaka that builds no-nonsense, high-conversion booking infrastructure and local SEO.
Your goal is to converse with the user and calculate their Annual Client Value (what one customer is worth to them in a single year) to show them how much money they are losing.

To calculate this, you need:
1. Business Type (e.g. salon, clinic, lodge)
2. Average spend per visit (in Zambian Kwacha, K)
3. Average visits per year (how many times they return in a single year)

Converse naturally. If they just say hello or 'hi', welcome them and ask what business they run.
If they tell you the business but no numbers, ask for the numbers. Give them examples (e.g. "For a dental clinic, a client might spend K350 per visit and return 2 times a year...").
ONLY calculate the LTV and return the calculation card once you have enough details to estimate these values.

You MUST return a raw JSON object exactly matching this schema:
{
  "businessType": "string",
  "avgValue": number,
  "visitsPerYear": number,
  "total": number,
  "salesPitch": "string",
  "isCalculation": boolean
}

If you are still gathering information, set "isCalculation" to false, "salesPitch" to your friendly conversational reply, and set all numeric fields to 0.
If you have enough information to calculate the Annual Value, set "isCalculation" to true, "total" to (avgValue * visitsPerYear), and "salesPitch" to a short, punchy paragraph explaining that the 'total' is what they actually lose per year if a client leaves their poorly optimized Facebook page without booking, and that 808 Digital Systems builds the infrastructure to stop that bleed. Use Zambian Kwacha (K). Don't use markdown in the salesPitch.`;

    const anthropicMessages = []
    if (history && Array.isArray(history)) {
      history.forEach((m) => {
        if (m.kind === 'user') {
          anthropicMessages.push({ role: 'user', content: m.text })
        } else if (m.kind === 'bot') {
          anthropicMessages.push({ role: 'assistant', content: m.text })
        }
      })
    }
    anthropicMessages.push({ role: 'user', content: message })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 400,
        system: systemPrompt,
        messages: anthropicMessages,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${errText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const json = await response.json()
    const textContent = json.content[0].text
    const match = textContent.match(/\{[\s\S]*\}/)

    if (!match) {
      return new Response(
        JSON.stringify({ error: 'No JSON found in response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(match[0], {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
