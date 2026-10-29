<template>
  <div class="page">
    <header class="page-head">
      <div>
        <button class="back" type="button" @click="back">
          <i class="el-icon-arrow-left"></i>
          返回产品目录
        </button>
        <div class="title-line">
          <h1>{{ row ? row.name : '产品详情' }}</h1>
          <StatusTag v-if="row" :status="row.status" />
        </div>
        <p v-if="row">{{ row.supplier }} · {{ row.category }} · 更新于 {{ row.updated }}</p>
      </div>
      <div v-if="row" class="head-actions">
        <el-button round icon="el-icon-view" @click="preview">业务端预览</el-button>
        <el-button type="primary" round icon="el-icon-edit" @click="edit">编辑产品</el-button>
      </div>
    </header>

    <div v-if="row" class="detail-layout">
      <div class="main-col">
        <div class="panel overview">
          <div class="media">
            <span>{{ initials }}</span>
            <em>{{ row.category }}</em>
          </div>

          <div class="overview-body">
            <h2>产品信息</h2>
            <p class="desc">
              {{ row.description || '暂无产品描述，可在编辑页补充面料、克重与印刷卖点。' }}
            </p>

            <dl class="facts">
              <div><dt>产品编号</dt><dd>{{ row.sku || row.id }}</dd></div>
              <div><dt>产品品类</dt><dd>{{ row.category }}</dd></div>
              <div><dt>所属供应商</dt><dd>{{ row.supplier }}</dd></div>
              <div><dt>生产时效</dt><dd>{{ row.productionDays }} 天</dd></div>
              <div><dt>印刷配置</dt><dd>{{ row.printArea || '—' }} · {{ row.printMethod || '—' }}</dd></div>
              <div><dt>更新时间</dt><dd>{{ row.updated }}</dd></div>
            </dl>
          </div>
        </div>

        <div class="panel spec-panel">
          <header class="panel-head">
            <h2>价格与规格</h2>
            <span class="hint">基础价为供应商结算价，不含运费</span>
          </header>

          <div class="price-grid">
            <div class="price-box">
              <span>基础价</span>
              <strong>${{ row.price.toFixed(2) }}</strong>
              <small>USD / 件</small>
            </div>
            <div class="price-box">
              <span>建议零售价</span>
              <strong>${{ retailPrice.toFixed(2) }}</strong>
              <small>运营参考</small>
            </div>
            <div class="price-box">
              <span>预估毛利率</span>
              <strong>{{ margin }}%</strong>
              <small>按零售价计算</small>
            </div>
          </div>

          <div class="spec-row">
            <h3>可选颜色</h3>
            <div class="chips">
              <span v-for="item in colors" :key="item">{{ item }}</span>
              <em v-if="!colors.length">未配置</em>
            </div>
          </div>

          <div class="spec-row">
            <h3>可选尺码</h3>
            <div class="chips">
              <span v-for="item in sizes" :key="item">{{ item }}</span>
              <em v-if="!sizes.length">未配置</em>
            </div>
          </div>
        </div>

        <div class="panel source-panel">
          <header class="panel-head">
            <h2>第三方数据来源</h2>
            <div class="source-tools">
              <span class="source-tag">{{ sourceMethod }}</span>
              <el-button size="mini" round icon="el-icon-refresh" @click="resync">重新同步</el-button>
            </div>
          </header>

          <dl class="facts">
            <div><dt>来源站点</dt><dd>{{ sourceSite }}</dd></div>
            <div><dt>最近同步</dt><dd>{{ sourceSynced }}</dd></div>
            <div><dt>原始标题</dt><dd>{{ sourceTitle }}</dd></div>
            <div><dt>同步方式</dt><dd>{{ sourceMethod }}</dd></div>
            <div class="span-2">
              <dt>原始页面</dt>
              <dd class="break">
                <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener">{{ sourceUrl }}</a>
                <span v-else>—</span>
              </dd>
            </div>
          </dl>

          <p class="source-note">
            产品价格、规格与描述均以第三方页面为准；同步失败或页面改版时，可重新同步或在编辑页手动修正。
          </p>
        </div>
      </div>

      <aside class="side">
        <div class="panel side-panel">
          <h3>目录状态</h3>
          <div class="status-row">
            <StatusTag :status="row.status" />
            <span class="muted">{{ row.status === 'live' ? '业务端可见' : '业务端不可见' }}</span>
          </div>
          <div class="switch-row">
            <el-switch :value="row.status === 'live'" @change="setLive" />
            <span>在业务端产品目录展示</span>
          </div>
          <p class="form-tip">下架后记录仍保留在后台，可随时重新上架。</p>
        </div>

        <div class="panel side-panel">
          <h3>供应商</h3>
          <div class="supplier-head">
            <span class="avatar">{{ supplierInitials }}</span>
            <div>
              <strong>{{ row.supplier }}</strong>
              <small>{{ supplier ? supplier.location : '未匹配到供应商记录' }}</small>
            </div>
          </div>

          <dl v-if="supplier" class="mini-facts">
            <div><dt>生产时效</dt><dd>{{ supplier.productionDays }} 天</dd></div>
            <div><dt>集成平台</dt><dd>{{ supplier.integrations }} 个</dd></div>
            <div><dt>供应商状态</dt><dd>{{ supplierStatusLabel }}</dd></div>
          </dl>

          <el-button size="small" round class="side-btn" @click="openSupplier">查看供应商</el-button>
        </div>

        <div class="panel side-panel">
          <h3>同供应商产品</h3>
          <ul class="related">
            <li v-for="item in related" :key="item.id">
              <router-link :to="`/products/${item.id}`">
                <strong>{{ item.name }}</strong>
                <small>${{ item.price.toFixed(2) }} · {{ item.productionDays }} 天</small>
              </router-link>
            </li>
            <li v-if="!related.length" class="related-empty">暂无其他产品</li>
          </ul>
        </div>
      </aside>
    </div>

    <div v-else class="panel empty">
      <el-empty description="产品不存在或已被删除">
        <el-button type="primary" round @click="back">返回产品目录</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script>
