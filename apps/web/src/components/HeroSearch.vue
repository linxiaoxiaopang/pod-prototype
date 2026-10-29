<template>
  <div class="hero-search" @paste="onPaste">
    <div id="search" class="search-card">
      <i class="el-icon-search search-icon" aria-hidden="true"></i>
      <el-autocomplete
        ref="search"
        v-model="keyword"
        class="search-input"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="true"
        :debounce="120"
        :placeholder="placeholder"
        aria-label="搜索按需打印供应商、产品、对比与指南"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <span class="sug-label">{{ item.value }}</span>
          <span v-if="item.meta" class="sug-meta">{{ item.meta }}</span>
          <span class="sug-group">{{ item.group }}</span>
        </template>
      </el-autocomplete>
      <button
        type="button"
        class="camera-btn"
        title="以图搜索"
        aria-label="以图搜索：上传或粘贴产品图片"
        @click="openImageSearch"
      >
        <i class="el-icon-camera" aria-hidden="true"></i>
      </button>
      <el-button type="primary" class="search-btn" @click="submit">搜索</el-button>
    </div>

    <div class="popular">
      <span class="popular-label">热门</span>
      <router-link
        v-for="item in popular"
        :key="item.label"
        class="popular-chip"
        :to="item.to"
      >
        {{ item.label }}
      </router-link>
    </div>

    <ImageSearchPanel ref="imageSearch" />
  </div>
</template>

<script>
import ImageSearchPanel from './ImageSearchPanel.vue'
import { hero, searchIndex } from '@/data/content'
import { bestProductMatch } from '@/data/products'

const GROUP_ORDER = { '供应商': 0, '产品': 1 }

