<template>
  <div class="thumb" :style="style">
    <svg viewBox="0 0 120 120" role="img" :aria-label="`${label} 产品示意图`">
      <g v-if="shape === 'tee'">
        <path
          d="M42 22 L52 18 Q60 27 68 18 L78 22 L96 34 L86 47 L78 42 L78 100 Q60 104 42 100 L42 42 L34 47 L24 34 Z"
          fill="#fff"
        />
        <path d="M52 18 Q60 27 68 18" fill="none" stroke="rgba(13,16,48,.1)" stroke-width="2" />
      </g>

      <g v-else-if="shape === 'hoodie'">
        <path
          d="M42 30 L50 26 Q60 8 70 26 L78 30 L96 40 L86 52 L78 47 L78 100 Q60 104 42 100 L42 47 L34 52 L24 40 Z"
          fill="#fff"
        />
        <path
          d="M50 26 Q60 40 70 26"
          fill="none"
          stroke="rgba(13,16,48,.14)"
          stroke-width="2.5"
        />
        <path
          d="M56 32 v12 M64 32 v12"
          fill="none"
          stroke="rgba(13,16,48,.14)"
          stroke-width="2"
          stroke-linecap="round"
        />
        <rect
          x="48"
          y="68"
          width="24"
          height="15"
          rx="3"
          fill="none"
          stroke="rgba(13,16,48,.1)"
          stroke-width="2.5"
        />
      </g>

      <g v-else-if="shape === 'pants'">
        <path d="M40 22 H80 L88 102 H68 L60 64 L52 102 H32 Z" fill="#fff" />
        <path d="M40 34 H80" fill="none" stroke="rgba(13,16,48,.1)" stroke-width="2.5" />
      </g>

      <g v-else-if="shape === 'mug'">
        <rect x="34" y="34" width="46" height="54" rx="8" fill="#fff" />
        <path
          d="M82 48 q16 0 16 14 t-16 14"
          fill="none"
          stroke="#fff"
          stroke-width="7"
          stroke-linecap="round"
        />
        <path d="M34 48 h46" fill="none" stroke="rgba(13,16,48,.08)" stroke-width="2.5" />
      </g>

      <g v-else-if="shape === 'poster'">
        <rect x="30" y="20" width="60" height="80" rx="4" fill="#fff" />
        <rect
          x="39"
          y="29"
          width="42"
          height="62"
          rx="2"
          fill="none"
          stroke="rgba(13,16,48,.12)"
          stroke-width="2.5"
        />
      </g>

      <g v-else-if="shape === 'tote'">
        <path
          d="M46 38 V32 a14 14 0 0 1 28 0 v6"
          fill="none"
          stroke="#fff"
          stroke-width="6"
          stroke-linecap="round"
        />
        <rect x="32" y="36" width="56" height="64" rx="5" fill="#fff" />
        <path d="M32 52 h56" fill="none" stroke="rgba(13,16,48,.08)" stroke-width="2.5" />
      </g>

      <g v-else-if="shape === 'case'">
        <rect x="38" y="18" width="44" height="84" rx="12" fill="#fff" />
        <rect x="50" y="26" width="20" height="12" rx="6" fill="rgba(13,16,48,.12)" />
      </g>

      <g v-else>
        <rect x="32" y="28" width="56" height="64" rx="16" fill="#fff" />
        <path
          d="M42 46 q18 9 36 0"
          fill="none"
          stroke="rgba(13,16,48,.1)"
          stroke-width="3"
          stroke-linecap="round"
        />
      </g>
    </svg>
  </div>
</template>

<script>
function tint(hex, alpha) {
  const value = (hex || '#5b4bff').replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value
  const int = parseInt(full, 16)
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`
}

export default {
  name: 'ProductThumb',
  props: {
    shape: { type: String, default: 'soft' },
    accent: { type: String, default: '#5b4bff' },
    label: { type: String, default: '产品' }
  },
  computed: {
    style() {
      return {
        background: `linear-gradient(155deg, ${tint(this.accent, 0.16)}, ${tint(
          this.accent,
          0.04
        )} 58%, #f6f7fd)`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.thumb {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;

  svg {
    width: 78%;
    height: 78%;
    filter: drop-shadow(0 12px 16px rgba(13, 16, 48, 0.16));
  }
}
</style>
