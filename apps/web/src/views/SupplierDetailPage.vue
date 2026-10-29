<template>
  <div v-if="profile.id" class="supplier-detail">
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-inner">
        <nav class="crumbs" aria-label="面包屑导航">
          <router-link to="/">首页</router-link>
          <i class="el-icon-arrow-right"></i>
          <router-link to="/suppliers">供应商</router-link>
          <i class="el-icon-arrow-right"></i>
          <span>{{ profile.name }}</span>
        </nav>

        <div class="hero-row">
          <div class="hero-id">
            <SupplierLogo
              :name="profile.name"
              :monogram="profile.monogram"
              :accent="profile.accent"
              :size="68"
            />
            <div>
              <span class="hero-tag">POD 供应商</span>
              <h1>{{ profile.name }} 按需打印供应商</h1>
              <p class="hero-loc">
                <i class="el-icon-location-outline"></i>
                {{ profile.location }}
                <em>· 成立于 {{ profile.since }} 年</em>
              </p>
            </div>
          </div>

          <div class="hero-actions">
            <el-button type="primary" size="large" round @click="visitSite">
              访问 {{ profile.name }}
              <i class="el-icon-top-right"></i>
            </el-button>
            <el-button size="large" round @click="$router.push('/comparisons')">
              与其他平台对比
            </el-button>
          </div>
        </div>

        <p class="hero-intro">{{ profile.intro }}</p>

        <p class="affiliate">
          <i class="el-icon-link"></i>
          联盟链接：我们可能获得佣金，但不会增加你的任何费用。
          <a href="#" @click.prevent="terms">查看条款</a>
        </p>
      </div>
    </section>

    <div class="container body">
      <div class="main">
        <WebsiteShot :supplier="profile" :src="profile.screenshot || ''" />

        <ul class="facts">
          <li v-for="fact in facts" :key="fact.label">
            <span>{{ fact.label }}</span>
            <strong>{{ fact.value }}</strong>
          </li>
        </ul>

        <section class="block">
          <div class="rating">
            <span class="rating-score">{{ rating.score.toFixed(1) }}</span>
            <div class="rating-body">
              <el-rate :value="rating.score" disabled allow-half />
              <p>{{ rating.source }} · {{ rating.reviews.toLocaleString() }} 条评价</p>
            </div>
            <span class="rating-updated">第三方评分 · 更新于 {{ profile.updated }}</span>
          </div>
        </section>

        <section class="block">
          <h2>
            产品 <span class="count">{{ profile.products }} 款</span>
            <router-link class="block-link" :to="`/suppliers/${profile.id}/products`">
              浏览产品目录
              <i class="el-icon-right"></i>
            </router-link>
          </h2>
          <p class="lead">
            目录覆盖 {{ profile.categories.length }} 个品类，具体可售情况取决于生产国家与底衫颜色。
          </p>
          <ul class="pills">
            <li v-for="item in profile.productList" :key="item">{{ variantName(item) }}</li>
          </ul>
          <router-link
            class="products-cta"
            :to="`/suppliers/${profile.id}/products`"
            :aria-label="`浏览 ${profile.name} 在售产品`"
          >
            <span class="products-cta__label">
              <i class="el-icon-s-goods"></i>
              查看 {{ host }} 的产品
            </span>
            <span class="products-cta__go">
              打开产品目录
              <i class="el-icon-right"></i>
            </span>
          </router-link>
        </section>

        <section class="block">
          <h2>印刷工艺</h2>
          <ul class="method-list">
            <li v-for="method in profile.printMethods" :key="method">
              <i class="el-icon-check"></i>
              {{ method }}
            </li>
          </ul>
        </section>

        <section class="block">
          <h2>可对接平台</h2>
          <ul class="integration-list">
            <li v-for="item in profile.integrations" :key="item">
              <i class="el-icon-connection"></i>
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="block">
          <h2>履约与配送</h2>
          <div class="split">
            <div>
              <h3>配送范围</h3>
              <p>{{ shipsText }}</p>
            </div>
            <div>
              <h3>服务类型</h3>
              <p>{{ profile.fulfillment.join(' · ') }}</p>
            </div>
          </div>
        </section>

        <section class="block">
          <h2>工厂分布</h2>
          <ul class="factory-list">
            <li v-for="place in profile.factories" :key="place">
              <i class="el-icon-location-outline"></i>
              {{ place }}
            </li>
          </ul>
        </section>
      </div>

      <aside class="side">
        <div class="sample">
          <h2>申请 {{ profile.name }} 样品</h2>
          <p class="sample-desc">
            上架前先确认印刷质量与交付时效。申请会在一个工作日内处理。
          </p>

          <label class="field-label">产品类型</label>
          <el-select v-model="form.productType" placeholder="选择产品">
            <el-option v-for="item in productTypes" :key="item" :label="item" :value="item" />
          </el-select>

          <label class="field-label">收货国家</label>
          <el-select v-model="form.country" placeholder="选择国家">
            <el-option v-for="item in countries" :key="item" :label="item" :value="item" />
          </el-select>

          <label class="field-label">邮箱</label>
          <el-input v-model="form.email" type="email" placeholder="you@yourstore.com" />

          <label class="field-label">
            月订单量 <span>选填</span>
          </label>
          <el-select v-model="form.volume" placeholder="选择区间">
            <el-option v-for="item in volumes" :key="item" :label="item" :value="item" />
          </el-select>

          <el-button type="primary" class="sample-btn" @click="submitSample">提交申请</el-button>

          <p v-if="submitted" class="sample-done">
            <i class="el-icon-circle-check"></i>
            已记录申请，我们会通过 {{ form.email }} 与你联系。
          </p>
          <p v-else class="sample-note">演示表单 · 不收取样品费用。</p>
        </div>

        <div class="side-facts">
          <h3>速览</h3>
          <dl>
            <div><dt>起价</dt><dd>${{ profile.priceFrom.toFixed(2) }}</dd></div>
            <div><dt>生产周期</dt><dd>{{ profile.productionDays }} 天</dd></div>
            <div><dt>最小起订</dt><dd>{{ profile.minOrder }} 件</dd></div>
            <div><dt>配送范围</dt><dd>{{ shipsText }}</dd></div>
          </dl>
        </div>
      </aside>
    </div>

    <section v-if="similar.length" class="similar">
      <div class="container">
        <div class="similar-head">
          <h2>相似的按需打印供应商</h2>
          <router-link to="/suppliers">
            查看全部供应商
            <i class="el-icon-right"></i>
          </router-link>
        </div>
        <div class="similar-grid">
          <SupplierCard v-for="item in similar" :key="item.id" :supplier="item" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SupplierLogo from '@/components/SupplierLogo.vue'
