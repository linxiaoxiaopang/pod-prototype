<template>
  <section id="suppliers" class="section suppliers">
    <div class="container">
      <div class="section-head is-left suppliers-head">
        <div v-reveal>
          <span class="eyebrow">目录</span>
          <h2 class="section-title">精选供应商</h2>
          <p class="section-desc">
            人工挑选的按需打印供应商，产品目录、集成方式与配送覆盖均已核验。
          </p>
        </div>
        <router-link class="head-link" to="/suppliers" v-reveal="{ delay: 80 }">
          查看全部供应商
          <i class="el-icon-right"></i>
        </router-link>
      </div>

      <div class="supplier-grid">
        <SupplierCard
          v-for="(supplier, i) in featured"
          :key="supplier.id"
          :supplier="supplier"
          v-reveal="{ delay: 60 * i }"
        />
      </div>

      <p class="suppliers-note" v-reveal>
        <i class="el-icon-info"></i>
        供应商数据每周更新 · 产品数量与交付时效以各家目录为准。
      </p>
    </div>
  </section>
</template>

<script>
import SupplierCard from './SupplierCard.vue'
import { suppliers } from '@/data/suppliers'

export default {
  name: 'FeaturedSuppliers',
  components: { SupplierCard },
  computed: {
    featured() {
      return suppliers.filter((item) => item.featured)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.suppliers-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  max-width: none;
  margin-bottom: 44px;

  .section-desc {
    max-width: 560px;
    margin-top: 14px;
  }
}

.head-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-bottom: 4px;
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

.supplier-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.suppliers-note {
  margin-top: 34px;
  font-size: 12.5px;
  line-height: 1.7;
  color: $muted;

  i {
    margin-right: 6px;
    color: $primary;
    font-size: 14px;
  }

  a {
    color: $primary;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
}

@include down(900px) {
  .suppliers-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
}

@include down(700px) {
  .supplier-grid {
    grid-template-columns: 1fr;
  }
}
</style>
