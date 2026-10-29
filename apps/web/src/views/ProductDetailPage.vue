<template>
  <div v-if="product" class="product-detail">
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-inner">
        <nav class="crumbs" aria-label="面包屑导航">
          <router-link to="/">首页</router-link>
          <i class="el-icon-arrow-right"></i>
          <router-link to="/products">产品</router-link>
          <i class="el-icon-arrow-right"></i>
          <span>{{ product.name }}</span>
        </nav>

        <div class="hero-grid">
          <div class="hero-media">
            <ProductThumb :shape="product.shape" :accent="product.accent" :label="product.name" />
            <span v-if="product.badge" class="hero-badge">{{ product.badge }}</span>
            <span class="source-badge">
              <i class="el-icon-link"></i>
              {{ tp.site }}
            </span>
          </div>

          <div class="hero-info">
            <p class="eyebrow">
              <span>{{ product.category }}</span>
              <em>/</em>
              <router-link v-if="supplier" :to="`/suppliers/${product.supplierId}`">
                {{ supplier.name }}
              </router-link>
              <span v-else>{{ product.supplierName }}</span>
            </p>

            <h1>{{ product.name }}</h1>
            <p class="subtitle">{{ tp.title }}<span v-if="tp.model"> · 型号 {{ tp.model }}</span></p>
            <p class="lead">{{ tp.description }}</p>

            <div class="hero-facts">
              <div class="fact">
                <span>供应价</span>
                <strong>${{ product.price.toFixed(2) }}</strong>
                <small>起 · 不含运费</small>
              </div>
              <div class="fact">
                <span>生产时间</span>
                <strong>{{ tp.production }}</strong>
                <small>印刷 + 备货</small>
              </div>
              <div class="fact">
                <span>可选规格</span>
                <strong>{{ specSummary }}</strong>
                <small>以第三方页面为准</small>
              </div>
            </div>

            <div class="hero-actions">
              <el-button type="primary" size="large" round @click="openSource">
                查看原始产品页
                <i class="el-icon-top-right"></i>
              </el-button>
              <router-link v-if="supplier" class="ghost-btn" :to="`/suppliers/${product.supplierId}`">
                供应商详情
                <i class="el-icon-right"></i>
              </router-link>
              <router-link class="ghost-btn" to="/products">
                返回产品目录
                <i class="el-icon-right"></i>
              </router-link>
            </div>

            <p class="sync-line">
              数据来自 {{ tp.site }} 公开产品页，同步于 {{ tp.syncedAt }}；价格与库存以第三方页面为准。
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container body">
      <main class="main">
        <section v-reveal class="block">
          <h2>产品亮点</h2>
          <p class="overview">{{ overviewText }}</p>
          <ul v-if="tp.highlights && tp.highlights.length" class="highlights">
            <li v-for="item in tp.highlights" :key="item">
              <i class="el-icon-check"></i>
              {{ item }}
            </li>
          </ul>
        </section>

        <section v-reveal class="block">
          <h2>规格参数</h2>
          <dl class="spec-grid">
            <div><dt>品牌</dt><dd>{{ tp.brand }}</dd></div>
            <div><dt>型号 / 款式</dt><dd>{{ tp.model || '—' }}</dd></div>
            <div><dt>产品品类</dt><dd>{{ product.category }}</dd></div>
            <div><dt>材质</dt><dd>{{ tp.material }}</dd></div>
            <div><dt>克重 / 容量</dt><dd>{{ tp.weight }}</dd></div>
            <div><dt>版型</dt><dd>{{ tp.fit }}</dd></div>
            <div><dt>可选颜色</dt><dd>{{ tp.colorCount ? tp.colorCount + ' 种' : '—' }}</dd></div>
            <div><dt>可选尺码</dt><dd>{{ tp.sizes.join(' / ') || '—' }}</dd></div>
          </dl>
        </section>

        <section v-reveal class="block">
          <h2>可选规格</h2>

          <div class="option-block">
            <h3>尺码<span>{{ tp.sizes.length }} 个</span></h3>
            <div class="size-pills">
              <span v-for="item in tp.sizes" :key="item">{{ item }}</span>
              <em v-if="!tp.sizes.length">以供应商目录为准</em>
            </div>
          </div>

          <div v-if="tp.colorCount || tp.colors.length" class="option-block">
            <h3>颜色<span>{{ tp.colorCount || tp.colors.length }} 种</span></h3>
            <div class="colors">
              <div v-for="item in colorSwatches" :key="item.name" class="color-item">
                <i :style="{ background: item.hex }"></i>
                <span>{{ item.name }}</span>
              </div>
              <span v-if="tp.colorCount > tp.colors.length" class="more-colors">
                +{{ tp.colorCount - tp.colors.length }} 色
              </span>
            </div>
          </div>

          <div class="option-block">
            <h3>印刷区域<span>{{ tp.printAreas.length }} 处</span></h3>
            <div class="size-pills print">
              <span v-for="item in tp.printAreas" :key="item">{{ item }}</span>
              <em v-if="!tp.printAreas.length">以供应商确认为准</em>
            </div>
          </div>
        </section>

        <section v-reveal class="block">
          <h2>生产与配送</h2>
          <div class="delivery-grid">
            <div class="delivery">
              <span>生产时间</span>
              <strong>{{ tp.production }}</strong>
              <small>自订单确认起算</small>
            </div>
            <div class="delivery">
              <span>起运运费</span>
              <strong>{{ tp.shippingFrom }}</strong>
              <small>按目的地与件数计算</small>
            </div>
            <div class="delivery">
              <span>配送范围</span>
              <strong>{{ shipsText }}</strong>
              <small>跨区可能叠加附加费</small>
            </div>
            <div class="delivery">
              <span>履约服务</span>
              <strong>{{ fulfillmentText }}</strong>
              <small>供应商负责包装与发货</small>
            </div>
          </div>
          <p class="delivery-note">
            工厂分布：{{ factoriesText }}。以上时效为供应商页面公示的平均值，旺季可能顺延 1–2 天。
          </p>
        </section>

        <section v-reveal class="block">
          <h2>
            第三方数据来源
            <span class="count">采集展示</span>
          </h2>

          <div class="source-card">
            <dl class="source-facts">
              <div><dt>来源平台</dt><dd>{{ supplier ? supplier.name : product.supplierName }}（{{ tp.site }}）</dd></div>
              <div><dt>原始标题</dt><dd>{{ tp.title }}</dd></div>
              <div><dt>最近同步</dt><dd>{{ tp.syncedAt }}</dd></div>
              <div><dt>采集方式</dt><dd>{{ product.thirdParty ? '供应商公开产品页' : '供应商目录摘要' }}</dd></div>
              <div class="span-2">
                <dt>原始页面</dt>
                <dd class="mono">{{ tp.url || '—' }}</dd>
              </div>
            </dl>

            <div class="source-actions">
              <a class="source-link" :href="tp.url" target="_blank" rel="noopener">
                查看原始产品页
                <i class="el-icon-top-right"></i>
              </a>
              <span class="source-note">价格、尺码与库存以第三方页面为准，本页为演示采集结果。</span>
            </div>
          </div>
        </section>

        <section v-if="sameSupplier.length" v-reveal class="block">
          <h2>
            该工厂的其他产品
            <span class="count">{{ supplierProductCount }} 款</span>
            <router-link class="block-link" :to="`/suppliers/${product.supplierId}/products`">
              查看全部
              <i class="el-icon-right"></i>
            </router-link>
          </h2>
          <div class="grid">
            <ProductCard v-for="item in sameSupplier" :key="item.id" :product="item" />
          </div>
        </section>

        <section v-if="related.length" v-reveal class="block">
          <h2>
            同类产品
            <span class="count">其他工厂</span>
            <router-link class="block-link" :to="`/products?cat=${encodeURIComponent(product.category)}`">
              查看更多 {{ product.category }}
              <i class="el-icon-right"></i>
            </router-link>
          </h2>
          <div class="grid">
            <ProductCard v-for="item in related" :key="item.id" :product="item" />
          </div>
        </section>
      </main>

      <aside class="side">
        <div class="price-card">
          <h3>报价参考</h3>
          <div class="price-main">
            <span>供应价</span>
            <strong>${{ product.price.toFixed(2) }}</strong>
            <small>起 · 不含运费</small>
          </div>
          <dl class="price-facts">
            <div><dt>参考零售价</dt><dd>${{ retailPrice.toFixed(2) }}</dd></div>
            <div><dt>预估毛利率</dt><dd>{{ margin }}%</dd></div>
            <div><dt>生产时间</dt><dd>{{ tp.production }}</dd></div>
          </dl>
          <el-button class="price-btn" type="primary" round @click="openSource">
            查看原始产品页
            <i class="el-icon-top-right"></i>
          </el-button>
          <p class="price-note">价格随尺码与颜色浮动，结算以第三方页面为准。</p>
        </div>

        <div v-if="supplier" class="supplier-card">
          <div class="supplier-head">
            <SupplierLogo
              :name="supplier.name"
              :monogram="supplier.monogram"
              :accent="supplier.accent"
              :size="48"
            />
            <div>
              <h3>{{ supplier.name }}</h3>
              <p>{{ supplier.location }}</p>
            </div>
          </div>

          <dl class="side-facts">
            <div><dt>生产周期</dt><dd>{{ supplier.productionDays }} 天</dd></div>
            <div><dt>最小起订</dt><dd>{{ supplier.minOrder }} 件</dd></div>
            <div><dt>目录起价</dt><dd>${{ priceFrom.toFixed(2) }}</dd></div>
            <div><dt>集成平台</dt><dd>{{ supplier.integrations.length }} 个</dd></div>
            <div v-if="supplier.rating"><dt>平台评分</dt><dd>{{ supplier.rating }} / 5</dd></div>
          </dl>

          <router-link class="side-cta" :to="`/suppliers/${product.supplierId}`">
            查看供应商详情
            <i class="el-icon-right"></i>
          </router-link>
        </div>

        <div class="aside-card">
          <h3>需要打样确认质量？</h3>
          <p>在供应商详情页提交样品申请，一个工作日内给出报价与排期。</p>
          <router-link class="aside-link" :to="`/suppliers/${product.supplierId}`">
            申请样品
            <i class="el-icon-right"></i>
          </router-link>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import ProductThumb from '@/components/ProductThumb.vue'
