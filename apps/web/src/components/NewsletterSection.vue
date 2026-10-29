<template>
  <section id="newsletter" class="newsletter-wrap">
    <div class="container">
      <div class="newsletter" v-reveal>
        <div class="glow" aria-hidden="true"></div>

        <div class="newsletter-copy">
          <span class="eyebrow eyebrow--light">每周速递</span>
          <h2>{{ data.title }}</h2>
          <p>{{ data.desc }}</p>
        </div>

        <div class="newsletter-form">
          <label class="field-label" for="newsletter-email">{{ data.label }}</label>
          <div class="field-row">
            <el-input
              id="newsletter-email"
              v-model="email"
              type="email"
              placeholder="you@yourstore.com"
              size="large"
              @keyup.enter.native="subscribe"
            />
            <el-button type="primary" size="large" class="submit-btn" @click="subscribe">
              订阅
            </el-button>
          </div>

          <p v-if="status === 'done'" class="form-note form-note--ok">
            <i class="el-icon-circle-check"></i>
            订阅成功——下一期将在周四发送。
          </p>
          <p v-else class="form-note">
            不发垃圾邮件，随时可退订。请查看我们的
            <a href="#" @click.prevent="showPrivacy">隐私政策</a>。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { newsletter } from '@/data/content'

export default {
  name: 'NewsletterSection',
  data() {
    return {
      data: newsletter,
      email: '',
      status: 'idle'
    }
  },
  methods: {
    subscribe() {
      const value = this.email.trim()
      if (!value) {
        this.$message.warning('请输入邮箱地址。')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        this.$message.error('邮箱地址格式不正确。')
        return
      }
      this.status = 'done'
      this.$message.success('订阅成功，请到邮箱确认。')
    },
    showPrivacy() {
      this.$message.info('隐私政策页面将在后续版本上线。')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.newsletter-wrap {
  padding: 0 0 92px;
}

.newsletter {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 48px;
  padding: 54px 52px;
  border-radius: $radius-xl;
  background: linear-gradient(115deg, #161338 0%, #0b0d24 52%, #1b1030 100%);
  overflow: hidden;
  box-shadow: $shadow-lg;
}

.glow {
  position: absolute;
  width: 520px;
  height: 520px;
  right: -120px;
  top: -220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(91, 75, 255, 0.5), transparent 62%);
  filter: blur(28px);
  pointer-events: none;
}

.newsletter-copy {
  position: relative;
  z-index: 1;

  h2 {
    color: #fff;
    font-size: clamp(23px, 2.6vw, 32px);
    line-height: 1.22;
    margin: 14px 0 14px;
  }

  p {
    max-width: 460px;
    font-size: 14.5px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.64);
  }
}

.newsletter-form {
  position: relative;
  z-index: 1;
}

.field-label {
  display: block;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.56);
}

.field-row {
  display: flex;
  gap: 10px;

  :deep(.el-input__inner) {
    height: 50px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.18);
    color: #fff;
    font-family: $font;
    font-size: 15px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.42);
    }

    &:focus {
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.submit-btn {
  height: 50px;
  padding: 0 24px;
  border-radius: 13px;
  flex-shrink: 0;
  background: #fff;
  border-color: #fff;
  color: $ink;
  box-shadow: 0 16px 30px -18px rgba(0, 0, 0, 0.8);

  &:hover,
  &:focus {
    background: $primary;
    border-color: $primary;
    color: #fff;
  }
}

.form-note {
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);

  a {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: #fff;
    }
  }

  &--ok {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #4ade80;

    i {
      font-size: 14px;
    }
  }
}

@include down(900px) {
  .newsletter {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 38px 30px;
    border-radius: $radius-lg;
  }

  .field-row {
    flex-direction: column;

    .submit-btn {
      width: 100%;
      margin-left: 0;
    }
  }
}

@include down(560px) {
  .newsletter-wrap {
    padding-bottom: 64px;
  }

  .newsletter {
    padding: 30px 22px;
  }
}
</style>
