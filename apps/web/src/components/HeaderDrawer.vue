<template>
  <el-drawer
    :visible="visible"
    direction="rtl"
    size="300px"
    :with-header="false"
    append-to-body
    custom-class="mobile-drawer"
    @update:visible="close"
  >
    <div class="drawer-body">
      <div class="drawer-head">
        <span class="drawer-brand">
          {{ brand.name }}<em>{{ brand.suffix }}</em>
        </span>
        <button class="drawer-close" aria-label="关闭菜单" @click="close">
          <i class="el-icon-close"></i>
        </button>
      </div>

      <ul class="drawer-nav">
        <li v-for="item in navLinks" :key="item.label">
          <router-link :to="item.to" @click.native="close">
            {{ item.label }}
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </li>
      </ul>

      <div class="drawer-note">
        <p class="drawer-label">POD 落地成本指数</p>
        <p class="drawer-text">
          横向对比各家供应商的热门 SKU，看谁能在最低落地成本下发货最快。
        </p>
      </div>

      <el-button type="primary" round class="drawer-cta" @click="goToSuppliers">
        浏览供应商
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'HeaderDrawer',
  props: {
    visible: { type: Boolean, default: false },
    navLinks: { type: Array, default: () => [] },
    brand: { type: Object, required: true }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    goToSuppliers() {
      this.close()
      if (this.$route.path !== '/suppliers') this.$router.push('/suppliers').catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px 22px 30px;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.drawer-brand {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: $ink;

  em {
    font-style: normal;
    color: $primary;
  }
}

.drawer-close {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: $bg-soft;
  color: $ink;
  font-size: 16px;
  cursor: pointer;
}

.drawer-nav {
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid $line;
    font-size: 16px;
    font-weight: 700;
    color: $ink;

    i {
      font-size: 12px;
      color: $muted;
    }
  }
}

.drawer-note {
  margin: 26px 0 auto;
  padding: 16px;
  border-radius: 14px;
  background: $bg-soft;
}

.drawer-label {
  font-size: 13px;
  font-weight: 800;
  color: $ink;
  margin-bottom: 6px;
}

.drawer-text {
  font-size: 12.5px;
  line-height: 1.6;
  color: $muted;
}

.drawer-cta {
  width: 100%;
  margin-top: 24px;
}
</style>
