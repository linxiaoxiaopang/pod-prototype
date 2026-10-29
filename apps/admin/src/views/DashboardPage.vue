<template>
  <div class="dashboard">
    <header class="page-head">
      <div>
        <h1>运营概览</h1>
        <p>供应商、产品与内容的最新状态，数据每 10 分钟同步一次。</p>
      </div>
      <div class="head-actions">
        <el-button icon="el-icon-refresh" round @click="refresh">刷新数据</el-button>
        <el-button type="primary" icon="el-icon-plus" round @click="$router.push('/suppliers/new')">
          新增供应商
        </el-button>
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

    <section class="grid">
      <div class="panel">
        <header class="panel-head">
          <h2>最近更新的供应商</h2>
          <router-link to="/suppliers">全部供应商 <i class="el-icon-right"></i></router-link>
        </header>

        <el-table :data="recentSuppliers" class="table" size="medium">
          <el-table-column label="供应商" min-width="170">
            <template slot-scope="{ row }">
              <div class="supplier-cell">
                <span class="dot" :class="`is-${row.status}`"></span>
                <div>
                  <strong>{{ row.name }}</strong>
                  <small>{{ row.location }}</small>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品类" min-width="150">
            <template slot-scope="{ row }">
              <span class="tag" v-for="cat in row.categories.slice(0, 2)" :key="cat">{{ cat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产" width="80">
            <template slot-scope="{ row }">{{ row.productionDays }} 天</template>
          </el-table-column>
          <el-table-column label="状态" width="110">
            <template slot-scope="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>
          <el-table-column label="更新" width="112" prop="updated" />
        </el-table>
      </div>

      <div class="panel">
        <header class="panel-head">
          <h2>操作动态</h2>
        </header>

        <ul class="activity">
          <li v-for="item in activities" :key="item.time + item.action">
            <span class="activity-avatar">{{ item.who.slice(0, 1) }}</span>
            <div>
              <p><strong>{{ item.who }}</strong> {{ item.action }}</p>
              <span class="activity-time">{{ item.time }}</span>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="shortcuts">
      <router-link v-for="item in shortcuts" :key="item.to" class="shortcut" :to="item.to">
        <i :class="item.icon"></i>
        <div>
          <strong>{{ item.title }}</strong>
          <span>{{ item.desc }}</span>
        </div>
        <i class="el-icon-right arrow"></i>
      </router-link>
    </section>
  </div>
</template>

<script>
import StatusTag from '@/components/StatusTag.vue'
import { adminActivities } from '@/data/adminData'
import { listCrawlItems, listHelpArticles, listProducts, listSuppliers } from '@/data/adminStore'

export default {
  name: 'DashboardPage',
  components: { StatusTag },
  data() {
    return {
      suppliers: listSuppliers(),
      products: listProducts(),
      helpArticles: listHelpArticles(),
      crawlItems: listCrawlItems(),
      activities: adminActivities,
      shortcuts: [
        { to: '/suppliers', icon: 'el-icon-office-building', title: '供应商管理', desc: '维护目录信息、状态与生产时效' },
        { to: '/products', icon: 'el-icon-s-goods', title: '产品目录', desc: '同步官网产品与上下架状态' },
        { to: '/extension', icon: 'el-icon-connection', title: '采集插件', desc: '用 Chrome 扩展采集竞品产品' },
        { to: '/help', icon: 'el-icon-chat-dot-square', title: '帮助中心', desc: '维护分类、问题与支持入口' }
      ]
    }
  },
  computed: {
    stats() {
      const liveProducts = this.products.filter((item) => item.status === 'live').length
      const publishedHelp = this.helpArticles.filter((item) => item.status === 'published').length
      const pending =
        this.products.filter((item) => item.status === 'draft').length +
        this.helpArticles.filter((item) => item.status !== 'published').length +
        this.crawlItems.filter((item) => item.status === 'pending').length

      return [
        {
          label: '供应商',
          value: this.suppliers.length,
          meta: `${this.suppliers.filter((item) => item.status === 'active').length} 家运营中`,
          icon: 'el-icon-office-building',
          tone: 'violet'
        },
        {
          label: '在售产品',
          value: liveProducts,
          meta: `共 ${this.products.length} 条产品记录`,
          icon: 'el-icon-s-goods',
          tone: 'green'
        },
        {
          label: '帮助中心',
          value: publishedHelp,
          meta: `共 ${this.helpArticles.length} 个问题`,
          icon: 'el-icon-chat-dot-square',
          tone: 'blue'
        },
        {
          label: '待处理',
          value: pending,
          meta: '草稿与待审核内容',
          icon: 'el-icon-bell',
          tone: 'amber'
        }
      ]
    },
    recentSuppliers() {
      return [...this.suppliers]
        .sort((a, b) => (a.updated < b.updated ? 1 : -1))
        .slice(0, 5)
    }
  },
  methods: {
    refresh() {
      this.$message.success('数据已刷新（演示为本地 mock）')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 22px;

  h1 {
    font-size: 24px;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }

  p {
    font-size: 13px;
    color: $muted;
  }
}

.head-actions {
  display: flex;
  gap: 10px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

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
  padding: 18px;

  strong {
    display: block;
    margin: 2px 0 3px;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
}

.stat-icon {
  @include flex-center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  font-size: 17px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $muted;
}

.stat-meta {
  font-size: 11.5px;
  color: $muted;
}

.tone-violet {
  .stat-icon {
    background: $primary-soft;
    color: $primary;
  }
}

.tone-green {
  .stat-icon {
    background: rgba(22, 185, 129, 0.12);
    color: #0e9c6c;
  }
}

.tone-blue {
  .stat-icon {
    background: rgba(14, 165, 233, 0.12);
    color: #0b7fb0;
  }
}

.tone-amber {
  .stat-icon {
    background: rgba(245, 158, 11, 0.14);
    color: #b4740a;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
  margin-top: 16px;

  @include down(1100px) {
    grid-template-columns: 1fr;
  }
}

.panel {
  @include card;
  padding: 18px 20px 8px;
  min-width: 0;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;

  h2 {
    font-size: 15px;
    letter-spacing: -0.01em;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12.5px;
    font-weight: 700;
    color: $primary;

    i {
      font-size: 11px;
    }
  }
}

.table {
  width: 100%;
}

.supplier-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  strong {
    display: block;
    font-size: 13.5px;
    font-weight: 700;
  }

  small {
    font-size: 11.5px;
    color: $muted;
  }
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: $muted;

  &.is-active {
    background: $success;
  }

  &.is-paused {
    background: $warning;
  }

  &.is-draft {
    background: #c3c7d8;
  }
}

.tag {
  display: inline-block;
  margin-right: 6px;
  padding: 2px 8px;
  border-radius: 6px;
  background: $bg;
  font-size: 11.5px;
  font-weight: 600;
  color: $ink-soft;
}

.activity {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 14px;

  li {
    display: flex;
    gap: 10px;
  }

  p {
    font-size: 12.5px;
    line-height: 1.6;
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }
}

.activity-avatar {
  @include flex-center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: $primary-soft;
  color: $primary;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.activity-time {
  font-size: 11px;
  color: $muted;
}

.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 16px;

  @include down(1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include down(700px) {
    grid-template-columns: 1fr;
  }
}

.shortcut {
  @include card;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  transition: border-color 0.25s $ease, box-shadow 0.25s $ease, transform 0.25s $ease;

  > i:first-child {
    @include flex-center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: $bg;
    color: $primary;
    font-size: 15px;
    flex-shrink: 0;
  }

  strong {
    display: block;
    font-size: 13.5px;
  }

  span {
    font-size: 11.5px;
    color: $muted;
  }

  .arrow {
    margin-left: auto;
    font-size: 12px;
    color: $muted;
  }

  &:hover {
    border-color: rgba(91, 75, 255, 0.32);
    box-shadow: $shadow-sm;
    transform: translateY(-2px);
  }
}
</style>
