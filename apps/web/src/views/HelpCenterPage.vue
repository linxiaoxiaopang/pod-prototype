<template>
  <div class="help-center">
    <PageHeader :eyebrow="data.eyebrow" :title="data.title" :desc="data.desc" />

    <div class="container help-body">
      <div class="help-toolbar" v-reveal>
        <el-input
          v-model="keyword"
          class="help-search"
          :placeholder="data.placeholder"
          prefix-icon="el-icon-search"
          clearable
        />

        <div class="help-cats">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="cat-pill"
            :class="{ 'is-active': activeCat === cat }"
            @click="activeCat = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="help-main">
        <div class="help-list">
          <el-collapse
            v-if="filtered.length"
            v-model="active"
            accordion
            class="faq-collapse"
          >
            <el-collapse-item v-for="(item, i) in filtered" :key="item.q" :name="i">
              <template slot="title">
                <span class="faq-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="faq-q">{{ item.q }}</span>
                <span class="faq-tag">{{ item.category }}</span>
              </template>
              <p class="faq-a">{{ item.a }}</p>
            </el-collapse-item>
          </el-collapse>

          <el-empty v-else :description="data.empty" />
        </div>

        <aside class="help-side">
          <div class="support-card">
            <span class="support-icon">
              <i class="el-icon-chat-line-round"></i>
            </span>
            <h3>{{ data.support.title }}</h3>
            <p>{{ data.support.desc }}</p>
            <a class="support-cta" :href="'mailto:' + data.support.email">
              {{ data.support.cta }}
              <i class="el-icon-right"></i>
            </a>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import { faqs, helpCenter } from '@/data/content'

export default {
  name: 'HelpCenterPage',
  components: { PageHeader },
  data() {
    return {
      data: helpCenter,
      faqs,
      keyword: '',
      activeCat: helpCenter.allLabel,
      active: 0
    }
  },
  computed: {
    categories() {
      const list = [this.data.allLabel]
      this.faqs.forEach((item) => {
        if (item.category && !list.includes(item.category)) list.push(item.category)
      })
      return list
    },
    filtered() {
      const kw = this.keyword.trim().toLowerCase()
      return this.faqs.filter((item) => {
        const catOk = this.activeCat === this.data.allLabel || item.category === this.activeCat
        const kwOk = !kw || item.q.toLowerCase().includes(kw) || item.a.toLowerCase().includes(kw)
        return catOk && kwOk
      })
    }
  },
  watch: {
    keyword() {
      this.active = 0
    },
    activeCat() {
      this.active = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.help-body {
  padding-top: 40px;
  padding-bottom: 92px;
}

.help-toolbar {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 860px;
  margin-bottom: 32px;
}

.help-search {
  max-width: 520px;

  :deep(.el-input__inner) {
    height: 48px;
    line-height: 48px;
    border-radius: 12px;
    border-color: $line;
    font-family: $font;
    font-size: 14.5px;
    color: $ink;

    &:focus {
      border-color: $primary;
    }
  }

  :deep(.el-input__prefix) {
    left: 14px;
    color: $muted;
    font-size: 15px;
  }
}

.help-cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-pill {
  padding: 7px 15px;
  border: 1px solid $line;
  border-radius: 99px;
  background: #fff;
  font-family: $font;
  font-size: 13px;
  font-weight: 600;
  color: $ink-soft;
  cursor: pointer;
  transition: border-color 0.2s $ease, background 0.2s $ease, color 0.2s $ease;

  &:hover {
    border-color: rgba(91, 75, 255, 0.4);
    color: $primary;
  }

  &.is-active {
    border-color: $primary;
    background: $primary;
    color: #fff;
  }
}

.help-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 30px;
  align-items: start;
}

.help-list {
  min-width: 0;
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
    margin-left: 14px;
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
  min-width: 0;
}

.faq-tag {
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 99px;
  background: $primary-soft;
  color: $primary;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}

.faq-a {
  font-size: 14.5px;
  line-height: 1.78;
  color: $ink-soft;
}

.help-side {
  position: sticky;
  top: calc(#{$header-h} + 20px);
}

.support-card {
  @include card;
  padding: 28px 24px;
  text-align: center;
  background: linear-gradient(165deg, #fbfbff 0%, #ffffff 60%);
  border-radius: $radius-lg;
}

.support-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: $primary-soft;
  color: $primary;
  font-size: 22px;
}

.support-card h3 {
  font-size: 17px;
  margin-bottom: 8px;
}

.support-card p {
  font-size: 13.5px;
  line-height: 1.7;
  color: $muted;
  margin-bottom: 18px;
}

.support-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 22px;
  border-radius: 99px;
  background: $primary;
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  transition: background 0.25s $ease, transform 0.25s $ease;

  i {
    font-size: 11px;
  }

  &:hover {
    background: $primary-dark;
    transform: translateY(-1px);
  }
}

@include down(980px) {
  .help-main {
    grid-template-columns: 1fr;
  }

  .help-side {
    position: static;
  }

  .help-search {
    max-width: 100%;
  }
}

@include down(560px) {
  .help-body {
    padding-top: 30px;
    padding-bottom: 64px;
  }

  .faq-collapse {
    :deep(.el-collapse-item__header) {
      padding: 16px 18px;
      font-size: 14.5px;
      gap: 10px;
    }

    :deep(.el-collapse-item__content) {
      padding: 0 18px 18px 50px;
    }
  }

  .faq-tag {
    display: none;
  }
}
</style>
