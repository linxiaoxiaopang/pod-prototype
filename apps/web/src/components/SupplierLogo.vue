<template>
  <span class="supplier-logo" :style="style" :aria-label="name">
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="accent" stop-opacity="1" />
          <stop offset="100%" :stop-color="accent" stop-opacity="0.62" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" :fill="`url(#${gradientId})`" />
      <circle cx="38" cy="10" r="12" fill="#fff" opacity="0.14" />
      <text
        x="24"
        y="30"
        text-anchor="middle"
        font-family="Plus Jakarta Sans, sans-serif"
        font-size="17"
        font-weight="800"
        fill="#ffffff"
      >
        {{ monogram }}
      </text>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'SupplierLogo',
  props: {
    name: { type: String, default: '供应商' },
    monogram: { type: String, default: '' },
    accent: { type: String, default: '#5b4bff' },
    size: { type: Number, default: 56 }
  },
  computed: {
    gradientId() {
      return `logo-grad-${this.name.replace(/\s+/g, '-').toLowerCase()}`
    },
    style() {
      return { width: `${this.size}px`, height: `${this.size}px` }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.supplier-logo {
  display: block;
  flex-shrink: 0;
  border-radius: 14px;
  box-shadow: 0 12px 24px -14px rgba(13, 16, 48, 0.55);

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