export default {
  name: 'HeroSearch',
  components: { ImageSearchPanel },
  data() {
    return {
      keyword: '',
      popular: hero.popular,
      placeholder: hero.placeholder
    }
  },
  mounted() {
    window.addEventListener('pod:focus-search', this.focusSearch)

    // 从其他页面点顶部搜索入口时，通过 ?focus=search 交接焦点
    if (this.$route.query.focus === 'search') {
      this.$nextTick(() => this.applyFocusRequest())
    }
  },
  beforeDestroy() {
    window.removeEventListener('pod:focus-search', this.focusSearch)
  },
  methods: {
    querySearch(query, cb) {
      const value = (query || '').trim().toLowerCase()
      const pool = value
        ? searchIndex.filter((item) => item.value.toLowerCase().includes(value))
        : searchIndex.slice(0, 7)
      cb(this.limitSuggestions(pool))
    },
    // 供应商 / 对比优先，产品最多 5 条，避免联想列表被同款产品刷屏
    limitSuggestions(pool) {
      const rank = (group) => (GROUP_ORDER[group] === undefined ? 9 : GROUP_ORDER[group])
      const sorted = pool.slice().sort((a, b) => rank(a.group) - rank(b.group))
      const primary = []
      const productHits = []

      sorted.forEach((item) => {
        if (item.group === '产品') {
          if (productHits.length < 5) productHits.push(item)
        } else if (primary.length < 4) {
          primary.push(item)
        }
      })

      return [...primary, ...productHits]
    },
    handleSelect(item) {
      this.keyword = item.value
      this.jump(item.to)
    },
    submit() {
      const raw = this.keyword.trim()
      const value = raw.toLowerCase()

      if (!value) {
        this.$message.warning('请输入供应商或产品名称后再搜索。')
        return
      }

      const match = searchIndex.find(
        (item) => item.group !== '产品' && item.value.toLowerCase().includes(value)
      )
      if (match) {
        this.$router.push(match.to).catch(() => {})
        return
      }

      const product = bestProductMatch(raw)
      if (product) {
        this.$message({
          message: `已找到「${product.name}」，正在打开产品详情。`,
          type: 'success'
        })
        this.$router.push(`/products/${product.id}`).catch(() => {})
        return
      }

      this.$message({
        message: `没有找到与「${raw}」完全匹配的结果，已改为在供应商目录中筛选。`,
        type: 'info'
      })
      this.$router.push({ path: '/suppliers', query: { q: raw } }).catch(() => {})
    },
    jump(target) {
      if (!target) return
      if (target.startsWith('/')) {
        this.$router.push(target).catch(() => {})
        return
      }
      const el = document.querySelector(target)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    focusSearch() {
      const input = this.$refs.search
      if (input && typeof input.focus === 'function') input.focus()
    },
    openImageSearch() {
      this.$refs.imageSearch.open()
    },
    // 在搜索框内直接粘贴截图时，交给以图搜索面板处理
    onPaste(event) {
      const items = (event.clipboardData && event.clipboardData.items) || []
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].kind === 'file' && /^image\//i.test(items[i].type)) {
          event.preventDefault()
          // 面板内也有 document 级粘贴监听，这里阻止冒泡避免重复识别
          event.stopPropagation()
          this.$refs.imageSearch.open(items[i].getAsFile())
          return
        }
      }
    },
    // 来自 ?focus=search 的聚焦请求：滚动到位、聚焦输入框并清理 query
    applyFocusRequest() {
      this.scrollToSearch()
      this.focusSearch()

      const query = { ...this.$route.query }
      delete query.focus
      if (this.$route.path === '/') {
        this.$router.replace({ path: '/', query }).catch(() => {})
      }
    },
    scrollToSearch() {
      const el = document.getElementById('search')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.search-card {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 720px;
  margin: 36px auto 0;
  padding: 10px 10px 10px 22px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid $line;
  box-shadow: 0 26px 60px -34px rgba(13, 16, 48, 0.4);
  transition: border-color 0.25s $ease, box-shadow 0.25s $ease;

  &:focus-within {
    border-color: rgba(91, 75, 255, 0.5);
    box-shadow: 0 0 0 4px rgba(91, 75, 255, 0.12), 0 30px 60px -34px rgba(13, 16, 48, 0.45);
  }
}

.search-icon {
  font-size: 19px;
  color: $muted;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;

  :deep(.el-input__inner) {
    height: 44px;
    padding: 0;
    border: none;
    background: transparent;
    font-family: $font;
    font-size: 15.5px;
    color: $ink;

    &::placeholder {
      color: $muted;
    }
  }
}

// 参考 Google 图片搜索：相机入口固定在搜索框内右侧
.camera-btn {
  @include flex-center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: $muted;
  font-size: 19px;
  cursor: pointer;
  transition: background 0.2s $ease, color 0.2s $ease;

  &:hover,
  &:focus-visible {
    background: $bg-soft;
    outline: none;
  }

  &:hover i {
    background: linear-gradient(135deg, $primary 10%, #8f5bff 55%, $accent 120%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.search-btn {
  height: 44px;
  padding: 0 26px;
  border-radius: 14px;
  font-size: 15px;
  flex-shrink: 0;
}

.popular {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.popular-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: $muted;
}

.popular-chip {
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid $line;
  background: #fff;
  font-size: 12.5px;
  font-weight: 600;
  color: $ink-soft;
  white-space: nowrap;
  transition: color 0.25s $ease, border-color 0.25s $ease, transform 0.25s $ease;

  &:hover {
    color: $primary;
    border-color: rgba(91, 75, 255, 0.4);
    transform: translateY(-1px);
  }
}

.sug-label {
  font-weight: 600;
}

.sug-meta {
  margin-left: 7px;
  font-size: 12px;
  font-weight: 600;
  color: $ink-soft;
}

.sug-group {
  margin-left: auto;
  padding-left: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $muted;
}

:deep(.el-autocomplete-suggestion__list li) {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  white-space: nowrap;
}

@include down(700px) {
  .search-card {
    flex-wrap: wrap;
    padding: 12px;
    gap: 10px;
  }

  .search-icon {
    margin-left: 6px;
  }

  .search-input {
    flex: 1 1 60%;
  }

  .search-btn {
    width: 100%;
    margin-left: 0;
  }

  .popular-label {
    width: 100%;
    text-align: center;
  }
}
</style>
