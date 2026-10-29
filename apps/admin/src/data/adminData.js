// 后台端演示数据（静态 mock，后续可替换为接口）
export const adminSuppliers = [
  { id: 'simple-print', name: 'Simple Print', location: '美国 · 加州', categories: ['T恤', '卫衣', '服装'], productionDays: 2, integrations: 2, status: 'active', updated: '2026-10-27' },
  { id: 'gelato', name: 'Gelato', location: '挪威 · 奥斯陆', categories: ['T恤', '卫衣', '墙面装饰'], productionDays: 2, integrations: 4, status: 'active', updated: '2026-10-26' },
  { id: 'pic-the-gift', name: 'Pic The Gift', location: '美国 · 圣路易斯', categories: ['服装', '水杯', '家居生活'], productionDays: 3, integrations: 3, status: 'active', updated: '2026-10-24' },
  { id: 'printdropper', name: 'PrintDropper', location: '美国 · 匹兹堡', categories: ['墙面装饰', '家居生活', '礼品'], productionDays: 1, integrations: 5, status: 'active', updated: '2026-10-22' },
  { id: 'printful', name: 'Printful', location: '美国 · 夏洛特', categories: ['T恤', '卫衣', '配件'], productionDays: 2, integrations: 7, status: 'active', updated: '2026-10-21' },
  { id: 'printify', name: 'Printify', location: '美国 · 多佛', categories: ['T恤', '水杯', '礼品'], productionDays: 2, integrations: 7, status: 'active', updated: '2026-10-20' },
  { id: 'podpartner', name: 'PODpartner', location: '中国 · 香港', categories: ['T恤', '服装'], productionDays: 3, integrations: 4, status: 'paused', updated: '2026-10-18' },
  { id: 'spod', name: 'SPOD', location: '德国 · 柏林', categories: ['T恤', '水杯'], productionDays: 2, integrations: 3, status: 'active', updated: '2026-10-17' },
  { id: 'merchize', name: 'Merchize', location: '越南 · 河内', categories: ['T恤', '墙面装饰'], productionDays: 3, integrations: 4, status: 'draft', updated: '2026-10-15' },
  { id: 'gooten', name: 'Gooten', location: '美国 · 纽约', categories: ['墙面装饰', '家居生活'], productionDays: 3, integrations: 4, status: 'active', updated: '2026-10-14' },
  { id: 'teelaunch', name: 'Teelaunch', location: '美国 · 奥斯汀', categories: ['墙面装饰', '礼品'], productionDays: 4, integrations: 4, status: 'draft', updated: '2026-10-12' },
  { id: 'apliiq', name: 'Apliiq', location: '美国 · 洛杉矶', categories: ['T恤', '卫衣'], productionDays: 5, integrations: 2, status: 'active', updated: '2026-10-10' }
]

