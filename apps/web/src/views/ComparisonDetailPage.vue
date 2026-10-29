<template>
  <div v-if="item.id" class="comparison-detail">
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-inner">
        <nav class="crumbs" aria-label="面包屑导航">
          <router-link to="/">首页</router-link>
          <i class="el-icon-arrow-right"></i>
          <router-link to="/comparisons">平台对比</router-link>
          <i class="el-icon-arrow-right"></i>
          <span>{{ item.title }}</span>
        </nav>

        <span class="tag">{{ item.tag }}</span>
        <h1>{{ item.title }}（2026）</h1>
        <p class="deck">{{ deck }}</p>

        <div class="hero-meta">
          <span class="updated">
            <i class="el-icon-refresh"></i>
            更新于 {{ updated }}
          </span>
        </div>

        <div class="hero-actions">
          <el-button
            v-if="leftSupplier"
            type="primary"
            round
            @click="$router.push(`/suppliers/${leftSupplier.id}`)"
          >
            查看 {{ left }} 供应商详情
          </el-button>
          <el-button
            v-if="rightSupplier"
            round
            @click="$router.push(`/suppliers/${rightSupplier.id}`)"
          >
            查看 {{ right }} 供应商详情
          </el-button>
          <el-button round @click="$router.push('/cost-index')">查看落地成本</el-button>
        </div>
      </div>
    </section>

    <div class="container body">
      <section class="verdict">
        <h2 class="verdict-title">
          <span aria-hidden="true">🏆</span>
          一句话结论
        </h2>
        <div class="verdict-grid">
          <div class="verdict-col">
            <h3>{{ left }} 更适合…</h3>
            <ul>
              <li v-for="point in verdict.left" :key="point">
                <i class="el-icon-check"></i>
                {{ point }}
              </li>
            </ul>
          </div>
          <div class="verdict-col">
            <h3>{{ right }} 更适合…</h3>
            <ul>
              <li v-for="point in verdict.right" :key="point">
                <i class="el-icon-check"></i>
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
        <p class="verdict-note">{{ verdict.note }}</p>
      </section>

      <section class="block">
        <h2>速览：核心对比表</h2>
        <div class="table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>对比项</th>
                <th>{{ left }}</th>
                <th>{{ right }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in item.rows" :key="row.label">
                <th>{{ row.label }}</th>
                <td>{{ row.left }}</td>
                <td>{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="table-note">
          数据于 {{ updated }} 对照官方页面核验。价格与库存可能随时变动，请以官方为准。
        </p>
      </section>

      <section v-for="section in sections" :key="section.title" class="block">
        <h2>{{ section.title }}</h2>
        <p>{{ section.body }}</p>
        <p class="bottom-line">
          <strong>小结：</strong>
          {{ section.bottom }}
        </p>
      </section>

      <section class="block">
        <h2>真实使用场景</h2>
        <ul class="cases">
          <li v-for="item in useCases" :key="item.who">
            <span>{{ item.who }}</span>
            <strong>{{ item.pick }}</strong>
          </li>
        </ul>
      </section>

      <section class="block">
        <h2>优势速览</h2>
        <div class="two-col">
          <div class="pros">
            <h3>{{ left }}</h3>
            <ul>
              <li v-for="point in pros.left" :key="point">
                <i class="el-icon-check"></i>
                {{ point }}
              </li>
            </ul>
          </div>
          <div class="pros">
            <h3>{{ right }}</h3>
            <ul>
              <li v-for="point in pros.right" :key="point">
                <i class="el-icon-check"></i>
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="block conclusion">
        <h2>到底该选哪个？</h2>
        <div class="two-col">
          <div class="choose">
            <h3>如果你看重以下几点，选 {{ left }}</h3>
            <ul>
              <li v-for="point in conclusion.left" :key="point">{{ point }}</li>
            </ul>
          </div>
          <div class="choose">
            <h3>如果你优先考虑以下几点，选 {{ right }}</h3>
            <ul>
              <li v-for="point in conclusion.right" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
        <p class="final"><strong>最终结论：</strong> {{ conclusion.final }}</p>
        <p class="evidence-line">
          数据日期：{{ updated }} —— 下单前请再次核对价格、库存与运费。
        </p>
      </section>

      <section class="block">
        <h2>下一步</h2>
        <div class="next-grid">
          <router-link v-if="leftSupplier" class="next-card" :to="`/suppliers/${leftSupplier.id}`">
            <span>供应商详情</span>
            <strong>{{ left }}</strong>
            <i class="el-icon-right"></i>
          </router-link>
          <router-link
            v-if="rightSupplier"
            class="next-card"
            :to="`/suppliers/${rightSupplier.id}`"
          >
            <span>供应商详情</span>
            <strong>{{ right }}</strong>
            <i class="el-icon-right"></i>
          </router-link>
          <router-link class="next-card" to="/cost-index">
            <span>数据</span>
            <strong>POD 落地成本指数</strong>
            <i class="el-icon-right"></i>
          </router-link>
          <router-link
            v-if="similar[0]"
            class="next-card"
            :to="`/comparisons/${similar[0].id}`"
          >
            <span>继续对比</span>
            <strong>{{ similar[0].title }}</strong>
            <i class="el-icon-right"></i>
          </router-link>
        </div>
      </section>

      <section class="block">
        <h2>常见问题</h2>
        <el-collapse v-model="active" accordion class="faq">
          <el-collapse-item v-for="(faq, i) in faqs" :key="faq.q" :name="i">
            <template slot="title">
              <span class="faq-q">{{ faq.q }}</span>
            </template>
            <p class="faq-a">{{ faq.a }}</p>
          </el-collapse-item>
        </el-collapse>
      </section>

      <section v-if="similar.length" class="block">
        <h2>其他对比</h2>
        <div class="more-list">
          <router-link
            v-for="other in similar"
            :key="other.id"
            class="more-item"
            :to="`/comparisons/${other.id}`"
          >
            <span>{{ other.title }}</span>
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { comparisons } from '@/data/comparisons'
import { getComparisonDetail } from '@/data/comparisonDetails'
import { suppliers } from '@/data/suppliers'

export default {
  name: 'ComparisonDetailPage',
  data() {
    return { active: 0 }
  },
  computed: {
    item() {
      const found = comparisons.find((c) => c.id === this.$route.params.id)
      return found ? getComparisonDetail(found) : {}
    },
    left() {
      return (this.item.title || '').split(' vs ')[0] || ''
    },
    right() {
      return (this.item.title || '').split(' vs ')[1] || ''
    },
    leftSupplier() {
      return this.findSupplier(this.left)
    },
    rightSupplier() {
      return this.findSupplier(this.right)
    },
    deck() {
      return this.item.deck || this.item.summary || ''
    },
    updated() {
      return this.item.updated || '2026年8月31日'
    },
    verdict() {
      return this.item.verdict || { left: [], right: [], note: '' }
    },
    sections() {
      return this.item.sections || []
    },
    useCases() {
      return this.item.useCases || []
    },
    pros() {
      return this.item.pros || { left: [], right: [] }
    },
    conclusion() {
      return this.item.conclusion || { left: [], right: [], final: '' }
    },
    faqs() {
      return this.item.faqs || []
    },
    similar() {
      const names = [this.left, this.right].filter(Boolean)
      return comparisons
        .filter((c) => c.id !== this.item.id)
        .map((c) => ({ c, score: names.filter((n) => c.title.includes(n)).length }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry) => entry.c)
    }
  },
  watch: {
    '$route.params.id'() {
      this.active = 0
      if (!this.item.id) this.$router.replace('/comparisons')
    }
  },
  created() {
    if (!this.item.id) this.$router.replace('/comparisons')
  },
  methods: {
    findSupplier(name) {
      if (!name) return null
      return suppliers.find((s) => s.name.toLowerCase() === name.toLowerCase()) || null
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
  background: radial-gradient(ellipse 55% 80% at 12% 0%, rgba(91, 75, 255, 0.15), transparent 62%),
    linear-gradient(180deg, #fbfbff 0%, #ffffff 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding-top: 26px;
  padding-bottom: 38px;
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

.tag {
  display: inline-block;
  margin-bottom: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  background: $primary-soft;
  color: $primary;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(27px, 3.6vw, 42px);
  letter-spacing: -0.035em;
  line-height: 1.12;
  margin-bottom: 12px;
}

.deck {
  max-width: 760px;
  font-size: 15.5px;
  line-height: 1.7;
  color: $ink-soft;
}

.hero-meta {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 14px;
  font-size: 12px;
  color: $muted;

  i {
    margin-right: 4px;
  }
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.body {
  max-width: 900px;
  padding-top: 34px;
  padding-bottom: 84px;
}

.verdict {
  padding: 26px;
  border-radius: 20px;
  background: linear-gradient(160deg, #f7f5ff 0%, #ffffff 60%);
  border: 1px solid rgba(91, 75, 255, 0.24);
}

.verdict-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 18px;
}

.verdict-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.verdict-col {
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid $line;

  h3 {
    font-size: 13px;
    font-weight: 800;
    color: $ink;
    margin-bottom: 10px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.6;
    color: $ink-soft;

    i {
      margin-top: 3px;
      font-size: 12px;
      color: $primary;
    }
  }
}

.verdict-note {
  margin-top: 16px;
  font-size: 12.5px;
  line-height: 1.7;
  color: $muted;
}

.block {
  padding-top: 36px;

  h2 {
    font-size: clamp(20px, 2.2vw, 25px);
    letter-spacing: -0.025em;
    margin-bottom: 14px;
  }

  > p {
    font-size: 14.5px;
    line-height: 1.8;
    color: $ink-soft;
  }
}

.table-wrap {
  margin-top: 6px;
  border: 1px solid $line;
  border-radius: 16px;
  overflow: hidden;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
    line-height: 1.55;
    vertical-align: top;
  }

  thead th {
    background: $bg-soft;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-soft;
  }

  tbody tr:not(:last-child) {
    border-bottom: 1px solid $line;
  }

  tbody th {
    width: 30%;
    font-weight: 600;
    color: $muted;
  }

  td {
    font-weight: 600;
    color: $ink;
  }
}

.table-note {
  margin-top: 10px;
  font-size: 11.5px;
  color: $muted;
  line-height: 1.6;
}

.bottom-line {
  margin-top: 12px;
  padding: 12px 16px;
  border-left: 3px solid $primary;
  border-radius: 0 10px 10px 0;
  background: $bg-soft;
  font-size: 13.5px;
  line-height: 1.7;
  color: $ink-soft;

  strong {
    color: $ink;
    font-weight: 800;
  }
}

.cases {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid $line;
  border-radius: 14px;
  overflow: hidden;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 11px 16px;
    background: #fff;
    font-size: 13.5px;
    color: $ink-soft;

    &:not(:last-child) {
      border-bottom: 1px solid $line;
    }
  }

  strong {
    font-weight: 800;
    color: $primary;
    white-space: nowrap;
  }
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.pros,
.choose {
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid $line;

  h3 {
    font-size: 13.5px;
    font-weight: 800;
    margin-bottom: 10px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.6;
    color: $ink-soft;

    i {
      margin-top: 3px;
      font-size: 12px;
      color: $success;
    }
  }
}

.choose ul li {
  position: relative;
  padding-left: 14px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: $primary;
  }
}

.final {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 14px;
  background: $ink;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13.5px;
  line-height: 1.7;

  strong {
    color: #fff;
  }
}

.evidence-line {
  margin-top: 10px;
  font-size: 11.5px;
  color: $muted;
}

.next-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.next-card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid $line;
  background: #fff;
  transition: border-color 0.25s $ease, transform 0.25s $ease;

  span {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: $muted;
  }

  strong {
    font-size: 14px;
    color: $ink;
  }

  i {
    align-self: flex-end;
    font-size: 11px;
    color: $primary;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(91, 75, 255, 0.4);
  }
}

.faq {
  :deep(.el-collapse-item) {
    margin-bottom: 8px;
    border: 1px solid $line;
    border-radius: 14px;
    overflow: hidden;

    &.is-active {
      border-color: rgba(91, 75, 255, 0.4);
    }
  }

  :deep(.el-collapse-item__header) {
    height: auto;
    padding: 15px 18px;
    font-size: 14.5px;
    font-weight: 700;
    color: $ink;
    border-bottom: none;
    background: transparent;
  }

  :deep(.el-collapse-item__arrow) {
    color: $primary;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
    background: transparent;
  }

  :deep(.el-collapse-item__content) {
    padding: 0 18px 16px;
  }
}

.faq-q {
  flex: 1;
}

.faq-a {
  font-size: 13.5px;
  line-height: 1.75;
  color: $ink-soft;
}

.more-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.more-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid $line;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 600;
  color: $ink;
  transition: border-color 0.25s $ease, color 0.25s $ease;

  i {
    font-size: 11px;
    color: $muted;
  }

  &:hover {
    color: $primary;
    border-color: rgba(91, 75, 255, 0.4);
  }
}

@include down(760px) {
  .verdict-grid,
  .two-col,
  .next-grid {
    grid-template-columns: 1fr;
  }

  .body {
    padding-bottom: 64px;
  }

  .compare-table {
    th,
    td {
      padding: 10px 12px;
      font-size: 12px;
    }
  }
}
</style>
