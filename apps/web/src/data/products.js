// 供应商官网产品目录（mock）：以每家供应商官网在售的 productList 词表生成，
// 名称、品类、图形、基础价来自 catalog，价格按供应商的价格水平浮动。
import { suppliers } from './suppliers'
import { supplierDetails } from './supplierDetails'

const catalog = {
  't-shirts': { name: '中性重磅T恤', shape: 'tee', category: 'T恤', price: 14.5, options: 'S–3XL · 12 色' },
  'oversized tees': { name: '落肩宽松T恤', shape: 'tee', category: 'T恤', price: 19.5, options: 'S–2XL · 6 色' },
  'tank tops': { name: '罗纹背心', shape: 'tee', category: '服装', price: 13.2, options: 'S–2XL · 8 色' },
  hoodies: { name: '抓绒套头卫衣', shape: 'hoodie', category: '卫衣', price: 29.9, options: 'S–3XL · 9 色' },
  sweatshirts: { name: '圆领卫衣', shape: 'hoodie', category: '卫衣', price: 26.5, options: 'S–3XL · 7 色' },
  apparel: { name: '日常纯棉T恤', shape: 'tee', category: '服装', price: 15.4, options: 'S–3XL · 10 色' },
  'embroidered apparel': { name: '刺绣Polo衫', shape: 'tee', category: '服装', price: 27.8, options: 'S–2XL · 5 色' },
  'kids apparel': { name: '儿童纯棉T恤', shape: 'tee', category: '服装', price: 12.9, options: '2–12岁 · 6 色' },
  'youth apparel': { name: '青少年圆领T恤', shape: 'tee', category: '服装', price: 13.4, options: '6–14岁 · 6 色' },
  'baby apparel': { name: '婴儿连体衣', shape: 'tee', category: '服装', price: 11.8, options: '0–24个月 · 4 色' },
  leggings: { name: '运动紧身裤', shape: 'pants', category: '服装', price: 22.5, options: 'XS–2XL' },
  shorts: { name: '运动短裤', shape: 'pants', category: '服装', price: 18.2, options: 'S–2XL' },
  sweatpants: { name: '抓绒束脚裤', shape: 'pants', category: '服装', price: 27.4, options: 'S–2XL' },
  sportswear: { name: '训练T恤', shape: 'tee', category: '服装', price: 19.6, options: 'S–2XL' },
  aprons: { name: '帆布厨房围裙', shape: 'tote', category: '家居生活', price: 17.4, options: '均码' },
  socks: { name: '中筒袜', shape: 'soft', category: '配件', price: 9.8, options: 'S/M · L/XL' },
  caps: { name: '棒球帽', shape: 'soft', category: '配件', price: 15.6, options: '均码' },
  beanies: { name: '针织毛线帽', shape: 'soft', category: '配件', price: 13.9, options: '均码' },
  mugs: { name: '11oz 陶瓷马克杯', shape: 'mug', category: '水杯', price: 9.4, options: '11oz / 15oz' },
  tumblers: { name: '真空保温杯', shape: 'mug', category: '水杯', price: 19.9, options: '20oz' },
  'water bottles': { name: '不锈钢运动水壶', shape: 'mug', category: '水杯', price: 21.5, options: '17oz' },
  posters: { name: '哑光艺术海报', shape: 'poster', category: '墙面装饰', price: 12.4, options: 'A3 / A2 / A1', extraDay: true },
  'framed prints': { name: '装裱艺术画', shape: 'poster', category: '墙面装饰', price: 38.9, options: '30 × 40 · 40 × 50', extraDay: true },
  'wall art': { name: '画廊帆布画', shape: 'poster', category: '墙面装饰', price: 34.5, options: '3 种尺寸', extraDay: true },
  canvases: { name: '绷框帆布画', shape: 'poster', category: '墙面装饰', price: 32.9, options: '3 种尺寸', extraDay: true },
  canvas: { name: '画廊帆布', shape: 'poster', category: '墙面装饰', price: 30.8, options: '3 种尺寸', extraDay: true },
  'canvas prints': { name: '帆布装饰画', shape: 'poster', category: '墙面装饰', price: 31.6, options: '3 种尺寸', extraDay: true },
  'acrylic prints': { name: '亚克力照片画', shape: 'poster', category: '墙面装饰', price: 44.2, options: '2 种尺寸', extraDay: true },
  'metal prints': { name: '金属墙画', shape: 'poster', category: '墙面装饰', price: 46.9, options: '2 种尺寸', extraDay: true },
  'wood prints': { name: '木质版画', shape: 'poster', category: '墙面装饰', price: 41.3, options: '2 种尺寸', extraDay: true },
  'photo panels': { name: '照片挂板', shape: 'poster', category: '墙面装饰', price: 28.4, options: '3 种尺寸', extraDay: true },
  tapestries: { name: '编织挂毯', shape: 'soft', category: '墙面装饰', price: 26.7, options: '2 种尺寸', extraDay: true },
  puzzles: { name: '定制拼图', shape: 'soft', category: '礼品', price: 16.8, options: '252 / 500 片' },
  stickers: { name: '乙烯基贴纸套装', shape: 'soft', category: '配件', price: 4.9, options: '10 张装' },
  ornaments: { name: '陶瓷挂饰', shape: 'soft', category: '礼品', price: 11.5, options: '均码' },
  jewelry: { name: '刻字项链', shape: 'soft', category: '配件', price: 24.9, options: '均码' },
  'custom labels': { name: '定制织标', shape: 'soft', category: '配件', price: 6.5, options: '25 个装' },
  'embroidered patches': { name: '刺绣布贴', shape: 'soft', category: '配件', price: 7.8, options: '均码' },
  'tote bags': { name: '帆布托特包', shape: 'tote', category: '配件', price: 12.9, options: '38 × 42 cm' },
  totes: { name: '日常托特包', shape: 'tote', category: '配件', price: 13.6, options: '38 × 42 cm' },
  bags: { name: '周末旅行包', shape: 'tote', category: '配件', price: 34.8, options: '均码' },
  'phone cases': { name: '超薄手机壳', shape: 'case', category: '配件', price: 15.4, options: 'iPhone / 安卓' },
  pillows: { name: '装饰抱枕', shape: 'soft', category: '家居生活', price: 22.9, options: '40 × 40 cm', extraDay: true },
  blankets: { name: '羊羔绒毯', shape: 'soft', category: '家居生活', price: 39.5, options: '130 × 150 cm', extraDay: true },
  'baby swaddles': { name: '有机棉婴儿包巾', shape: 'soft', category: '家居生活', price: 18.9, options: '均码' },
  notebooks: { name: '硬壳笔记本', shape: 'soft', category: '礼品', price: 14.9, options: 'A5' },
  stationery: { name: '文具套装', shape: 'soft', category: '礼品', price: 12.4, options: '5 件装' }
}

