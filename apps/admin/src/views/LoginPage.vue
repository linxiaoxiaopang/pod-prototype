<template>
  <div class="login">
    <section class="aside">
      <div class="aside-bg" aria-hidden="true"></div>

      <div class="brand">
        <span class="brand-mark">P</span>
        <span class="brand-text">
          PrintOnDemand<em>Business</em>
        </span>
      </div>

      <div class="aside-copy">
        <p class="eyebrow">运营控制台</p>
        <h1>把供应商、产品与内容<br />放在同一个后台维护</h1>
        <p class="desc">
          后台端负责数据录入与审核，业务端负责展示。两端独立部署、独立构建，共用同一套设计语言。
        </p>

        <ul class="facts">
          <li v-for="item in facts" :key="item.label">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>

      <p class="aside-foot">演示工作区 · 数据均为静态 mock</p>
    </section>

    <section class="panel">
      <div class="panel-inner">
        <p class="eyebrow">登录</p>
        <h2>登录运营后台</h2>
        <p class="hint">使用演示账号进入管理台。</p>

        <label class="field-label" for="username">账号</label>
        <el-input
          id="username"
          v-model="form.username"
          placeholder="admin"
          prefix-icon="el-icon-user"
          @keyup.enter.native="submit"
        />

        <label class="field-label" for="password">密码</label>
        <el-input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          prefix-icon="el-icon-lock"
          show-password
          @keyup.enter.native="submit"
        />

        <div class="row">
          <el-checkbox v-model="remember">记住登录状态</el-checkbox>
          <a href="#" class="link" @click.prevent="hint">忘记密码？</a>
        </div>

        <p v-if="error" class="error">
          <i class="el-icon-warning-outline"></i>
          {{ error }}
        </p>

        <el-button type="primary" class="submit" :loading="loading" @click="submit">
          登录
        </el-button>

        <p class="demo">演示账号 <code>admin</code> · 密码 <code>admin123</code></p>
      </div>
    </section>
  </div>
</template>

<script>
import { AUTH_KEY } from '@/router'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: { username: 'admin', password: 'admin123' },
      remember: true,
      loading: false,
      error: '',
      facts: [
        { value: '12', label: '供应商' },
        { value: '16', label: '在售产品' },
        { value: '6', label: '对比内容' }
      ]
    }
  },
  methods: {
    submit() {
      const { username, password } = this.form
      if (!username.trim() || !password.trim()) {
        this.error = '请输入账号与密码'
        return
      }

      this.loading = true
      this.error = ''

      window.setTimeout(() => {
        if (username.trim() === 'admin' && password === 'admin123') {
          if (this.remember) {
            window.localStorage.setItem(AUTH_KEY, 'demo-token')
          } else {
            window.sessionStorage.setItem(AUTH_KEY, 'demo-token')
          }
          this.$message.success('欢迎回来，运营管理员')
          const redirect = this.$route.query.redirect
          this.$router.replace(redirect && redirect !== '/login' ? redirect : '/dashboard')
          return
        }

        this.loading = false
        this.error = '账号或密码不正确，请使用演示账号 admin / admin123'
      }, 450)
    },
    hint() {
      this.$message.info('演示环境暂不支持找回密码，请使用 admin / admin123')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.login {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  min-height: 100vh;
  background: #fff;

  @include down(900px) {
    grid-template-columns: 1fr;
  }
}

.aside {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 38px 44px;
  overflow: hidden;
  background: $sidebar;
  color: #fff;

  @include down(900px) {
    display: none;
  }
}

.aside-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 50% at 10% 0%, rgba(91, 75, 255, 0.5), transparent 62%),
    radial-gradient(ellipse 60% 45% at 92% 88%, rgba(255, 107, 53, 0.32), transparent 60%),
    linear-gradient(160deg, #0b0d24 0%, #141838 100%);
}

.brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  @include flex-center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: linear-gradient(140deg, $primary 0%, #8d5bff 60%, #ff6b35 140%);
  font-size: 16px;
  font-weight: 800;
}

.brand-text {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.02em;

  em {
    font-style: normal;
    color: #a89bff;
  }
}

.aside-copy {
  position: relative;
  max-width: 460px;
  margin-top: auto;
  padding-bottom: 10px;
}

.eyebrow {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.aside-copy h1 {
  margin: 14px 0 16px;
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.desc {
  max-width: 420px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.66);
}

.facts {
  display: flex;
  gap: 34px;
  margin-top: 34px;

  li {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  span {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
  }
}

.aside-foot {
  position: relative;
  margin-top: auto;
  padding-top: 28px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.34);
}

.panel {
  display: grid;
  place-items: center;
  padding: 40px 24px;
}

.panel-inner {
  width: 100%;
  max-width: 360px;

  h2 {
    margin: 10px 0 6px;
    font-size: 25px;
    letter-spacing: -0.03em;
  }
}

.hint {
  margin-bottom: 26px;
  font-size: 13px;
  color: $muted;
}

.field-label {
  display: block;
  margin: 16px 0 7px;
  font-size: 12px;
  font-weight: 700;
  color: $ink-soft;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 18px;
}

.link {
  font-size: 12.5px;
  font-weight: 600;
  color: $primary;
}

.error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  padding: 9px 12px;
  border-radius: 9px;
  background: rgba(239, 68, 68, 0.08);
  font-size: 12.5px;
  font-weight: 600;
  color: #c03131;
}

.submit {
  width: 100%;
  height: 44px;
  border-radius: 11px;
  font-size: 14.5px;
  font-weight: 700;
}

.demo {
  margin-top: 16px;
  font-size: 12px;
  color: $muted;
  text-align: center;

  code {
    padding: 2px 6px;
    border-radius: 5px;
    background: $bg;
    font-family: $font;
    font-weight: 700;
    color: $ink-soft;
  }
}
</style>
