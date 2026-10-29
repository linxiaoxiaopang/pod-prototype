<template>
  <section class="page-head">
    <div class="page-head__bg" aria-hidden="true"></div>
    <div class="container page-head__inner">
      <nav class="crumbs" aria-label="面包屑导航">
        <router-link to="/">首页</router-link>
        <i class="el-icon-arrow-right"></i>
        <span>{{ eyebrow }}</span>
      </nav>

      <div class="page-head__row">
        <div class="page-head__copy">
          <h1>{{ title }}</h1>
          <p v-if="desc">{{ desc }}</p>
        </div>
        <div v-if="$slots.actions" class="page-head__actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    desc: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.page-head {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid $line;
}

.page-head__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 55% 90% at 15% 0%, rgba(91, 75, 255, 0.14), transparent 60%),
    linear-gradient(180deg, #fbfbff 0%, #ffffff 100%);
  pointer-events: none;
}

.page-head__inner {
  position: relative;
  z-index: 1;
  padding-top: 30px;
  padding-bottom: 36px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 12.5px;
  font-weight: 600;
  color: $muted;

  a {
    color: $muted;

    &:hover {
      color: $primary;
    }
  }

  i {
    font-size: 10px;
  }

  span {
    color: $ink-soft;
  }
}

.page-head__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}

h1 {
  font-size: clamp(28px, 3.6vw, 42px);
  letter-spacing: -0.035em;
  line-height: 1.12;
  margin-bottom: 12px;
}

p {
  max-width: 620px;
  font-size: 15.5px;
  line-height: 1.7;
  color: $ink-soft;
}

.page-head__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