import ProductCard from '@/components/ProductCard.vue'
import SupplierLogo from '@/components/SupplierLogo.vue'
import { productById, productsBySupplier } from '@/data/products'
import { suppliers, supplierById } from '@/data/suppliers'
import { getSupplierProfile } from '@/data/supplierDetails'
import { shipsLabel } from '@/utils/supplierQuery'

const colorHex = {
  白色: '#ffffff',
  黑色: '#141419',
  藏青: '#22314f',
  运动灰: '#a8abb2',
  森林绿: '#2f4f3a',
  酒红: '#6b1f2a',
  米白: '#f4efe4',
  灰色: '#8d8f96',
  红色: '#c0392b',
  原木色: '#d3b28a',
  双色: 'linear-gradient(135deg, #ffffff 50%, #141419 50%)'
}

const fallbackSupplier = (product) => ({
  id: product.supplierId,
  name: product.supplierName,
  monogram: (product.supplierName || '?').slice(0, 2).toUpperCase(),
  accent: product.accent || '#5b4bff',
  location: '',
  productionDays: product.productionDays,
  minOrder: 1,
  priceFrom: product.price,
  integrations: [],
  shipsTo: [],
  printMethods: [],
  fulfillment: [],
  factories: [],
  rating: 0,
  website: product.supplierWebsite
})

