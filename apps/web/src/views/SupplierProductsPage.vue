<template>
  <div v-if="supplier" class="products-page">
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-inner">
        <nav class="crumbs" aria-label="面包屑导航">
          <router-link to="/">首页</router-link>
          <i class="el-icon-arrow-right"></i>
          <router-link to="/suppliers">供应商</router-link>
          <i class="el-icon-arrow-right"></i>
          <router-link :to="`/suppliers/${supplier.id}`">{{ supplier.name }}</router-link>
          <i class="el-icon-arrow-right"></i>
          <span>产品</span>
        </nav>

        <div class="hero-row">
          <div class="hero-id">
            <SupplierLogo
              :name="supplier.name"
              :monogram="supplier.monogram"
              :accent="supplier.accent"
              :size="62"
            />
            <div>
              <span class="hero-tag">产品目录</span>
              <h1>{{ supplier.name }} 的产品</h1>
              <p class="hero-meta">
                <span>{{ list.length }} 款产品</span>
                <span class="dot">·</span>
                <span class="hero-meta__loc">{{ supplier.location }}</span>
                <span class="dot hero-meta__loc">·</span>
                <span>{{ supplier.productionDays }} 天生产周期</span>
              </p>
            </div>
          </div>

          <div class="hero-actions">
            <el-button type="primary" size="large" round @click="visitSite">
              访问 {{ supplier.name }}
              <i class="el-icon-top-right"></i>
            </el-button>
            <router-link class="back-link" :to="`/suppliers/${supplier.id}`">
              返回供应商页
              <i class="el-icon-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <div class="container body">
      <div class="toolbar">
        <div class="search-field">
          <i class="el-icon-search" aria-hidden="true"></i>
          <input
            v-model="keyword"
            type="search"
            :placeholder="`在 ${host} 的 ${list.length} 款产品中搜索`"
            :aria-label="`搜索 ${supplier.name} 的产品`"
          />
          <button v-if="keyword" class="search-clear" type="button" aria-label="清空搜索" @click="keyword = ''">
            <i class="el-icon-close"></i>
          </button>
        </div>

        <el-select v-model="sort" class="sort" aria-label="产品排序">
          <el-option
            v-for="option in sortOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <div class="cat-row">
        <button
          type="button"
          class="chip"
          :class="{ 'is-active': !category }"
          :aria-pressed="!category"
          @click="category = ''"
        >
          全部产品
          <span>{{ list.length }}</span>
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="chip"
          :class="{ 'is-active': category === cat }"
          :aria-pressed="category === cat"
          @click="category = category === cat ? '' : cat"
        >
          {{ cat }}
          <span>{{ categoryCount(cat) }}</span>
        </button>
      </div>

      <p class="result-count">
        <strong>{{ results.length }}</strong>
        <span>/ 共 {{ list.length }} 款产品</span>
        <em v-if="keyword">匹配“{{ keyword }}”</em>
      </p>

      <div v-if="results.length" class="grid">
        <ProductCard
          v-for="item in results"
          :key="item.id"
          :product="item"
          :highlight="item.id === highlightId"
        />
      </div>

      <el-empty v-else description="没有符合搜索条件的产品">
        <el-button type="primary" round @click="reset">清空搜索</el-button>
      </el-empty>

      <p class="catalog-note">
        <i class="el-icon-info"></i>
        产品目录、价格与规格均取自 {{ host }} 的产品数据，为原型演示用的示例数据。
      </p>
    </div>
  </div>
</template>

<script>
import SupplierLogo from '@/components/SupplierLogo.vue'
import ProductCard from '@/components/ProductCard.vue'
import { supplierById } from '@/data/suppliers'
import {
  productsBySupplier,
  productCategories,
  productSortOptions,
  searchProducts,
  sortProducts
} from '@/data/products'
import debounce from '@/utils/debounce'

const SORT_VALUES = productSortOptions.map((option) => option.value)

