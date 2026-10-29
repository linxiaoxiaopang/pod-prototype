<template>
  <section id="proof" class="proof">
    <div class="container proof-inner">
      <div class="proof-copy" v-reveal>
        <span class="eyebrow">行业认可</span>
        <h2 class="proof-title">
          {{ proof.titleBefore }}<span class="text-gradient">15+</span>{{ proof.titleAfter }}
        </h2>
        <p class="proof-desc">{{ proof.desc }}</p>
      </div>

      <div class="platforms">
        <div
          v-for="(p, i) in proof.platforms"
          :key="p.name"
          class="platform"
          v-reveal="{ delay: 70 * i }"
        >
          <span class="platform-mark" aria-hidden="true">{{ p.name.charAt(0) }}</span>
          <span class="platform-body">
            <span class="platform-name">{{ p.name }}</span>
            <span class="platform-meta">{{ p.meta }}</span>
          </span>
          <i class="el-icon-top-right platform-arrow" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { proof } from '@/data/content'

export default {
  name: 'PlatformProof',
  data() {
    return { proof }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.proof {
  padding: 26px 0 78px;
}

.proof-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 56px;
  padding-top: 46px;
  border-top: 1px solid $line;
}

.proof-title {
  font-size: clamp(24px, 2.6vw, 33px);
  line-height: 1.2;
  margin: 14px 0 16px;
  letter-spacing: -0.03em;
}

.proof-desc {
  font-size: 15px;
  line-height: 1.75;
  color: $ink-soft;
  max-width: 480px;
}

.platforms {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.platform {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid $line;
  transition: transform 0.3s $ease, border-color 0.3s $ease, box-shadow 0.3s $ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(91, 75, 255, 0.32);
    box-shadow: $shadow-sm;

    .platform-mark {
      background: $primary;
      color: #fff;
    }

    .platform-arrow {
      color: $primary;
      transform: translate(2px, -2px);
    }
  }
}

.platform-mark {
  @include flex-center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 11px;
  background: $bg-soft;
  color: $ink-soft;
  font-size: 15px;
  font-weight: 800;
  transition: background 0.3s $ease, color 0.3s $ease;
}

.platform-body {
  min-width: 0;
}

.platform-name {
  display: block;
  font-size: 14.5px;
  font-weight: 800;
  color: $ink;
  line-height: 1.3;
}

.platform-meta {
  display: block;
  font-size: 11.5px;
  color: $muted;
}

.platform-arrow {
  margin-left: auto;
  font-size: 13px;
  color: $muted;
  transition: color 0.3s $ease, transform 0.3s $ease;
}

@include down(980px) {
  .proof-inner {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .proof-desc {
    max-width: 620px;
  }
}

@include down(560px) {
  .proof {
    padding-bottom: 56px;
  }

  .platforms {
    grid-template-columns: 1fr;
  }
}
</style>
