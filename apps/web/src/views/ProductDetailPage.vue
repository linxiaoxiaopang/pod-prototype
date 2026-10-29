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
            <p class="lead">{{ leadText }}</p>

            <div class="hero-facts">
              <div class="fact">
                <span>基础价</span>
                <strong>${{ product.price.toFixed(2) }}</strong>
                <small>起 · 不含运费</small>
              </div>
              <div class="fact">
                <span>生产时效</span>
                <strong>{{ product.productionDays }} 天</strong>
                <small>印刷 + 备货</small>
              </div>
              <div class="fact">
                <span>可选规格</span>
                <strong>{{ product.options }}</strong>
                <small>以工厂目录为准</small>
              </div>
            </div>

            <div class="hero-actions">
              <el-button type="primary" size="large" round @click="visitSite">
                前往 {{ host }} 查看
                <i class="el-icon-top-right"></i>
              </el-button>
              <router-link class="ghost-btn" to="/products">
                返回产品目录
                <i class="el-icon-right"></i>
              </router-link>
            </div>

            <p class="affiliate">
              <i class="el-icon-link"></i>
              联盟链接：通过该链接下单我们可能获得佣金，不会增加你的费用。
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container body">
      <main class="main">
        <section v-reveal class="block">
          <h2>产品概览</h2>
          <p class="overview">{{ overviewText }}</p>
          <ul class="pills">
            <li>{{ product.category }}</li>
            <li v-for="item in optionParts" :key="item">{{ item }}</li>
            <li>{{ product.productionDays }} 天生产</li>
            <li v-if="product.badge">{{ product.badge }}</li>
          </ul>
        </section>

        <section v-reveal class="block">
          <h2>规格与选项</h2>
          <dl class="spec-grid">
            <div><dt>产品名称</dt><dd>{{ product.name }}</dd></div>
            <div><dt>产品品类</dt><dd>{{ product.category }}</dd></div>
            <div><dt>可选规格</dt><dd>{{ product.options }}</dd></div>
            <div><dt>生产时效</dt><dd>{{ product.productionDays }} 个工作日</dd></div>
            <div><dt>产品编号</dt><dd class="mono">{{ product.id }}</dd></div>
            <div><dt>数据来源</dt><dd>{{ host }} 公开产品目录</dd></div>
          </dl>

          <div v-if="optionParts.length" class="option-row">
            <span class="option-label">规格拆分</span>
            <div class="option-chips">
              <span v-for="item in optionParts" :key="item">{{ item }}</span>
            </div>
          </div>
        </section>

        <section v-reveal class="block">
          <h2>印刷与履约</h2>
          <p class="lead">
            由 {{ supplier.name }} 负责印刷与发货，{{ shipsText }}；具体工艺可用性以工厂确认为准。
          </p>

          <div class="split">
            <div>
              <h3>印刷工艺</h3>
              <ul class="check-list">
                <li v-for="item in printMethods" :key="item">
                  <i class="el-icon-check"></i>
                  {{ item }}
                </li>
                <li v-if="!printMethods.length" class="muted">以工厂报价单为准</li>
              </ul>
            </div>

            <div>
              <h3>履约信息</h3>
              <dl class="mini-facts">
                <div><dt>配送范围</dt><dd>{{ shipsText }}</dd></div>
                <div><dt>服务类型</dt><dd>{{ fulfillmentText }}</dd></div>
                <div><dt>最小起订</dt><dd>{{ supplier.minOrder }} 件</dd></div>
                <div><dt>工厂分布</dt><dd>{{ factoriesText }}</dd></div>
              </dl>
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
    priceFrom() {
      return Number((this.supplier && this.supplier.priceFrom) || this.product.price)
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
    printMethods() {
      return (this.supplier && this.supplier.printMethods) || []
    },
    optionParts() {
      if (!this.product || !this.product.options) return []
      return String(this.product.options)
        .split('·')
        .map((item) => item.trim())
        .filter(Boolean)
    },
    leadText() {
      if (!this.product) return ''
      return `${this.product.name} 属于 ${this.product.category} 品类，由 ${
        this.supplier ? this.supplier.name : this.product.supplierName
      } 提供，基础价 $${this.product.price.toFixed(2)}，${this.product.productionDays} 天完成印刷与发货。`
    },
    overviewText() {
      if (!this.product) return ''
      const supplierName = this.supplier ? this.supplier.name : this.product.supplierName
      return `这款${this.product.name}来自 ${supplierName} 的公开产品目录，可选规格为 ${
        this.product.options
      }。适合用于品牌周边、活动定制与礼品场景；下单后按你的设计按需生产，无需提前备货，${
        this.product.productionDays
      } 个工作日内完成生产并发货。`
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
    visitSite() {
      const url = (this.supplier && this.supplier.website) || ''
      if (!url) {
        this.$message.info('该产品暂未提供官网链接')
        return
      }
      window.open(url, '_blank', 'noopener')
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
  text-transform: uppercase;
  color: $primary;
  backdrop-filter: blur(6px);
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
  font-size: clamp(26px, 3.4vw, 40px);
  line-height: 1.14;
  letter-spacing: -0.035em;
  margin-bottom: 12px;
}

.lead {
  max-width: 560px;
  font-size: 14.5px;
  line-height: 1.75;
  color: $ink-soft;
}

.hero-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 24px 0 22px;

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
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $ink;
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

.affiliate {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 11.5px;
  color: $muted;

  i {
    font-size: 11px;
  }
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
    margin-bottom: 14px;
    font-size: 20px;
    letter-spacing: -0.025em;
  }

  > .lead {
    margin-bottom: 18px;
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

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;

  li {
    padding: 6px 12px;
    border: 1px solid $line;
    border-radius: 99px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    color: $ink-soft;
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
  }
}

.mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px !important;
  color: $ink-soft !important;
  word-break: break-all;
}

.option-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 18px;
}

.option-label {
  flex-shrink: 0;
  padding-top: 5px;
  font-size: 12px;
  font-weight: 700;
  color: $muted;
}

.option-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 5px 12px;
    border-radius: 8px;
    background: $primary-soft;
    font-size: 12px;
    font-weight: 700;
    color: $primary;
  }
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @include down(720px) {
    grid-template-columns: 1fr;
  }
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $ink-soft;
  }

  i {
    color: $success;
    font-size: 12px;
  }

  .muted {
    color: $muted;
  }
}

.mini-facts {
  display: flex;
  flex-direction: column;
  gap: 9px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding-bottom: 8px;
    border-bottom: 1px dashed $line;
    font-size: 12.5px;

    &:last-child {
      border-bottom: none;
    }
  }

  dt {
    color: $muted;
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: $ink-soft;
    text-align: right;
  }
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
