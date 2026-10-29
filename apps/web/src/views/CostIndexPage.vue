<template>
  <div class="cost-page">
    <PageHeader
      eyebrow="成本指数"
      title="POD 落地成本指数"
      desc="覆盖供应商网络中 20 款热门 SKU 的最低报价单价、生产时长与总时效，可按对你利润最关键的方式排序。"
    >
      <template #actions>
        <el-button round @click="$router.push('/suppliers')">浏览供应商</el-button>
      </template>
    </PageHeader>

    <div class="container body">
      <div class="controls">
        <el-input
          v-model="keyword"
          class="search"
          placeholder="搜索 SKU 或供应商"
          prefix-icon="el-icon-search"
          clearable
        />
        <el-select v-model="category" class="category" placeholder="全部品类">
          <el-option label="全部品类" value="" />
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
        </el-select>
        <p class="meta">
          共 <strong>{{ rows.length }}</strong> 款 SKU · {{ quoteCount }} 条报价
        </p>
      </div>

      <el-table
        :data="rows"
        class="table"
        :default-sort="{ prop: 'cost', order: 'ascending' }"
        row-key="id"
      >
        <el-table-column label="产品" min-width="260">
          <template slot-scope="{ row }">
            <div class="product">
              <span class="product-name">{{ row.name }}</span>
              <span class="product-cat">{{ row.category }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="最低价供应商" min-width="170">
          <template slot-scope="{ row }">
            <span class="supplier">
              <i class="dot" :style="{ background: row.accent }"></i>
              {{ row.supplier }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="cost" label="落地成本" width="140" sortable align="right">
          <template slot-scope="{ row }">
            <span class="cost">${{ row.cost.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="production" label="生产" width="130" sortable align="right">
          <template slot-scope="{ row }">{{ row.production }} 天</template>
        </el-table-column>

        <el-table-column prop="lead" label="总时效" width="130" sortable align="right">
          <template slot-scope="{ row }">
            <span class="lead">{{ row.lead }} 天</span>
          </template>
        </el-table-column>

        <el-table-column prop="quotes" label="报价数" width="110" sortable align="right">
          <template slot-scope="{ row }">
            <span class="quotes">{{ row.quotes }}</span>
          </template>
        </el-table-column>
      </el-table>

      <p class="note">
        <i class="el-icon-info"></i>
        落地成本不含运费与税费。总时效 = 生产时长 + 境内配送预估。数据为原型演示用的静态样本。
      </p>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import { skus, costCategories } from '@/data/costIndex'
import { supplierById } from '@/data/suppliers'

export default {
  name: 'CostIndexPage',
  components: { PageHeader },
  data() {
    return {
      skus,
      categories: costCategories,
      keyword: '',
      category: ''
    }
  },
  computed: {
    allRows() {
      return this.skus.map((sku) => {
        const cheapest = sku.quotes.reduce((min, q) => (q.cost < min.cost ? q : min), sku.quotes[0])
        const supplier = supplierById[cheapest.supplierId] || {}
        return {
          id: sku.id,
          name: sku.name,
          category: sku.category,
          supplier: supplier.name || cheapest.supplierId,
          accent: supplier.accent || '#5b4bff',
          cost: cheapest.cost,
          production: cheapest.production,
          lead: cheapest.production + cheapest.shipping,
          quotes: sku.quotes.length,
          fastest: Math.min(...sku.quotes.map((q) => q.production + q.shipping))
        }
      })
    },
    rows() {
      const keyword = this.keyword.trim().toLowerCase()
      return this.allRows.filter((row) => {
        if (this.category && row.category !== this.category) return false
        if (!keyword) return true
        return `${row.name} ${row.supplier} ${row.category}`.toLowerCase().includes(keyword)
      })
    },
    quoteCount() {
      return this.skus.reduce((total, sku) => total + sku.quotes.length, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.body {
  padding-top: 40px;
  padding-bottom: 92px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.search {
  width: 320px;

  :deep(.el-input__inner) {
    height: 42px;
    border-radius: 11px;
    font-family: $font;
  }
}

.category {
  width: 200px;

  :deep(.el-input__inner) {
    height: 42px;
    border-radius: 11px;
    font-family: $font;
  }
}

.meta {
  margin-left: auto;
  font-size: 12.5px;
  color: $muted;

  strong {
    color: $ink;
    font-weight: 800;
  }
}

.product {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.product-name {
  font-size: 13.5px;
  font-weight: 700;
  color: $ink;
}

.product-cat {
  font-size: 11px;
  color: $muted;
}

.supplier {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: $ink-soft;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

.cost {
  font-size: 14px;
  font-weight: 800;
  color: $ink;
}

.lead {
  font-weight: 600;
}

.quotes {
  display: inline-block;
  min-width: 24px;
  padding: 1px 7px;
  border-radius: 6px;
  background: $bg-soft;
  font-size: 11.5px;
  font-weight: 700;
  color: $ink-soft;
}

.table {
  border: 1px solid $line;
  border-radius: 18px;
  overflow: hidden;

  :deep(th.el-table__cell) {
    background: $bg-soft;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $muted;
    padding: 11px 0;
  }

  :deep(td.el-table__cell) {
    padding: 12px 0;
  }

  :deep(.el-table__row:hover > td.el-table__cell) {
    background: rgba(91, 75, 255, 0.04);
  }

  :deep(.caret-wrapper) {
    height: 22px;
  }
}

.note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 18px;
  font-size: 12px;
  line-height: 1.65;
  color: $muted;

  i {
    margin-top: 2px;
    color: $primary;
  }
}

@include down(700px) {
  .search,
  .category {
    width: 100%;
  }

  .meta {
    margin-left: 0;
  }

  .body {
    padding-bottom: 64px;
  }
}
</style>
