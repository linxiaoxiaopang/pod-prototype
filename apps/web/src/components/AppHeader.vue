<template>
  <header class="site-header" :class="{ 'is-solid': scrolled }">
    <div class="header-inner">
      <a class="logo" href="#top" aria-label="PrintOnDemandBusiness">
        <span class="logo-mark">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 3h7.2a5.3 5.3 0 0 1 0 10.6H10V21H6V3zm4 3.4v3.8h3a1.9 1.9 0 0 0 0-3.8h-3z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span class="logo-text">
          {{ brand.name }}<em>{{ brand.suffix }}</em>
          <small>{{ brand.tagline }}</small>
        </span>
      </a>

      <nav class="nav" aria-label="主导航">
        <router-link
          v-for="item in navLinks"
          :key="item.label"
          class="nav-link"
          :to="item.to"
          active-class="is-active"
          exact-active-class="is-current"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="header-actions">
        <button class="search-entry" type="button" @click="focusSearch">
          <i class="el-icon-search"></i>
          <span>搜索</span>
          <kbd>/</kbd>
        </button>

        <el-button type="primary" round class="header-cta" @click="$router.push('/suppliers')">
          浏览供应商
        </el-button>

        <button class="burger" aria-label="打开菜单" @click="drawer = true">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h10"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <HeaderDrawer :visible.sync="drawer" :nav-links="navLinks" :brand="brand" />
  </header>
</template>

<script>
import HeaderDrawer from './HeaderDrawer.vue'
import { brand, navLinks } from '@/data/content'

export default {
  name: 'AppHeader',
  components: { HeaderDrawer },
  data() {
    return {
      brand,
      navLinks,
      drawer: false,
      scrolled: false
    }
  },
  mounted() {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 8
    },
    onKeydown(e) {
      if (e.key === '/' && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault()
        this.focusSearch()
      }
    },
    focusSearch() {
      this.drawer = false

      if (this.$route.path === '/') {
        this.revealSearch()
        return
      }

      // 跨页时用 query 把「聚焦搜索」交给首页组件，避免首页懒加载完成前派发事件而丢失
      this.$router
        .push({ path: '/', query: { focus: 'search' } })
        .catch(() => this.revealSearch())
    },
    // 首页已挂载：滚动到搜索框并让搜索组件接管焦点；元素未就绪时短暂重试
    revealSearch(attempt = 0) {
      const target = document.getElementById('search')

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        window.dispatchEvent(new CustomEvent('pod:focus-search'))
        return
      }

      if (attempt < 15) {
        setTimeout(() => this.revealSearch(attempt + 1), 80)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  transition: box-shadow 0.3s $ease, border-color 0.3s $ease;
  border-bottom: 1px solid transparent;

  &.is-solid {
    border-bottom-color: $line;
    box-shadow: 0 10px 30px -24px rgba(13, 16, 48, 0.55);
  }
}

.header-inner {
  @include container;
  height: $header-h;
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo-mark {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(140deg, $primary 0%, #8d5bff 60%, $accent 130%);
  box-shadow: 0 10px 20px -12px rgba(91, 75, 255, 0.9);

  svg {
    width: 19px;
    height: 19px;
  }
}

.logo-text {
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: $ink;
  line-height: 1.1;

  em {
    font-style: normal;
    color: $primary;
  }

  small {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $muted;
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 10px;
}

.nav-link {
  position: relative;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 14.5px;
  font-weight: 600;
  color: $ink-soft;
  transition: color 0.2s $ease;

  &::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 3px;
    height: 2px;
    border-radius: 2px;
    background: $primary;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s $ease;
  }

  &:hover,
  &.is-active {
    color: $primary;

    &::after {
      transform: scaleX(1);
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.search-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid $line;
  border-radius: 10px;
  background: $bg-soft;
  color: $muted;
  font-family: $font;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s $ease, background 0.2s $ease, color 0.2s $ease;

  i {
    font-size: 14px;
  }

  kbd {
    padding: 1px 5px;
    border-radius: 5px;
    background: #fff;
    border: 1px solid $line;
    font-family: $font;
    font-size: 11px;
    color: $muted;
  }

  &:hover {
    border-color: rgba(91, 75, 255, 0.4);
    background: #fff;
    color: $primary;
  }
}

.burger {
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid $line;
  border-radius: 11px;
  background: #fff;
  color: $ink;
  cursor: pointer;

  svg {
    width: 19px;
    height: 19px;
  }
}

@include down(1180px) {
  .nav,
  .search-entry span,
  .search-entry kbd,
  .header-cta {
    display: none;
  }

  .search-entry {
    width: 40px;
    height: 40px;
    justify-content: center;
    padding: 0;
    background: #fff;
  }

  .burger {
    display: grid;
  }
}

@include down(560px) {
  .logo-text small {
    display: none;
  }

  .logo-text {
    font-size: 14px;
  }
}
</style>
