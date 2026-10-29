import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from './config.js'
import { clientIp, readJsonBody, sendJson } from './http.js'
import { createVisualSearchHandler } from './visualSearchRoute.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const config = loadConfig(process.env)
const handleVisualSearch = createVisualSearchHandler(config)

const staticDir = config.staticDir
  ? path.resolve(config.staticDir)
  : path.resolve(repoRoot, 'apps/web/dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon'
}

function serveStatic(req, res, pathname) {
  if (!fs.existsSync(staticDir)) {
    sendJson(res, 404, {
      code: 'NO_BUILD',
      message: 'apps/web/dist not found — run `npm run build:web` first'
    })
    return
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const resolved = path.resolve(staticDir, relative)

  if (!resolved.startsWith(staticDir)) {
    sendJson(res, 403, { code: 'FORBIDDEN', message: 'Invalid path' })
    return
  }

  const file = fs.existsSync(resolved) && fs.statSync(resolved).isFile()
    ? resolved
    : path.join(staticDir, 'index.html')

  const ext = path.extname(file).toLowerCase()
  res.statusCode = 200
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=3600')
  fs.createReadStream(file).pipe(res)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const pathname = decodeURIComponent(url.pathname)

  if (pathname === '/api/health') {
    sendJson(res, 200, {
      status: 'ok',
      visualSearch: {
        provider: config.mock ? 'mock' : config.openai.apiKey ? 'openai' : 'none',
        model: config.openai.apiKey ? config.openai.model : null
      }
    })
    return
  }

  if (pathname === '/api/visual-search') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      sendJson(res, 405, { code: 'METHOD_NOT_ALLOWED', message: 'Use POST' })
      return
    }

    try {
      const body = await readJsonBody(req)
      const outcome = await handleVisualSearch({ ip: clientIp(req), body })
      sendJson(res, outcome.status, outcome.payload)
    } catch (error) {
      const status = error && error.status ? error.status : 500
      sendJson(res, status, {
        code: (error && error.code) || 'INTERNAL_ERROR',
        message: (error && error.message) || 'Unexpected error'
      })
    }
    return
  }

  if (pathname.startsWith('/api/')) {
    sendJson(res, 404, { code: 'NOT_FOUND', message: 'Unknown API route' })
    return
  }

  serveStatic(req, res, pathname)
})

server.listen(config.port, () => {
  const provider = config.mock ? 'mock' : config.openai.apiKey ? config.openai.model : 'none (local fallback)'
  console.log(`[pod-api] listening on http://localhost:${config.port} · vision: ${provider}`)
  console.log(`[pod-api] static: ${staticDir}`)
})

const shutdown = () => {
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 3000).unref()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
