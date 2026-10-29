<template>
  <div class="filters">
    <div v-if="showHeader" class="filter-head">
      <h2>筛选</h2>
      <button v-if="hasActive" class="reset" type="button" @click="$emit('reset')">重置</button>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="supplier-search">搜索</label>
      <el-input
        id="supplier-search"
        :value="value.keyword"
        placeholder="名称或地区"
        prefix-icon="el-icon-search"
        clearable
        @input="set('keyword', $event)"
      />
    </div>

    <div class="filter-group">
      <p class="filter-label">品类</p>
      <div class="chips">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="chip"
          :class="{ 'is-active': value.categories.includes(cat) }"
          :aria-pressed="value.categories.includes(cat)"
          @click="toggle('categories', cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <p class="filter-label">配送至</p>
      <el-radio-group :value="value.shipTo" size="small" @input="set('shipTo', $event)">
        <el-radio-button v-for="opt in shipping" :key="opt.value" :label="opt.value">
          {{ opt.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="filter-group">
      <p class="filter-label">集成平台</p>
      <el-checkbox
        v-for="item in integrations"
        :key="item"
        class="check"
        :value="value.integrations.includes(item)"
        @change="toggle('integrations', item)"
      >
        {{ item }}
      </el-checkbox>
    </div>

    <p class="filter-hint">
      多选会扩大结果范围 —— 同一组内只要满足任意一个条件，供应商就会出现在结果中。
    </p>
  </div>
</template>

<script>
export default {
  name: 'SupplierFilters',
  props: {
    value: { type: Object, required: true },
    categories: { type: Array, default: () => [] },
    integrations: { type: Array, default: () => [] },
    shipping: { type: Array, default: () => [] },
    showHeader: { type: Boolean, default: true }
  },
  computed: {
    hasActive() {
      const v = this.value
      return Boolean(v.keyword || v.shipTo || v.categories.length || v.integrations.length)
    }
  },
  methods: {
    set(key, val) {
      this.$emit('input', { ...this.value, [key]: val })
    },
    toggle(key, val) {
      const list = this.value[key]
      const next = list.includes(val) ? list.filter((i) => i !== val) : [...list, val]
      this.set(key, next)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid $line;

  h2 {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
}

.reset {
  border: none;
  background: transparent;
  font-family: $font;
  font-size: 12.5px;
  font-weight: 700;
  color: $primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.filter-label {
  display: block;
  margin-bottom: 10px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $muted;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.chip {
  padding: 5px 11px;
  border: 1px solid $line;
  border-radius: 8px;
  background: #fff;
  font-family: $font;
  font-size: 12px;
  font-weight: 600;
  color: $ink-soft;
  cursor: pointer;
  transition: all 0.2s $ease;

  &:hover {
    border-color: rgba(91, 75, 255, 0.4);
    color: $primary;
  }

  &.is-active {
    background: $primary;
    border-color: $primary;
    color: #fff;
    box-shadow: 0 8px 18px -12px rgba(91, 75, 255, 0.9);
  }
}

.check {
  display: flex;
  align-items: center;
  width: 100%;
  height: 26px;
  margin: 0;
  line-height: 1;

  :deep(.el-checkbox__input) {
    display: flex;
    align-items: center;
    line-height: 1;
  }

  :deep(.el-checkbox__label) {
    padding-left: 9px;
    font-size: 13px;
    line-height: 1.2;
    color: $ink-soft;
  }

  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: $primary;
    font-weight: 600;
  }
}

.filter-hint {
  padding: 12px 14px;
  border-radius: 12px;
  background: $bg-soft;
  font-size: 11.5px;
  line-height: 1.6;
  color: $muted;
}

:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

:deep(.el-radio-button__inner) {
  border-radius: 8px !important;
  border-left: 1px solid $line;
  padding: 7px 12px;
  font-family: $font;
  font-size: 12px;
  font-weight: 600;
  color: $ink-soft;
  box-shadow: none;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: $primary;
  border-color: $primary;
  color: #fff;
  box-shadow: 0 8px 18px -12px rgba(91, 75, 255, 0.9);
}
</style>
