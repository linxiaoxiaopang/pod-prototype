import { ApiError, badRequest, tooLarge } from './errors.js'
import { analyzeImage } from './visualSearchService.js'

const DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([a-z0-9+/=\s]+)$/i

export function createRateLimiter({ windowMs, max }) {
  const hits = new Map()

  return {
    hit(key) {
      const now = Date.now()
      const bucket = (hits.get(key) || []).filter((time) => now - time < windowMs)
      bucket.push(now)
      hits.set(key, bucket)

      if (hits.size > 500) {
        for (const [entryKey, times] of hits) {
          if (!times.some((time) => now - time < windowMs)) hits.delete(entryKey)
        }
      }

      return bucket.length <= max
    }
  }
}

function parsePayload(body, config) {
  if (!body || typeof body !== 'object') {
    throw badRequest('INVALID_BODY', 'Expected a JSON body with an image data URL')
  }

  const image = typeof body.image === 'string' ? body.image.trim() : ''
  const matched = DATA_URL.exec(image)

  if (!matched) {
    throw badRequest(
      'INVALID_IMAGE',
      'image must be a base64 data URL of type image/jpeg, image/png or image/webp'
    )
  }

  const base64 = matched[2].replace(/\s/g, '')
  const bytes = Math.floor((base64.length * 3) / 4)
  const maxBytes = config.maxImageBytes

  if (bytes > maxBytes) {
    throw tooLarge(`Image is larger than ${Math.round(maxBytes / 1024 / 1024)}MB`)
  }

  return {
    dataUrl: `data:${matched[1].toLowerCase()};base64,${base64}`,
    mime: matched[1].toLowerCase(),
    bytes
  }
}

/**
 * 与传输层无关的处理器：Vite 开发中间件与独立 Node 服务共用。
 * @returns {Promise<{status:number, payload:object}>}
 */
export function createVisualSearchHandler(config) {
  const limiter = createRateLimiter(config.rateLimit)

  return async function handleVisualSearch({ ip = 'unknown', body } = {}) {
    try {
      if (!limiter.hit(ip)) {
        throw new ApiError('RATE_LIMITED', 429, 'Too many visual searches, please retry shortly')
      }

      const payload = parsePayload(body, config)
      const analysis = await analyzeImage(payload, config)

      return { status: 200, payload: analysis }
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: error.status,
          payload: { code: error.code, message: error.message }
        }
      }

      return {
        status: 500,
        payload: { code: 'INTERNAL_ERROR', message: 'Unexpected visual search error' }
      }
    }
  }
}
