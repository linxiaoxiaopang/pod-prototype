<template>
  <figure class="shot">
    <div class="frame">
      <div class="chrome">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="url">
          <i class="el-icon-lock"></i>
          {{ host }}
        </span>
      </div>

      <div class="viewport">
        <img v-if="src" class="shot-img" :src="src" :alt="`${supplier.name} 官网截图`" />
        <div v-else class="mock" :style="mockStyle" aria-hidden="true">
          <header class="mock-nav">
            <span class="mock-brand">
              <span class="mock-logo">{{ monogram }}</span>
              {{ supplier.name }}
            </span>
            <nav class="mock-links">
              <span v-for="link in links" :key="link">{{ link }}</span>
            </nav>
            <span class="mock-cta">免费开始</span>
          </header>

          <div class="mock-hero">
            <div class="mock-copy">
              <span class="mock-eyebrow">按需打印</span>
              <strong class="mock-headline">{{ headline }}</strong>
              <span class="mock-line"></span>
              <span class="mock-line short"></span>
              <span class="mock-btn">浏览产品</span>
            </div>
            <div class="mock-tiles">
              <span class="mock-tile t1" :class="{ 'no-apparel': !hasApparel }"></span>
              <span class="mock-tile t2"></span>
              <span class="mock-tile t3"></span>
            </div>
          </div>

          <footer class="mock-strip">
            <span v-for="chip in chips" :key="chip">{{ chip }}</span>
          </footer>
        </div>
      </div>
    </div>

    <figcaption>
      <span class="caption">官网首页截图 · {{ host }}</span>
      <a :href="supplier.website" target="_blank" rel="noopener">
        访问官网
        <i class="el-icon-top-right"></i>
      </a>
    </figcaption>
  </figure>
</template>

<script>
function tint(hex, alpha) {
  const value = hex.replace('#', '')
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
  name: 'WebsiteShot',
  props: {
    supplier: { type: Object, required: true },
    // 可传入真实截图地址；缺省时渲染内置的站点预览
    src: { type: String, default: '' }
  },
  data() {
    return {
      links: ['产品', '服务流程', '价格']
    }
  },
  computed: {
    monogram() {
      return this.supplier.monogram || this.supplier.name.slice(0, 2).toUpperCase()
    },
    accent() {
      return this.supplier.accent || '#5b4bff'
    },
    host() {
      return (this.supplier.website || '')
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
    },
    headline() {
      const category = (this.supplier.categories || [])[0] || '产品'
      return `${category}，按需打印。`
    },
    chips() {
      return (this.supplier.categories || []).slice(0, 5)
    },
    hasApparel() {
      return (this.supplier.categories || []).some((item) => /T恤|服装|卫衣|背心/.test(item))
    },
    mockStyle() {
      return {
        '--accent': this.accent,
        '--accent-soft': tint(this.accent, 0.14),
        '--accent-faint': tint(this.accent, 0.06)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.shot {
  margin: 0 0 30px;
}

.frame {
  overflow: hidden;
  border: 1px solid $line;
  border-radius: 16px;
  background: #fff;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.35s $ease, border-color 0.35s $ease;

  &:hover {
    border-color: rgba(91, 75, 255, 0.28);
    box-shadow: $shadow;
  }
}

.chrome {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  background: linear-gradient(180deg, #fbfbfe, #f4f5fb);
  border-bottom: 1px solid $line;
}

.dots {
  display: flex;
  gap: 5px;

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e1e4f1;
  }
}

.url {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  height: 23px;
  padding: 0 11px;
  border: 1px solid $line;
  border-radius: 99px;
  background: #fff;
  font-size: 11px;
  font-weight: 600;
  color: $muted;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  i {
    font-size: 10px;
    flex-shrink: 0;
  }
}

.viewport {
  position: relative;
  aspect-ratio: 16 / 9.2;
  background: #fff;
  container-type: inline-size;
}

.shot-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 站点预览：按容器宽度等比缩放，尽量贴近真实首页截图的比例与信息密度
.mock {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse 60% 90% at 6% 0%, var(--accent-faint), transparent 62%), #fff;
  font-family: $font;
}

.mock-nav {
  display: flex;
  align-items: center;
  gap: 2.4cqw;
  padding: 2.1cqw 3cqw;
  border-bottom: 1px solid #f1f2f9;
}

.mock-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.9cqw;
  font-size: 1.9cqw;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: $ink;
}

.mock-logo {
  @include flex-center;
  width: 2.9cqw;
  height: 2.9cqw;
  border-radius: 0.85cqw;
  background: var(--accent);
  color: #fff;
  font-size: 1.2cqw;
  font-weight: 800;
}

.mock-links {
  display: flex;
  gap: 1.9cqw;
  margin-left: 1.2cqw;

  span {
    font-size: 1.25cqw;
    font-weight: 600;
    color: #6a6f8c;
  }
}

.mock-cta {
  margin-left: auto;
  padding: 0.75cqw 1.7cqw;
  border-radius: 99px;
  background: var(--accent);
  color: #fff;
  font-size: 1.2cqw;
  font-weight: 700;
}

.mock-hero {
  flex: 1;
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  gap: 3.2cqw;
  align-items: center;
  padding: 2.6cqw 3cqw;
}

.mock-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1cqw;
  min-width: 0;
}

.mock-eyebrow {
  font-size: 1.15cqw;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--accent);
}

