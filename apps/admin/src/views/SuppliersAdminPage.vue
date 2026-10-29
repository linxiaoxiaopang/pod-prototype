<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>供应商管理</h1>
        <p>{{ rows.length }} 家供应商 · {{ activeCount }} 家运营中，数据同步自业务端目录。</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" round @click="createNew">新增供应商</el-button>
    </header>

    <div class="panel">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          class="search"
          prefix-icon="el-icon-search"
          placeholder="搜索名称或所在地"
          clearable
        />
        <el-select v-model="status" class="filter" placeholder="全部状态">
          <el-option label="全部状态" value="" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span class="result">{{ filtered.length }} 条结果</span>
      </div>

      <el-table :data="paged" class="table">
        <el-table-column label="供应商" min-width="220">
          <template slot-scope="{ row }">
            <div class="supplier-cell">
              <span class="avatar" :class="`is-${row.status}`">{{ row.name.slice(0, 2).toUpperCase() }}</span>
              <div>
                <strong>{{ row.name }}</strong>
                <small>{{ row.location }}</small>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="品类" min-width="210">
          <template slot-scope="{ row }">
            <span v-for="cat in row.categories.slice(0, 2)" :key="cat" class="tag">{{ cat }}</span>
            <span v-if="row.categories.length > 2" class="tag more">+{{ row.categories.length - 2 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="集成" width="90" align="center">
          <template slot-scope="{ row }">{{ row.integrations }} 个</template>
        </el-table-column>

        <el-table-column label="生产时效" width="110">
          <template slot-scope="{ row }">{{ row.productionDays }} 天</template>
        </el-table-column>

        <el-table-column label="状态" width="120">
          <template slot-scope="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>

        <el-table-column label="目录展示" width="110" align="center">
          <template slot-scope="{ row }">
            <el-switch
              :value="row.status === 'active'"
              @change="toggleStatus(row, $event)"
            />
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="120" prop="updated" />

        <el-table-column label="操作" width="140" align="right">
          <template slot-scope="{ row }">
            <button class="link" type="button" @click="open(row)">查看</button>
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
import { statusOptions } from '@/data/adminData'
import { listSuppliers, saveSuppliers } from '@/data/adminStore'

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

export default {
  name: 'SuppliersAdminPage',
  components: { StatusTag },
  data() {
    return {
      rows: listSuppliers(),
      statusOptions,
      keyword: '',
      status: '',
      page: 1,
      pageSize: 8
    }
  },
  computed: {
    activeCount() {
      return this.rows.filter((item) => item.status === 'active').length
    },
    filtered() {
      const value = this.keyword.trim().toLowerCase()
      return this.rows.filter((item) => {
        if (this.status && item.status !== this.status) return false
        if (!value) return true
        return (
          item.name.toLowerCase().includes(value) || item.location.toLowerCase().includes(value)
        )
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
    status() {
      this.page = 1
    },
    '$route.query.q': {
      immediate: true,
      handler(value) {
        this.keyword = value || ''
      }
    }
  },
  methods: {
    toggleStatus(row, enabled) {
      row.status = enabled ? 'active' : 'paused'
      saveSuppliers(this.rows)
      this.$message.success(`${row.name} 已${enabled ? '开启' : '关闭'}目录展示`)
    },
    open(row) {
      window.open(`${webUrl}/#/suppliers/${row.id}`, '_blank', 'noopener')
    },
    edit(row) {
      this.$router.push(`/suppliers/${row.id}/edit`).catch(() => {})
    },
    createNew() {
      this.$router.push('/suppliers/new').catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';
</style>