export default {
  name: 'ProductDetailPage',
  components: { ProductThumb, ProductCard, SupplierLogo },
  computed: {
    product() {
      return productById(this.$route.params.id)
    },
    supplier() {
      if (!this.product) return null
      const raw = supplierById[this.product.supplierId]
      return raw ? getSupplierProfile(raw) : fallbackSupplier(this.product)
    },
    host() {
      const url = (this.supplier && this.supplier.website) || ''
      return url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
    },
    tp() {
      const product = this.product
      if (!product) return null
      if (product.thirdParty) return product.thirdParty
      return {
        site: this.host,
        url: product.supplierWebsite || '',
        syncedAt: '—',
        title: product.name,
        brand: product.supplierName,
        model: '',
        material: '以供应商目录为准',
        weight: '—',
        fit: '—',
        sizes: [],
        colors: [],
        colorCount: 0,
        printAreas: [],
        production: `${product.productionDays} 个工作日`,
        shippingFrom: '以结算页为准',
        rating: 0,
        reviews: 0,
        highlights: [],
        description: ''
      }
    },
    priceFrom() {
      return Number((this.supplier && this.supplier.priceFrom) || this.product.price)
    },
    retailPrice() {
      return Number((this.product.price * 1.6).toFixed(2))
    },
    margin() {
      if (!this.retailPrice) return 0
      return Math.round(((this.retailPrice - this.product.price) / this.retailPrice) * 100)
    },
    colorSwatches() {
      return (this.tp.colors || []).map((name) => ({
        name,
        hex: colorHex[name] || '#d9dbe6'
      }))
    },
    specSummary() {
      const parts = []
      if (this.tp.colorCount) parts.push(`${this.tp.colorCount} 色`)
      if (this.tp.sizes.length) parts.push(`${this.tp.sizes.length} 个尺码`)
      return parts.join(' / ') || '以目录为准'
    },
    shipsText() {
      return this.supplier && this.supplier.shipsTo && this.supplier.shipsTo.length
        ? shipsLabel(this.supplier)
        : '以工厂确认的地区为准'
    },
    fulfillmentText() {
      return this.supplier && this.supplier.fulfillment && this.supplier.fulfillment.length
        ? this.supplier.fulfillment.join(' · ')
        : '按需生产'
    },
    factoriesText() {
      return this.supplier && this.supplier.factories && this.supplier.factories.length
        ? this.supplier.factories.join(' · ')
        : '—'
    },
    overviewText() {
      if (!this.product) return ''
      const supplierName = this.supplier ? this.supplier.name : this.product.supplierName
      return `${this.tp.description} 数据采集自 ${this.tp.site} 的产品页，由 ${supplierName} 负责生产与发货，可按需单件起订。`
    },
    supplierProductCount() {
      if (!this.product) return 0
      return productsBySupplier(this.product.supplierId).length
    },
    sameSupplier() {
      if (!this.product) return []
      return productsBySupplier(this.product.supplierId)
        .filter((item) => item.id !== this.product.id)
        .slice(0, 3)
    },
    related() {
      if (!this.product) return []
      return suppliers
        .filter((item) => item.id !== this.product.supplierId)
        .reduce((list, item) => {
          const match = productsBySupplier(item.id).find(
            (entry) => entry.category === this.product.category
          )
          return match ? list.concat(match) : list
        }, [])
        .slice(0, 3)
    }
  },
  watch: {
    '$route.params.id'() {
      if (!this.product) this.$router.replace('/products')
    }
  },
  created() {
    if (!this.product) this.$router.replace('/products')
  },
  methods: {
    openSource() {
      if (!this.tp.url) {
        this.$message.info('该产品暂未提供原始页面链接')
        return
      }
      window.open(this.tp.url, '_blank', 'noopener')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid $line;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 50% 80% at 8% 0%, rgba(91, 75, 255, 0.14), transparent 62%),
    linear-gradient(180deg, #fbfbff 0%, #fff 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding-top: 26px;
  padding-bottom: 40px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
  font-size: 12.5px;
  font-weight: 600;
  color: $muted;

  a:hover {
    color: $primary;
  }

  i {
    font-size: 10px;
  }

  span {
    color: $ink-soft;
  }
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 40px;
  align-items: center;

  @include down(960px) {
    grid-template-columns: 1fr;
    gap: 26px;
  }
}

.hero-media {
  position: relative;
  height: 360px;
  padding: 22px;
  border: 1px solid $line;
  border-radius: $radius-lg;
  background: #fff;
  box-shadow: $shadow-sm;

  @include down(960px) {
    height: 300px;
  }

  @include down(560px) {
    height: 240px;
    padding: 14px;
  }
}

.hero-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 5px 11px;
  border: 1px solid $line;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.92);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: $primary;
  backdrop-filter: blur(6px);
}

