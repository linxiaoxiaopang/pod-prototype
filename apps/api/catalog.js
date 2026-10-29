// 与业务端 src/data/suppliers.js 中的 categories 保持一致（服务端只做白名单校验）
export const ALLOWED_CATEGORIES = [
  'T-Shirts',
  'Hoodies',
  'Apparel',
  'Drinkware',
  'Wall Art',
  'Accessories',
  'Home & Living',
  'Gifts'
]

export const CATEGORY_HINTS = {
  'T-Shirts': 't-shirts, tees, tank tops',
  Hoodies: 'hoodies, sweatshirts, crewnecks',
  Apparel: 'leggings, shorts, joggers, kids/baby clothing, embroidered apparel',
  Drinkware: 'mugs, tumblers, water bottles',
  'Wall Art': 'posters, canvas, framed prints, metal/wood/acrylic prints, tapestries',
  Accessories: 'tote bags, phone cases, caps, beanies, socks, stickers, jewelry, labels',
  'Home & Living': 'pillows, blankets, swaddles, aprons',
  Gifts: 'notebooks, stationery, puzzles, ornaments, patches'
}
