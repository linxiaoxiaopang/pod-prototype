<template>
  <section id="faq" class="section faq">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow" v-reveal>常见问题</span>
        <h2 class="section-title" v-reveal="{ delay: 60 }">按需打印常见问题</h2>
        <p class="section-desc" v-reveal="{ delay: 120 }">关于 POD 生意，这里有你最常问的答案</p>
      </div>

      <div class="faq-list" v-reveal="{ delay: 80 }">
        <el-collapse v-model="active" accordion class="faq-collapse">
          <el-collapse-item v-for="(item, i) in faqs" :key="item.q" :name="i">
            <template slot="title">
              <span class="faq-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="faq-q">{{ item.q }}</span>
            </template>
            <p class="faq-a">{{ item.a }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>

      <p class="faq-foot" v-reveal>
        还在犹豫？可以先看
        <router-link to="/suppliers">精选供应商</router-link>，
        或到
        <router-link to="/cost-index">POD 落地成本指数</router-link> 对比落地成本。
      </p>
    </div>
  </section>
</template>

<script>
import { faqs } from '@/data/content'

export default {
  name: 'FaqSection',
  data() {
    return {
      faqs,
      active: 0
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.faq-list {
  max-width: 860px;
  margin: 0 auto;
}

.faq-collapse {
  :deep(.el-collapse-item) {
    margin-bottom: 10px;
    border-radius: $radius;
    background: #fff;
    border: 1px solid $line;
    overflow: hidden;
    transition: border-color 0.3s $ease, box-shadow 0.3s $ease;

    &:hover {
      border-color: rgba(91, 75, 255, 0.32);
    }

    &.is-active {
      border-color: rgba(91, 75, 255, 0.42);
      box-shadow: $shadow-sm;
    }
  }

  :deep(.el-collapse-item__header) {
    display: flex;
    align-items: center;
    gap: 14px;
    height: auto;
    padding: 20px 24px;
    font-size: 15.5px;
    font-weight: 700;
    line-height: 1.5;
    color: $ink;
    background: transparent;
    border-bottom: none;
  }

  :deep(.el-collapse-item__arrow) {
    margin-left: auto;
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 50%;
    background: $bg-soft;
    color: $ink-soft;
    font-weight: 700;
    font-size: 12px;
    transform: rotate(90deg);
    transition: transform 0.3s $ease, background 0.3s $ease, color 0.3s $ease;
  }

  :deep(.el-collapse-item__arrow.is-active) {
    transform: rotate(-90deg);
    background: $primary;
    color: #fff;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
    background: transparent;
  }

  :deep(.el-collapse-item__content) {
    padding: 0 24px 22px 62px;
  }
}

.faq-index {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: $muted;
}

.faq-q {
  flex: 1;
}

.faq-a {
  font-size: 14.5px;
  line-height: 1.78;
  color: $ink-soft;
}

.faq-foot {
  max-width: 860px;
  margin: 26px auto 0;
  text-align: center;
  font-size: 13.5px;
  color: $muted;

  a {
    color: $primary;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

@include down(560px) {
  .faq-collapse {
    :deep(.el-collapse-item__header) {
      padding: 17px 18px;
      font-size: 14.5px;
      gap: 10px;
    }

    :deep(.el-collapse-item__content) {
      padding: 0 18px 20px 50px;
    }
  }
}
</style>