.source-badge {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 99px;
  background: rgba(13, 16, 48, 0.82);
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  backdrop-filter: blur(6px);

  i {
    font-size: 10px;
  }
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: $primary;

  em {
    font-style: normal;
    color: $line;
  }

  a {
    color: $ink-soft;

    &:hover {
      color: $primary;
    }
  }
}

h1 {
  font-size: clamp(26px, 3.2vw, 38px);
  line-height: 1.14;
  letter-spacing: -0.035em;
  margin-bottom: 8px;
}

.subtitle {
  margin-bottom: 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: $muted;
}

.lead {
  max-width: 580px;
  font-size: 14px;
  line-height: 1.75;
  color: $ink-soft;
}

.hero-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 22px 0 20px;

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.fact {
  padding: 14px 16px;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.75);

  span {
    display: block;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $muted;
  }

  strong {
    display: block;
    margin: 5px 0 3px;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $ink;
    line-height: 1.25;
  }

  small {
    font-size: 11px;
    color: $muted;
  }
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 18px;
  border: 1px solid $line;
  border-radius: 99px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: $ink-soft;
  transition: border-color 0.25s $ease, color 0.25s $ease;

  i {
    font-size: 11px;
  }

  &:hover {
    border-color: rgba(91, 75, 255, 0.4);
    color: $primary;
  }
}