export const adminProducts = [
  { id: 'simple-print-tshirt', name: '中性重磅T恤', supplier: 'Simple Print', category: 'T恤', price: 16.4, productionDays: 2, status: 'live', updated: '2026-10-27' },
  { id: 'simple-print-hoodie', name: '抓绒套头卫衣', supplier: 'Simple Print', category: '卫衣', price: 32.9, productionDays: 2, status: 'live', updated: '2026-10-26' },
  { id: 'gelato-tee', name: '中性重磅T恤', supplier: 'Gelato', category: 'T恤', price: 17.4, productionDays: 2, status: 'live', updated: '2026-10-26' },
  { id: 'gelato-mug', name: '11oz 陶瓷马克杯', supplier: 'Gelato', category: '水杯', price: 11.3, productionDays: 2, status: 'live', updated: '2026-10-25' },
  { id: 'gelato-poster', name: '哑光艺术海报', supplier: 'Gelato', category: '墙面装饰', price: 14.9, productionDays: 3, status: 'draft', updated: '2026-10-24' },
  { id: 'pic-blanket', name: '羊羔绒毯', supplier: 'Pic The Gift', category: '家居生活', price: 43.6, productionDays: 4, status: 'live', updated: '2026-10-23' },
  { id: 'pic-swatch', name: '有机棉婴儿包巾', supplier: 'Pic The Gift', category: '家居生活', price: 20.9, productionDays: 3, status: 'live', updated: '2026-10-22' },
  { id: 'dropper-poster', name: '画廊帆布画', supplier: 'PrintDropper', category: '墙面装饰', price: 35.8, productionDays: 2, status: 'live', updated: '2026-10-21' },
  { id: 'printful-tee', name: '精梳棉T恤', supplier: 'Printful', category: 'T恤', price: 18.2, productionDays: 2, status: 'live', updated: '2026-10-20' },
  { id: 'printful-hoodie', name: '拉链连帽卫衣', supplier: 'Printful', category: '卫衣', price: 36.5, productionDays: 2, status: 'live', updated: '2026-10-19' },
  { id: 'printify-tote', name: '帆布托特包', supplier: 'Printify', category: '配件', price: 15.4, productionDays: 3, status: 'paused', updated: '2026-10-18' },
  { id: 'printify-case', name: '超薄手机壳', supplier: 'Printify', category: '配件', price: 17.9, productionDays: 2, status: 'live', updated: '2026-10-17' },
  { id: 'spod-tumbler', name: '真空保温杯', supplier: 'SPOD', category: '水杯', price: 22.6, productionDays: 3, status: 'live', updated: '2026-10-16' },
  { id: 'gooten-tapestry', name: '编织挂毯', supplier: 'Gooten', category: '墙面装饰', price: 29.4, productionDays: 4, status: 'draft', updated: '2026-10-14' },
  { id: 'teelaunch-ornament', name: '陶瓷挂饰', supplier: 'Teelaunch', category: '礼品', price: 13.1, productionDays: 4, status: 'draft', updated: '2026-10-12' },
  { id: 'apliiq-joggers', name: '抓绒束脚裤', supplier: 'Apliiq', category: '服装', price: 31.8, productionDays: 5, status: 'paused', updated: '2026-10-10' }
]

