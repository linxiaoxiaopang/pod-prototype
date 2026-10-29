// POD 落地成本指数（mock）：每个 SKU 记录多家供应商的落地成本与时效
export const skus = [
  {
    id: 'heavy-cotton-tee',
    name: '中性重磅纯棉T恤',
    category: 'T恤',
    quotes: [
      { supplierId: 'simple-print', cost: 8.95, production: 2, shipping: 3 },
      { supplierId: 'printful', cost: 13.75, production: 2, shipping: 3 },
      { supplierId: 'printify', cost: 8.49, production: 2, shipping: 5 },
      { supplierId: 'podpartner', cost: 7.9, production: 3, shipping: 6 }
    ]
  },
  {
    id: 'ringspun-tee',
    name: '精梳棉T恤',
    category: 'T恤',
    quotes: [
      { supplierId: 'gelato', cost: 12.4, production: 2, shipping: 2 },
      { supplierId: 'printful', cost: 14.95, production: 2, shipping: 3 },
      { supplierId: 'apliiq', cost: 11.85, production: 5, shipping: 4 }
    ]
  },
  {
    id: 'oversized-tee',
    name: '落肩宽松T恤',
    category: 'T恤',
    quotes: [
      { supplierId: 'podpartner', cost: 10.4, production: 3, shipping: 6 },
      { supplierId: 'merchize', cost: 11.2, production: 3, shipping: 7 },
      { supplierId: 'printify', cost: 11.65, production: 2, shipping: 5 }
    ]
  },
  {
    id: 'pullover-hoodie',
    name: '套头卫衣',
    category: '卫衣',
    quotes: [
      { supplierId: 'podpartner', cost: 19.9, production: 3, shipping: 6 },
      { supplierId: 'printful', cost: 29.95, production: 2, shipping: 3 },
      { supplierId: 'printify', cost: 21.4, production: 2, shipping: 5 },
      { supplierId: 'spod', cost: 24.6, production: 2, shipping: 3 }
    ]
  },
  {
    id: 'zip-hoodie',
    name: '拉链连帽卫衣',
    category: '卫衣',
    quotes: [
      { supplierId: 'printful', cost: 34.5, production: 3, shipping: 3 },
      { supplierId: 'merchize', cost: 26.8, production: 4, shipping: 7 },
      { supplierId: 'apliiq', cost: 28.9, production: 5, shipping: 4 }
    ]
  },
  {
    id: 'crewneck',
    name: '圆领卫衣',
    category: '卫衣',
    quotes: [
      { supplierId: 'simple-print', cost: 21.4, production: 2, shipping: 3 },
      { supplierId: 'printful', cost: 27.25, production: 2, shipping: 3 },
      { supplierId: 'printify', cost: 20.75, production: 3, shipping: 5 }
    ]
  },
  {
    id: 'ceramic-mug',
    name: '11oz 陶瓷马克杯',
    category: '水杯',
    quotes: [
      { supplierId: 'simple-print', cost: 6.2, production: 2, shipping: 3 },
      { supplierId: 'gelato', cost: 7.15, production: 2, shipping: 2 },
      { supplierId: 'printify', cost: 5.6, production: 2, shipping: 5 },
      { supplierId: 'spod', cost: 7.9, production: 2, shipping: 3 }
    ]
  },
  {
    id: 'steel-tumbler',
    name: '15oz 不锈钢保温杯',
    category: '水杯',
    quotes: [
      { supplierId: 'pic-the-gift', cost: 12.8, production: 3, shipping: 3 },
      { supplierId: 'merchize', cost: 11.4, production: 4, shipping: 7 },
      { supplierId: 'gooten', cost: 13.2, production: 3, shipping: 4 }
    ]
  },
  {
    id: 'enamel-mug',
    name: '珐琅露营杯',
    category: '水杯',
    quotes: [
      { supplierId: 'gooten', cost: 9.6, production: 3, shipping: 4 },
      { supplierId: 'gelato', cost: 10.25, production: 2, shipping: 2 },
      { supplierId: 'printify', cost: 8.9, production: 3, shipping: 5 }
    ]
  },
  {
    id: 'matte-poster',
    name: '哑光海报 18×24',
    category: '墙面装饰',
    quotes: [
      { supplierId: 'printdropper', cost: 6.4, production: 1, shipping: 3 },
      { supplierId: 'gooten', cost: 7.2, production: 3, shipping: 4 },
      { supplierId: 'teelaunch', cost: 6.85, production: 4, shipping: 5 },
      { supplierId: 'gelato', cost: 8.1, production: 2, shipping: 2 }
    ]
  },
  {
    id: 'framed-poster',
    name: '装裱海报 16×20',
    category: '墙面装饰',
    quotes: [
      { supplierId: 'printdropper', cost: 21.5, production: 2, shipping: 4 },
      { supplierId: 'teelaunch', cost: 19.8, production: 4, shipping: 5 },
      { supplierId: 'gooten', cost: 22.4, production: 3, shipping: 4 }
    ]
  },
  {
    id: 'stretched-canvas',
    name: '绷框帆布画 16×16',
    category: '墙面装饰',
    quotes: [
      { supplierId: 'printdropper', cost: 12.5, production: 2, shipping: 4 },
      { supplierId: 'teelaunch', cost: 13.9, production: 4, shipping: 5 },
      { supplierId: 'merchize', cost: 11.8, production: 4, shipping: 7 },
      { supplierId: 'gelato', cost: 14.6, production: 2, shipping: 2 }
    ]
  },
  {
    id: 'iphone-tough-case',
    name: 'iPhone 防摔手机壳',
    category: '配件',
    quotes: [
      { supplierId: 'simple-print', cost: 9.8, production: 2, shipping: 3 },
      { supplierId: 'printful', cost: 12.25, production: 2, shipping: 3 },
      { supplierId: 'printdropper', cost: 8.6, production: 1, shipping: 3 }
    ]
  },
  {
    id: 'samsung-snap-case',
    name: '三星超薄手机壳',
    category: '配件',
    quotes: [
      { supplierId: 'printify', cost: 8.5, production: 3, shipping: 5 },
      { supplierId: 'gelato', cost: 10.1, production: 2, shipping: 2 },
      { supplierId: 'spod', cost: 9.4, production: 2, shipping: 3 }
    ]
  },
  {
    id: 'canvas-tote',
    name: '帆布托特包',
    category: '配件',
    quotes: [
      { supplierId: 'simple-print', cost: 7.6, production: 2, shipping: 3 },
      { supplierId: 'podpartner', cost: 6.2, production: 3, shipping: 6 },
      { supplierId: 'printful', cost: 9.95, production: 2, shipping: 3 }
    ]
  },
  {
    id: 'embroidered-cap',
    name: '刺绣棒球帽',
    category: '配件',
    quotes: [
      { supplierId: 'printful', cost: 14.4, production: 3, shipping: 3 },
      { supplierId: 'apliiq', cost: 13.15, production: 5, shipping: 4 },
      { supplierId: 'merchize', cost: 11.9, production: 4, shipping: 7 }
    ]
  },
  {
    id: 'sherpa-blanket',
    name: '羊羔绒毯',
    category: '家居生活',
    quotes: [
      { supplierId: 'pic-the-gift', cost: 24.5, production: 3, shipping: 3 },
      { supplierId: 'teelaunch', cost: 27.8, production: 4, shipping: 5 },
      { supplierId: 'merchize', cost: 22.9, production: 4, shipping: 7 },
      { supplierId: 'gooten', cost: 26.4, production: 3, shipping: 4 }
    ]
  },
  {
    id: 'throw-pillow',
    name: '装饰抱枕 18×18',
    category: '家居生活',
    quotes: [
      { supplierId: 'teelaunch', cost: 12.4, production: 4, shipping: 5 },
      { supplierId: 'gooten', cost: 11.8, production: 3, shipping: 4 },
      { supplierId: 'pic-the-gift', cost: 10.9, production: 3, shipping: 3 }
    ]
  },
  {
    id: 'baby-onesie',
    name: '婴儿连体衣',
    category: '服装',
    quotes: [
      { supplierId: 'simple-print', cost: 9.4, production: 2, shipping: 3 },
      { supplierId: 'printful', cost: 13.25, production: 3, shipping: 3 },
      { supplierId: 'spod', cost: 10.6, production: 2, shipping: 3 }
    ]
  },
  {
    id: 'yoga-leggings',
    name: '瑜伽紧身裤',
    category: '服装',
    quotes: [
      { supplierId: 'printful', cost: 25.5, production: 4, shipping: 3 },
      { supplierId: 'podpartner', cost: 19.8, production: 5, shipping: 6 },
      { supplierId: 'printify', cost: 21.6, production: 4, shipping: 5 }
    ]
  }
]

export const costCategories = Array.from(new Set(skus.map((s) => s.category)))
