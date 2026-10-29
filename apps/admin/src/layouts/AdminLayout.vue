<template>
  <div class="admin-shell">
    <aside class="sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="brand">
        <span class="brand-mark">P</span>
        <span class="brand-text">
          PrintOnDemand<em>Business</em>
          <small>运营后台</small>
        </span>
      </div>

      <nav class="nav" aria-label="后台导航">
        <p class="nav-label">工作台</p>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          class="nav-item"
          :to="item.to"
          active-class="is-active"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <em v-if="item.badge" class="nav-badge">{{ item.badge }}</em>
        </router-link>
      </nav>

      <div class="sidebar-foot">
        <a class="storefront" :href="webUrl" target="_blank" rel="noopener">
          <i class="el-icon-view"></i>
          查看业务端
          <i class="el-icon-top-right"></i>
        </a>
        <p class="env">演示环境 · v1.0.0</p>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <button class="menu-toggle" type="button" aria-label="展开菜单" @click="sidebarOpen = !sidebarOpen">
          <i class="el-icon-s-fold"></i>
        </button>

        <div class="crumb">
          <span>后台</span>
          <i class="el-icon-arrow-right"></i>
          <strong>{{ title }}</strong>
        </div>

        <div class="topbar-actions">
          <el-input
            v-model="keyword"
            class="global-search"
            prefix-icon="el-icon-search"
            placeholder="搜索供应商或产品"
            clearable
            @keyup.enter.native="goSearch"
          />

          <el-dropdown trigger="click" @command="onCommand">
            <span class="user">
              <span class="avatar">OP</span>
              <span class="user-name">
                运营管理员
                <small>admin@pod.demo</small>
              </span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="storefront">打开业务端</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>

    <div v-if="sidebarOpen" class="scrim" @click="sidebarOpen = false"></div>
  </div>
</template>

<script>
import { AUTH_KEY } from '@/router'
import { listCrawlItems, listHelpArticles, listSuppliers } from '@/data/adminStore'

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

export default {
  name: 'AdminLayout',
  data() {
    return {
      webUrl,
      keyword: '',
      sidebarOpen: false,
      supplierCount: listSuppliers().length,
      helpPendingCount: listHelpArticles().filter((item) => item.status !== 'published').length,
      crawlPendingCount: listCrawlItems().filter((item) => item.status === 'pending').length
    }
  },
  computed: {
    title() {
      return this.$route.meta.title || '运营后台'
    },
    navItems() {
      return [
        { to: '/dashboard', label: '运营概览', icon: 'el-icon-data-line' },
        {
          to: '/suppliers',
          label: '供应商管理',
          icon: 'el-icon-office-building',
          badge: String(this.supplierCount)
        },
        { to: '/products', label: '产品目录', icon: 'el-icon-s-goods' },
        {
          to: '/extension',
          label: '采集插件',
          icon: 'el-icon-connection',
          badge: this.crawlPendingCount ? String(this.crawlPendingCount) : ''
        },
        {
          to: '/help',
          label: '帮助中心',
          icon: 'el-icon-chat-dot-square',
          badge: this.helpPendingCount ? String(this.helpPendingCount) : ''
        }
      ]
    }
  },
  watch: {
    $route() {
      this.sidebarOpen = false
      this.supplierCount = listSuppliers().length
      this.helpPendingCount = listHelpArticles().filter((item) => item.status !== 'published').length
      this.crawlPendingCount = listCrawlItems().filter((item) => item.status === 'pending').length
    }
  },
  methods: {
    goSearch() {
      const value = this.keyword.trim()
      this.$router.push({ path: '/suppliers', query: value ? { q: value } : {} }).catch(() => {})
    },
    onCommand(command) {
      if (command === 'storefront') {
        window.open(this.webUrl, '_blank', 'noopener')
        return
      }
      if (command === 'logout') {
        window.localStorage.removeItem(AUTH_KEY)
        window.sessionStorage.removeItem(AUTH_KEY)
        this.$message.success('已退出登录')
        this.$router.replace('/login').catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.admin-shell {
  display: flex;
  min-height: 100vh;
  background: $bg;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  width: $sidebar-w;
  padding: 22px 16px 18px;
  background: radial-gradient(ellipse 120% 60% at 0% 0%, #1b1f47 0%, $sidebar 62%);
  color: #fff;

  @include down(980px) {
    transform: translateX(-100%);
    transition: transform 0.3s $ease;

    &.is-open {
      transform: translateX(0);
      box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.6);
    }
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 22px;
}

.brand-mark {
  @include flex-center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(140deg, $primary 0%, #8d5bff 60%, #ff6b35 140%);
  font-size: 15px;
  font-weight: 800;
}

.brand-text {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;

  em {
    font-style: normal;
    color: #a89bff;
  }

  small {
    display: block;
    margin-top: 4px;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.42);
  }
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

.nav-label {
  padding: 0 10px;
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.34);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.68);
  transition: background 0.2s $ease, color 0.2s $ease;

  i {
    font-size: 15px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
  }

  &.is-active {
    background: linear-gradient(100deg, rgba(91, 75, 255, 0.28), rgba(91, 75, 255, 0.08));
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
}

.nav-badge {
  margin-left: auto;
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-foot {
  margin-top: auto;
  padding-top: 18px;
}

.storefront {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  transition: background 0.2s $ease, color 0.2s $ease;

  i:last-child {
    margin-left: auto;
    font-size: 11px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
}

.env {
  margin: 12px 2px 0;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.32);
}

.main {
  flex: 1;
  min-width: 0;
  margin-left: $sidebar-w;

  @include down(980px) {
    margin-left: 0;
  }
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 16px;
  height: $header-h;
  padding: 0 26px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid $line;
  backdrop-filter: blur(14px);
}

.menu-toggle {
  display: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid $line;
  border-radius: 9px;
  background: #fff;
  color: $ink;
  font-size: 15px;
  cursor: pointer;

  @include down(980px) {
    display: grid;
  }
}

.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $muted;

  i {
    font-size: 10px;
  }

  strong {
    font-weight: 700;
    color: $ink;
  }
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
}

.global-search {
  width: 240px;

  :deep(.el-input__inner) {
    height: 36px;
    border-radius: 9px;
    background: $bg;
  }

  @include down(760px) {
    display: none;
  }
}

.user {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 8px 5px 5px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s $ease;

  &:hover {
    background: $bg;
  }
}

.avatar {
  @include flex-center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: $primary-soft;
  color: $primary;
  font-size: 12px;
  font-weight: 800;
}

.user-name {
  display: flex;
  flex-direction: column;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.25;
  color: $ink;

  small {
    font-size: 10.5px;
    font-weight: 500;
    color: $muted;
  }

  @include down(620px) {
    display: none;
  }
}

.content {
  padding: 26px;
  max-width: 1440px;

  @include down(760px) {
    padding: 18px 16px 32px;
  }
}

.scrim {
  position: fixed;
  inset: 0;
  z-index: 25;
  display: none;
  background: rgba(13, 16, 48, 0.45);

  @include down(980px) {
    display: block;
  }
}
</style>
