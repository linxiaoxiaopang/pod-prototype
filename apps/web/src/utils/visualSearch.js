import { products } from '@/data/products'

const ENDPOINT = import.meta.env.VITE_VISUAL_SEARCH_ENDPOINT || '/api/visual-search'
const REQUEST_TIMEOUT = 18000

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const hexToRgb = (hex) => {
  const value = String(hex || '').replace('#', '')
  if (value.length !== 6) return null
  const int = Number.parseInt(value, 16)
  if (!Number.isFinite(int)) return null
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`

export const colorDistance = (hexA, hexB) => {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  if (!a || !b) return 1
  const dr = (a.r - b.r) / 255
  const dg = (a.g - b.g) / 255
  const db = (a.b - b.b) / 255
  return clamp(Math.sqrt(dr * dr + dg * dg + db * db) / Math.sqrt(3), 0, 1)
}

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('无法读取图片文件，请重新选择'))
    reader.readAsDataURL(file)
  })

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片解析失败，请换一张再试'))
    image.src = src
  })

function drawScaled(image, maxSize) {
  const ratio = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio))
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

// 压缩到最长边 1024px 的 JPEG，另存 320px 缩略图用于结果页展示
export async function prepareImage(file, { maxSize = 1024, quality = 0.82, thumbSize = 320 } = {}) {
  if (!file || !/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    throw new Error('请上传 JPG、PNG 或 WebP 格式的图片')
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('图片不能超过 12MB')
  }

  const source = await readFile(file)
  const image = await loadImage(source)
  const dataUrl = drawScaled(image, maxSize).toDataURL('image/jpeg', quality)
  const thumb = drawScaled(image, thumbSize).toDataURL('image/jpeg', 0.7)
  const rgb = await sampleDominantColor(image)

  return {
    dataUrl,
    thumb,
    color: rgb ? { hex: rgbToHex(rgb), rgb } : null,
    width: image.naturalWidth,
    height: image.naturalHeight,
    mime: 'image/jpeg'
  }
}

// 主色采样：量化到 32 级色桶，过滤极白/极黑像素后取最大桶均值
export function sampleDominantColor(image) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, 32, 32)
  const { data } = context.getImageData(0, 0, 32, 32)

  const buckets = new Map()
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]
    if (alpha < 200) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r > 245 && g > 245 && b > 245) continue
    if (r < 12 && g < 12 && b < 12) continue
    const key = `${r >> 5}-${g >> 5}-${b >> 5}`
    const bucket = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 }
    bucket.count += 1
    bucket.r += r
    bucket.g += g
    bucket.b += b
    buckets.set(key, bucket)
  }

  if (!buckets.size) return null

  const best = [...buckets.values()].sort((a, b) => b.count - a.count)[0]
  return {
    r: Math.round(best.r / best.count),
    g: Math.round(best.g / best.count),
    b: Math.round(best.b / best.count)
  }
}

// 后端返回 { provider, model, tookMs, result: {...} }；同时兼容扁平结构
function normalizeAnalysis(payload) {
  if (!payload || typeof payload !== 'object') return null

  const source = payload.result && typeof payload.result === 'object' ? payload.result : payload
  const categories = Array.isArray(source.categories) ? source.categories.filter(Boolean) : []
  const keywords = Array.isArray(source.keywords) ? source.keywords.filter(Boolean) : []
  const colors = Array.isArray(source.colors) ? source.colors.filter((item) => item && item.hex) : []

  if (!categories.length && !keywords.length && !colors.length) return null

  const confidence = Number(source.confidence)

  return {
    categories,
    keywords,
    colors,
    style: source.style || '',
    subject: source.subject || '',
    confidence: Number.isFinite(confidence) ? clamp(confidence, 0, 1) : 0.5,
    provider: payload.provider || 'server',
    model: payload.model || '',
    tookMs: Number(payload.tookMs) || 0
  }
}

export async function requestVisualAnalysis({ dataUrl }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ image: dataUrl })
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const error = new Error((payload && payload.message) || `Visual search failed (${response.status})`)
      error.code = (payload && payload.code) || `HTTP_${response.status}`
      error.status = response.status
      throw error
    }

    const analysis = normalizeAnalysis(payload)

    // 开发服务器未挂载接口时会回退成 index.html，这里统一按空结果处理以便本地降级
    if (!analysis) {
      const error = new Error((payload && payload.message) || 'Visual search returned no usable result')
      error.code = 'EMPTY_ANALYSIS'
      throw error
    }

    return analysis
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Visual search timed out')
      timeoutError.code = 'CLIENT_TIMEOUT'
      throw timeoutError
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

// 本地降级：按图片主色最接近的产品推断品类与关键词
export function buildLocalAnalysis({ color, aspectRatio = 1 }) {
  const accentPool = products.map((product) => ({
    product,
    distance: color ? colorDistance(color.hex, product.accent) : 1
  }))

  accentPool.sort((a, b) => a.distance - b.distance)
  const nearest = accentPool[0]
  const category = nearest ? nearest.product.category : '服装'

  return {
    categories: [category],
    keywords: nearest ? [nearest.product.variant] : [],
    colors: color ? [{ hex: color.hex, name: '' }] : [],
    style: aspectRatio > 1.15 ? '横版图片' : aspectRatio < 0.87 ? '竖版图片' : '方版图片',
    subject: '',
    confidence: 0.32,
    provider: 'local'
  }
}

export function scoreProduct(product, analysis) {
  const categories = analysis.categories || []
  const keywords = analysis.keywords || []
  const colors = analysis.colors || []
  const reasons = []
  // 品类与关键词可能同义（如 "T-Shirts" / "t-shirts"），展示时去重
  const addReason = (value) => {
    const label = String(value || '').trim()
    if (!label) return
    if (reasons.some((item) => item.toLowerCase() === label.toLowerCase())) return
    reasons.push(label)
  }
  let score = 0

  if (categories.includes(product.category)) {
    score += 55
    addReason(product.category)
  }

  const haystack = `${product.name} ${product.variant}`.toLowerCase()
  keywords.forEach((keyword) => {
    const value = String(keyword || '').toLowerCase()
    if (value.length > 2 && haystack.includes(value)) {
      score += 22
      addReason(keyword)
    }
  })

  if (colors.length) {
    const best = colors.reduce(
      (min, color) => Math.min(min, colorDistance(product.accent, color.hex)),
      1
    )
    score += 18 * (1 - best)
  }

  return { product, score, reasons }
}

// 原始分无上限（关键词可叠加），统一按本轮最强匹配归一，避免所有条目都顶到 99%
const percentOf = (value, ceiling) => clamp(Math.round((value / (ceiling || 1)) * 100), 35, 99)

export function scoreSupplierProducts(list, analysis) {
  const scored = list
    .map((product) => scoreProduct(product, analysis))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const ceiling = scored.length ? scored[0].score : 110

  return scored.map((entry) => ({
    ...entry,
    percent: percentOf(entry.score, ceiling),
    relative: Math.round((entry.score / ceiling) * 100)
  }))
}

export function rankSuppliers(analysis, { limit = 3 } = {}) {
  const bySupplier = new Map()

  products.forEach((product) => {
    const entry = scoreProduct(product, analysis)
    if (entry.score <= 0) return
    const bucket = bySupplier.get(product.supplierId) || {
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      accent: product.accent,
      items: []
    }
    bucket.items.push(entry)
    bySupplier.set(product.supplierId, bucket)
  })

  const buckets = [...bySupplier.values()].map((bucket) => {
    const sorted = bucket.items.sort((a, b) => b.score - a.score)
    const [first, second, third] = sorted
    const score = first.score + (second ? second.score * 0.25 : 0) + (third ? third.score * 0.12 : 0)
    return {
      ...bucket,
      items: sorted,
      matchCount: sorted.filter((item) => item.score >= 40).length,
      score
    }
  })

  if (!buckets.length) return []

  const itemCeiling = Math.max(...buckets.map((bucket) => bucket.items[0].score))
  const supplierCeiling = Math.max(...buckets.map((bucket) => bucket.score))

  return buckets
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((bucket) => ({
      ...bucket,
      percent: percentOf(bucket.score, supplierCeiling),
      items: bucket.items
        .slice(0, 3)
        .map((item) => ({ ...item, percent: percentOf(item.score, itemCeiling) }))
    }))
}
