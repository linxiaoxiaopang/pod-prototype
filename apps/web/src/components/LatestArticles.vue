<template>
  <section id="articles" class="section articles">
    <div class="container">
      <div class="articles-head">
        <div v-reveal>
          <span class="eyebrow">研究</span>
          <h2 class="section-title">最新研究与文章</h2>
        </div>
        <a
          class="head-link"
          href="#articles"
          v-reveal="{ delay: 80 }"
          @click.prevent="openArticle({ title: '全部文章' })"
        >
          查看全部文章
          <i class="el-icon-right"></i>
        </a>
      </div>

      <ul class="article-list">
        <li
          v-for="(article, i) in articles"
          :key="article.title"
          class="article-row"
          v-reveal="{ delay: 50 * i }"
        >
          <a class="article-link" href="#articles" @click.prevent="openArticle(article)">
            <ArticleCover :variant="article.variant" :accent="article.accent" />

            <span class="article-body">
              <span class="article-meta">
                <span v-if="article.category" class="article-cat">{{ article.category }}</span>
                <span class="article-date">{{ article.date }}</span>
              </span>
              <span class="article-title">{{ article.title }}</span>
            </span>

            <span class="article-arrow"><i class="el-icon-right"></i></span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import ArticleCover from './ArticleCover.vue'
import { articles } from '@/data/content'

export default {
  name: 'LatestArticles',
  components: { ArticleCover },
  data() {
    return { articles }
  },
  methods: {
    openArticle(article) {
      this.$message({
        message: `「${article.title}」——完整文章页将在后续版本上线。`,
        type: 'info'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.articles {
  background: $bg-soft;
  border-top: 1px solid $line;
  border-bottom: 1px solid $line;
}

.articles-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 34px;

  .section-title {
    margin-top: 13px;
    margin-bottom: 0;
  }
}

.head-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-bottom: 5px;
  font-size: 14px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 12px;
    transition: transform 0.25s $ease;
  }

  &:hover i {
    transform: translateX(4px);
  }
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-row {
  background: #fff;
  border: 1px solid $line;
  border-radius: 18px;
  transition: border-color 0.3s $ease, box-shadow 0.3s $ease, transform 0.3s $ease;

  &:hover {
    border-color: rgba(91, 75, 255, 0.32);
    box-shadow: $shadow-sm;
    transform: translateY(-3px);

    .article-title {
      color: $primary;
    }

    .article-arrow {
      background: $primary;
      color: #fff;
      transform: translateX(0);
    }
  }
}

.article-link {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 22px 16px 16px;
}

.article-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11.5px;
  font-weight: 700;
}

.article-cat {
  padding: 3px 9px;
  border-radius: 6px;
  background: $primary-soft;
  color: $primary;
  letter-spacing: 0.02em;
}

.article-date {
  color: $muted;
  font-weight: 600;
}

.article-title {
  font-size: 16.5px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.45;
  color: $ink;
  transition: color 0.25s $ease;
}

.article-arrow {
  @include flex-center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: $bg-soft;
  color: $ink-soft;
  font-size: 12px;
  transition: background 0.3s $ease, color 0.3s $ease, transform 0.3s $ease;
  transform: translateX(-4px);
}

@include down(760px) {
  .articles-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .article-link {
    gap: 14px;
    padding: 14px;
  }

  .article-title {
    font-size: 14.5px;
  }

  .article-arrow {
    display: none;
  }
}

@include down(480px) {
  .article-meta {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>