// 第三方产品页字段模板（后台展示用，模拟从供应商官网同步的规格与卖点）
const adminSpecProfiles = {
  T恤: {
    brand: 'Bella + Canvas',
    model: '3001',
    material: '100% Airlume 精梳环纺棉',
    weight: '142 g/m² · 4.2 oz',
    fit: '中性直筒版型',
    colorCount: 44,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    colors: ['白色', '黑色', '藏青', '运动灰', '森林绿', '酒红'],
    printAreas: ['正面', '背面', '左胸', '右胸', '左袖', '右袖', '领标'],
    highlights: ['侧缝结构，多次水洗不易变形', '可撕除领标，支持自有品牌', '40+ 颜色与 9 个尺码可选'],
    description: '中性直筒版型，男女同款，适合团队定制与零售上架；印花还原度高，是目录里最常被选中的基础款。'
  },
  卫衣: {
    brand: 'Gildan',
    model: '18500',
    material: '80% 棉 / 20% 聚酯纤维',
    weight: '285 g/m² · 8.4 oz',
    fit: '中性落肩版型',
    colorCount: 24,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: ['白色', '黑色', '藏青', '灰色', '森林绿'],
    printAreas: ['正面', '背面', '左胸', '袖子'],
    highlights: ['双针车缝领口与袖口', '正面大身平整，适合大幅印花', '内里抓绒，秋冬主推款'],
    description: '经典厚磅连帽卫衣，正面与背面留白充足，适合大面积图案；内里抓绒保暖，秋冬销量稳定。'
  },
  服装: {
    brand: 'AS Colour',
    model: '5001',
    material: '100% 精梳棉',
    weight: '180 g/m²',
    fit: '常规版型',
    colorCount: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['黑色', '米白', '藏青', '灰色'],
    printAreas: ['正面', '背面', '左胸'],
    highlights: ['柔软水洗手感', '多品类共用同一版型体系', '适合系列化上新'],
    description: '日常穿着的服饰系列，版型稳定、尺码齐全，适合按系列开发周边；印花位置以供应商目录为准。'
  },
  水杯: {
    brand: 'Printful',
    model: '11oz',
    material: '陶瓷（可用洗碗机与微波炉）',
    weight: '11oz / 15oz',
    fit: '常规杯型',
    colorCount: 3,
    sizes: ['11oz', '15oz'],
    colors: ['白色', '黑色', '双色'],
    printAreas: ['正面', '背面', '环绕'],
    highlights: ['耐高温陶瓷，图案不易脱落', '杯身留白适中，适合照片与文字', '可单个起订，无需备货'],
    description: '经典陶瓷杯型，杯身留白适合照片与文字排版；可单件起订，运输包装由供应商负责。'
  },
  墙面装饰: {
    brand: 'Gelato',
    model: 'Premium Matte',
    material: '200 g/m² 哑光艺术纸 / 帆布',
    weight: '200 g/m²',
    fit: '标准画幅',
    colorCount: 0,
    sizes: ['A3', 'A2', 'A1'],
    colors: [],
    printAreas: ['整幅'],
    highlights: ['哑光纸面，减少反光', '色彩还原稳定，适合摄影作品', '可按尺寸与画框组合销售'],
    description: '哑光材质输出，色彩过渡自然，适合摄影、插画与海报设计；可与画框组合成套装销售。'
  },
  配件: {
    brand: 'Printify',
    model: 'One Size',
    material: '棉帆布 / 皮革 / 硅胶',
    weight: '常规配件',
    fit: '均码',
    colorCount: 8,
    sizes: ['均码', '多种尺寸'],
    colors: ['黑色', '米白', '藏青'],
    printAreas: ['正面', '背面'],
    highlights: ['小件易起量，适合搭配主推款', '印刷面积较小，适合标识与短句', '包装轻便，跨境运费友好'],
    description: '配件类客单价低、复购高，适合作为主推款的搭配组合；可选颜色与印刷位置以供应商目录为准。'
  },
  家居生活: {
    brand: 'Pic The Gift',
    model: 'Standard',
    material: '聚酯纤维 / 羊羔绒 / 有机棉',
    weight: '按品类而定',
    fit: '多尺寸',
    colorCount: 6,
    sizes: ['40 × 40 cm', '130 × 150 cm'],
    colors: ['白色', '米白', '灰色'],
    printAreas: ['正面', '整面'],
    highlights: ['整面印花，适合照片与拼贴', '家居场景溢价空间更大', '包装体积较大，注意运费核算'],
    description: '家居用品以整面印花为主，适合照片、插画与节日主题；生产与运输周期略长，建议提前准备尺寸说明。'
  },
  礼品: {
    brand: 'Teelaunch',
    model: 'Standard',
    material: '陶瓷 / 纸品 / 木作',
    weight: '按品类而定',
    fit: '多尺寸',
    colorCount: 5,
    sizes: ['均码', '多种尺寸'],
    colors: ['白色', '原木色', '黑色'],
    printAreas: ['正面', '整面'],
    highlights: ['节日与纪念场景需求集中', '适合小批量定制与礼盒组合', '可按活动节点做主题上新'],
    description: '礼品类适合节点营销与纪念场景，通常以小批量定制为主；不同材质上色表现差异较大，建议先打样。'
  }
}

// 空白衫品牌按供应商区分
const adminBlankBrands = {
  Printful: { T恤: ['Bella + Canvas', '3001'], 卫衣: ['Gildan', '18500'] },
  Printify: { T恤: ['Gildan', '64000'], 卫衣: ['Gildan', '18500'] },
  'Simple Print': { T恤: ['AS Colour', '5001'] },
  Gelato: { T恤: ['Stanley/Stella', 'Creator'] },
  SPOD: { T恤: ['Stanley/Stella', 'Creator'] },
  Apliiq: { 服装: ['AS Colour', '5001'] }
}

export function buildAdminProductSpecs(product) {
  const profile = adminSpecProfiles[product.category] || adminSpecProfiles['礼品']
  const rule = (adminBlankBrands[product.supplier] || {})[product.category]

  return {
    brand: rule ? rule[0] : profile.brand,
    model: rule ? rule[1] : profile.model,
    material: profile.material,
    weight: profile.weight,
    fit: profile.fit,
    colorCount: profile.colorCount,
    sizes: [...profile.sizes],
    colors: [...profile.colors],
    printAreas: [...profile.printAreas],
    highlights: [...profile.highlights],
    description: `${profile.description} 数据同步自供应商公开产品目录，价格与库存以供应商页面为准。`
  }
}

export const adminActivities = [
  { who: 'Lena', action: '更新了 Gelato 的配送国家与生产成本', time: '2 小时前' },
  { who: 'Marco', action: '新增供应商 Pic The Gift 的 3 个产品', time: '5 小时前' },
  { who: 'Ivy', action: '提交了「运费是怎么计算的？」帮助中心草稿', time: '昨天 18:20' },
  { who: 'Lena', action: '暂停了 PODpartner 的目录展示', time: '昨天 11:05' },
  { who: 'System', action: '每日价格同步任务完成，更新 46 条报价', time: '今天 06:00' }
]

