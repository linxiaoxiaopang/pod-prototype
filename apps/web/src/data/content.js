// 页面文案与数据集中管理（内容取自 printondemandbusiness.com 首页）
import { products } from './products'

export const brand = {
  name: 'PrintOnDemand',
  suffix: 'Business',
  tagline: '按需打印供应商目录'
}

export const navLinks = [
  { label: '供应商', labelEn: 'Suppliers', to: '/suppliers' },
  { label: '产品', labelEn: 'Products', to: '/products' },
  { label: '帮助中心', labelEn: 'Help Center', to: '/help' }
]

// 导航语言切换（演示）：仅切换导航与头部按钮文案
export const headerCopy = {
  zh: { search: '搜索', cta: '浏览供应商', drawerCta: '浏览供应商' },
  en: { search: 'Search', cta: 'Browse suppliers', drawerCta: 'Browse suppliers' }
}

export const hero = {
  titleBefore: '把',
  titleHighlight: '按需打印',
  titleAfter: '生意做得更明白',
  desc: '在选择供应商之前，先查一遍供应商目录、产品清单与实操指南。',
  placeholder: '搜索供应商、产品或指南…',
  popularLabel: '热门',
  popular: [
    { label: '亚马逊 POD', to: '/suppliers' }
  ]
}

// 搜索联想数据源：value 为展示文本，group 为分组，to 为跳转路由
const siteSearchIndex = [
  { value: 'Simple Print', group: '供应商', to: '/suppliers/simple-print' },
  { value: 'Gelato', group: '供应商', to: '/suppliers/gelato' },
  { value: 'Pic The Gift', group: '供应商', to: '/suppliers/pic-the-gift' },
  { value: 'PrintDropper', group: '供应商', to: '/suppliers/printdropper' },
  { value: 'Printful', group: '供应商', to: '/suppliers/printful' },
  { value: 'Printify', group: '供应商', to: '/suppliers/printify' },
  { value: 'PODpartner', group: '供应商', to: '/suppliers/podpartner' },
  { value: 'SPOD', group: '供应商', to: '/suppliers/spod' },
  { value: 'Merchize', group: '供应商', to: '/suppliers/merchize' },
  { value: 'Gooten', group: '供应商', to: '/suppliers/gooten' },
  { value: 'Teelaunch', group: '供应商', to: '/suppliers/teelaunch' },
  { value: 'Apliiq', group: '供应商', to: '/suppliers/apliiq' }
]

// 产品索引：同款产品只保留一条联想（取价格最低的供应商），直接打开该产品详情
const productGroups = products.reduce((map, product) => {
  const entry = map.get(product.name)
  if (!entry) {
    map.set(product.name, { product, count: 1 })
    return map
  }
  entry.count += 1
  if (product.price < entry.product.price) entry.product = product
  return map
}, new Map())

const productSearchIndex = [...productGroups.values()].map(({ product, count }) => ({
  value: product.name,
  group: '产品',
  meta: count > 1 ? `${product.supplierName} 等 ${count} 家` : product.supplierName,
  to: `/products/${product.id}`
}))

export const searchIndex = [...siteSearchIndex, ...productSearchIndex]

export const proof = {
  titleBefore: '已被 ',
  titleHighlight: '15+',
  titleAfter: ' 个新品发布与发现平台收录',
  desc: '从 Reddit、Product Hunt 到各类创业项目目录，PrintOnDemandBusiness.com 正在被创业者、店主与独立开发者关注。',
  platforms: [
    { name: 'Product Hunt', meta: '当日热门产品' },
    { name: 'Fazier', meta: '新项目收录' },
    { name: 'Merchize', meta: '英国最佳 POD 服务商' },
    { name: 'Firsto', meta: '项目目录' }
  ]
}

export const newsletter = {
  title: '订阅 PrintOnDemand Business 周报',
  desc: '每周一封短邮件，汇总按需打印领域的供应商与生产动态。',
  label: '邮箱地址',
  cta: '订阅周报',
  note: '不发垃圾邮件，随时可退订。请查看我们的隐私政策。'
}

export const articles = [
  {
    date: '2026年7月11日',
    category: '',
    title: '实测 Kittl 智能 AI 设计功能：POD 卖家能省下多少时间？',
    variant: 'ai',
    accent: '#5b4bff'
  },
  {
    date: '2026年7月7日',
    category: '供应商对比',
    title: 'PODpartner 对比 Printful：服装品牌该选哪家 POD 供应商？',
    variant: 'compare',
    accent: '#ff6b35'
  },
  {
    date: '2026年6月15日',
    category: '销售指南',
    title: '用 Gelato 在欧洲做 POD：本地履约、增值税、物流与利润风险',
    variant: 'europe',
    accent: '#1b9cff'
  },
  {
    date: '2026年5月28日',
    category: '销售指南',
    title: '如何用 Gelato 赚钱：从第一件产品到第一笔订单',
    variant: 'money',
    accent: '#16b981'
  }
]