import SupplierCard from '@/components/SupplierCard.vue'
import WebsiteShot from '@/components/WebsiteShot.vue'
import { suppliers } from '@/data/suppliers'
import {
  getSupplierProfile,
  sampleProductTypes,
  sampleCountries
} from '@/data/supplierDetails'
import { variantName } from '@/data/products'
import { shipsLabel } from '@/utils/supplierQuery'

export default {
  name: 'SupplierDetailPage',
  components: { SupplierLogo, SupplierCard, WebsiteShot },
  data() {
    return {
      productTypes: sampleProductTypes,
      countries: sampleCountries,
      volumes: ['50 单以下', '50–200 单', '200–1,000 单', '1,000 单以上'],
      form: { productType: '', country: '', email: '', volume: '' },
      submitted: false
    }
  },
  computed: {
    profile() {
      const supplier = suppliers.find((item) => item.id === this.$route.params.id)
      return supplier ? getSupplierProfile(supplier) : {}
    },
    shipsText() {
      return this.profile.shipsTo ? shipsLabel(this.profile) : ''
    },
    host() {
      return (this.profile.website || '')
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
    },
    rating() {
      return this.profile.rating || { source: '—', score: 0, reviews: 0 }
    },
    facts() {
      if (!this.profile.id) return []
      return [
        { label: '所在地', value: this.profile.location },
        { label: '产品', value: `${this.profile.products} 款` },
        { label: '集成平台', value: `${this.profile.integrations.length} 个` },
        { label: '配送范围', value: this.shipsText },
        { label: '生产周期', value: `${this.profile.productionDays} 天` },
        { label: '最小起订', value: `${this.profile.minOrder} 件` }
      ]
    },
    similar() {
      if (!this.profile.id) return []
      return suppliers
        .filter((item) => item.id !== this.profile.id)
        .map((item) => ({
          item,
          score: item.categories.filter((c) => this.profile.categories.includes(c)).length
        }))
        .sort((a, b) => b.score - a.score || Number(b.item.featured) - Number(a.item.featured))
        .slice(0, 3)
        .map((entry) => entry.item)
    }
  },
  watch: {
    '$route.params.id'() {
      this.submitted = false
      this.form = { productType: '', country: '', email: '', volume: '' }
      if (!this.profile.id) this.$router.replace('/suppliers')
    }
  },
  created() {
    if (!this.profile.id) this.$router.replace('/suppliers')
  },
  methods: {
    visitSite() {
      window.open(this.profile.website, '_blank', 'noopener')
    },
    terms() {
      this.$message.info('联盟推广条款页面将在后续版本上线。')
    },
    submitSample() {
      const { productType, country, email } = this.form
      if (!productType || !country || !email) {
        this.$message.warning('请填写产品类型、国家和邮箱。')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        this.$message.error('邮箱地址格式不正确。')
        return
      }
      this.submitted = true
      this.$message.success(`已记录「${productType}」的样品申请。`)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.hero {
  position: relative;
  border-bottom: 1px solid $line;
  overflow: hidden;
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
  padding-bottom: 32px;
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

.hero-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 26px;
  flex-wrap: wrap;
}

.hero-id {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

.hero-tag {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: $primary;
}

h1 {
  font-size: clamp(25px, 3.2vw, 38px);
  letter-spacing: -0.035em;
  line-height: 1.14;
  margin-bottom: 10px;
}

.hero-loc {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: $ink-soft;

  i {
    color: $muted;
  }

  em {
    font-style: normal;
    color: $muted;
  }
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  i {
    margin-left: 5px;
    font-size: 12px;
  }
}

.hero-intro {
  max-width: 760px;
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.75;
  color: $ink-soft;
}

.affiliate {
  margin-top: 14px;
  font-size: 11.5px;
  line-height: 1.6;
  color: $muted;

  i {
    margin-right: 5px;
  }

  a {
    color: $ink-soft;
    white-space: nowrap;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}

.body {
  display: grid;
  grid-template-columns: 1fr 344px;
  gap: 40px;
  padding-top: 36px;
  padding-bottom: 80px;
  align-items: start;
}

.facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin-bottom: 34px;
  border: 1px solid $line;
  border-radius: 16px;
  overflow: hidden;
  background: $line;

  li {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 14px 16px;
    background: #fff;
  }

  span {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: $muted;
  }

  strong {
    font-size: 14px;
    font-weight: 700;
    color: $ink;
    line-height: 1.4;
  }
}

.block {
  padding: 26px 0;
  border-top: 1px solid $line;

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 19px;
    margin-bottom: 14px;
    letter-spacing: -0.02em;
  }

  h3 {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: $muted;
    margin-bottom: 6px;
  }

  p {
    font-size: 14px;
    line-height: 1.75;
    color: $ink-soft;
  }
}

.count {
  padding: 3px 9px;
  border-radius: 99px;
  background: $bg-soft;
  font-size: 11px;
  font-weight: 700;
  color: $muted;
}

.lead {
  margin-bottom: 16px;
}

.block-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 700;
  color: $primary;
  white-space: nowrap;

  i {
    font-size: 11px;
  }

  &:hover {
    color: $primary-dark;
  }
}

.products-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid $line;
  border-radius: 14px;
  background: linear-gradient(120deg, $primary-soft, #fff 62%);
  transition: border-color 0.3s $ease, box-shadow 0.3s $ease, transform 0.3s $ease;

  &:hover {
    border-color: rgba(91, 75, 255, 0.4);
    box-shadow: $shadow-sm;
    transform: translateY(-1px);
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    font-weight: 700;
    color: $ink;
    min-width: 0;

    i {
      font-size: 14px;
      color: $primary;
    }
  }

  &__go {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    font-weight: 800;
    color: $primary;
    white-space: nowrap;

    i {
      font-size: 11px;
    }
  }
}

.rating {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border: 1px solid $line;
  border-radius: 16px;
  background: $bg-soft;
}

.rating-score {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: $ink;
  line-height: 1;
}

.rating-body {
  :deep(.el-rate__icon) {
    font-size: 15px;
    margin-right: 2px;
  }

  p {
    font-size: 12px;
    color: $muted;
  }
}

.rating-updated {
  margin-left: auto;
  font-size: 11.5px;
  color: $muted;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    padding: 6px 11px;
    border-radius: 8px;
    border: 1px solid $line;
    background: #fff;
    font-size: 12.5px;
    font-weight: 600;
    color: $ink-soft;
    text-transform: capitalize;
  }
}

.method-list,
.integration-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 20px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    color: $ink-soft;

    i {
      color: $success;
      font-size: 13px;
    }
  }
}