// 谷歌插件（竞品产品采集）演示数据
export const extensionDefaults = {
  name: 'POD Catalog Collector',
  version: '1.2.0',
  latestVersion: '1.3.0',
  status: 'connected',
  browser: 'Chrome 129 · Windows 11',
  lastHeartbeat: '今天 09:42',
  apiKey: 'pod_ext_7f3c9a2e84b14d6f',
  autoApprove: false
}

export const adminCrawlTasks = [
  {
    id: 'task-printful-apparel',
    name: 'Printful 服装新品',
    site: 'printful.com',
    url: 'https://www.printful.com/custom/mens/t-shirts',
    category: 'T恤',
    supplier: 'Printful',
    frequency: 'daily',
    status: 'running',
    lastRun: '今天 08:30',
    collected: 46,
    autoApprove: false
  },
  {
    id: 'task-gelato-wallart',
    name: 'Gelato 墙面装饰',
    site: 'gelato.com',
    url: 'https://www.gelato.com/us/posters',
    category: '墙面装饰',
    supplier: 'Gelato',
    frequency: 'daily',
    status: 'running',
    lastRun: '今天 07:10',
    collected: 32,
    autoApprove: false
  },
  {
    id: 'task-printify-mug',
    name: 'Printify 水杯价格',
    site: 'printify.com',
    url: 'https://printify.com/catalog/mugs',
    category: '水杯',
    supplier: 'Printify',
    frequency: 'weekly',
    status: 'paused',
    lastRun: '10-26 20:15',
    collected: 18,
    autoApprove: false
  },
  {
    id: 'task-spod-basic',
    name: 'SPOD 基础款同步',
    site: 'spod.com',
    url: 'https://www.spod.com/products',
    category: 'T恤',
    supplier: 'SPOD',
    frequency: 'manual',
    status: 'running',
    lastRun: '10-28 15:40',
    collected: 24,
    autoApprove: true
  }
]

export const adminCrawlItems = [
  {
    id: 'crawl-1',
    title: 'Printful 中性重磅T恤 5001',
    site: 'printful.com',
    url: 'https://www.printful.com/custom/mens/t-shirts',
    category: 'T恤',
    supplier: 'Printful',
    price: 18.2,
    collectedAt: '今天 08:32',
    status: 'pending',
    accent: '#5b4bff'
  },
  {
    id: 'crawl-2',
    title: 'Printful 拉链连帽卫衣 3001',
    site: 'printful.com',
    url: 'https://www.printful.com/custom/mens/hoodies',
    category: '卫衣',
    supplier: 'Printful',
    price: 36.5,
    collectedAt: '今天 08:32',
    status: 'pending',
    accent: '#8b5cf6'
  },
  {
    id: 'crawl-3',
    title: 'Gelato 哑光艺术海报 30×40',
    site: 'gelato.com',
    url: 'https://www.gelato.com/us/posters',
    category: '墙面装饰',
    supplier: 'Gelato',
    price: 14.9,
    collectedAt: '今天 07:12',
    status: 'pending',
    accent: '#ff6b35'
  },
  {
    id: 'crawl-4',
    title: 'Gelato 11oz 陶瓷马克杯',
    site: 'gelato.com',
    url: 'https://www.gelato.com/us/mugs',
    category: '水杯',
    supplier: 'Gelato',
    price: 11.3,
    collectedAt: '今天 07:12',
    status: 'pending',
    accent: '#16b981'
  },
  {
    id: 'crawl-5',
    title: 'Printify 帆布托特包',
    site: 'printify.com',
    url: 'https://printify.com/catalog/bags',
    category: '配件',
    supplier: 'Printify',
    price: 15.4,
    collectedAt: '昨天 20:04',
    status: 'pending',
    accent: '#0ea5e9'
  },
  {
    id: 'crawl-6',
    title: 'SPOD 真空保温杯 450ml',
    site: 'spod.com',
    url: 'https://www.spod.com/products',
    category: '水杯',
    supplier: 'SPOD',
    price: 22.6,
    collectedAt: '10-28 15:41',
    status: 'approved',
    accent: '#f59e0b'
  },
  {
    id: 'crawl-7',
    title: 'Printify 超薄手机壳（旧款）',
    site: 'printify.com',
    url: 'https://printify.com/catalog/phone-cases',
    category: '配件',
    supplier: 'Printify',
    price: 14.2,
    collectedAt: '10-27 11:20',
    status: 'ignored',
    accent: '#ec4899'
  }
]