export const faqs = [
  {
    category: '基础概念',
    q: '什么是按需打印（POD）？',
    a: '按需打印是一种商业模式：你与供应商合作，用自己的设计生产定制产品。只有客户下单后，产品才会被生产和配送。'
  },
  {
    category: '基础概念',
    q: '按需打印是怎么运作的？',
    a: '在按需打印模式下，你负责设计，供应商负责印刷、包装，并以你的品牌名义发货给客户。'
  },
  {
    category: '基础概念',
    q: '按需打印有哪些优势？',
    a: '启动成本低、无需备货、设计选择丰富，而且履约与物流全部由供应商处理，省心省力。'
  },
  {
    category: '产品与设计',
    q: '按需打印可以卖哪些产品？',
    a: '服装、家居装饰、饰品等都可以。用我们的目录，可以找到专做你想卖品类的公司。'
  },
  {
    category: '品牌与运营',
    q: '按需打印能用自己的品牌吗？',
    a: '可以。大多数按需打印服务都支持在包装和产品上使用你自己的品牌，让客户体验保持统一。'
  },
  {
    category: '物流与配送',
    q: '按需打印的发货需要多久？',
    a: '发货时间因公司和地区而异。通常情况下，印刷加发货需要 2 到 7 个工作日。你可以在目录中筛选覆盖目标地区的供应商。'
  },
  {
    category: '品牌与运营',
    q: '可以在自己的网站上卖按需打印产品吗？',
    a: '可以。大多数按需打印服务都能与你的网站对接，让你直接面向客户销售，并提供顺畅的购物体验。'
  },
  {
    category: '产品质量',
    q: '按需打印的产品质量如何？',
    a: '质量因公司而异。不过大多数口碑较好的公司都能提供符合行业标准、耐用可靠的产品。'
  }
]

export const helpCenter = {
  eyebrow: '帮助中心',
  title: '按需打印帮助中心',
  desc: '从入门概念到履约发货，关于按需打印生意的常见问题都在这里。找不到答案时，欢迎直接联系我们。',
  placeholder: '搜索问题关键词…',
  allLabel: '全部',
  empty: '没有找到相关问题，换个关键词试试。',
  support: {
    title: '没有找到答案？',
    desc: '联系我们的支持团队，我们会尽快回复你。',
    email: 'alita@toaddit.com',
    cta: '联系我们'
  }
}

export const footer = {
  desc: '一个独立的按需打印目录：收录供应商、产品清单与实操指南，服务于店主与独立创作者。',
  columns: [
    {
      title: '目录',
      links: [
        { label: '全部供应商', to: '/suppliers' },
        { label: '全部产品', to: '/products' }
      ]
    },
    {
      title: '资源',
      links: [
        { label: '帮助中心', to: '/help' },
        { label: '每周速递', section: 'newsletter' }
      ]
    },
    {
      title: '关于',
      links: [
        { label: '关于我们', section: 'proof' },
        { label: '联系我们', section: 'newsletter' },
        { label: '隐私政策', section: 'proof' },
        { label: '常见问题', section: 'faq' }
      ]
    }
  ],
  socials: [
    { label: 'Facebook', name: 'facebook', href: 'https://www.facebook.com/ToAddit.Printastic' },
    { label: '飞书', name: 'feishu', href: 'https://www.feishu.cn/invitation/page/add_contact/?token=14eu076d-1117-46de-93b9-13ac44267313&unique_id=frIYTgEgyLef6lZ5cXPo3A==' },
    { label: 'Telegram', name: 'telegram', href: 'https://t.me/alitacheng' },
    { label: 'WhatsApp', name: 'whatsapp', href: 'https://wa.me/8617706093305' },
    { label: 'Instagram', name: 'instagram', href: 'https://www.instagram.com/toadditprints/' },
    { label: 'Pinterest', name: 'pinterest', href: 'https://www.pinterest.com/Toadditprints/' }
  ],
  contacts: {
    company: '魚丁國際拓展有限公司',
    address: '香港新蒲崗太子道東704號新時代工貿商業中心1701-02室A07房',
    person: 'Alita Cheng',
    email: 'alita@toaddit.com',
    phone: '0086-177 0609 3305',
    tel: '+8617706093305'
  }
}
