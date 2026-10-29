// 平台对比数据（mock）
export const comparisons = [
  {
    id: 'printful-vs-printify',
    title: 'Printful vs Printify',
    tag: '供应商对比',
    summary:
      'Printful 自建工厂、单价更高但交付更稳定；Printify 是工厂网络，价格更低，但不同合作工厂之间质量参差。',
    rows: [
      { label: '起售价（T恤）', left: '$13.75', right: '$8.49' },
      { label: '产品数量', left: '340+ 款', right: '900+ 款' },
      { label: '生产周期', left: '2–5 天', right: '2–7 天' },
      { label: '履约方式', left: '自有工厂', right: '合作工厂网络' },
      { label: '最适合', left: '品牌一致性', right: '最低单件成本' }
    ]
  },
  {
    id: 'printify-vs-gelato',
    title: 'Printify vs Gelato',
    tag: '供应商对比',
    summary:
      'Gelato 在 32 个国家本地印刷，能降低欧洲的运费与清关摩擦。Printify 在产品数量与美国市场价格上更占优。',
    rows: [
      { label: '起售价（T恤）', left: '$8.49', right: '$12.40' },
      { label: '本地生产', left: '美国 / 欧洲合作工厂', right: '32 个国家' },
      { label: '配送时效', left: '3–7 天', right: '1–4 天' },
      { label: '清关处理', left: '视合作工厂而定', right: '本地发货，无关税' },
      { label: '最适合', left: '美国走量卖家', right: '欧洲 / 全球品牌' }
    ]
  },
  {
    id: 'printful-vs-gelato',
    title: 'Printful vs Gelato',
    tag: '供应商对比',
    summary:
      '两家都属于中高端选择。Gelato 在国际配送速度上更优，Printful 在刺绣与品牌化服务上更强。',
    rows: [
      { label: '起售价（T恤）', left: '$13.75', right: '$12.40' },
      { label: '刺绣', left: '自有产线支持', right: '支持有限' },
      { label: '生产国数量', left: '9 个', right: '32 个' },
      { label: '品牌化选项', left: '织标、包装、随箱卡片', right: '织标、包装' },
      { label: '最适合', left: '服装品牌', right: '全球履约' }
    ]
  },
  {
    id: 'etsy-vs-redbubble',
    title: 'Etsy vs Redbubble',
    tag: '平台对比',
    summary:
      'Etsy 给你自己的店铺与定价权，但营销要你自己做。Redbubble 零投入，但抽成高且客户不属于你。',
    rows: [
      { label: '前期成本', left: '每个商品 $0.20', right: '无' },
      { label: '利润控制', left: '自行定价', right: '固定创作者分成' },
      { label: '客户数据', left: '归你', right: '归 Redbubble' },
      { label: '营销', left: '主要靠你自己', right: '平台流量驱动' },
      { label: '最适合', left: '打造品牌', right: '被动上传作品' }
    ]
  },
  {
    id: 'shopify-vs-etsy',
    title: 'Shopify vs Etsy',
    tag: '建站平台对比',
    summary:
      'Shopify 月费更高、需要自己带流量，但店铺、数据和结算都归你。Etsy 相当于租用一批现成买家。',
    rows: [
      { label: '月成本', left: '$39 起', right: '$0（按成交收费）' },
      { label: '交易费', left: '2.9% + 30¢', right: '6.5% + 商品刊登费' },
      { label: '自带流量', left: '无', right: '较强' },
      { label: '可定制性', left: '完全可控', right: '受限' },
      { label: '最适合', left: '长期品牌经营', right: '快速拿到首单' }
    ]
  },
  {
    id: 'podpartner-vs-printful',
    title: 'PODpartner vs Printful',
    tag: '供应商对比',
    summary:
      'PODpartner 的重磅底衫更便宜，在亚洲与美国发货都快。Printful 在欧盟合规与品牌化上更稳妥。',
    rows: [
      { label: '起售价（卫衣）', left: '$19.90', right: '$29.95' },
      { label: '底衫品质', left: '重磅、宽松版型', right: '标准零售版型' },
      { label: '生产周期', left: '3–5 天', right: '2–5 天' },
      { label: '欧盟合规', left: '支持有限', right: '完整支持（VAT、IOSS）' },
      { label: '最适合', left: '潮牌上新', right: '欧洲店铺' }
    ]
  }
]
