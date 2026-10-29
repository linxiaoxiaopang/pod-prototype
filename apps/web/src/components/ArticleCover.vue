<template>
  <span class="cover" :class="`cover--${variant}`">
    <svg viewBox="0 0 160 120" role="img" aria-hidden="true">
      <rect width="160" height="120" :fill="tint" />

      <template v-if="variant === 'ai'">
        <circle cx="122" cy="26" r="34" fill="#fff" opacity="0.28" />
        <path d="M22 92l30-34 22 24 18-20 34 30z" fill="#fff" opacity="0.55" />
        <circle cx="46" cy="34" r="9" :fill="accent" opacity="0.85" />
      </template>

      <template v-else-if="variant === 'compare'">
        <rect x="18" y="26" width="54" height="68" rx="10" fill="#fff" opacity="0.72" />
        <rect x="88" y="26" width="54" height="68" rx="10" fill="#fff" opacity="0.42" />
        <rect x="30" y="42" width="30" height="4" rx="2" :fill="accent" opacity="0.7" />
        <rect x="100" y="42" width="30" height="4" rx="2" :fill="accent" opacity="0.45" />
        <path d="M80 44v32" :stroke="accent" stroke-width="2" stroke-dasharray="4 4" opacity="0.5" />
      </template>

      <template v-else-if="variant === 'europe'">
        <circle cx="80" cy="60" r="40" fill="#fff" opacity="0.25" />
        <path
          d="M40 60a40 40 0 0 1 80 0"
          fill="none"
          :stroke="accent"
          stroke-width="3"
          opacity="0.7"
        />
        <path d="M28 60h104M80 20v80" :stroke="accent" stroke-width="2" opacity="0.35" />
        <circle cx="104" cy="40" r="5" fill="#fff" opacity="0.9" />
      </template>

      <template v-else>
        <path d="M20 96l26-40 20 26 16-18 34 32z" fill="#fff" opacity="0.55" />
        <circle cx="118" cy="32" r="13" :fill="accent" opacity="0.75" />
        <rect x="20" y="20" width="34" height="6" rx="3" fill="#fff" opacity="0.7" />
      </template>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'ArticleCover',
  props: {
    variant: { type: String, default: 'ai' },
    accent: { type: String, default: '#5b4bff' }
  },
  computed: {
    tint() {
      const map = {
        ai: 'rgba(91, 75, 255, 0.14)',
        compare: 'rgba(255, 107, 53, 0.14)',
        europe: 'rgba(27, 156, 255, 0.14)',
        money: 'rgba(22, 185, 129, 0.14)'
      }
      return map[this.variant] || map.ai
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.cover {
  display: block;
  width: 96px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 14px;
  overflow: hidden;
  background: $bg-soft;
  border: 1px solid $line;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

@include down(620px) {
  .cover {
    width: 64px;
    height: 64px;
    border-radius: 12px;
  }
}
</style>