// 分类（中文）→ catalog 词表 key，仅用于供应商未配置 productList 时的回退
const categoryNoun = {
  T恤: 't-shirts',
  卫衣: 'hoodies',
  服装: 'apparel',
  水杯: 'mugs',
  墙面装饰: 'posters',
  配件: 'phone cases',
  家居生活: 'pillows',
  礼品: 'stickers'
}

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const round = (value) => Math.round(value * 100) / 100

function buildProducts() {
  const list = []

  suppliers.forEach((supplier) => {
    const detail = supplierDetails[supplier.id] || {}
    const nouns =
      detail.productList && detail.productList.length
        ? detail.productList
        : supplier.categories.map((item) => categoryNoun[item]).filter(Boolean)
    const factor = 0.8 + (supplier.priceFrom || 12) / 30

    nouns.forEach((noun, index) => {
      const template = catalog[noun]
      if (!template) return

      list.push({
        id: `${supplier.id}-${slugify(noun)}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierWebsite: supplier.website,
        accent: supplier.accent,
        website: supplier.website,
        name: template.name,
        variant: noun,
        category: template.category,
        shape: template.shape,
        options: template.options,
        price: round(template.price * factor),
        productionDays: supplier.productionDays + (template.extraDay ? 1 : 0),
        badge: index === 0 ? '热销' : index === 4 ? '新品' : ''
      })
    })
  })

  return list
}

export const products = buildProducts()

export const productById = (id) => products.find((item) => item.id === id) || null

// 把 catalog 词表 key（英文 noun）映射为展示用的中文名称
export const variantName = (noun) => (catalog[noun] ? catalog[noun].name : noun)

export const productsBySupplier = (supplierId) =>
  products.filter((item) => item.supplierId === supplierId)

export const productCategories = (list) => {
  const seen = []
  list.forEach((item) => {
    if (!seen.includes(item.category)) seen.push(item.category)
  })
  return seen
}

export const productSortOptions = [
  { value: 'featured', label: '推荐优先' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'name', label: '名称 A–Z' }
]

export const searchProducts = (list, { keyword = '', category = '' } = {}) => {
  const value = keyword.trim().toLowerCase()
  return list.filter((item) => {
    if (category && item.category !== category) return false
    if (!value) return true
    return (
      item.name.toLowerCase().includes(value) ||
      item.category.toLowerCase().includes(value) ||
      item.variant.toLowerCase().includes(value)
    )
  })
}

// 搜索提交时使用：优先名称匹配，其次品类匹配，并取价格最低的一家
export const bestProductMatch = (keyword) => {
  const value = (keyword || '').trim().toLowerCase()
  if (!value) return null

  const byName = products.filter((item) => item.name.toLowerCase().includes(value))
  const pool = byName.length
    ? byName
    : products.filter((item) => item.category.toLowerCase().includes(value))

  return pool.reduce((best, item) => (!best || item.price < best.price ? item : best), null)
}

export const sortProducts = (list, sort) => {
  const sorted = [...list]
  if (sort === 'price-asc') return sorted.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return sorted.sort((a, b) => b.price - a.price)
  if (sort === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name))
  return sorted.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)))
}