.sync-line {
  margin-top: 14px;
  font-size: 11.5px;
  line-height: 1.7;
  color: $muted;
}

.body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 40px;
  align-items: start;
  padding-top: 40px;
  padding-bottom: 96px;

  @include down(1000px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.main {
  min-width: 0;
}

.block {
  & + & {
    margin-top: 40px;
    padding-top: 36px;
    border-top: 1px solid $line;
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    font-size: 20px;
    letter-spacing: -0.025em;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: $ink;
  }
}

.count {
  padding: 3px 9px;
  border-radius: 99px;
  background: $bg-soft;
  font-size: 11.5px;
  font-weight: 700;
  color: $muted;
}

.block-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 11px;
  }

  &:hover {
    color: $primary-dark;
  }
}

.overview {
  font-size: 14.5px;
  line-height: 1.85;
  color: $ink-soft;
}

.highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;

  @include down(760px) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 14px 16px;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: #fbfbff;
    font-size: 12.5px;
    line-height: 1.6;
    color: $ink-soft;
  }

  i {
    margin-top: 3px;
    color: $success;
    font-size: 12px;
    flex-shrink: 0;
  }
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid $line;
  border-radius: $radius;
  background: $line;

  @include down(620px) {
    grid-template-columns: 1fr;
  }

  > div {
    padding: 14px 18px;
    background: #fff;
  }

  dt {
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $muted;
  }

  dd {
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
    color: $ink;
    word-break: break-word;
  }
}

.option-block {
  & + & {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px dashed $line;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      padding: 2px 8px;
      border-radius: 99px;
      background: $bg-soft;
      font-size: 11px;
      font-weight: 700;
      color: $muted;
    }
  }
}

.size-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    min-width: 46px;
    padding: 7px 14px;
    border: 1px solid $line;
    border-radius: 8px;
    background: #fff;
    font-size: 12.5px;
    font-weight: 600;
    color: $ink-soft;
    text-align: center;
  }

  &.print span {
    background: $primary-soft;
    border-color: rgba(91, 75, 255, 0.2);
    color: $primary;
  }

  em {
    font-size: 12px;
    font-style: normal;
    color: $muted;
  }
}

