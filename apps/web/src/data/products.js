// 供应商官网产品目录（mock）：以每家供应商官网在售的 productList 词表生成，
// 名称、品类、图形、基础价来自 catalog，价格按供应商的价格水平浮动。
import { suppliers, supplierById, categories as supplierCategories } from './suppliers'
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

// 第三方产品页字段模板：模拟从供应商官网产品页采集到的规格与卖点
const categoryProfiles = {
  T恤: {
    enName: 'Unisex Staple T-Shirt',
    brand: 'Bella + Canvas',
    model: '3001',
    material: '100% Airlume 精梳环纺棉',
    weight: '142 g/m² · 4.2 oz',
    fit: '中性直筒版型',
    colorCount: 44,
    colors: ['白色', '黑色', '藏青', '运动灰', '森林绿', '酒红'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    printAreas: ['正面', '背面', '左胸', '右胸', '左袖', '右袖', '领标'],
    production: '2–5 个工作日',
    shippingFrom: '$3.99 起',
    highlights: ['侧缝结构，多次水洗不易变形', '可撕除领标，支持自有品牌', '40+ 颜色与 9 个尺码可选'],
    description:
      '中性直筒版型，男女同款，适合团队定制与零售上架；面料克重适中，印花还原度高，是 POD 目录里最常被选中的基础款。'
  },
  卫衣: {
    enName: 'Unisex Heavy Blend Hoodie',
    brand: 'Gildan',
    model: '18500',
    material: '80% 棉 / 20% 聚酯纤维',
    weight: '285 g/m² · 8.4 oz',
    fit: '中性落肩版型',
    colorCount: 24,
    colors: ['白色', '黑色', '藏青', '灰色', '森林绿', '酒红'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    printAreas: ['正面', '背面', '左胸', '袖子'],
    production: '2–6 个工作日',
    shippingFrom: '$4.49 起',
    highlights: ['双针车缝领口与袖口', '正面大身平整，适合大幅印花', '内里抓绒，秋冬主推款'],
    description:
      '经典厚磅连帽卫衣，正面与背面留白充足，适合大面积图案；内里抓绒保暖，是秋冬季节销量最稳的 POD 品类之一。'
  },
  服装: {
    enName: 'Everyday Apparel',
    brand: 'AS Colour',
    model: '5001',
    material: '100% 精梳棉',
    weight: '180 g/m²',
    fit: '常规版型',
    colorCount: 18,
    colors: ['白色', '黑色', '米白', '藏青', '灰色', '红色'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    printAreas: ['正面', '背面', '左胸'],
    production: '2–6 个工作日',
    shippingFrom: '$3.99 起',
    highlights: ['柔软水洗手感', '多品类共用同一版型体系', '适合系列化上新'],
    description:
      '覆盖日常穿着的服饰系列，版型稳定、尺码齐全，适合按系列开发周边；不同品类的印花位置与工艺可在供应商目录中逐款确认。'
  },
  水杯: {
    enName: 'Ceramic Mug',
    brand: 'Printful',
    model: '11oz',
    material: '陶瓷（可用洗碗机与微波炉）',
    weight: '11oz / 15oz',
    fit: '常规杯型',
    colorCount: 3,
    colors: ['白色', '黑色', '双色'],
    sizes: ['11oz', '15oz'],
    printAreas: ['正面', '背面', '环绕'],
    production: '2–5 个工作日',
    shippingFrom: '$5.99 起',
    highlights: ['耐高温陶瓷，图案不易脱落', '杯身留白适中，适合照片与文字', '可单个起订，无需备货'],
    description:
      '经典陶瓷杯型，杯身留白适合照片、插画与文字排版；可单件起订，适合礼品与节日场景，运输包装由供应商负责。'
  },
  墙面装饰: {
    enName: 'Matte Art Poster',
    brand: 'Gelato',
    model: 'Premium Matte',
    material: '200 g/m² 哑光艺术纸',
    weight: '200 g/m²',
    fit: '标准画幅',
    colorCount: 0,
    colors: [],
    sizes: ['A3', 'A2', 'A1'],
    printAreas: ['整幅'],
    production: '3–6 个工作日',
    shippingFrom: '$6.49 起',
    highlights: ['哑光纸面，减少反光', '色彩还原稳定，适合摄影作品', '可按尺寸与画框组合销售'],
    description:
      '哑光艺术纸输出，色彩过渡自然，适合摄影、插画与海报类设计；尺寸覆盖常见画幅，可与画框组合成套装销售。'
  },
  配件: {
    enName: 'Everyday Accessory',
    brand: 'Printful',
    model: 'One Size',
    material: '棉帆布 / 皮革 / 硅胶',
    weight: '常规配件',
    fit: '均码',
    colorCount: 8,
    colors: ['黑色', '米白', '藏青'],
    sizes: ['均码', '多种尺寸'],
    printAreas: ['正面', '背面'],
    production: '2–5 个工作日',
    shippingFrom: '$4.29 起',
    highlights: ['小件易起量，适合搭配主推款', '印刷面积较小，适合标识与短句', '包装轻便，跨境运费友好'],
    description:
      '配件类产品客单价低、复购高，适合作为主推款的搭配组合；可选颜色与印刷位置以供应商目录为准。'
  },
  家居生活: {
    enName: 'Home & Living',
    brand: 'Pic The Gift',
    model: 'Standard',
    material: '聚酯纤维 / 羊羔绒 / 有机棉',
    weight: '按品类而定',
    fit: '多尺寸',
    colorCount: 6,
    colors: ['白色', '米白', '灰色'],
    sizes: ['40 × 40 cm', '130 × 150 cm'],
    printAreas: ['正面', '整面'],
    production: '3–7 个工作日',
    shippingFrom: '$7.99 起',
    highlights: ['整面印花，适合照片与拼贴', '家居场景溢价空间更大', '包装体积较大，注意运费核算'],
    description:
      '家居用品以整面印花为主，适合照片、插画与节日主题；生产与运输周期略长，建议提前备好主图与尺寸说明。'
  },
  礼品: {
    enName: 'Custom Gift',
    brand: 'Printful',
    model: 'Standard',
    material: '陶瓷 / 纸品 / 木作',
    weight: '按品类而定',
    fit: '多尺寸',
    colorCount: 5,
    colors: ['白色', '原木色', '黑色'],
    sizes: ['均码', '多种尺寸'],
    printAreas: ['正面', '整面'],
    production: '3–6 个工作日',
    shippingFrom: '$5.49 起',
    highlights: ['节日与纪念场景需求集中', '适合小批量定制与礼盒组合', '可按活动节点做主题上新'],
    description:
      '礼品类适合节点营销与纪念场景，通常以小批量定制为主；不同材质的上色表现差异较大，建议先打样确认。'
  }
}

// 空白衫品牌按供应商区分，模拟各官网实际使用的底衫
const blankBrands = {
  printful: { T恤: ['Bella + Canvas', '3001'], 卫衣: ['Gildan', '18500'] },
  printify: { T恤: ['Gildan', '64000'], 卫衣: ['Gildan', '18500'] },
  'simple-print': { T恤: ['AS Colour', '5001'] },
  gelato: { T恤: ['Stanley/Stella', 'Creator'] },
  spod: { T恤: ['Stanley/Stella', 'Creator'] },
  apliiq: { T恤: ['AS Colour', '5001'] }
}

// 已知的第三方产品页地址（其余回落到供应商官网）
const sourceOverrides = {
  'printful-t-shirts':
    'https://www.printful.com/custom/mens/t-shirts/unisex-staple-t-shirt-bella-canvas-3001',
  'printful-hoodies':
    'https://www.printful.com/custom/mens/hoodies/unisex-heavy-blend-hoodie-gildan-18500'
}

const syncTimes = ['2026-10-29 08:32', '2026-10-29 07:10', '2026-10-28 22:40', '2026-10-28 18:05']

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const round = (value) => Math.round(value * 100) / 100

const siteHost = (url) =>
  String(url || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')

function buildThirdParty(product, supplier, template, index) {
  const profile = categoryProfiles[template.category] || categoryProfiles.礼品
  const rule = (blankBrands[supplier.id] || {})[template.category]
  const brand = rule ? rule[0] : profile.brand
  const model = rule ? rule[1] : profile.model
  const title = `${profile.enName} | ${brand}${model ? ` ${model}` : ''}`

  return {
    site: siteHost(supplier.website),
    url: sourceOverrides[product.id] || supplier.website || '',
    syncedAt: syncTimes[index % syncTimes.length],
    title,
    brand,
    model,
    material: profile.material,
    weight: profile.weight,
    fit: profile.fit,
    sizes: [...profile.sizes],
    colors: [...profile.colors],
    colorCount: profile.colorCount,
    printAreas: [...profile.printAreas],
    production: profile.production,
    shippingFrom: profile.shippingFrom,
    rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    reviews: 1200 + index * 137,
    highlights: [...profile.highlights],
    description: profile.description
  }
}

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

      const product = {
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
      }

      product.thirdParty = buildThirdParty(product, supplier, template, index)
      list.push(product)
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

// 全站分类顺序：沿用供应商分类的定义顺序，未收录的新分类追加到末尾
export const allProductCategories = (list = products) => {
  const seen = productCategories(list)
  const ordered = supplierCategories.filter((cat) => seen.includes(cat))
  const extra = seen.filter((cat) => !supplierCategories.includes(cat))
  return [...ordered, ...extra]
}

// 供应商数据缺失时的兜底对象，避免分组标题渲染崩溃
const fallbackSupplier = (item) => ({
  id: item.supplierId,
  name: item.supplierName,
  monogram: (item.supplierName || '?').slice(0, 2).toUpperCase(),
  accent: item.accent || '#5b4bff',
  location: '',
  productionDays: item.productionDays,
  website: item.supplierWebsite
})

// [{ supplier, products }]，按产品数量降序、同数量按名称排序
export const groupProductsBySupplier = (list) => {
  const map = new Map()
  list.forEach((item) => {
    if (!map.has(item.supplierId)) map.set(item.supplierId, [])
    map.get(item.supplierId).push(item)
  })

  return [...map.values()]
    .map((group) => ({
      supplier: supplierById[group[0].supplierId] || fallbackSupplier(group[0]),
      products: group
    }))
    .sort(
      (a, b) =>
        b.products.length - a.products.length || a.supplier.name.localeCompare(b.supplier.name)
    )
}

// [{ category, products }]，按分类定义顺序排列
export const groupProductsByCategory = (list) => {
  const map = new Map()
  list.forEach((item) => {
    if (!map.has(item.category)) map.set(item.category, [])
    map.get(item.category).push(item)
  })

  return allProductCategories(list)
    .filter((category) => map.has(category))
    .map((category) => ({ category, products: map.get(category) }))
}

// 工厂下拉选项：只保留目录中确实有产品的工厂，并带上数量
export const productSupplierOptions = (list = products) => {
  const counts = new Map()
  list.forEach((item) => {
    counts.set(item.supplierId, (counts.get(item.supplierId) || 0) + 1)
  })

  return suppliers
    .filter((supplier) => counts.has(supplier.id))
    .map((supplier) => ({
      value: supplier.id,
      label: supplier.name,
      count: counts.get(supplier.id)
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

// 页头统计条
export const productOverview = {
  totalProducts: products.length,
  totalSuppliers: new Set(products.map((item) => item.supplierId)).size,
  totalCategories: new Set(products.map((item) => item.category)).size
}

export const productSortOptions = [
  { value: 'featured', label: '推荐优先' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'name', label: '名称 A–Z' }
]

// matchSupplier 默认关闭：供应商详情页内搜索不应命中其它供应商的产品
export const searchProducts = (
  list,
  { keyword = '', category = '', supplierId = '', matchSupplier = false } = {}
) => {
  const value = keyword.trim().toLowerCase()
  return list.filter((item) => {
    if (category && item.category !== category) return false
    if (supplierId && item.supplierId !== supplierId) return false
    if (!value) return true
    return (
      item.name.toLowerCase().includes(value) ||
      item.category.toLowerCase().includes(value) ||
      item.variant.toLowerCase().includes(value) ||
      (matchSupplier && item.supplierName.toLowerCase().includes(value))
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
