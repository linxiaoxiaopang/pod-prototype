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

export const adminComparisons = [
  { id: 'printful-vs-printify', title: 'Printful vs Printify', status: 'published', updated: '2026-10-27', views: 12480 },
  { id: 'printify-vs-gelato', title: 'Printify vs Gelato', status: 'published', updated: '2026-10-25', views: 9320 },
  { id: 'printful-vs-gelato', title: 'Printful vs Gelato', status: 'published', updated: '2026-10-21', views: 8115 },
  { id: 'etsy-vs-redbubble', title: 'Etsy vs Redbubble', status: 'published', updated: '2026-10-18', views: 6042 },
  { id: 'shopify-vs-etsy', title: 'Shopify vs Etsy', status: 'draft', updated: '2026-10-15', views: 0 },
  { id: 'podpartner-vs-printful', title: 'PODpartner vs Printful', status: 'review', updated: '2026-10-12', views: 0 }
]

export const adminActivities = [
  { who: 'Lena', action: '更新了 Gelato 的配送国家与生产成本', time: '2 小时前' },
  { who: 'Marco', action: '新增供应商 Pic The Gift 的 3 个产品', time: '5 小时前' },
  { who: 'Ivy', action: '提交了「Shopify vs Etsy」对比草稿', time: '昨天 18:20' },
  { who: 'Lena', action: '暂停了 PODpartner 的目录展示', time: '昨天 11:05' },
  { who: 'System', action: '每日价格同步任务完成，更新 46 条报价', time: '今天 06:00' }
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