.colors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px 6px 7px;
  border: 1px solid $line;
  border-radius: 99px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: $ink-soft;

  i {
    width: 18px;
    height: 18px;
    border: 1px solid rgba(13, 16, 48, 0.12);
    border-radius: 50%;
  }
}

.more-colors {
  font-size: 12px;
  font-weight: 700;
  color: $primary;
}

.delivery-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @include down(900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.delivery {
  padding: 14px 16px;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: #fff;

  span {
    display: block;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: $muted;
  }

  strong {
    display: block;
    margin: 6px 0 4px;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.35;
    color: $ink;
  }

  small {
    font-size: 11px;
    color: $muted;
  }
}

.delivery-note {
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.7;
  color: $muted;
}

.source-card {
  padding: 20px;
  border: 1px solid rgba(91, 75, 255, 0.18);
  border-radius: $radius;
  background: linear-gradient(165deg, #f8f7ff 0%, #ffffff 72%);
}

.source-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 24px;

  @include down(620px) {
    grid-template-columns: 1fr;
  }

  > div {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    font-size: 12.5px;
  }

  dt {
    color: $muted;
    white-space: nowrap;
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: $ink-soft;
    text-align: right;
    word-break: break-word;
  }

  .span-2 {
    grid-column: 1 / -1;
  }
}

.mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 11.5px !important;
  word-break: break-all;
}

.source-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed rgba(91, 75, 255, 0.2);
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 11px;
  }

  &:hover {
    color: $primary-dark;
  }
}

.source-note {
  font-size: 11.5px;
  color: $muted;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @include down(900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.side {
  position: sticky;
  top: calc(#{$header-h} + 20px);
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include down(1000px) {
    position: static;
  }
}

.price-card {
  @include card;
  padding: 22px;

  h3 {
    margin-bottom: 14px;
    font-size: 13.5px;
    font-weight: 800;
  }
}

.price-main {
  padding-bottom: 14px;
  border-bottom: 1px solid $line;

  span {
    display: block;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $muted;
  }

  strong {
    display: block;
    margin: 4px 0 2px;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: $ink;
  }

  small {
    font-size: 11.5px;
    color: $muted;
  }
}

.price-facts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 0;

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12.5px;
  }

  dt {
    color: $muted;
  }

  dd {
    margin: 0;
    font-weight: 700;
    color: $ink-soft;
  }
}

.price-btn {
  width: 100%;
}

.price-note {
  margin-top: 10px;
  font-size: 11px;
  line-height: 1.7;
  color: $muted;
}

.supplier-card {
  @include card;
  padding: 22px;
}

.supplier-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  h3 {
    margin-bottom: 3px;
    font-size: 15.5px;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 12px;
    color: $muted;
  }
}

.side-facts {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-bottom: 16px;
  border-bottom: 1px solid $line;

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12.5px;
  }

  dt {
    color: $muted;
  }

  dd {
    margin: 0;
    font-weight: 700;
    color: $ink-soft;
  }
}

.side-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  padding: 11px 16px;
  border-radius: 99px;
  background: $primary;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  transition: background 0.25s $ease, transform 0.25s $ease;

  i {
    font-size: 11px;
  }

  &:hover {
    background: $primary-dark;
    transform: translateY(-1px);
  }
}

.aside-card {
  padding: 22px;
  border: 1px solid rgba(91, 75, 255, 0.18);
  border-radius: $radius-lg;
  background: linear-gradient(165deg, #f8f7ff 0%, #ffffff 70%);

  h3 {
    margin-bottom: 8px;
    font-size: 15px;
  }

  p {
    font-size: 12.5px;
    line-height: 1.7;
    color: $muted;
    margin-bottom: 14px;
  }
}

.aside-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 11px;
  }
}

@include down(560px) {
  .hero-inner {
    padding-bottom: 30px;
  }

  .body {
    padding-top: 28px;
    padding-bottom: 64px;
  }

  .hero-actions {
    :deep(.el-button) {
      width: 100%;
    }
  }

  .ghost-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
