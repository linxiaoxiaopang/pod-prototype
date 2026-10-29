const DEFAULT_BASE_URL = 'https://api.openai.com/v1'

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

// 配置集中读取，缺 key 不算启动失败（前端会走本地降级）
export function loadConfig(env = process.env) {
  return {
    port: toInt(env.PORT, 8787),
    staticDir: env.STATIC_DIR || '',
    openai: {
      apiKey: env.OPENAI_API_KEY || '',
      baseUrl: (env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ''),
      model: env.OPENAI_VISION_MODEL || 'gpt-4o-mini',
      timeoutMs: toInt(env.VISUAL_SEARCH_TIMEOUT_MS, 15000)
    },
    mock: env.MOCK_VISION === '1',
    maxImageBytes: toInt(env.VISUAL_SEARCH_MAX_IMAGE_BYTES, 4 * 1024 * 1024),
    rateLimit: {
      windowMs: toInt(env.VISUAL_SEARCH_RATE_WINDOW_MS, 60000),
      max: toInt(env.VISUAL_SEARCH_RATE_MAX, 12)
    }
  }
}
