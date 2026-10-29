<template>
  <div class="products-page">
    <PageHeader
      eyebrow="产品"
      title="产品目录"
      desc="汇总全部 POD 工厂的在售产品，按工厂或按分类浏览，快速找到合适的品类与供应来源。"
    >
      <template #actions>
        <el-button round @click="$router.push('/suppliers')">
          浏览供应商
          <i class="el-icon-right"></i>
        </el-button>
      </template>
    </PageHeader>

    <div class="stats">
      <div class="container stats-inner">
        <div v-for="item in stats" :key="item.label" class="stat">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div class="toolbar-wrap" :class="{ 'is-stuck': stuck }">
      <div class="container toolbar">
        <div class="tools">
          <div class="search-field">
            <i class="el-icon-search" aria-hidden="true"></i>
            <input
              v-model="keyword"
              type="search"
              placeholder="搜索产品、分类或工厂"
              aria-label="搜索产品"
            />
            <button
              v-if="keyword"
              class="search-clear"
              type="button"
              aria-label="清空搜索"
              @click="keyword = ''"
            >
              <i class="el-icon-close"></i>
            </button>
          </div>

          <el-select
            v-model="supplierId"
            class="supplier-select"
            clearable
            filterable
            placeholder="全部工厂"
            aria-label="按工厂筛选"
          >
            <el-option
              v-for="option in supplierOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              <span class="option-label">{{ option.label }}</span>
              <span class="option-count">{{ option.count }} 款</span>
            </el-option>
          </el-select>

          <el-select v-model="sort" class="sort" aria-label="产品排序">
            <el-option
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="container body">
      <div class="cat-row">
        <button
          type="button"
          class="chip"
          :class="{ 'is-active': !category }"
          :aria-pressed="!category"
          @click="category = ''"
        >
          全部分类
          <span>{{ baseList.length }}</span>
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

      <div class="result-line">
        <p class="result-count">
          <strong>{{ list.length }}</strong>
          <span>/ 共 {{ overview.totalProducts }} 款产品</span>
          <em v-if="activeHint">{{ activeHint }}</em>
        </p>
        <button v-if="hasFilter" type="button" class="clear-filters" @click="reset">
          <i class="el-icon-refresh-left"></i>
          清空筛选
        </button>
      </div>

      <div v-if="list.length" :key="`${view}-${category}-${supplierId}-${sort}`" class="sections">
        <section v-for="section in sections" :key="section.key" v-reveal class="group">
          <ProductGroupHeader
            v-if="section.supplier"
            :title="section.supplier.name"
            :supplier="section.supplier"
            :meta="supplierMeta(section)"
            :count="section.products.length"
            :to="`/suppliers/${section.supplier.id}/products`"
            link-label="查看该工厂产品"
          />
          <ProductGroupHeader
            v-else-if="section.category"
            :title="section.category"
            :meta="categoryMeta(section)"
            :count="section.products.length"
            :to="`/products?view=supplier&cat=${encodeURIComponent(section.category)}`"
            link-label="按工厂查看"
          />

          <div class="grid">
            <ProductCard v-for="item in section.products" :key="item.id" :product="item" />
          </div>
        </section>
      </div>

      <el-empty v-else description="没有符合条件的产品">
        <el-button type="primary" round @click="reset">清空筛选</el-button>
      </el-empty>

      <div v-if="canLoadMore" class="load-more">
        <el-button round @click="loadMore">
          显示更多产品
          <i class="el-icon-arrow-down"></i>
        </el-button>
        <span>还剩 {{ remaining }} 款</span>
      </div>

      <p class="catalog-note">
        <i class="el-icon-info"></i>
        产品名称、价格与规格取自各工厂公开产品目录，为原型演示用的示例数据。
      </p>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import ProductGroupHeader from '@/components/ProductGroupHeader.vue'
import ProductCard from '@/components/ProductCard.vue'
import {
  products,
  allProductCategories,
  groupProductsByCategory,
  groupProductsBySupplier,
  productOverview,
  productSortOptions,
  productSupplierOptions,
  searchProducts,
  sortProducts
} from '@/data/products'
import debounce from '@/utils/debounce'

