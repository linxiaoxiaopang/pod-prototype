import { ApiError } from './errors.js'

export function readJsonBody(req, { limit = 6 * 1024 * 1024 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false

    const fail = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }

    req.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > limit) {
        fail(new ApiError('PAYLOAD_TOO_LARGE', 413, 'Request body is too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })

    req.on('end', () => {
      if (settled) return
      settled = true
      if (!chunks.length) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch (error) {
        reject(new ApiError('INVALID_JSON', 400, 'Request body is not valid JSON'))
      }
    })

    req.on('error', (error) => fail(error))
  })
}

export function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(body)
}

export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim()
  return (req.socket && req.socket.remoteAddress) || 'unknown'
}
