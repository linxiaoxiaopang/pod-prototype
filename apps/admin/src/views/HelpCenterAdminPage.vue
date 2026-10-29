<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>帮助中心管理</h1>
        <p>{{ articles.length }} 个问题 · {{ publishedCount }} 个已发布，展示在业务端帮助中心。</p>
      </div>
      <div class="head-actions">
        <el-button icon="el-icon-view" round @click="openSite">查看帮助中心</el-button>
        <el-button type="primary" icon="el-icon-plus" round @click="openArticle()">新建问题</el-button>
      </div>
    </header>

    <section class="stats">
      <article v-for="item in stats" :key="item.label" class="stat" :class="`tone-${item.tone}`">
        <span class="stat-icon"><i :class="item.icon"></i></span>
        <div>
          <p class="stat-label">{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span class="stat-meta">{{ item.meta }}</span>
        </div>
      </article>
    </section>

    <div class="help-layout">
      <aside class="side">
        <div class="panel cat-panel">
          <header class="cat-head">
            <h2>分类</h2>
            <button class="mini" type="button" @click="openCategory()">
              <i class="el-icon-plus"></i>
              新增
            </button>
          </header>

          <ul class="cat-list">
            <li :class="{ 'is-active': !category }" @click="selectCategory('')">
              <span class="cat-name">全部问题</span>
              <em>{{ articles.length }}</em>
            </li>
            <li
              v-for="item in categories"
              :key="item.id"
              :class="{ 'is-active': category === item.name }"
              @click="selectCategory(item.name)"
            >
              <span class="cat-name">{{ item.name }}</span>
              <em>{{ countByCategory(item.name) }}</em>
              <span class="cat-tools">
                <button type="button" title="编辑分类" @click.stop="openCategory(item)">
                  <i class="el-icon-edit"></i>
                </button>
                <button type="button" title="删除分类" @click.stop="removeCategory(item)">
                  <i class="el-icon-delete"></i>
                </button>
              </span>
            </li>
          </ul>
        </div>

        <div class="panel settings-panel">
          <h2>帮助中心设置</h2>
          <el-form label-position="top" class="settings-form">
            <el-form-item label="页面标题">
              <el-input v-model="settings.title" size="small" />
            </el-form-item>
            <el-form-item label="搜索占位提示">
              <el-input v-model="settings.placeholder" size="small" />
            </el-form-item>
            <el-form-item label="支持邮箱">
              <el-input v-model="settings.supportEmail" size="small" />
            </el-form-item>
          </el-form>
          <el-button type="primary" size="small" round @click="saveSettings">保存设置</el-button>
        </div>
      </aside>

      <div class="panel main-panel">
        <div class="toolbar">
          <el-input
            v-model="keyword"
            class="search"
            prefix-icon="el-icon-search"
            placeholder="搜索问题或答案"
            clearable
          />
          <el-select v-model="status" class="filter" placeholder="全部状态">
            <el-option label="全部状态" value="" />
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span class="result">{{ filtered.length }} 条结果</span>
        </div>

        <el-table :data="paged" class="table">
          <el-table-column label="问题" min-width="280">
            <template slot-scope="{ row }">
              <div class="title-cell">
                <strong>{{ row.title }}</strong>
                <span v-if="row.pinned" class="pin">置顶</span>
              </div>
              <small class="excerpt">{{ row.excerpt }}</small>
            </template>
          </el-table-column>

          <el-table-column label="分类" width="130">
            <template slot-scope="{ row }">
              <span class="tag">{{ row.category }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="110">
            <template slot-scope="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>

          <el-table-column label="浏览量" width="100">
            <template slot-scope="{ row }">
              <span :class="{ muted: !row.views }">{{ row.views ? row.views.toLocaleString() : '—' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="有用率" width="90">
            <template slot-scope="{ row }">
              <span :class="{ muted: !row.helpful }">{{ row.helpful ? row.helpful + '%' : '—' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="更新时间" width="120" prop="updated" />

          <el-table-column label="操作" width="170" align="right">
            <template slot-scope="{ row }">
              <button class="link" type="button" @click="openArticle(row)">编辑</button>
              <button class="link" type="button" @click="togglePublish(row)">
                {{ row.status === 'published' ? '下架' : '发布' }}
              </button>
              <button class="link danger" type="button" @click="removeArticle(row)">删除</button>
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

    <el-dialog
      :title="articleEditing ? '编辑问题' : '新建问题'"
      :visible.sync="articleVisible"
      width="720px"
      :close-on-click-modal="false"
    >
      <el-form ref="articleForm" :model="articleForm" :rules="articleRules" label-position="top">
        <el-form-item label="问题标题" prop="title">
          <el-input v-model="articleForm.title" maxlength="60" show-word-limit placeholder="例如：按需打印的发货需要多久？" />
        </el-form-item>

        <div class="dialog-grid">
          <el-form-item label="所属分类" prop="category">
            <el-select v-model="articleForm.category" placeholder="请选择分类">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="articleForm.status">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="排序">
            <el-input-number v-model="articleForm.order" :min="1" :max="99" controls-position="right" />
          </el-form-item>

          <el-form-item label="置顶">
            <div class="switch-row">
              <el-switch v-model="articleForm.pinned" />
              <span>{{ articleForm.pinned ? '列表中优先展示' : '按排序展示' }}</span>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="摘要">
          <el-input v-model="articleForm.excerpt" maxlength="60" show-word-limit placeholder="一句话概括答案" />
        </el-form-item>

        <el-form-item label="正文" prop="body">
          <el-input v-model="articleForm.body" type="textarea" :rows="7" placeholder="支持纯文本或 Markdown 语法" />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="articleVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveArticle">保存问题</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="categoryEditing ? '编辑分类' : '新增分类'"
      :visible.sync="categoryVisible"
      width="460px"
      :close-on-click-modal="false"
    >
      <el-form ref="categoryForm" :model="categoryForm" :rules="categoryRules" label-position="top">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" maxlength="20" show-word-limit placeholder="例如：物流与配送" />
        </el-form-item>
        <el-form-item label="分类说明">
          <el-input v-model="categoryForm.desc" type="textarea" :rows="2" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.order" :min="1" :max="99" controls-position="right" />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="categoryVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存分类</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StatusTag from '@/components/StatusTag.vue'
import { helpStatusOptions } from '@/data/adminData'
import {
  getHelpSettings,
  listHelpArticles,
  listHelpCategories,
  removeHelpArticle,
  saveHelpArticles,
  saveHelpCategories,
  saveHelpSettings,
  slugify,
  today,
  upsertHelpArticle
} from '@/data/adminStore'

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

const emptyArticle = () => ({
  id: '',
  title: '',
  category: '',
  excerpt: '',
  body: '',
  status: 'draft',
  pinned: false,
  order: 99
})

const emptyCategory = () => ({ id: '', name: '', desc: '', order: 99 })

export default {
  name: 'HelpCenterAdminPage',
  components: { StatusTag },
  data() {
    return {
      articles: listHelpArticles(),
      categories: listHelpCategories(),
      settings: getHelpSettings(),
      statusOptions: helpStatusOptions,
      keyword: '',
      category: '',
      status: '',
      page: 1,
      pageSize: 8,
      saving: false,
      articleVisible: false,
      categoryVisible: false,
      articleEditing: false,
      categoryEditing: false,
      articleForm: emptyArticle(),
      categoryForm: emptyCategory(),
      articleRules: {
        title: [
          { required: true, message: '请输入问题标题', trigger: 'blur' },
          { max: 60, message: '标题不超过 60 个字符', trigger: 'blur' }
        ],
        category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
        body: [{ required: true, message: '请填写答案正文', trigger: 'blur' }]
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { max: 20, message: '名称不超过 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    publishedCount() {
      return this.articles.filter((item) => item.status === 'published').length
    },
    reviewCount() {
      return this.articles.filter((item) => item.status === 'review').length
    },
    totalViews() {
      return this.articles.reduce((sum, item) => sum + (item.views || 0), 0)
    },
    stats() {
      return [
        {
          label: '全部问题',
          value: this.articles.length,
          meta: `${this.categories.length} 个分类`,
          icon: 'el-icon-chat-dot-square',
          tone: 'violet'
        },
        {
          label: '已发布',
          value: this.publishedCount,
          meta: '业务端可见',
          icon: 'el-icon-document-checked',
          tone: 'green'
        },
        {
          label: '待审核',
          value: this.reviewCount,
          meta: '需要运营确认',
          icon: 'el-icon-time',
          tone: 'amber'
        },
        {
          label: '累计浏览',
          value: this.totalViews.toLocaleString(),
          meta: '帮助中心页面',
          icon: 'el-icon-view',
          tone: 'blue'
        }
      ]
    },
    filtered() {
      const value = this.keyword.trim().toLowerCase()
      return this.articles
        .filter((item) => {
          if (this.category && item.category !== this.category) return false
          if (this.status && item.status !== this.status) return false
          if (!value) return true
          return (
            String(item.title).toLowerCase().includes(value) ||
            String(item.body).toLowerCase().includes(value)
          )
        })
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
          if (a.order !== b.order) return a.order - b.order
          return a.updated < b.updated ? 1 : -1
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
    category() {
      this.page = 1
    }
  },
  created() {
    // 分类被删除后文章可能指向不存在的分类，这里兜底为第一个分类
    if (this.categories.length && !this.articleForm.category) {
      this.articleForm.category = this.categories[0].name
    }
  },
  methods: {
    openSite() {
      window.open(`${webUrl}/#/help`, '_blank', 'noopener')
    },
    countByCategory(name) {
      return this.articles.filter((item) => item.category === name).length
    },
    selectCategory(name) {
      this.category = name
      if (!name) return
      if (this.articleForm.category !== name) this.articleForm.category = name
    },
    openArticle(row) {
      this.articleEditing = Boolean(row)
      this.articleForm = row
        ? { ...emptyArticle(), ...row }
        : { ...emptyArticle(), category: this.category || (this.categories[0] || {}).name || '', order: this.articles.length + 1 }
      this.articleVisible = true
      this.$nextTick(() => {
        if (this.$refs.articleForm) this.$refs.articleForm.clearValidate()
      })
    },
    saveArticle() {
      this.$refs.articleForm.validate((valid) => {
        if (!valid) return
        const form = this.articleForm
        const payload = {
          ...form,
          id: form.id || `${slugify(form.title)}-${Date.now().toString(36).slice(-4)}`,
          title: form.title.trim(),
          excerpt: form.excerpt.trim(),
          body: form.body.trim(),
          updated: today()
        }
        this.saving = true
        window.setTimeout(() => {
          this.articles = upsertHelpArticle(payload)
          this.saving = false
          this.articleVisible = false
          this.$message.success(this.articleEditing ? '问题已更新' : '问题已创建')
        }, 320)
      })
    },
    togglePublish(row) {
      const next = row.status === 'published' ? 'draft' : 'published'
      row.status = next
      row.updated = today()
      saveHelpArticles(this.articles)
      this.$message.success(`「${row.title}」已${next === 'published' ? '发布' : '转为草稿'}`)
    },
    removeArticle(row) {
      this.$confirm(`删除后「${row.title}」将不再展示，确定继续？`, '删除问题', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.articles = removeHelpArticle(row.id)
          this.$message.success('问题已删除')
        })
        .catch(() => {})
    },
    openCategory(row) {
      this.categoryEditing = Boolean(row)
      this.categoryForm = row
        ? { ...row }
        : { ...emptyCategory(), order: this.categories.length + 1 }
      this.categoryVisible = true
      this.$nextTick(() => {
        if (this.$refs.categoryForm) this.$refs.categoryForm.clearValidate()
      })
    },
    saveCategory() {
      this.$refs.categoryForm.validate((valid) => {
        if (!valid) return
        const form = this.categoryForm
        const name = form.name.trim()

        if (!form.id && this.categories.some((item) => item.name === name)) {
          this.$message.error('分类名称已存在')
          return
        }

        const previousName = (this.categories.find((item) => item.id === form.id) || {}).name
        const payload = {
          id: form.id || slugify(name),
          name,
          desc: form.desc.trim(),
          order: form.order
        }

        const nextCategories = form.id
          ? this.categories.map((item) => (item.id === form.id ? payload : item))
          : [...this.categories, payload]
        this.categories = saveHelpCategories(nextCategories)

        // 分类改名时同步更新文章的分类字段
        if (previousName && previousName !== name) {
          this.articles = saveHelpArticles(
            this.articles.map((item) =>
              item.category === previousName ? { ...item, category: name, updated: today() } : item
            )
          )
          if (this.category === previousName) this.category = name
        }

        this.categoryVisible = false
        this.$message.success(form.id ? '分类已更新' : '分类已创建')
      })
    },
    removeCategory(row) {
      const count = this.countByCategory(row.name)
      if (count) {
        this.$message.warning(`「${row.name}」下还有 ${count} 个问题，请先移动或删除后再试`)
        return
      }
      this.$confirm(`确定删除分类「${row.name}」？`, '删除分类', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.categories = saveHelpCategories(this.categories.filter((item) => item.id !== row.id))
          if (this.category === row.name) this.category = ''
          this.$message.success('分类已删除')
        })
        .catch(() => {})
    },
    saveSettings() {
      saveHelpSettings(this.settings)
      this.$message.success('帮助中心设置已保存')
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

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @include down(1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.stat {
  @include card;
  display: flex;
  gap: 14px;
  padding: 16px 18px;

  strong {
    display: block;
    margin: 2px 0 3px;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
}

.stat-icon {
  @include flex-center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  font-size: 16px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $muted;
}

.stat-meta {
  font-size: 11.5px;
  color: $muted;
}

.tone-violet .stat-icon {
  background: $primary-soft;
  color: $primary;
}

.tone-green .stat-icon {
  background: rgba(22, 185, 129, 0.12);
  color: #0e9c6c;
}

.tone-blue .stat-icon {
  background: rgba(14, 165, 233, 0.12);
  color: #0b7fb0;
}

.tone-amber .stat-icon {
  background: rgba(245, 158, 11, 0.14);
  color: #b4740a;
}

.help-layout {
  display: grid;
  grid-template-columns: 268px minmax(0, 1fr);
  gap: 16px;
  align-items: start;

  @include down(1000px) {
    grid-template-columns: 1fr;
  }
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cat-panel {
  padding: 18px 14px 12px;
}

.cat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 12px;

  h2 {
    font-size: 14px;
    font-weight: 700;
  }
}

.mini {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border: 1px solid rgba(91, 75, 255, 0.28);
  border-radius: 99px;
  background: $primary-soft;
  font-family: $font;
  font-size: 11.5px;
  font-weight: 700;
  color: $primary;
  cursor: pointer;

  &:hover {
    background: rgba(91, 75, 255, 0.16);
  }
}

.cat-list {
  display: flex;
  flex-direction: column;
  gap: 2px;

  li {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border-radius: 9px;
    font-size: 12.5px;
    font-weight: 600;
    color: $ink-soft;
    cursor: pointer;
    transition: background 0.2s $ease, color 0.2s $ease;

    em {
      margin-left: auto;
      padding: 1px 7px;
      border-radius: 99px;
      background: $bg;
      font-style: normal;
      font-size: 11px;
      font-weight: 700;
      color: $muted;
    }

    &:hover {
      background: $bg;

      .cat-tools {
        display: flex;
      }
    }

    &.is-active {
      background: $primary-soft;
      color: $primary;

      em {
        background: rgba(255, 255, 255, 0.75);
        color: $primary;
      }
    }
  }
}

.cat-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cat-tools {
  display: none;
  align-items: center;
  gap: 2px;

  button {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-size: 11.5px;
    color: $muted;
    cursor: pointer;

    &:hover {
      background: #fff;
      color: $primary;
    }

    &:last-child:hover {
      color: $danger;
    }
  }
}

.cat-list li:hover em {
  display: none;
}

.settings-panel {
  padding: 18px 18px 16px;

  h2 {
    margin-bottom: 14px;
    font-size: 14px;
    font-weight: 700;
  }
}

.settings-form {
  :deep(.el-form-item) {
    margin-bottom: 10px;
  }

  :deep(.el-form-item__label) {
    padding-bottom: 4px;
    font-size: 11.5px;
  }
}

.main-panel {
  min-width: 0;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    font-size: 13.5px;
    font-weight: 700;
    color: $ink;
  }
}

.pin {
  padding: 1px 7px;
  border-radius: 99px;
  background: rgba(91, 75, 255, 0.12);
  font-size: 10.5px;
  font-weight: 700;
  color: $primary;
}

.excerpt {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  color: $muted;
}

.link.danger {
  color: $muted;

  &:hover {
    color: $danger;
  }
}

.dialog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  font-size: 12px;
  color: $muted;
}
</style>
