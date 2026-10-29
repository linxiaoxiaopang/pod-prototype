// 对比详情页数据（按对比 id 索引，与 comparisons.js 合并使用）
export const comparisonDetails = {
  'printful-vs-printify': {
    deck:
      '从套餐价格、产品目录、生产模式、品牌化资格、集成能力与客服支持等维度，逐项对比 Printful 与 Printify。',
    updated: '2026年8月31日',
    verdict: {
      left: ['更适合流程集中管理', '更适合完整的品牌化控制'],
      right: ['更适合自由选择印刷商', '更适合产品线广度'],
      note:
        '在价格或质量上并不存在绝对赢家。真正有用的比较，是拿同一款底衫、尺码、颜色、印刷位置与目的地去要报价，然后各自下样单实测。'
    },
    sections: [
      {
        title: '产品目录与丰富度',
        body:
          'Printful 维持一个数百款产品的精选目录，可以做到从设计到履约的端到端把控。Printify 则是聚合了 100 多家印刷商的 900+ 款商品市场，小众 SKU 更容易找到。',
        bottom: '广度上 Printify 占优，可预测性上 Printful 占优。'
      },
      {
        title: '履约速度与稳定性',
        body:
          'Printful 把订单分配在自有工厂与精选合作工厂之间，流程更统一。Printify 把生产交给你选择的印刷商，因此交期与瑕疵率会随工厂不同而波动。',
        bottom: '放量之前，先向真正要用的那家印刷商下样单。'
      },
      {
        title: '定价模式与单件成本',
        body:
          '基础款 T恤 Printify 约 $8.49 起，Printful 约 $13.75 起。两边都有付费套餐——Printful Growth $24.99/月，Printify Premium $39/月起——折扣按产品而定，并非统一费率。',
        bottom: 'Printify 单件通常更便宜，Printful 把更多服务打包进了价格里。'
      },
      {
        title: '品牌化与定制',
        body:
          'Printful 为符合条件的订单提供织标、装箱单、随箱赠品与定制包装。Printify 通过参与计划的印刷商支持插入卡与织标，但覆盖范围更窄。',
        bottom: '如果开箱体验是品牌的一部分，Printful 是更稳的底座。'
      }
    ],
    useCases: [
      { who: '预算有限，先上线第一款产品', pick: 'Printify' },
      { who: '经营中高端服装品牌', pick: 'Printful' },
      { who: '快速测试大量小众 SKU', pick: 'Printify' },
      { who: '需要所有订单包装一致', pick: 'Printful' }
    ],
    pros: {
      left: ['跨工厂的统一流程', '更丰富的包装与织标选项', '单一付费套餐、价格清晰'],
      right: ['可按印刷商选择价格与产地', '产品更多、覆盖更多小众品类', '符合条件的订单可灵活分配']
    },
    conclusion: {
      left: ['希望平台自动处理订单分配', '定制包装与随箱赠品很重要', '不想在过多选项里做决策'],
      right: ['希望按印刷商优化成本', '销售小众或季节性 SKU', '愿意自己甄别工厂质量']
    },
    faqs: [
      {
        q: '2026 年 Printify 还比 Printful 便宜吗？',
        a: '多数情况是，但并不总是。折扣取决于印刷商、产品和你选的套餐，建议按实际底衫与销往目的地索取实时报价后再比。'
      },
      {
        q: '2024 年的合并对卖家有影响吗？',
        a: '交易在 2024 年 11 月完成，但两家平台的账号、目录、价格、品牌化规则与履约流程仍各自独立运行。'
      },
      {
        q: '可以同时使用两个平台吗？',
        a: '可以。为每款产品指定唯一的履约方，分开设置运费模板，并写清退货说明，避免出现拆单。'
      }
    ]
  },
  'printify-vs-gelato': {
    deck:
      '这是一场成本与速度的对比：Printify 通过印刷商网络压低单件价格，Gelato 通过本地生产压缩配送距离。',
    updated: '2026年8月31日',
    verdict: {
      left: ['更适合追求最低单件成本', '更适合美国走量卖家'],
      right: ['更适合欧洲本地生产', '更适合国际配送时效']
    },
    sections: [
      {
        title: '生产模式',
        body:
          'Printify 是一个由独立印刷商组成的网络。Gelato 自建跨 32 个国家的调度层，只要有量，就尽量在买家附近印刷。',
        bottom: 'Printify 竞争的是价格，Gelato 竞争的是距离。'
      },
      {
        title: '配送时效与清关',
        body:
          'Gelato 在欧洲境内通常 1–4 天送达且无关税，因为包裹走的是本土发货。Printify 的跨境订单通常需要 3–7 天，还可能产生关税。',
        bottom: '面向欧洲客户时，即使单价更高，Gelato 也常常更划算。'
      },
      {
        title: '目录与价格',
        body:
          'Printify 上架 900+ 款产品，T恤约 $8.49 起。Gelato 的目录更精简，约 $12.40 起，超低价的底衫更少。',
        bottom: '算总成本，而不是看标价。'
      },
      {
        title: '品牌化与集成',
        body:
          '两家都能对接 Shopify、WooCommerce、Etsy 与 Squarespace。Printify 支持更多平台与第三方应用集成；Gelato 更专注店铺与 API 流程。',
        bottom: '这一项很少由集成决定，通常由地理位置决定。'
      }
    ],
    useCases: [
      { who: '主要在美国走量销售', pick: 'Printify' },
      { who: '在欧洲多国销售并需处理增值税', pick: 'Gelato' },
      { who: '经营大量小众产品', pick: 'Printify' },
      { who: '承诺 2–4 天送达', pick: 'Gelato' }
    ],
    pros: {
      left: ['单件价格最低', '产品市场最广', '平台集成最多'],
      right: ['32 个国家本地生产', '本土配送速度快', '清关问题更少']
    },
    conclusion: {
      left: ['利润是首要约束', '买家主要集中在一个国家', '能接受交期波动'],
      right: ['做国际销售', '配送速度影响评价', '希望关税在本地解决']
    },
    faqs: [
      {
        q: '欧洲订单哪家更快？',
        a: '多数情况下是 Gelato。在目的国境内印刷省去了清关环节，通常 1–4 天可送达。'
      },
      {
        q: 'Printify 能从欧洲发货吗？',
        a: '部分印刷商可以。是否可用取决于你选的产品与印刷商，上架前请先确认印刷商所在地。'
      },
      {
        q: '可以在一个店铺里混用两家供应商吗？',
        a: '可以，但要按产品分别维护运费模板与生产承诺，让客户看到的时效估算准确。'
      }
    ]
  },
  'printful-vs-gelato': {
    deck:
      '两家都是中高端供应商，但强项不同：Printful 强在服装装饰工艺与品牌化，Gelato 强在全球生产覆盖。',
    updated: '2026年8月31日',
    verdict: {
      left: ['更适合刺绣与高端服装', '更适合包装控制'],
      right: ['更适合全球生产覆盖', '更适合快速的国际配送']
    },
    sections: [
      {
        title: '服装与装饰工艺',
        body:
          'Printful 自建刺绣产线，支持织标、布贴与高端底衫。Gelato 的数码直喷与热升华做得不错，但刺绣能力有限。',
        bottom: '如果刺绣是设计核心，先从 Printful 开始。'
      },
      {
        title: '生产布局',
        body:
          'Printful 在九个国家印刷，Gelato 覆盖 32 个国家，能缩短面向国际客户的最后一公里。',
        bottom: 'Gelato 靠地理扩张，Printful 靠运营扩张。'
      },
      {
        title: '单件成本',
        body:
          '同款 T恤 Gelato 约 $12.40，Printful 约 $13.75。卫衣与高端底衫的差距会更大。',
        bottom: '在未计入运费前，Gelato 略便宜。'
      },
      {
        title: '品牌化与包装',
        body:
          '两家都支持织标与包装插入卡。Printful 的随箱赠品选项更丰富；Gelato 的品牌化更简单，但各区域都能用。',
        bottom: '要更重的开箱仪式感选 Printful，要全球一致的品牌呈现选 Gelato。'
      }
    ],
    useCases: [
      { who: '做带刺绣的高端潮牌', pick: 'Printful' },
      { who: '在 10 个以上国家销售', pick: 'Gelato' },
      { who: '需要规模化定制包装', pick: 'Printful' },
      { who: '承诺欧洲境内短时效', pick: 'Gelato' }
    ],
    pros: {
      left: ['自有刺绣产线', '品牌化服务丰富', '品控稳定'],
      right: ['32 国生产', '本地配送快', '全球统一定价']
    },
    conclusion: {
      left: ['装饰工艺质量优先', '主要发往美国', '包装是产品的一部分'],
      right: ['客群分布全球', '需要本地增值税处理', '速度比工艺广度更重要']
    },
    faqs: [
      {
        q: 'Gelato 支持刺绣吗？',
        a: '只支持少量产品。如果刺绣是产品线的核心，Printful 或专业供应商更合适。'
      },
      {
        q: '哪家印刷质量更好？',
        a: '两家都稳定处于中上水平。质量差异更多取决于具体底衫与印刷工艺，而不是平台整体。'
      },
      {
        q: '可以对欧洲用 Gelato、对美国用 Printful 吗？',
        a: '可以。按目的地拆分即可，但要确保运费估算与退货地址和实际生产方一致。'
      }
    ]
  },
  'etsy-vs-redbubble': {
    deck:
      '这是一道平台选择题，而非供应商选择题：Etsy 给你店铺与定价权，Redbubble 给你流量但抽成更高。',
    updated: '2026年8月31日',
    verdict: {
      left: ['更适合打造品牌', '更适合掌控定价'],
      right: ['更适合零投入上传', '更适合被动曝光']
    },
    sections: [
      {
        title: '成本结构',
        body:
          'Etsy 对每个商品收取 $0.20 刊登费，外加 6.5% 交易费与支付手续费。Redbubble 无前期成本，但每笔成交按固定比例付给创作者。',
        bottom: 'Etsy 前期花钱更多，走量后单笔成本更低。'
      },
      {
        title: '利润与定价控制',
        body:
          '在 Etsy 上由你设定零售价，差价归你。在 Redbubble 上，基础价与创作者分成由平台决定。',
        bottom: '如果利润重要，Redbubble 会限制你的上限。'
      },
      {
        title: '流量与客户归属',
        body:
          'Etsy 带来搜索流量，但你仍要自己做营销。Redbubble 带来逛市场的买家，但客户属于 Redbubble。',
        bottom: '两边的流量都是租来的，只有 Etsy 让你拥有客户关系。'
      },
      {
        title: '运营工作量',
        body:
          'Etsy 需要你自己对接 POD 供应商并处理客服。Redbubble 帮你搞定生产、配送与退换。',
        bottom: 'Redbubble 更省事，Etsy 更可控。'
      }
    ],
    useCases: [
      { who: '零准备先测试设计', pick: 'Redbubble' },
      { who: '想做复购型品牌', pick: 'Etsy' },
      { who: '想积累邮箱名单', pick: 'Etsy' },
      { who: '完全不想做客服', pick: 'Redbubble' }
    ],
    pros: {
      left: ['定价自主', '拥有客户数据', '有品牌成长空间'],
      right: ['零启动成本', '自带市场流量', '不用做履约']
    },
    conclusion: {
      left: ['你要利润与数据', '你打算投广告', '你卖多种产品'],
      right: ['想靠作品获得被动收入', '不想处理客服', '还在验证需求']
    },
    faqs: [
      {
        q: '同一个设计可以在两个平台都卖吗？',
        a: '通常可以，除非你给了独家授权。上传同一份作品前，先看两个平台的条款。'
      },
      {
        q: '哪家单笔收入更高？',
        a: '走量情况下通常是 Etsy，因为零售价由你定。Redbubble 的固定分成更简单但上限更低。'
      },
      {
        q: '在 Etsy 卖需要 POD 供应商吗？',
        a: '需要。Etsy 是市场而非印刷厂，你需要对接 Printify、Gelato 这类供应商来履约。'
      }
    ]
  },
  'shopify-vs-etsy': {
    deck:
      '是拥有自己的店铺，还是租用一批现成买家：从成本、控制力与流量三方面对比 Shopify 与 Etsy。',
    updated: '2026年8月31日',
    verdict: {
      left: ['更适合长期品牌建设', '更适合完全掌控设计'],
      right: ['更适合快速拿到首单', '更适合自带搜索流量']
    },
    sections: [
      {
        title: '月成本',
        body:
          'Shopify 从 $39/月起，另加支付手续费。Etsy 没有订阅费，但每笔成交都要收刊登费与交易费。',
        bottom: 'Shopify 是固定成本，Etsy 是变动成本。'
      },
      {
        title: '流量与曝光',
        body:
          'Etsy 每月有大量买家在搜索礼品与定制产品。Shopify 没有市场流量——每一个访客都要你自己买或自己养。',
        bottom: 'Etsy 帮你卖，Shopify 逼你卖。'
      },
      {
        title: '可定制性',
        body:
          'Shopify 支持完整的主题控制、应用、组合销售、订阅与邮件自动化。Etsy 对页面布局与结算流程限制较多。',
        bottom: '如果购物体验本身就是产品，Shopify 胜出。'
      },
      {
        title: '费用与利润',
        body:
          'Etsy 的费用是叠加的：刊登费、交易费、支付费，还有可选的广告。Shopify 的费用可预测，但广告支出会替代平台费用。',
        bottom: '在断定 Shopify 更便宜之前，先算清广告预算。'
      }
    ],
    useCases: [
      { who: '零基础拿第一单', pick: 'Etsy' },
      { who: '用邮件与广告做品牌', pick: 'Shopify' },
      { who: '卖礼品导向的设计', pick: 'Etsy' },
      { who: '做组合销售与订阅', pick: 'Shopify' }
    ],
    pros: {
      left: ['完全掌控店铺', '更好的复购工具', '月成本可预测'],
      right: ['现成买家', '不用维护网站', '搭建速度快']
    },
    conclusion: {
      left: ['你有或能买到流量', '你想要邮件与订阅收入', '你需要定制结算流程'],
      right: ['起步时没有客群', '卖礼品导向的设计', '希望尽量少折腾']
    },
    faqs: [
      {
        q: '同一个 POD 供应商能同时对接两边吗？',
        a: '可以。Printify、Printful 与 Gelato 都能对接 Shopify 与 Etsy，一套目录可以同时供两个渠道使用。'
      },
      {
        q: '月订单不足 100 单，Shopify 值得吗？',
        a: '通常只有在你已经有流量时才值得。低于这个量级，Etsy 的费用往往比订阅费加广告更便宜。'
      },
      {
        q: '能把 Etsy 的客户迁移到 Shopify 吗？',
        a: '你可以在包装与随箱卡片里引导客户到你的店铺，但不能导出 Etsy 买家邮箱用于营销。'
      }
    ]
  },
  'podpartner-vs-printful': {
    deck:
      '面向服装品牌的价格与合规对比：PODpartner 靠重磅底衫竞争，Printful 靠欧盟合规与品牌化竞争。',
    updated: '2026年8月31日',
    verdict: {
      left: ['更适合重磅潮牌底衫', '更适合低价卫衣'],
      right: ['更适合欧盟合规', '更适合品牌化与刺绣']
    },
    sections: [
      {
        title: '底衫品质与版型',
        body:
          'PODpartner 备货宽松重磅底衫，在潮牌圈很受欢迎。Printful 提供标准零售版型，尺码与颜色矩阵更全。',
        bottom: '要廓形选 PODpartner，要零售版型选 Printful。'
      },
      {
        title: '单件价格',
        body:
          '重磅卫衣 PODpartner 约 $19.90，Printful 约 $29.95。把亚洲运费算进去后，差距会缩小。',
        bottom: '比落地成本，别只比目录价。'
      },
      {
        title: '生产与交付',
        body:
          'PODpartner 在香港与中国生产，3–5 天出货。Printful 在九个国家生产，2–5 天出货，欧美最后一公里更短。',
        bottom: 'Printful 离客户更近，PODpartner 离低价更近。'
      },
      {
        title: '合规与品牌化',
        body:
          'Printful 处理欧盟增值税与 IOSS 流程，并提供完整的品牌化选项。PODpartner 支持基础织标，但欧盟合规工具有限。',
        bottom: '面向欧洲店铺，Printful 能省掉大量文书工作。'
      }
    ],
    useCases: [
      { who: '做宽松版型的潮牌上新', pick: 'PODpartner' },
      { who: '销往欧盟并需处理增值税', pick: 'Printful' },
      { who: '最大化卫衣利润', pick: 'PODpartner' },
      { who: '需要刺绣与织标', pick: 'Printful' }
    ],
    pros: {
      left: ['卫衣与 T恤价格低', '重磅宽松底衫', '亚洲出货快'],
      right: ['欧盟合规与 IOSS', '刺绣与品牌化', '多国生产']
    },
    conclusion: {
      left: ['价格是产品核心', '客群偏好宽松版型', '能接受较长运期'],
      right: ['在欧盟销售', '在意图标与包装', '配送速度影响评价']
    },
    faqs: [
      {
        q: 'PODpartner 的卫衣更便宜吗？',
        a: '看目录价是的——同类型重磅卫衣约 $19.90 对 $29.95。决定前请把运费与关税算进去。'
      },
      {
        q: 'PODpartner 处理欧盟增值税吗？',
        a: '相比 Printful，其合规工具有限。欧洲卖家在放量前应确认 IOSS 处理方式与关税责任归属。'
      },
      {
        q: '哪家印刷质量更好？',
        a: '数码直喷两家都稳。PODpartner 的优势在底衫，Printful 的优势在跨工厂的一致性。'
      }
    ]
  }
}

