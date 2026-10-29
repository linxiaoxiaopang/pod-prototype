<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>对比内容</h1>
        <p>{{ rows.length }} 组对比，{{ publishedCount }} 组已发布到业务端。</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" round @click="create">新建对比</el-button>
    </header>

    <div class="panel">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          class="search"
          prefix-icon="el-icon-search"
          placeholder="搜索对比标题"
          clearable
        />
        <el-select v-model="status" class="filter" placeholder="全部状态">
          <el-option label="全部状态" value="" />
          <el-option label="已发布" value="published" />
          <el-option label="待审核" value="review" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <span class="result">{{ filtered.length }} 条结果</span>
      </div>

      <el-table :data="filtered" class="table">
        <el-table-column label="对比标题" min-width="240">
          <template slot-scope="{ row }">
            <strong class="title">{{ row.title }}</strong>
            <small class="code">/comparisons/{{ row.id }}</small>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120">
          <template slot-scope="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>

        <el-table-column label="浏览量" width="120">
          <template slot-scope="{ row }">
            <span :class="{ muted: !row.views }">{{ row.views ? row.views.toLocaleString() : '—' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="130" prop="updated" />

        <el-table-column label="操作" width="180" align="right">
          <template slot-scope="{ row }">
            <button class="link" type="button" @click="preview(row)">预览</button>
            <button class="link" type="button" @click="edit(row)">编辑</button>
            <button class="link" type="button" @click="publish(row)">
              {{ row.status === 'published' ? '下架' : '发布' }}
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import StatusTag from '@/components/StatusTag.vue'
import { adminComparisons } from '@/data/adminData'

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

export default {
  name: 'ComparisonsAdminPage',
  components: { StatusTag },
  data() {
    return {
      rows: adminComparisons.map((item) => ({ ...item })),
      keyword: '',
      status: ''
    }
  },
  computed: {
    publishedCount() {
      return this.rows.filter((item) => item.status === 'published').length
    },
    filtered() {
      const value = this.keyword.trim().toLowerCase()
      return this.rows.filter((item) => {
        if (this.status && item.status !== this.status) return false
        if (!value) return true
        return item.title.toLowerCase().includes(value)
      })
    }
  },
  methods: {
    preview(row) {
      window.open(`${webUrl}/#/comparisons/${row.id}`, '_blank', 'noopener')
    },
    edit(row) {
      this.$message.info(`编辑「${row.title}」（演示环境不保存）`)
    },
    publish(row) {
      const next = row.status === 'published' ? 'draft' : 'published'
      row.status = next
      this.$message.success(`「${row.title}」已${next === 'published' ? '发布' : '转为草稿'}`)
    },
    create() {
      this.$message.info('新建对比表单将在接口接入后开放')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';

.title {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: $ink;
}

.code {
  font-size: 11.5px;
  color: $muted;
}
</style>