import StatusTag from '@/components/StatusTag.vue'
import { statusOptions } from '@/data/adminData'
import { findProduct, listProducts, listSuppliers, saveProducts, today } from '@/data/adminStore'

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

export default {
  name: 'ProductDetailAdminPage',
  components: { StatusTag },
  data() {
    return {
      row: null,
      suppliers: listSuppliers(),
      products: listProducts()
    }
  },
  computed: {
    supplier() {
      if (!this.row) return null
      return this.suppliers.find((item) => item.name === this.row.supplier) || null
    },
    supplierInitials() {
      return (this.row.supplier || '—').slice(0, 2).toUpperCase()
    },
    supplierStatusLabel() {
      if (!this.supplier) return '—'
      return (statusOptions.find((item) => item.value === this.supplier.status) || {}).label || '—'
    },
    initials() {
      return (this.row.name || 'PD').slice(0, 2).toUpperCase()
    },
    retailPrice() {
      if (!this.row) return 0
      return Number(this.row.retailPrice || this.row.price * 1.6)
    },
    margin() {
      if (!this.row || !this.retailPrice) return 0
      return Math.round(((this.retailPrice - this.row.price) / this.retailPrice) * 100)
    },
    colors() {
      return (this.row && this.row.colors) || []
    },
    sizes() {
      return (this.row && this.row.sizes) || []
    },
    related() {
      if (!this.row) return []
      return this.products
        .filter((item) => item.supplier === this.row.supplier && item.id !== this.row.id)
        .slice(0, 4)
    },
    sourceSite() {
      if (!this.row) return '—'
      if (this.row.source && this.row.source.site) return this.row.source.site
      const website = (this.supplier && this.supplier.website) || ''
      return (
        website
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/$/, '') || '—'
      )
    },
    sourceUrl() {
      if (!this.row) return ''
      return (this.row.source && this.row.source.url) || (this.supplier && this.supplier.website) || ''
    },
    sourceSynced() {
      if (!this.row) return '—'
      return (this.row.source && this.row.source.collectedAt) || this.row.updated
    },
    sourceMethod() {
      return this.row && this.row.source ? '谷歌插件采集' : '供应商目录同步'
    },
    sourceTitle() {
      if (!this.row) return '—'
      if (this.row.thirdParty && this.row.thirdParty.title) return this.row.thirdParty.title
      return this.row.name
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(value) {
        this.load(value)
      }
    }
  },
  methods: {
    load(id) {
      this.products = listProducts()
      this.suppliers = listSuppliers()
      this.row = id ? findProduct(id) : null
    },
    back() {
      this.$router.push('/products').catch(() => {})
    },
    edit() {
      this.$router.push(`/products/${this.row.id}/edit`).catch(() => {})
    },
    preview() {
      const query = encodeURIComponent(this.row.name)
      window.open(`${webUrl}/#/products?q=${query}`, '_blank', 'noopener')
    },
    openSupplier() {
      if (this.supplier) {
        this.$router.push(`/suppliers/${this.supplier.id}/edit`).catch(() => {})
        return
      }
      this.$router.push({ path: '/suppliers', query: { q: this.row.supplier } }).catch(() => {})
    },
    setLive(enabled) {
      this.row.status = enabled ? 'live' : 'paused'
      this.row.updated = today()
      this.products = saveProducts(
        this.products.map((item) => (item.id === this.row.id ? { ...item, ...this.row } : item))
      )
      this.$message.success(`${this.row.name} 已${enabled ? '上架' : '下架'}`)
    },
    resync() {
      this.row.updated = today()
      this.products = saveProducts(
        this.products.map((item) => (item.id === this.row.id ? { ...item, ...this.row } : item))
      )
      this.$message.success(`已触发从 ${this.sourceSite} 重新同步`)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';
@use './admin-form';

.title-line {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  h1 {
    margin-bottom: 0;
  }
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;

  @include down(1080px) {
    grid-template-columns: 1fr;
  }
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.overview {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 22px;
  padding: 22px;

  @include down(760px) {
    grid-template-columns: 1fr;
  }
}

.media {
  position: relative;
  display: grid;
  place-items: center;
  height: 220px;
  border-radius: $radius;
  background: linear-gradient(150deg, #efecff 0%, #f8f8ff 55%, #e9f6ff 100%);

  span {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: rgba(91, 75, 255, 0.55);
  }

  em {
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 3px 9px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.88);
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: $ink-soft;
  }

  @include down(760px) {
    height: 160px;
  }
}

.overview-body {
  min-width: 0;

  h2 {
    margin-bottom: 8px;
    font-size: 15px;
  }
}

.desc {
  margin-bottom: 16px;
  font-size: 12.5px;
  line-height: 1.75;
  color: $muted;
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  padding-top: 14px;
  border-top: 1px solid $line;

  > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
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

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.spec-panel {
  padding: 20px 22px 18px;
}

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 14px;

  h2 {
    font-size: 15px;
  }
}

.hint {
  font-size: 11.5px;
  color: $muted;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @include down(620px) {
    grid-template-columns: 1fr;
  }
}

.price-box {
  padding: 14px 16px;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: #fafbff;

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
    margin: 5px 0 3px;
    font-size: 21px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $ink;
  }

  small {
    font-size: 11px;
    color: $muted;
  }
}

.spec-row {
  padding-top: 16px;

  h3 {
    margin-bottom: 9px;
    font-size: 12.5px;
    font-weight: 700;
    color: $ink;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  span {
    padding: 4px 11px;
    border-radius: 7px;
    background: $bg;
    font-size: 11.5px;
    font-weight: 600;
    color: $ink-soft;
  }

  em {
    font-size: 11.5px;
    font-style: normal;
    color: $muted;
  }
}

.source-tag {
  padding: 2px 8px;
  border-radius: 99px;
  background: $primary-soft;
  font-size: 11px;
  font-weight: 700;
  color: $primary;
}

.source-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.source-note {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed $line;
  font-size: 11.5px;
  line-height: 1.7;
  color: $muted;
}

.facts a {
  color: $primary;
  word-break: break-all;

  &:hover {
    color: $primary-dark;
  }
}

.break {
  word-break: break-all;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-panel {
  padding: 18px 20px;

  h3 {
    margin-bottom: 12px;
    font-size: 13.5px;
    font-weight: 700;
  }
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .muted {
    font-size: 11.5px;
  }
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: $muted;
}

.form-tip {
  margin-top: 10px;
  font-size: 11.5px;
  line-height: 1.7;
  color: $muted;
}

.supplier-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  strong {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: $ink;
  }

  small {
    font-size: 11.5px;
    color: $muted;
  }
}

.avatar {
  @include flex-center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: $primary-soft;
  color: $primary;
  font-size: 11.5px;
  font-weight: 800;
  flex-shrink: 0;
}

.mini-facts {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-bottom: 12px;
  border-bottom: 1px solid $line;

  div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
  }

  dt {
    color: $muted;
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: $ink-soft;
  }
}

.side-btn {
  width: 100%;
  margin-top: 14px;
}

.related {
  display: flex;
  flex-direction: column;
  gap: 2px;

  li a {
    display: block;
    padding: 8px 10px;
    border-radius: 8px;
    transition: background 0.2s $ease;

    &:hover {
      background: $bg;
    }
  }

  strong {
    display: block;
    overflow: hidden;
    font-size: 12.5px;
    font-weight: 600;
    color: $ink;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  small {
    font-size: 11px;
    color: $muted;
  }
}

.related-empty {
  padding: 6px 2px;
  font-size: 12px;
  color: $muted;
}

.empty {
  padding: 20px;
}
</style>