// 结论性文案（verdict.note / conclusion.final），按对比 id 合并到详情中
const comparisonExtras = {
  'printful-vs-printify': {
    note:
      '在价格或质量上并不存在绝对赢家。真正有用的比较，是拿同一款底衫、尺码、颜色、印刷位置与目的地去要报价，然后各自下样单实测。',
    final:
      'Printful 通常在集中管理上占优，Printify 通常在选择自由度上占优。只要为每款产品指定唯一的履约方，两者完全可以并行。'
  },
  'printify-vs-gelato': {
    note:
      '本地生产对账目的影响比目录价更大。请针对你最重要的三个目的地，测算「生产 + 运费 + 关税」的落地成本。',
    final:
      '价格决定时用 Printify，距离决定时用 Gelato。很多店铺两者并用，按目的地分配订单。'
  },
  'printful-vs-gelato': {
    note:
      '两家都处在市场的中高端。决策通常取决于你更需要刺绣与包装，还是在更多国家本地印刷。',
    final:
      'Printful 是服装专家，Gelato 是物流专家。二者在质量上都不算妥协，只是优化了订单中的不同环节。'
  },
  'etsy-vs-redbubble': {
    note:
      'Redbubble 更像一个授权渠道，而不是店铺。如果你想要客户数据、邮件名单与复购，你需要自己的店铺或 Etsy 店。',
    final:
      '用 Redbubble 低成本验证设计，再把跑出来的爆款搬到 Etsy 或 Shopify，那里价格与客户数据都由你掌控。'
  },
  'shopify-vs-etsy': {
    note:
      '多数做得好的 POD 卖家最终会两边同时做：Etsy 负责曝光，Shopify 负责利润与留存。先从你现实中有流量的地方开始。',
    final:
      '没有客群时先开 Etsy 店，再把复购客户迁移到 Shopify。用同一家 POD 供应商供货，运营会更简单。'
  },
  'podpartner-vs-printful': {
    note:
      '底衫便宜只有在瑕疵率低的前提下才划算。在确定上新前，先按你要卖的颜色与尺码下样单。',
    final:
      'PODpartner 赢在底衫成本与廓形，Printful 赢在合规与后道工艺。大批量上新前，两家都先用样单实测。'
  }
}

export function getComparisonDetail(comparison) {
  const detail = comparisonDetails[comparison.id] || {}
  const extra = comparisonExtras[comparison.id] || {}
  return {
    ...comparison,
    ...detail,
    verdict: { ...(detail.verdict || {}), note: extra.note || '' },
    conclusion: { ...(detail.conclusion || {}), final: extra.final || '' }
  }
}
