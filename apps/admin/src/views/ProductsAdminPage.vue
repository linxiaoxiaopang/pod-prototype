<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>产品目录</h1>
        <p>{{ rows.length }} 条产品记录，其中 {{ liveCount }} 条已上架。</p>
      </div>
      <div class="head-actions">
        <el-button icon="el-icon-refresh" round @click="syncCatalog">同步供应商产品</el-button>
        <el-button type="primary" icon="el-icon-plus" round @click="createNew">新增产品</el-button>
      </div>
    </header>

    <div class="panel">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          class="search"
          prefix-icon="el-icon-search"
          placeholder="搜索产品名称"
          clearable
        />
        <el-select v-model="supplier" class="filter" placeholder="全部供应商">
          <el-option label="全部供应商" value="" />
          <el-option v-for="item in supplierOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="category" class="filter" placeholder="全部品类">
          <el-option label="全部品类" value="" />
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <span class="result">{{ filtered.length }} 条结果</span>
      </div>

      <el-table :data="paged" class="table">
        <el-table-column label="产品" min-width="240">
          <template slot-scope="{ row }">
            <div class="supplier-cell">
              <span class="avatar">{{ row.name.slice(0, 2).toUpperCase() }}</span>
              <div>
                <strong>{{ row.name }}</strong>
                <small>{{ row.supplier }}</small>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="品类" width="150">
          <template slot-scope="{ row }">
            <span class="tag">{{ row.category }}</span>
          </template>
        </el-table-column>

        <el-table-column label="基础价" width="110">
          <template slot-scope="{ row }"><span class="money">${{ row.price.toFixed(2) }}</span></template>
        </el-table-column>

        <el-table-column label="生产时效" width="110">
          <template slot-scope="{ row }">{{ row.productionDays }} 天</template>
        </el-table-column>

        <el-table-column label="状态" width="120">
          <template slot-scope="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>

        <el-table-column label="上架" width="90" align="center">
          <template slot-scope="{ row }">
            <el-switch :value="row.status === 'live'" @change="toggleLive(row, $event)" />
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="120" prop="updated" />

        <el-table-column label="操作" width="120" align="right">
          <template slot-scope="{ row }">
            <button class="link" type="button" @click="detail(row)">查看</button>
            <button class="link" type="button" @click="edit(row)">编辑</button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          :current-page.sync="page"
          :page-size="pageSize"
          :total="filtered.length"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<script>
import StatusTag from '@/components/StatusTag.vue'
import { listProducts, saveProducts } from '@/data/adminStore'

export default {
  name: 'ProductsAdminPage',
  components: { StatusTag },
  data() {
    return {
      rows: listProducts(),
      keyword: '',
      supplier: '',
      category: '',
      page: 1,
      pageSize: 10
    }
  },
  computed: {
    liveCount() {
      return this.rows.filter((item) => item.status === 'live').length
    },
    supplierOptions() {
      return [...new Set(this.rows.map((item) => item.supplier))]
    },
    categoryOptions() {
      return [...new Set(this.rows.map((item) => item.category))]
    },
    filtered() {
      const value = this.keyword.trim().toLowerCase()
      return this.rows.filter((item) => {
        if (this.supplier && item.supplier !== this.supplier) return false
        if (this.category && item.category !== this.category) return false
        if (!value) return true
        return item.name.toLowerCase().includes(value)
      })
    },
    paged() {
      const start = (this.page - 1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  watch: {
    keyword() {
      this.page = 1
    },
    supplier() {
      this.page = 1
    },
    category() {
      this.page = 1
    }
  },
  methods: {
    toggleLive(row, enabled) {
      row.status = enabled ? 'live' : 'paused'
      saveProducts(this.rows)
      this.$message.success(`${row.name} 已${enabled ? '上架' : '下架'}`)
    },
    detail(row) {
      this.$router.push(`/products/${row.id}`).catch(() => {})
    },
    edit(row) {
      this.$router.push(`/products/${row.id}/edit`).catch(() => {})
    },
    createNew() {
      this.$router.push('/products/new').catch(() => {})
    },
    syncCatalog() {
      this.$message.success('已触发同步任务，稍后可在列表查看结果')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';

.head-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
