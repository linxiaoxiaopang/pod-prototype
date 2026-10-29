<template>
  <div class="comparisons-page">
    <PageHeader
      eyebrow="平台对比"
      title="平台对比"
      desc="汇总卖家最关心的六组 POD 供应商与平台横向对比。表中价格为单件最低公开报价。"
    >
      <template #actions>
        <el-button round @click="$router.push('/cost-index')">查看落地成本</el-button>
      </template>
    </PageHeader>

    <div class="container body">
      <div class="grid">
        <router-link
          v-for="item in comparisons"
          :key="item.id"
          class="card"
          :to="`/comparisons/${item.id}`"
        >
          <span class="tag">{{ item.tag }}</span>
          <h2>{{ item.title }}</h2>
          <p class="summary">{{ item.summary }}</p>

          <div class="table">
            <div class="row row--head">
              <span></span>
              <span>{{ sides(item).left }}</span>
              <span>{{ sides(item).right }}</span>
            </div>
            <div v-for="row in item.rows" :key="row.label" class="row">
              <span class="label">{{ row.label }}</span>
              <span>{{ row.left }}</span>
              <span>{{ row.right }}</span>
            </div>
          </div>

          <div class="card-foot">
            <p class="foot">
              <i class="el-icon-refresh"></i>
              每周核验 · 单件价格不含运费
            </p>
            <span class="card-cta">
              查看完整对比
              <i class="el-icon-right"></i>
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import { comparisons } from '@/data/comparisons'

export default {
  name: 'ComparisonsPage',
  components: { PageHeader },
  data() {
    return { comparisons }
  },
  methods: {
    sides(item) {
      const parts = item.title.split(' vs ')
      return { left: parts[0], right: parts[1] || '' }
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

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 26px;
  border-radius: 20px;
  border: 1px solid $line;
  background: #fff;
  transition: transform 0.3s $ease, box-shadow 0.3s $ease, border-color 0.3s $ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(91, 75, 255, 0.28);
    box-shadow: $shadow-sm;
  }

  h2 {
    font-size: 20px;
    margin: 12px 0 8px;
    letter-spacing: -0.02em;
  }
}

.tag {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 6px;
  background: $primary-soft;
  color: $primary;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.summary {
  font-size: 13.5px;
  line-height: 1.7;
  color: $ink-soft;
  margin-bottom: 18px;
}

.table {
  margin-top: auto;
  border: 1px solid $line;
  border-radius: 14px;
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr;
  gap: 10px;
  padding: 9px 14px;
  font-size: 12.5px;
  color: $ink;

  &:not(:last-child) {
    border-bottom: 1px solid $line;
  }

  span:not(.label) {
    font-weight: 600;
  }

  &--head {
    background: $bg-soft;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-soft;
  }
}

.label {
  color: $muted;
  font-weight: 600;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.foot {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: $muted;

  i {
    color: $primary;
  }
}

.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 800;
  color: $primary;

  i {
    font-size: 11px;
    transition: transform 0.25s $ease;
  }
}

.card:hover .card-cta i {
  transform: translateX(4px);
}

@include down(900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@include down(560px) {
  .body {
    padding-bottom: 64px;
  }

  .row {
    grid-template-columns: 1fr 1fr;
    padding: 10px 12px;

    &--head span:first-child,
    .label {
      grid-column: 1 / -1;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $muted;
    }
  }
}
</style>
