// 供应商详情页数据（按供应商 id 索引，与 suppliers.js 合并使用）
export const supplierDetails = {
  'simple-print': {
    intro:
      'Simple Print 是一家只服务美国市场的按需打印供应商，专注服装与水杯，在加州自建数码直喷与丝网印刷产线。',
    rating: { source: 'Shopify App Store', score: 4.8, reviews: 312 },
    priceFrom: 8.95,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'tank tops',
      'kids apparel',
      'mugs',
      'tumblers',
      'posters',
      'tote bags',
      'phone cases'
    ],
    printMethods: ['数码直喷 (DTG)', '丝网印刷', '热升华'],
    fulfillment: ['标准', '快递', '可追踪', '国内'],
    factories: ['美国']
  },
  gelato: {
    intro:
      'Gelato 提供 T恤与卫衣的按需打印服务，在 32 个国家本地生产，生产地点包括澳大利亚。',
    rating: { source: 'Shopify App Store', score: 4.8, reviews: 647 },
    priceFrom: 12.4,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'tank tops',
      'baby apparel',
      'youth apparel',
      'mugs',
      'canvases',
      'posters',
      'totes',
      'bags',
      'phone cases',
      'wall art',
      'sportswear',
      'stationery',
      'notebooks',
      'canvas prints'
    ],
    printMethods: ['数码直喷 (DTG)', '丝网印刷', '热升华', '数码印刷'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国内', '国际'],
    factories: [
      '澳大利亚',
      '加拿大',
      '德国',
      '日本',
      '墨西哥',
      '新西兰',
      '阿联酋',
      '英国',
      '美国'
    ]
  },
  'pic-the-gift': {
    intro:
      'Pic The Gift 总部位于圣路易斯，专做个性化家居用品、毛毯与婴儿用品，热升华工艺自有产线。',
    rating: { source: 'Shopify App Store', score: 4.6, reviews: 128 },
    priceFrom: 10.9,
    updated: '2026年8月31日',
    productList: [
      'blankets',
      'baby swaddles',
      'pillows',
      'mugs',
      'tumblers',
      'ornaments',
      'tote bags',
      'aprons',
      'puzzles',
      'photo panels'
    ],
    printMethods: ['热升华', '数码直喷 (DTG)', 'UV 印刷', '数码印刷'],
    fulfillment: ['标准', '快递', '可追踪', '国际'],
    factories: ['美国']
  },
  printdropper: {
    intro:
      'PrintDropper 是匹兹堡的墙面装饰专精供应商，生产帆布画、海报与装裱画，平均 1 天出货。',
    rating: { source: 'Shopify App Store', score: 4.7, reviews: 86 },
    priceFrom: 6.4,
    updated: '2026年8月31日',
    productList: [
      'canvases',
      'posters',
      'framed prints',
      'acrylic prints',
      'metal prints',
      'wood prints',
      'blankets',
      'tapestries'
    ],
    printMethods: ['数码印刷', 'UV 印刷', '热升华'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国际'],
    factories: ['美国']
  },
  printful: {
    intro:
      'Printful 自建履约中心，并整合了精选合作工厂，在所有 POD 供应商中提供最完整的统一品牌定制能力。',
    rating: { source: 'Shopify App Store', score: 4.6, reviews: 4120 },
    priceFrom: 13.75,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'leggings',
      'caps',
      'embroidered apparel',
      'mugs',
      'posters',
      'canvas',
      'phone cases',
      'tote bags',
      'stickers'
    ],
    printMethods: ['数码直喷 (DTG)', '丝网印刷', '刺绣', '热升华', '数码印刷'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国际'],
    factories: [
      '美国',
      '墨西哥',
      '拉脱维亚',
      '西班牙',
      '德国',
      '英国',
      '加拿大',
      '澳大利亚',
      '日本'
    ]
  },
  printify: {
    intro:
      'Printify 采用平台模式：每款产品由你自行选择印刷商，单价更低，但质量取决于所选工厂。',
    rating: { source: 'Shopify App Store', score: 4.4, reviews: 3260 },
    priceFrom: 8.49,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'leggings',
      'mugs',
      'water bottles',
      'posters',
      'canvas',
      'phone cases',
      'tote bags',
      'blankets',
      'jewelry'
    ],
    printMethods: ['数码直喷 (DTG)', '丝网印刷', '热升华', '刺绣'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国际'],
    factories: ['合作网络 — 覆盖美国、欧洲与亚太的 100+ 家工厂']
  },
  podpartner: {
    intro:
      'PODpartner 在香港与中国生产重磅宽松版型服装，主打街头潮牌小批量上新，卫衣价格有竞争力。',
    rating: { source: 'Trustpilot', score: 4.7, reviews: 540 },
    priceFrom: 7.9,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'oversized tees',
      'hoodies',
      'sweatshirts',
      'sweatpants',
      'caps',
      'tote bags',
      'socks'
    ],
    printMethods: ['数码直喷 (DTG)', '丝网印刷', '刺绣'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国际'],
    factories: ['香港', '中国']
  },
  spod: {
    intro:
      'SPOD（Spreadshirt POD）在德国与美国印刷，适合需要合规增值税本地履约的欧洲卖家。',
    rating: { source: 'Trustpilot', score: 4.5, reviews: 870 },
    priceFrom: 9.4,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'mugs',
      'water bottles',
      'aprons',
      'tote bags',
      'pillows',
      'stickers'
    ],
    printMethods: ['数码直喷 (DTG)', '数码印刷', '热升华'],
    fulfillment: ['标准', '快递', '可追踪', '国内', '国际'],
    factories: ['德国', '美国']
  },
  merchize: {
    intro:
      'Merchize 以越南产线结合美国工厂，服装、毛毯与墙面装饰的单件成本较低，适合大批量上新。',
    rating: { source: 'Trustpilot', score: 4.6, reviews: 1180 },
    priceFrom: 9.9,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'mugs',
      'blankets',
      'posters',
      'pillows',
      'phone cases',
      'canvas'
    ],
    printMethods: ['数码直喷 (DTG)', '热升华', '数码印刷'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国际'],
    factories: ['越南', '美国']
  },
  gooten: {
    intro:
      'Gooten 整合了全球供应商网络，家居与墙面装饰品类覆盖较好，装饰类产品通常比 Printful 更便宜。',
    rating: { source: 'Trustpilot', score: 4.3, reviews: 410 },
    priceFrom: 7.2,
    updated: '2026年8月31日',
    productList: [
      'posters',
      'canvas',
      'pillows',
      'mugs',
      'blankets',
      'phone cases',
      'tote bags',
      'apparel'
    ],
    printMethods: ['数码印刷', 'UV 印刷', '热升华'],
    fulfillment: ['标准', '快递', '经济', '可追踪', '国际'],
    factories: ['美国', '荷兰', '中国']
  },
  teelaunch: {
    intro:
      'Teelaunch 是美国的小型供应商，专注墙面装饰与家居用品，价格统一、无月费。',
    rating: { source: 'Trustpilot', score: 4.2, reviews: 260 },
    priceFrom: 6.85,
    updated: '2026年8月31日',
    productList: [
      'posters',
      'canvas',
      'framed prints',
      'blankets',
      'pillows',
      'mugs',
      'tote bags',
      'stickers'
    ],
    printMethods: ['数码印刷', 'UV 印刷'],
    fulfillment: ['标准', '经济', '可追踪', '国际'],
    factories: ['美国']
  },
  apliiq: {
    intro:
      'Apliiq 专注装饰工艺服装——布贴、刺绣与定制织标——在洛杉矶为高端潮牌生产。',
    rating: { source: 'Trustpilot', score: 4.7, reviews: 190 },
    priceFrom: 11.85,
    updated: '2026年8月31日',
    productList: [
      't-shirts',
      'hoodies',
      'sweatshirts',
      'caps',
      'beanies',
      'shorts',
      'embroidered patches',
      'custom labels'
    ],
    printMethods: ['丝网印刷', '数码直喷 (DTG)', '刺绣'],
    fulfillment: ['标准', '快递', '可追踪', '国际'],
    factories: ['美国']
  }
}

export function getSupplierProfile(supplier) {
  const detail = supplierDetails[supplier.id] || {}
  return { ...supplier, ...detail }
}

export const sampleProductTypes = [
  'T恤',
  '卫衣',
  '马克杯',
  '海报',
  '帆布画',
  '手机壳',
  '托特包'
]

export const sampleCountries = [
  '美国',
  '英国',
  '德国',
  '法国',
  '加拿大',
  '澳大利亚',
  '日本',
  '其他'
]
