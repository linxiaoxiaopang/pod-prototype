<template>
  <article
    :id="`product-${product.id}`"
    class="product"
    :class="{ 'is-highlight': highlight }"
  >
    <div class="product-media">
      <ProductThumb :shape="product.shape" :accent="product.accent" :label="product.name" />
      <span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
    </div>

    <div class="product-body">
      <span class="product-category">{{ product.category }}</span>
      <h3>{{ product.name }}</h3>
      <p class="product-meta">
        {{ product.options }}
        <em>· {{ product.productionDays }} 天生产</em>
      </p>

      <div class="product-foot">
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
        <a
          class="product-link"
          :href="product.supplierWebsite"
          target="_blank"
          rel="noopener"
          :aria-label="`在 ${host} 查看 ${product.name}`"
        >
          前往 {{ host }} 查看
          <i class="el-icon-top-right"></i>
        </a>
      </div>
    </div>
  </article>
</template>

<script>
import ProductThumb from './ProductThumb.vue'

export default {
  name: 'ProductCard',
  components: { ProductThumb },
  props: {
    product: { type: Object, required: true },
    highlight: { type: Boolean, default: false }
  },
  computed: {
    host() {
      return (this.product.supplierWebsite || '')
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.product {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid $line;
  border-radius: 18px;
  background: #fff;
  transition: transform 0.35s $ease, box-shadow 0.35s $ease, border-color 0.35s $ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(91, 75, 255, 0.28);
    box-shadow: $shadow;
  }

  &.is-highlight {
    border-color: rgba(91, 75, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(91, 75, 255, 0.14), $shadow;
  }
}

.product-media {
  position: relative;
  aspect-ratio: 4 / 3.4;
  padding: 14px 18px 4px;
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 9px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid $line;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $primary;
  backdrop-filter: blur(6px);
}

.product-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 14px 18px 16px;
  border-top: 1px solid $line;

  h3 {
    font-size: 15.5px;
    line-height: 1.3;
    letter-spacing: -0.02em;
    margin: 2px 0 5px;
  }
}

.product-category {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $muted;
}

.product-meta {
  font-size: 12px;
  line-height: 1.5;
  color: $muted;

  em {
    font-style: normal;
    white-space: nowrap;
  }
}

.product-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
}

.product-price {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: $ink;
}

.product-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: $primary;
  white-space: nowrap;

  &:hover {
    color: $primary-dark;
  }

  i {
    font-size: 11px;
  }
}
</style>
