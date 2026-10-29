<template>
  <div class="suppliers-page">
    <PageHeader
      eyebrow="供应商"
      title="供应商目录"
      desc="按品类、配送覆盖与集成方式筛选按需打印供应商，再对比产品数量与生产速度。"
    />

    <div class="container page-body">
      <aside class="sidebar">
        <SupplierFilters
          :value="filters"
          :categories="categories"
          :integrations="integrations"
          :shipping="shippingOptions"
          @input="onFilterChange"
          @reset="reset"
        />
      </aside>

      <section class="results">
        <div class="toolbar">
          <p class="result-count">
            <strong>{{ results.length }}</strong>
            <span>/ 共 {{ suppliers.length }} 家供应商</span>
            <em v-if="activeCount">{{ activeCount }} 个筛选条件</em>
          </p>

          <div class="toolbar-actions">
            <el-button
              class="mobile-filter"
              icon="el-icon-s-operation"
              @click="drawer = true"
            >
              筛选<span v-if="activeCount"> ({{ activeCount }})</span>
            </el-button>

            <el-select v-model="sort" class="sort">
              <el-option
                v-for="option in sortOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </div>

        <div v-if="activeChips.length" class="active-chips">
          <span class="active-label">已选条件</span>
          <el-tag
            v-for="chip in activeChips"
            :key="chip.key"
            size="small"
            closable
            @close="removeChip(chip)"
          >
            {{ chip.label }}
          </el-tag>
          <button class="clear-all" type="button" @click="reset">清空全部</button>
        </div>

        <div v-if="results.length" class="grid">
          <SupplierCard v-for="item in results" :key="item.id" :supplier="item" />
        </div>

        <el-empty v-else description="没有符合条件的供应商">
          <el-button type="primary" round @click="reset">清空筛选</el-button>
        </el-empty>
      </section>
    </div>

    <el-drawer
      :visible.sync="drawer"
      direction="btt"
      size="88%"
      :with-header="false"
      append-to-body
      custom-class="filter-drawer"
    >
      <div class="drawer-body">
        <div class="drawer-head">
          <h2>筛选</h2>
          <button class="drawer-close" aria-label="关闭筛选" @click="drawer = false">
            <i class="el-icon-close"></i>
          </button>
        </div>

        <div class="drawer-scroll">
          <SupplierFilters
            :value="filters"
            :categories="categories"
            :integrations="integrations"
            :shipping="shippingOptions"
            :show-header="false"
            @input="onFilterChange"
            @reset="reset"
          />
        </div>

        <div class="drawer-foot">
          <el-button round @click="reset">重置</el-button>
          <el-button type="primary" round class="apply" @click="drawer = false">
            查看 {{ results.length }} 家供应商
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import SupplierFilters from '@/components/SupplierFilters.vue'
import SupplierCard from '@/components/SupplierCard.vue'
import {
  suppliers,
  categories,
  integrations,
  shippingOptions,
  sortOptions
} from '@/data/suppliers'
import {
  querySuppliers,
  activeFilterCount,
  emptyFilters
} from '@/utils/supplierQuery'
import debounce from '@/utils/debounce'

const SHIP_VALUES = shippingOptions.map((o) => o.value).filter(Boolean)
const SORT_VALUES = sortOptions.map((o) => o.value)

