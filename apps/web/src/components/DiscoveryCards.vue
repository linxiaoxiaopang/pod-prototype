<template>
  <section id="discover" class="discover">
    <div class="container">
      <div class="discover-grid">
        <router-link
          v-for="(card, i) in cards"
          :key="card.title"
          class="discover-card"
          :class="'discover-card--' + card.tone"
          :to="card.to"
          v-reveal="{ delay: 80 * i }"
        >
          <span class="discover-icon"><i :class="card.icon"></i></span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>

          <ul class="discover-examples">
            <li v-for="example in card.examples" :key="example">{{ example }}</li>
          </ul>

          <span class="discover-link">
            {{ card.cta }}
            <i class="el-icon-right"></i>
          </span>
          <span class="discover-orb" aria-hidden="true"></span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { discoveryCards } from '@/data/content'

export default {
  name: 'DiscoveryCards',
  data() {
    return { cards: discoveryCards }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.discover {
  padding: 0 0 92px;
}

.discover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.discover-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 34px 32px 30px;
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1px solid transparent;
  transition: transform 0.35s $ease, box-shadow 0.35s $ease;

  h3 {
    position: relative;
    z-index: 1;
    font-size: 22px;
    margin: 20px 0 10px;
  }

  p {
    position: relative;
    z-index: 1;
    max-width: 380px;
    font-size: 14.5px;
    line-height: 1.7;
    color: $ink-soft;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow;

    .discover-link i {
      transform: translateX(5px);
    }

    .discover-orb {
      transform: scale(1.12);
    }
  }
}

.discover-card--violet {
  background: linear-gradient(150deg, #f1edff 0%, #e2daff 55%, #f6f2ff 100%);
  border-color: rgba(91, 75, 255, 0.16);

  .discover-icon {
    background: #fff;
    color: $primary;
  }

  .discover-link {
    color: $primary;
  }

  .discover-orb {
    background: radial-gradient(circle, rgba(91, 75, 255, 0.28), transparent 62%);
  }
}

.discover-card--amber {
  background: linear-gradient(150deg, #fff3e9 0%, #ffe2cd 55%, #fff7f0 100%);
  border-color: rgba(255, 107, 53, 0.18);

  .discover-icon {
    background: #fff;
    color: $accent;
  }

  .discover-link {
    color: #ea4f18;
  }

  .discover-orb {
    background: radial-gradient(circle, rgba(255, 107, 53, 0.28), transparent 62%);
  }
}

.discover-icon {
  position: relative;
  z-index: 1;
  @include flex-center;
  width: 52px;
  height: 52px;
  border-radius: 15px;
  font-size: 23px;
  box-shadow: $shadow-xs;
}

.discover-examples {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 20px;

  li {
    padding: 5px 10px;
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.68);
    font-size: 11.5px;
    font-weight: 600;
    color: $ink-soft;
  }
}

.discover-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  font-size: 14px;
  font-weight: 800;

  i {
    font-size: 12px;
    transition: transform 0.3s $ease;
  }
}

.discover-orb {
  position: absolute;
  width: 260px;
  height: 260px;
  right: -90px;
  bottom: -120px;
  border-radius: 50%;
  transition: transform 0.6s $ease;
}

@include down(760px) {
  .discover-grid {
    grid-template-columns: 1fr;
  }

  .discover {
    padding-bottom: 64px;
  }

  .discover-card {
    padding: 28px 24px 26px;
  }
}
</style>