.mock-headline {
  font-size: 3cqw;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: $ink;
}

.mock-line {
  width: 21cqw;
  height: 0.8cqw;
  border-radius: 99px;
  background: #eceef7;
}

.mock-line.short {
  width: 13cqw;
}

.mock-btn {
  margin-top: 0.7cqw;
  padding: 0.95cqw 1.9cqw;
  border-radius: 0.7cqw;
  background: var(--accent);
  color: #fff;
  font-size: 1.25cqw;
  font-weight: 700;
}

.mock-tiles {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: 1fr 1fr;
  gap: 1.3cqw;
  height: 100%;
  padding: 0.6cqw 0;
}

.mock-tile {
  position: relative;
  overflow: hidden;
  border-radius: 1.2cqw;
  background: linear-gradient(155deg, var(--accent-soft), #f4f5fb);

  &::after {
    content: '';
    position: absolute;
    left: 26%;
    right: 26%;
    top: 26%;
    bottom: 27%;
    border-radius: 0.45cqw;
    background: #fff;
    box-shadow: 0 1.4cqw 2.4cqw -1.3cqw rgba(13, 16, 48, 0.45);
  }
}

.mock-tile.t1 {
  grid-row: span 2;

  &::after {
    left: 17%;
    right: 17%;
    top: 19%;
    bottom: 24%;
    border-radius: 0;
    clip-path: polygon(
      31% 0,
      43% 6%,
      57% 6%,
      69% 0,
      100% 15%,
      88% 34%,
      78% 28%,
      78% 100%,
      22% 100%,
      22% 28%,
      12% 34%,
      0 15%
    );
  }
}

.mock-tile.t1.no-apparel::after {
  left: 22%;
  right: 22%;
  top: 14%;
  bottom: 18%;
  border-radius: 0.3cqw;
  clip-path: none;
  transform: rotate(-2deg);
}

.mock-tile.t2 {
  background: linear-gradient(155deg, var(--accent), var(--accent-soft));

  &::after {
    left: 24%;
    right: 31%;
    top: 36%;
    bottom: 34%;
    border-radius: 0.9cqw;
  }

  &::before {
    content: '';
    position: absolute;
    right: 21%;
    top: 44%;
    width: 11%;
    height: 15%;
    border: 0.55cqw solid rgba(255, 255, 255, 0.9);
    border-left: none;
    border-radius: 0 50% 50% 0;
  }
}

.mock-tile.t3 {
  background: linear-gradient(155deg, #f4f5fb, var(--accent-soft));

  &::after {
    left: 24%;
    right: 24%;
    top: 24%;
    bottom: 24%;
    border-radius: 0.3cqw;
    transform: rotate(-2.5deg);
  }
}

.mock-strip {
  display: flex;
  gap: 0.9cqw;
  padding: 0 3cqw 2.2cqw;

  span {
    padding: 0.55cqw 1.1cqw;
    border-radius: 0.6cqw;
    background: #f6f7fd;
    font-size: 1.05cqw;
    font-weight: 700;
    color: #6a6f8c;
  }
}

figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: $muted;

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: $primary;
    white-space: nowrap;

    &:hover {
      color: $primary-dark;
    }

    i {
      font-size: 11px;
    }
  }
}

@include down(760px) {
  .mock-hero {
    grid-template-columns: 1fr;
    padding: 3.4cqw 4cqw;
  }

  .mock-copy {
    gap: 1.4cqw;
  }

  .mock-headline {
    font-size: 4.6cqw;
  }

  .mock-eyebrow {
    font-size: 1.6cqw;
  }

  .mock-btn {
    padding: 1.4cqw 2.6cqw;
    font-size: 1.8cqw;
  }

  .mock-tiles {
    display: none;
  }

  .mock-links {
    display: none;
  }

  .mock-nav {
    padding: 2.8cqw 4cqw;
  }

  .mock-brand {
    font-size: 2.8cqw;
  }

  .mock-logo {
    width: 4.4cqw;
    height: 4.4cqw;
    font-size: 1.9cqw;
  }

  .mock-cta {
    padding: 1.1cqw 2.4cqw;
    font-size: 1.8cqw;
  }

  .mock-strip {
    display: none;
  }
}
</style>
