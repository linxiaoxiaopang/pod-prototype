<template>
  <article
    class="supplier"
    role="link"
    tabindex="0"
    :aria-label="`查看 ${supplier.name} 详情`"
    @click="goToProfile"
    @keydown.enter.prevent="goToProfile"
  >
    <div class="supplier-top">
      <SupplierLogo
        :name="supplier.name"
        :monogram="supplier.monogram"
        :accent="supplier.accent"
        :size="52"
      />
      <div class="supplier-id">
        <h3>{{ supplier.name }}</h3>
        <p class="supplier-location">
          <i class="el-icon-location-outline"></i>
          {{ supplier.location }}
        </p>
      </div>
      <span v-if="supplier.featured" class="supplier-badge">精选</span>
    </div>

    <ul class="supplier-stats">
      <li>
        <strong>{{ supplier.products }}</strong>
        <span>款产品</span>
      </li>
      <li>
        <strong>{{ supplier.productionDays }} 天</strong>
        <span>生产周期</span>
      </li>
      <li>
        <strong>{{ supplier.since }}</strong>
        <span>年开始营业</span>
      </li>
    </ul>

    <dl class="supplier-fields">
      <div class="field">
        <dt>品类</dt>
        <dd>
          {{ topCategories }}
          <span v-if="moreCategories" class="more">+{{ moreCategories }}</span>
        </dd>
      </div>
      <div class="field">
        <dt>可对接</dt>
        <dd>
          {{ topIntegrations }}
          <span v-if="moreIntegrations" class="more">+{{ moreIntegrations }}</span>
        </dd>
      </div>
      <div class="field">
        <dt>配送范围</dt>
        <dd>{{ ships }}</dd>
      </div>
    </dl>

    <div class="supplier-actions">
      <router-link
        class="supplier-link"
        :to="profilePath"
        @click.stop
      >
        查看详情
        <i class="el-icon-right"></i>
      </router-link>
      <a
        class="supplier-ext"
        :href="supplier.website"
        target="_blank"
        rel="noopener"
        :aria-label="`访问 ${supplier.name} 官网`"
        @click.stop
      >
        <i class="el-icon-top-right"></i>
      </a>
    </div>
  </article>
</template>

<script>
import SupplierLogo from './SupplierLogo.vue'
import { shipsLabel } from '@/utils/supplierQuery'

export default {
  name: 'SupplierCard',
  components: { SupplierLogo },
  props: {
    supplier: { type: Object, required: true }
  },
  computed: {
    profilePath() {
      return `/suppliers/${this.supplier.id}`
    },
    topCategories() {
      return this.supplier.categories.slice(0, 3).join(', ')
    },
    moreCategories() {
      return Math.max(this.supplier.categories.length - 3, 0)
    },
    topIntegrations() {
      return this.supplier.integrations.slice(0, 2).join(', ')
    },
    moreIntegrations() {
      return Math.max(this.supplier.integrations.length - 2, 0)
    },
    ships() {
      return shipsLabel(this.supplier)
    }
  },
  methods: {
    goToProfile() {
      if (this.$route.path !== this.profilePath) {
        this.$router.push(this.profilePath)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.supplier {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid $line;
  cursor: pointer;
  transition: transform 0.35s $ease, box-shadow 0.35s $ease, border-color 0.35s $ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(91, 75, 255, 0.3);
    box-shadow: $shadow;

    .supplier-id h3 {
      color: $primary;
    }

    .supplier-link i {
      transform: translate(2px, -2px);
    }
  }

  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 3px;
    border-color: rgba(91, 75, 255, 0.45);
    box-shadow: $shadow;
  }
}

.supplier-top {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.supplier-id {
  min-width: 0;

  h3 {
    font-size: 17px;
    margin-bottom: 3px;
    transition: color 0.25s $ease;
  }
}

.supplier-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: $muted;

  i {
    font-size: 13px;
  }
}

.supplier-badge {
  margin-left: auto;
  padding: 4px 9px;
  border-radius: 99px;
  background: $primary-soft;
  color: $primary;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.supplier-stats {
  display: flex;
  gap: 22px;
  margin: 18px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: $bg-soft;

  li {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }

  strong {
    font-size: 15px;
    font-weight: 800;
    color: $ink;
    letter-spacing: -0.01em;
  }

  span {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $muted;
  }
}

.supplier-fields {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-bottom: 18px;
  margin-bottom: 16px;
  border-bottom: 1px solid $line;
}

.field {
  display: flex;
  align-items: baseline;
  gap: 12px;

  dt {
    width: 78px;
    flex-shrink: 0;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: $muted;
  }

  dd {
    flex: 1;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: $ink;
    line-height: 1.45;
  }
}

.more {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 5px;
  background: $primary-soft;
  color: $primary;
  font-size: 11px;
  font-weight: 800;
}

.supplier-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.supplier-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 12px;
    transition: transform 0.3s $ease;
  }
}

.supplier-ext {
  @include flex-center;
  width: 28px;
  height: 28px;
  margin-left: auto;
  border-radius: 8px;
  background: $bg-soft;
  color: $muted;
  font-size: 12px;
  transition: background 0.25s $ease, color 0.25s $ease;

  &:hover {
    background: $primary;
    color: #fff;
  }
}
</style>
