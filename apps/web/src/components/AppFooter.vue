<template>
  <footer class="footer">
    <div class="container footer-top">
      <div class="footer-brand">
        <a class="logo" href="#top" aria-label="PrintOnDemandBusiness">
          <span class="logo-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 3h7.2a5.3 5.3 0 0 1 0 10.6H10V21H6V3zm4 3.4v3.8h3a1.9 1.9 0 0 0 0-3.8h-3z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span class="logo-text">
            {{ brand.name }}<em>{{ brand.suffix }}</em>
            <small>{{ brand.tagline }}</small>
          </span>
        </a>

        <p class="footer-desc">{{ data.desc }}</p>

        <router-link class="footer-cta" to="/suppliers">
          浏览供应商目录
          <i class="el-icon-right"></i>
        </router-link>
      </div>

      <div v-for="col in data.columns" :key="col.title" class="footer-col">
        <h4>{{ col.title }}</h4>
        <ul>
          <li v-for="link in col.links" :key="link.label">
            <router-link v-if="link.to" :to="link.to">{{ link.label }}</router-link>
            <a v-else href="#" @click.prevent="goTo(link.section)">{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <p class="copyright">© 2026 PrintOnDemandBusiness.com · 独立 POD 目录</p>

      <div class="footer-socials">
        <a v-for="s in data.socials" :key="s.label" href="#top" :aria-label="s.label">
          <i :class="s.icon"></i>
        </a>
      </div>
    </div>

    <div class="container footer-disclaimer">
      供应商数据来自公开的产品目录，可能随时变动。部分外链为联盟链接，但不会影响我们的排名与对比结论。
    </div>
  </footer>
</template>

<script>
import { brand, footer } from '@/data/content'
import { goToSection } from '@/utils/nav'

export default {
  name: 'AppFooter',
  data() {
    return {
      brand,
      data: footer
    }
  },
  methods: {
    goTo(section) {
      if (section) goToSection(this.$router, section)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.footer {
  background: $bg-dark;
  color: rgba(255, 255, 255, 0.6);
  padding-top: 66px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 0.8fr);
  gap: 44px;
  padding-bottom: 50px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.logo-mark {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(140deg, $primary 0%, #8d5bff 60%, $accent 130%);

  svg {
    width: 19px;
    height: 19px;
  }
}

.logo-text {
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  line-height: 1.1;

  em {
    font-style: normal;
    color: #a99bff;
  }

  small {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.42);
  }
}

.footer-desc {
  max-width: 370px;
  font-size: 13.5px;
  line-height: 1.75;
}

.footer-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 20px;
  font-size: 13.5px;
  font-weight: 700;
  color: #fff;

  i {
    font-size: 11px;
    transition: transform 0.25s $ease;
  }

  &:hover {
    color: #a99bff;

    i {
      transform: translateX(4px);
    }
  }
}

.footer-col {
  h4 {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 16px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  a {
    font-size: 13.5px;
    color: rgba(255, 255, 255, 0.56);
    transition: color 0.2s $ease;

    &:hover {
      color: #fff;
    }
  }
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.copyright {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.42);
}

.footer-socials {
  display: flex;
  gap: 8px;
  margin-left: auto;

  a {
    @include flex-center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.68);
    font-size: 14px;
    transition: background 0.25s $ease, color 0.25s $ease, transform 0.25s $ease;

    &:hover {
      background: $primary;
      color: #fff;
      transform: translateY(-2px);
    }
  }
}

.footer-disclaimer {
  padding: 0 24px 26px;
  font-size: 11.5px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.3);
  max-width: $container;
}

@include down(1080px) {
  .footer-top {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 34px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@include down(620px) {
  .footer {
    padding-top: 48px;
  }

  .footer-top {
    grid-template-columns: 1fr 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-socials {
    margin-left: 0;
  }
}
</style>
