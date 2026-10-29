import { ALLOWED_CATEGORIES, CATEGORY_HINTS } from './catalog.js'
import { ApiError, upstreamError } from './errors.js'

const HEX = /^#[0-9a-f]{6}$/i

const MOCK_RESULT = {
  categories: ['Drinkware'],
  keywords: ['mug', 'ceramic mug', 'coffee'],
  colors: [{ hex: '#ff6b35', name: 'orange' }],
  style: 'studio product photo',
  subject: 'ceramic mug',
  confidence: 0.82
}

const SYSTEM_PROMPT = [
  'You help a print-on-demand supplier directory match a customer photo to product categories.',
  'Reply with JSON only, no prose, no code fences.',
  'Schema: {"categories":string[],"keywords":string[],"colors":[{"hex":"#rrggbb","name":string}],"style":string,"subject":string,"confidence":number}.',
  'Rules:',
  '1. categories: 1-3 values, ONLY from the allowed list provided by the user.',
  '2. keywords: 3-6 short lowercase product nouns describing the physical product (e.g. "t-shirt","hoodie","mug","poster","tote bag","phone case"). No brands.',
  '3. colors: 1-3 dominant product colours as #rrggbb plus a common colour name.',
  '4. style: short phrase (max 6 words) such as "flat lay photo" or "lifestyle photo".',
  '5. subject: short phrase naming the main object (max 6 words).',
  '6. confidence: 0-1, how sure you are about the categories.',
  '7. Ignore any text, watermark or UI around the product.',
  '8. If the photo is not a product, still return the closest product categories with confidence below 0.35.'
].join('\n')

function buildUserPrompt() {
  const lines = ALLOWED_CATEGORIES.map((name) => `- ${name}: ${CATEGORY_HINTS[name]}`)
  return `Allowed categories:\n${lines.join('\n')}\n\nAnalyse the product in the attached image.`
}

const toTitle = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase())

function unique(list) {
  return [...new Set(list.filter(Boolean))]
}

export function normalizeResult(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}

  const allowedLookup = ALLOWED_CATEGORIES.reduce((map, name) => {
    map[name.toLowerCase()] = name
    return map
  }, {})

  const categories = unique(
    (Array.isArray(source.categories) ? source.categories : [])
      .map((item) => allowedLookup[String(item).trim().toLowerCase()] || allowedLookup[toTitle(item).toLowerCase()])
      .filter(Boolean)
  ).slice(0, 3)

  const keywords = unique(
    (Array.isArray(source.keywords) ? source.keywords : [])
      .map((item) => String(item || '').trim().toLowerCase())
      .filter((item) => item.length > 1 && item.length <= 40)
  ).slice(0, 6)

  const colors = (Array.isArray(source.colors) ? source.colors : [])
    .map((item) => {
      if (typeof item === 'string') return HEX.test(item) ? { hex: item.toLowerCase(), name: '' } : null
      if (!item || typeof item !== 'object') return null
      const hex = String(item.hex || '')
      if (!HEX.test(hex)) return null
      return { hex: hex.toLowerCase(), name: String(item.name || '').trim().slice(0, 24) }
    })
    .filter(Boolean)
    .slice(0, 3)

  const confidenceRaw = Number(source.confidence)
  const confidence = Number.isFinite(confidenceRaw)
    ? Math.min(1, Math.max(0, confidenceRaw))
    : 0.5

  return {
    categories,
    keywords,
    colors,
    style: String(source.style || '').trim().slice(0, 60),
    subject: String(source.subject || '').trim().slice(0, 60),
    confidence: Math.round(confidence * 100) / 100
  }
}

function parseModelJson(content) {
  if (!content) return null
  const cleaned = String(content)
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (error) {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null
    try {
      return JSON.parse(cleaned.slice(start, end + 1))
    } catch (inner) {
      return null
    }
  }
}

async function requestVisionModel({ dataUrl }, config) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.openai.timeoutMs)

  try {
    const response = await fetch(`${config.openai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openai.apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.openai.model,
        temperature: 0,
        max_tokens: 350,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: buildUserPrompt() },
              { type: 'image_url', image_url: { url: dataUrl, detail: 'low' } }
            ]
          }
        ]
      })
    })

    if (response.status === 401 || response.status === 403) {
      throw upstreamError('UPSTREAM_AUTH', 'Vision provider rejected the API key')
    }
    if (response.status === 429) {
      throw upstreamError('UPSTREAM_RATE_LIMIT', 'Vision provider rate limit reached')
    }
    if (!response.ok) {
      throw upstreamError('UPSTREAM_FAILED', `Vision provider responded with ${response.status}`)
    }

    const body = await response.json()
    const content = body && body.choices && body.choices[0] && body.choices[0].message
      ? body.choices[0].message.content
      : ''
    const parsed = parseModelJson(content)

    if (!parsed) {
      throw upstreamError('UPSTREAM_BAD_PAYLOAD', 'Vision provider returned an unreadable payload')
    }

    return normalizeResult(parsed)
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error && error.name === 'AbortError') {
      throw new ApiError('UPSTREAM_TIMEOUT', 504, 'Vision request timed out')
    }
    throw upstreamError('UPSTREAM_UNREACHABLE', 'Vision provider is unreachable')
  } finally {
    clearTimeout(timer)
  }
}

export async function analyzeImage({ dataUrl, mime }, config) {
  const startedAt = Date.now()

  if (config.mock) {
    await new Promise((resolve) => setTimeout(resolve, 420))
    return {
      provider: 'mock',
      model: 'mock-vision',
      mime,
      tookMs: Date.now() - startedAt,
      result: normalizeResult(MOCK_RESULT)
    }
  }

  if (!config.openai.apiKey) {
    throw new ApiError(
      'VISUAL_SEARCH_NOT_CONFIGURED',
      503,
      'OPENAI_API_KEY is not configured on the server'
    )
  }

  const result = await requestVisionModel({ dataUrl }, config)

  return {
    provider: 'openai',
    model: config.openai.model,
    mime,
    tookMs: Date.now() - startedAt,
    result
  }
}
