<template>
  <div class="group-head" :class="supplier ? 'is-supplier' : 'is-category'">
    <div class="group-id">
      <SupplierLogo
        v-if="supplier"
        :name="supplier.name"
        :monogram="supplier.monogram"
        :accent="supplier.accent"
        :size="44"
      />
      <span v-else class="group-bar" aria-hidden="true"></span>

      <div class="group-text">
        <h2>{{ title }}</h2>
        <p v-if="meta.length" class="group-meta">{{ meta.join(' · ') }}</p>
      </div>
    </div>

    <div class="group-side">
      <span class="group-count">{{ count }} 款</span>
      <router-link v-if="to" class="group-link" :to="to">
        {{ linkLabel }}
        <i class="el-icon-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import SupplierLogo from './SupplierLogo.vue'

export default {
  name: 'ProductGroupHeader',
  components: { SupplierLogo },
  props: {
    title: { type: String, required: true },
    meta: { type: Array, default: () => [] },
    count: { type: Number, default: 0 },
    supplier: { type: Object, default: null },
    to: { type: String, default: '' },
    linkLabel: { type: String, default: '查看工厂产品' }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid $line;
}

.group-id {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.group-bar {
  width: 4px;
  height: 34px;
  border-radius: 99px;
  background: linear-gradient(180deg, $primary 0%, #9b7bff 60%, $accent 140%);
  flex-shrink: 0;
}

.group-text {
  min-width: 0;

  h2 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.25;
  }
}

.group-meta {
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 600;
  color: $muted;
}

.group-side {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
}

.group-count {
  padding: 4px 11px;
  border-radius: 99px;
  background: $primary-soft;
  color: $primary;
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
}

.group-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: $primary;
  white-space: nowrap;

  &:hover {
    color: $primary-dark;

    i {
      transform: translateX(2px);
    }
  }

  i {
    font-size: 11px;
    transition: transform 0.25s $ease;
  }
}

@include down(760px) {
  .group-head {
    gap: 12px;
    align-items: flex-start;
  }

  .group-side {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  .group-text h2 {
    font-size: 17.5px;
  }
}
</style>
