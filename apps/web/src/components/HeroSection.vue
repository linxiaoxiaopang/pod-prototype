<template>
  <section id="top" class="hero">
    <div class="hero-bg" aria-hidden="true">
      <span class="blob blob--1"></span>
      <span class="blob blob--2"></span>
      <span class="grid"></span>
    </div>

    <div class="container hero-inner">
      <span class="hero-badge" v-reveal>
        <span class="dot"></span>
        独立调研 · 每周更新
      </span>

      <h1 class="hero-title" v-reveal="{ delay: 60 }">
        {{ hero.titleBefore }}
        <span class="text-gradient">{{ hero.titleHighlight }}</span>
        {{ hero.titleAfter }}
      </h1>

      <p class="hero-desc" v-reveal="{ delay: 120 }">{{ hero.desc }}</p>

      <HeroSearch v-reveal="{ delay: 160 }" />

      <ul class="hero-meta" v-reveal="{ delay: 220 }">
        <li v-for="m in meta" :key="m">{{ m }}</li>
      </ul>
    </div>
  </section>
</template>

<script>
import HeroSearch from './HeroSearch.vue'
import { hero } from '@/data/content'

export default {
  name: 'HeroSection',
  components: { HeroSearch },
  data() {
    return {
      hero,
      meta: ['4 家精选供应商', '15+ 个发现平台', '覆盖 190 个国家']
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.hero {
  position: relative;
  padding: 84px 0 76px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.5;
  }

  .blob--1 {
    width: 560px;
    height: 560px;
    top: -260px;
    left: 50%;
    transform: translateX(-62%);
    background: radial-gradient(circle, rgba(91, 75, 255, 0.34), transparent 64%);
  }

  .blob--2 {
    width: 400px;
    height: 400px;
    right: -120px;
    top: 60px;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.2), transparent 65%);
  }

  .grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(13, 16, 48, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13, 16, 48, 0.045) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse 65% 70% at 50% 0%, #000 0%, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse 65% 70% at 50% 0%, #000 0%, transparent 78%);
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 860px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 16px 7px 12px;
  border-radius: 99px;
  background: #fff;
  border: 1px solid $line;
  box-shadow: $shadow-xs;
  font-size: 12.5px;
  font-weight: 700;
  color: $ink;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: $success;
    box-shadow: 0 0 0 4px rgba(22, 185, 129, 0.16);
  }
}

.hero-title {
  margin: 24px auto 20px;
  max-width: 900px;
  font-size: clamp(38px, 5vw, 62px);
  line-height: 1.05;
  letter-spacing: -0.035em;

  .text-gradient {
    white-space: nowrap;
  }
}

.hero-desc {
  max-width: 620px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.7;
  color: $ink-soft;
}

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px 26px;
  flex-wrap: wrap;
  margin-top: 40px;

  li {
    position: relative;
    font-size: 12.5px;
    font-weight: 600;
    color: $muted;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -14px;
      top: 50%;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #d3d7e6;
      transform: translateY(-50%);
    }
  }
}

@include down(700px) {
  .hero {
    padding: 56px 0;
  }

  .hero-meta li:not(:last-child)::after {
    display: none;
  }
}
</style>