export default {
  name: 'SuppliersPage',
  components: { PageHeader, SupplierFilters, SupplierCard },
  data() {
    return {
      suppliers,
      categories,
      integrations,
      shippingOptions,
      sortOptions,
      filters: { ...emptyFilters, categories: [], integrations: [] },
      sort: 'featured',
      drawer: false
    }
  },
  computed: {
    results() {
      return querySuppliers(this.suppliers, this.filters, this.sort)
    },
    activeCount() {
      return activeFilterCount(this.filters)
    },
    activeChips() {
      const chips = []
      if (this.filters.keyword) {
        chips.push({ key: 'keyword', label: `搜索：${this.filters.keyword}` })
      }
      if (this.filters.shipTo) {
        const option = this.shippingOptions.find((o) => o.value === this.filters.shipTo)
        chips.push({ key: 'shipTo', label: `配送至 ${option ? option.label : this.filters.shipTo}` })
      }
      this.filters.categories.forEach((cat) => {
        chips.push({ key: `cat:${cat}`, label: cat, type: 'categories', value: cat })
      })
      this.filters.integrations.forEach((item) => {
        chips.push({ key: `int:${item}`, label: item, type: 'integrations', value: item })
      })
      return chips
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.syncQuery()
      }
    },
    sort() {
      this.syncQuery()
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
  methods: {
    onFilterChange(next) {
      this.filters = next
    },
    reset() {
      this.filters = { keyword: '', categories: [], integrations: [], shipTo: '' }
      this.sort = 'featured'
    },
    removeChip(chip) {
      if (chip.key === 'keyword') this.filters = { ...this.filters, keyword: '' }
      else if (chip.key === 'shipTo') this.filters = { ...this.filters, shipTo: '' }
      else {
        this.filters = {
          ...this.filters,
          [chip.type]: this.filters[chip.type].filter((item) => item !== chip.value)
        }
      }
    },
    hydrate(query) {
      const cats = (query.cat || '').split(',').filter((c) => this.categories.includes(c))
      const ints = (query.int || '').split(',').filter((i) => this.integrations.includes(i))
      this.filters = {
        keyword: query.q || '',
        categories: cats,
        integrations: ints,
        shipTo: SHIP_VALUES.includes(query.ships) ? query.ships : ''
      }
      this.sort = SORT_VALUES.includes(query.sort) ? query.sort : 'featured'
    },
    buildQuery() {
      const query = {}
      if (this.filters.keyword) query.q = this.filters.keyword
      if (this.filters.categories.length) query.cat = this.filters.categories.join(',')
      if (this.filters.integrations.length) query.int = this.filters.integrations.join(',')
      if (this.filters.shipTo) query.ships = this.filters.shipTo
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
      this.$router.replace({ path: '/suppliers', query: next }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.page-body {
  display: grid;
  grid-template-columns: 268px 1fr;
  gap: 30px;
  padding-top: 40px;
  padding-bottom: 92px;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: calc(#{$header-h} + 20px);
  padding: 22px;
  border: 1px solid $line;
  border-radius: 20px;
  background: #fff;
  box-shadow: $shadow-xs;
}

.results {
  min-width: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.result-count {
  display: flex;
  align-items: baseline;
  gap: 7px;
  font-size: 13.5px;
  color: $muted;

  strong {
    font-size: 19px;
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

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort {
  width: 200px;

  :deep(.el-input__inner) {
    border-radius: 10px;
    font-family: $font;
    font-size: 13.5px;
    font-weight: 600;
  }
}

.mobile-filter {
  display: none;
  border-radius: 10px;
  font-size: 13.5px;
}

.active-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 12px 14px;
  border-radius: 14px;
  background: $bg-soft;

  :deep(.el-tag) {
    height: 26px;
    padding: 0 9px;
    border: 1px solid rgba(91, 75, 255, 0.2);
    background: #fff;
    color: $ink-soft;
    font-size: 12px;
    font-weight: 600;
    line-height: 24px;
    border-radius: 7px;

    .el-tag__close {
      color: $muted;

      &:hover {
        color: #fff;
        background: $primary;
      }
    }
  }
}

.active-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $muted;
}

.clear-all {
  border: none;
  background: transparent;
  padding: 0 4px;
  font-family: $font;
  font-size: 12px;
  font-weight: 700;
  color: $primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 20px 0;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid $line;

  h2 {
    font-size: 16px;
    font-weight: 800;
  }
}

.drawer-close {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: $bg-soft;
  color: $ink;
  font-size: 15px;
  cursor: pointer;
}

.drawer-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 22px 2px 10px;
}

.drawer-foot {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 10px;
  padding: 14px 0 20px;
  background: #fff;
  border-top: 1px solid $line;

  .el-button {
    flex: 1;
    margin-left: 0;
  }
}

@include down(1080px) {
  .page-body {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .sidebar {
    display: none;
  }

  .mobile-filter {
    display: inline-flex;
    align-items: center;
  }
}

@include down(760px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .sort {
    width: 100%;
  }

  .toolbar-actions {
    width: 100%;
  }

  .toolbar-actions .sort {
    flex: 1;
  }
}
</style>