export const adminCrawlDomains = [
  { domain: 'printful.com', enabled: true, note: '官方产品目录，允许采集价格与规格' },
  { domain: 'gelato.com', enabled: true, note: '墙面装饰与家居类目' },
  { domain: 'printify.com', enabled: true, note: '仅产品目录页' },
  { domain: 'spod.com', enabled: false, note: '暂缓：页面结构改版中' },
  { domain: 'etsy.com', enabled: false, note: '需确认授权后再开启' }
]

export const adminCrawlLogs = [
  { id: 'log-1', time: '今天 09:42', level: 'success', message: '插件心跳正常，已同步 3 个采集任务配置' },
  { id: 'log-2', time: '今天 08:32', level: 'success', message: 'Printful 服装采集完成，新增 12 个产品到待审核' },
  { id: 'log-3', time: '今天 07:12', level: 'success', message: 'Gelato 墙面装饰采集完成，新增 8 个产品到待审核' },
  { id: 'log-4', time: '昨天 20:05', level: 'warn', message: 'printify.com 分页结构变化，已自动跳过 2 个页面' },
  { id: 'log-5', time: '昨天 15:40', level: 'info', message: 'SPOD 基础款同步任务由手动触发' }
]

export const crawlFrequencyOptions = [
  { value: 'manual', label: '手动触发' },
  { value: 'daily', label: '每天一次' },
  { value: 'weekly', label: '每周一次' }
]

export const crawlItemStatusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已入库' },
  { value: 'ignored', label: '已忽略' }
]

export const statusOptions = [
  { value: 'active', label: '运营中' },
  { value: 'paused', label: '已暂停' },
  { value: 'draft', label: '草稿' }
]

export const productStatusOptions = [
  { value: 'live', label: '已上架' },
  { value: 'paused', label: '已下架' },
  { value: 'draft', label: '草稿' }
]

// 供应商表单可选项（与业务端目录保持一致）
export const supplierCategoryOptions = [
  'T恤',
  '卫衣',
  '服装',
  '水杯',
  '墙面装饰',
  '配件',
  '家居生活',
  '礼品'
]

export const integrationOptions = [
  'Shopify',
  'WooCommerce',
  'Etsy',
  'Amazon',
  'TikTok Shop',
  'Squarespace',
  'Wix'
]

export const printMethodOptions = ['DTG', 'DTF', '丝网印刷', '刺绣', '热升华', 'UV 打印']

export const shipRegionOptions = ['美国', '欧洲', '全球']

export const productCategoryOptions = supplierCategoryOptions

export const productColorOptions = ['白色', '黑色', '米白', '藏青', '灰色', '红色']

export const productSizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']

// 帮助中心：分类与问题
export const adminHelpCategories = [
  { id: 'basics', name: '基础概念', desc: '按需打印的定义、运作方式与优势', order: 1 },
  { id: 'product-design', name: '产品与设计', desc: '品类选择、设计文件与印刷工艺', order: 2 },
  { id: 'brand-ops', name: '品牌与运营', desc: '自有品牌、店铺运营与增长', order: 3 },
  { id: 'shipping', name: '物流与配送', desc: '发货时效、运费与覆盖地区', order: 4 },
  { id: 'quality', name: '产品质量', desc: '打样、质检与售后处理', order: 5 }
]