.integration-list i {
  color: $primary;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
}

.factory-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 11px;
    border-radius: 8px;
    background: $bg-soft;
    font-size: 12.5px;
    font-weight: 600;
    color: $ink-soft;

    i {
      color: $primary;
    }
  }
}

.side {
  position: sticky;
  top: calc(#{$header-h} + 20px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sample {
  padding: 22px;
  border-radius: 20px;
  border: 1px solid $line;
  background: #fff;
  box-shadow: $shadow-sm;

  h2 {
    font-size: 16.5px;
    margin-bottom: 8px;
  }
}

.sample-desc {
  font-size: 12.5px;
  line-height: 1.65;
  color: $muted;
  margin-bottom: 18px;
}

.field-label {
  display: block;
  margin: 14px 0 7px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $muted;

  span {
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    color: #a6abc2;
  }
}

.sample-btn {
  width: 100%;
  margin-top: 18px;
  height: 42px;
  border-radius: 11px;
}

.sample-note,
.sample-done {
  margin-top: 10px;
  font-size: 11.5px;
  color: $muted;
}

.sample-done {
  display: flex;
  align-items: center;
  gap: 6px;
  color: $success;
}

.side-facts {
  padding: 20px 22px;
  border-radius: 18px;
  background: $bg-soft;

  h3 {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $muted;
    margin-bottom: 12px;
  }

  dl > div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px dashed rgba(13, 16, 48, 0.08);

    &:last-child {
      border-bottom: none;
    }
  }

  dt {
    font-size: 12px;
    color: $muted;
  }

  dd {
    margin: 0;
    font-size: 12.5px;
    font-weight: 700;
    color: $ink;
    text-align: right;
  }
}

.similar {
  padding: 62px 0 84px;
  background: $bg-soft;
  border-top: 1px solid $line;
}

.similar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
  flex-wrap: wrap;

  h2 {
    font-size: clamp(20px, 2.4vw, 26px);
    letter-spacing: -0.03em;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 700;
    color: $primary;

    i {
      font-size: 11px;
    }
  }
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

@include down(1080px) {
  .body {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .side {
    position: static;
  }

  .similar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include down(760px) {
  .facts {
    grid-template-columns: repeat(2, 1fr);
  }

  .split,
  .method-list,
  .integration-list {
    grid-template-columns: 1fr;
  }

  .similar-grid {
    grid-template-columns: 1fr;
  }

  .rating-updated {
    margin-left: 0;
  }
}
</style>
