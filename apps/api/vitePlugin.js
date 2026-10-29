import { loadConfig } from './config.js'
import { clientIp, readJsonBody, sendJson } from './http.js'
import { createVisualSearchHandler } from './visualSearchRoute.js'

/**
 * 开发环境：把 /api/* 直接挂到 Vite 中间件上，免去额外进程；
 * 生产环境由 apps/api/server.js 提供同样两个接口。
 */
export function visualSearchPlugin(env = process.env) {
  const config = loadConfig(env)
  const handleVisualSearch = createVisualSearchHandler(config)

  return {
    name: 'pod-visual-search-api',
    configureServer(server) {
      server.middlewares.use('/api/health', (req, res) => {
        sendJson(res, 200, {
          status: 'ok',
          visualSearch: {
            provider: config.mock ? 'mock' : config.openai.apiKey ? 'openai' : 'none',
            model: config.openai.apiKey ? config.openai.model : null
          }
        })
      })

      server.middlewares.use('/api/visual-search', async (req, res) => {
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
      })
    }
  }
}