export default {
  name: 'SupplierProductsPage',
  components: { SupplierLogo, ProductCard },
  data() {
    return {
      keyword: '',
      category: '',
      sort: 'featured',
      highlightId: '',
      sortOptions: productSortOptions,
      highlightTimer: null
    }
  },
  computed: {
    supplier() {
      return supplierById[this.$route.params.id] || null
    },
    list() {
      return this.supplier ? productsBySupplier(this.supplier.id) : []
    },
    categories() {
      return productCategories(this.list)
    },
    results() {
      const filtered = searchProducts(this.list, {
        keyword: this.keyword,
        category: this.category
      })
      return sortProducts(filtered, this.sort)
    },
    host() {
      return (this.supplier ? this.supplier.website : '')
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
    }
  },
  watch: {
    keyword() {
      this.syncQuery()
    },
    category() {
      this.syncQuery()
    },
    sort() {
      this.syncQuery()
    },
    '$route.query': {
      handler(query) {
        if (!this.sameQuery(query, this.buildQuery())) this.hydrate(query)
        this.applyHighlight()
      }
    },
    '$route.params.id'() {
      if (!this.supplier) {
        this.$router.replace('/suppliers')
        return
      }
      this.keyword = ''
      this.category = ''
      this.applyHighlight()
    }
  },
  created() {
    this.syncQuery = debounce(this.replaceQuery, 240)
    this.hydrate(this.$route.query)
  },
  mounted() {
    this.applyHighlight()
  },
  beforeDestroy() {
    clearTimeout(this.highlightTimer)
  },
  methods: {
    categoryCount(value) {
      return this.list.filter((item) => item.category === value).length
    },
    reset() {
      this.keyword = ''
      this.category = ''
      this.sort = 'featured'
    },
    visitSite() {
      window.open(this.supplier.website, '_blank', 'noopener')
    },
    applyHighlight() {
      const id = this.$route.query.p || ''
      this.highlightId = id
      clearTimeout(this.highlightTimer)
      if (!id) return

      setTimeout(() => {
        const el = document.getElementById(`product-${id}`)
        if (!el) return
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        this.highlightTimer = setTimeout(() => {
          this.highlightId = ''
        }, 3600)
      }, 160)
    },
    hydrate(query) {
      this.keyword = query.q || ''
      this.category = query.cat && this.categories.includes(query.cat) ? query.cat : ''
      this.sort = SORT_VALUES.includes(query.sort) ? query.sort : 'featured'
      this.highlightId = query.p || ''
    },
    buildQuery() {
      const query = {}
      if (this.keyword) query.q = this.keyword
      if (this.category) query.cat = this.category
      if (this.sort !== 'featured') query.sort = this.sort
      if (this.highlightId) query.p = this.highlightId
      return query
    },
    sameQuery(a, b) {
      const keysA = Object.keys(a || {}).sort()
      const keysB = Object.keys(b || {}).sort()
      if (keysA.join('|') !== keysB.join('|')) return false
      return keysA.every((key) => String(a[key]) === String(b[key]))
    },
    replaceQuery() {
      const next = this.buildQuery()
      if (this.sameQuery(next, this.$route.query)) return
      this.$router
        .replace({ path: `/suppliers/${this.supplier.id}/products`, query: next })
        .catch(() => {})
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

.hero-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  font-size: 13px;
  color: $ink-soft;

  .dot {
    color: $muted;
  }
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  i {
    margin-left: 5px;
    font-size: 12px;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13.5px;
  font-weight: 700;
  color: $primary;

  &:hover {
    color: $primary-dark;
  }

  i {
    font-size: 12px;
  }
}

.body {
  padding-top: 32px;
  padding-bottom: 88px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 240px;
  height: 46px;
  padding: 0 14px;
  border: 1px solid $line;
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.25s $ease, box-shadow 0.25s $ease;

  &:focus-within {
    border-color: rgba(91, 75, 255, 0.5);
    box-shadow: 0 0 0 4px rgba(91, 75, 255, 0.12);
  }

  > i {
    font-size: 15px;
    color: $muted;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    background: transparent;
    font-family: $font;
    font-size: 14px;
    font-weight: 600;
    color: $ink;
    outline: none;

    &::placeholder {
      color: $muted;
      font-weight: 500;
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }
}

.search-clear {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 7px;
  background: $bg-soft;
  color: $muted;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: $primary-soft;
    color: $primary;
  }
}

.sort {
  width: 216px;

  :deep(.el-input__inner) {
    height: 46px;
    border-radius: 12px;
    font-family: $font;
    font-size: 13.5px;
    font-weight: 600;
  }
}

.cat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 13px;
  border: 1px solid $line;
  border-radius: 99px;
  background: #fff;
  font-family: $font;
  font-size: 12.5px;
  font-weight: 700;
  color: $ink-soft;
  cursor: pointer;
  transition: color 0.25s $ease, border-color 0.25s $ease, background 0.25s $ease;

  span {
    font-size: 11px;
    font-weight: 800;
    color: $muted;
  }

  &:hover {
    color: $primary;
    border-color: rgba(91, 75, 255, 0.4);
  }

  &.is-active {
    background: $primary;
    border-color: $primary;
    color: #fff;

    span {
      color: rgba(255, 255, 255, 0.75);
    }
  }
}

.result-count {
  display: flex;
  align-items: baseline;
  gap: 7px;
  flex-wrap: wrap;
  margin: 22px 0 16px;
  font-size: 13px;
  color: $muted;

  strong {
    font-size: 18px;
    font-weight: 800;
    color: $ink;
    letter-spacing: -0.02em;
  }

  em {
    font-style: normal;
    padding: 3px 9px;
    border-radius: 99px;
    background: $primary-soft;
    color: $primary;
    font-size: 11.5px;
    font-weight: 700;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.catalog-note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 26px;
  font-size: 11.5px;
  color: $muted;

  i {
    font-size: 12px;
  }
}

@include down(760px) {
  .hero-id {
    gap: 14px;
  }

  .hero-meta__loc {
    display: none;
  }

  .sort {
    width: 100%;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .cat-row {
    gap: 6px;
  }

  .chip {
    padding: 7px 11px;
    font-size: 12px;
  }
}

@include down(420px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