export const adminHelpArticles = [
  {
    id: 'what-is-pod',
    title: '什么是按需打印（POD）？',
    category: '基础概念',
    excerpt: '客户下单后才生产，无需提前备货。',
    body: '按需打印是一种商业模式：你与供应商合作，用自己的设计生产定制产品。只有客户下单后，产品才会被生产和配送。',
    status: 'published',
    pinned: true,
    order: 1,
    views: 18420,
    helpful: 96,
    updated: '2026-10-27'
  },
  {
    id: 'how-pod-works',
    title: '按需打印是怎么运作的？',
    category: '基础概念',
    excerpt: '设计、印刷、包装与发货的分工。',
    body: '在按需打印模式下，你负责设计，供应商负责印刷、包装，并以你的品牌名义发货给客户。',
    status: 'published',
    pinned: false,
    order: 2,
    views: 12105,
    helpful: 94,
    updated: '2026-10-26'
  },
  {
    id: 'pod-benefits',
    title: '按需打印有哪些优势？',
    category: '基础概念',
    excerpt: '启动成本低、无需备货、履约交给供应商。',
    body: '启动成本低、无需备货、设计选择丰富，而且履约与物流全部由供应商处理，省心省力。',
    status: 'published',
    pinned: false,
    order: 3,
    views: 9340,
    helpful: 92,
    updated: '2026-10-24'
  },
  {
    id: 'which-products',
    title: '按需打印可以卖哪些产品？',
    category: '产品与设计',
    excerpt: '服装、家居装饰、饰品等主流品类。',
    body: '服装、家居装饰、饰品等都可以。用我们的目录，可以找到专做你想卖品类的公司。',
    status: 'published',
    pinned: false,
    order: 4,
    views: 7820,
    helpful: 90,
    updated: '2026-10-23'
  },
  {
    id: 'own-brand',
    title: '按需打印能用自己的品牌吗？',
    category: '品牌与运营',
    excerpt: '包装、吊牌与装箱单均可使用自有品牌。',
    body: '可以。大多数按需打印服务都支持在包装和产品上使用你自己的品牌，让客户体验保持统一。',
    status: 'published',
    pinned: false,
    order: 5,
    views: 6410,
    helpful: 95,
    updated: '2026-10-21'
  },
  {
    id: 'shipping-time',
    title: '按需打印的发货需要多久？',
    category: '物流与配送',
    excerpt: '通常印刷加发货需要 2 到 7 个工作日。',
    body: '发货时间因公司和地区而异。通常情况下，印刷加发货需要 2 到 7 个工作日。你可以在目录中筛选覆盖目标地区的供应商。',
    status: 'published',
    pinned: false,
    order: 6,
    views: 11260,
    helpful: 88,
    updated: '2026-10-20'
  },
  {
    id: 'sell-on-own-site',
    title: '可以在自己的网站上卖按需打印产品吗？',
    category: '品牌与运营',
    excerpt: '通过 Shopify、WooCommerce 等集成直接销售。',
    body: '可以。大多数按需打印服务都能与你的网站对接，让你直接面向客户销售，并提供顺畅的购物体验。',
    status: 'review',
    pinned: false,
    order: 7,
    views: 0,
    helpful: 0,
    updated: '2026-10-19'
  },
  {
    id: 'product-quality',
    title: '按需打印的产品质量如何？',
    category: '产品质量',
    excerpt: '质量因供应商而异，建议先打样。',
    body: '质量因公司而异。不过大多数口碑较好的公司都能提供符合行业标准、耐用可靠的产品。',
    status: 'published',
    pinned: false,
    order: 8,
    views: 5980,
    helpful: 91,
    updated: '2026-10-18'
  },
  {
    id: 'sample-order',
    title: '如何申请样品或打样？',
    category: '产品质量',
    excerpt: '在供应商详情页提交样品申请。',
    body: '进入供应商详情页，在样品申请表单中填写收货地址与期望产品，供应商通常在 2 个工作日内确认报价。',
    status: 'draft',
    pinned: false,
    order: 9,
    views: 0,
    helpful: 0,
    updated: '2026-10-16'
  },
  {
    id: 'shipping-fee',
    title: '运费是怎么计算的？',
    category: '物流与配送',
    excerpt: '按件计费或按重量阶梯计费。',
    body: '大多数供应商按件收取固定运费，部分按重量阶梯计费；跨区配送会叠加附加费，结算页会展示最终运费。',
    status: 'draft',
    pinned: false,
    order: 10,
    views: 0,
    helpful: 0,
    updated: '2026-10-14'
  }
]

export const helpStatusOptions = [
  { value: 'published', label: '已发布' },
  { value: 'review', label: '待审核' },
  { value: 'draft', label: '草稿' }
]

export const helpCenterDefaults = {
  title: '按需打印帮助中心',
  placeholder: '搜索问题关键词…',
  supportEmail: 'alita@toaddit.com'
}