const PAGE_SIZE = 48
const VIEW_VALUES = ['all', 'supplier', 'category']
const SORT_VALUES = productSortOptions.map((option) => option.value)

export default {
  name: 'ProductsPage',
  components: { PageHeader, ProductGroupHeader, ProductCard },
  data() {
    return {
      products,
      overview: productOverview,
      sortOptions: productSortOptions,
      supplierOptions: productSupplierOptions(),
      categories: allProductCategories(),
      keyword: '',
      category: '',
      supplierId: '',
      sort: 'featured',
      view: 'all',
      visibleCount: PAGE_SIZE,
      pageSize: PAGE_SIZE,
      stuck: false
    }
  },
  computed: {
    stats() {
      return [
        { label: '产品款式', value: this.overview.totalProducts },
        { label: '覆盖工厂', value: this.overview.totalSuppliers },
        { label: '产品分类', value: this.overview.totalCategories }
      ]
    },
    baseList() {
      return searchProducts(this.products, {
        keyword: this.keyword,
        supplierId: this.supplierId,
        matchSupplier: true
      })
    },
    list() {
      return this.category
        ? this.baseList.filter((item) => item.category === this.category)
        : this.baseList
    },
    sorted() {
      return sortProducts(this.list, this.sort)
    },
    sections() {
      if (this.view === 'supplier') {
        return groupProductsBySupplier(this.sorted).map((group) => ({
          key: `s-${group.supplier.id}`,
          supplier: group.supplier,
          products: group.products
        }))
      }

      if (this.view === 'category') {
        return groupProductsByCategory(this.sorted).map((group) => ({
          key: `c-${group.category}`,
          category: group.category,
          products: group.products
        }))
      }

      return [
        {
          key: 'all',
          products: this.sorted.slice(0, this.visibleCount)
        }
      ]
    },
    canLoadMore() {
      return this.view === 'all' && this.visibleCount < this.sorted.length
    },
    remaining() {
      return Math.max(this.sorted.length - this.visibleCount, 0)
    },
    hasFilter() {
      return Boolean(this.keyword || this.category || this.supplierId || this.sort !== 'featured')
    },
    activeHint() {
      const parts = []
      if (this.keyword) parts.push(`匹配“${this.keyword}”`)
      if (this.supplierId) {
        const option = this.supplierOptions.find((item) => item.value === this.supplierId)
        if (option) parts.push(option.label)
      }
      return parts.join(' · ')
    }
  },
  watch: {
    keyword() {
      this.onFilterChange()
    },
    category() {
      this.onFilterChange()
    },
    supplierId() {
      this.onFilterChange()
    },
    sort() {
      this.onFilterChange()
    },
    view() {
      this.onFilterChange()
    },
    '$route.query': {
      handler(query) {
        if (!this.sameQuery(query, this.buildQuery())) this.hydrate(query)
      }
    }
  },
  created() {
    this.syncQuery = debounce(this.replaceQuery, 240)
    this.hydrate(this.$route.query)
  },
  mounted() {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      this.stuck = window.scrollY > 300
    },
    onFilterChange() {
      this.visibleCount = this.pageSize
      this.syncQuery()
    },
    categoryCount(value) {
      return this.baseList.filter((item) => item.category === value).length
    },
    supplierMeta(section) {
      const supplier = section.supplier
      return [supplier.location, `${supplier.productionDays} 天生产周期`].filter(Boolean)
    },
    categoryMeta(section) {
      const factories = new Set(section.products.map((item) => item.supplierId)).size
      const min = section.products.reduce(
        (lowest, item) => (item.price < lowest ? item.price : lowest),
        section.products[0].price
      )
      return [`覆盖 ${factories} 家工厂`, `起价 $${min.toFixed(2)}`]
    },
    loadMore() {
      this.visibleCount += this.pageSize
    },
    reset() {
      this.keyword = ''
      this.category = ''
      this.supplierId = ''
      this.sort = 'featured'
      this.view = 'all'
    },
    hydrate(query) {
      this.keyword = query.q || ''
      this.category =
        query.cat && this.categories.includes(query.cat) ? query.cat : ''
      this.supplierId =
        query.f && this.supplierOptions.some((item) => item.value === query.f) ? query.f : ''
      this.sort = SORT_VALUES.includes(query.sort) ? query.sort : 'featured'
      this.view = VIEW_VALUES.includes(query.view) ? query.view : 'all'
      this.visibleCount = this.pageSize
    },
    buildQuery() {
      const query = {}
      if (this.view !== 'all') query.view = this.view
      if (this.keyword) query.q = this.keyword
      if (this.category) query.cat = this.category
      if (this.supplierId) query.f = this.supplierId
      if (this.sort !== 'featured') query.sort = this.sort
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
      this.$router.replace({ path: '/products', query: next }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.stats {
  border-bottom: 1px solid $line;
  background: $bg-soft;
}

.stats-inner {
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
  padding-top: 16px;
  padding-bottom: 16px;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 8px;

  strong {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: $ink;
  }

  span {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: $muted;
  }
}

.toolbar-wrap {
  position: sticky;
  top: $header-h;
  z-index: 20;
  border-bottom: 1px solid transparent;
  background: rgba(255, 255, 255, 0.94);
  transition: box-shadow 0.3s $ease, border-color 0.3s $ease, backdrop-filter 0.3s $ease;

  &.is-stuck {
    border-bottom-color: $line;
    box-shadow: 0 12px 26px -22px rgba(13, 16, 48, 0.55);
    backdrop-filter: blur(12px);
  }
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 12px;
  padding-bottom: 12px;
}

.tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 260px;
  height: 42px;
  padding: 0 13px;
  border: 1px solid $line;
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.25s $ease, box-shadow 0.25s $ease;

  &:focus-within {
    border-color: rgba(91, 75, 255, 0.5);
    box-shadow: 0 0 0 4px rgba(91, 75, 255, 0.12);
  }

  > i {
    font-size: 14px;
    color: $muted;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    background: transparent;
    font-family: $font;
    font-size: 13.5px;
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
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 7px;
  background: $bg-soft;
  color: $muted;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    background: $primary-soft;
    color: $primary;
  }
}

.supplier-select {
  width: 168px;
}

.sort {
  width: 168px;
}

.supplier-select,
.sort {
  :deep(.el-input__inner) {
    height: 42px;
    border-radius: 12px;
    font-family: $font;
    font-size: 13px;
    font-weight: 600;
  }
}

.option-label {
  font-weight: 600;
}

.option-count {
  float: right;
  color: $muted;
  font-size: 12px;
}

.body {
  padding-top: 20px;
  padding-bottom: 88px;
}

.cat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
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

.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin: 20px 0 18px;
}

.result-count {
  display: flex;
  align-items: baseline;
  gap: 7px;
  flex-wrap: wrap;
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

.clear-filters {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid $line;
  border-radius: 99px;
  background: #fff;
  font-family: $font;
  font-size: 12px;
  font-weight: 700;
  color: $ink-soft;
  cursor: pointer;

  &:hover {
    border-color: rgba(91, 75, 255, 0.4);
    color: $primary;
  }

  i {
    font-size: 11px;
  }
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
  animation: fade-in 0.28s $ease;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 34px;

  i {
    margin-left: 4px;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: $muted;
  }
}

.catalog-note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 30px;
  font-size: 11.5px;
  color: $muted;

  i {
    font-size: 12px;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@include down(1180px) {
  .search-field {
    width: 200px;
  }

  .supplier-select,
  .sort {
    width: 148px;
  }
}

@include down(900px) {
  .stats-inner {
    gap: 28px;
  }
}

@include down(760px) {
  .toolbar {
    gap: 10px;
  }

  .tools {
    width: 100%;
  }

  .search-field {
    flex: 1 1 100%;
    width: 100%;
  }

  .supplier-select,
  .sort {
    flex: 1 1 0;
    width: auto;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .sections {
    gap: 30px;
  }

  .stat strong {
    font-size: 22px;
  }
}

@include down(420px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
