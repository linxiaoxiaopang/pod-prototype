<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>站点设置</h1>
        <p>这些配置会同步到业务端的目录与列表展示。</p>
      </div>
      <el-button type="primary" icon="el-icon-check" round :loading="saving" @click="save">
        保存设置
      </el-button>
    </header>

    <div class="layout">
      <div class="panel form-panel">
        <h2>基础信息</h2>

        <el-form label-position="top" class="form">
          <el-form-item label="站点名称">
            <el-input v-model="form.siteName" placeholder="PrintOnDemandBusiness" />
          </el-form-item>

          <el-form-item label="站点域名">
            <el-input v-model="form.domain" placeholder="printondemandbusiness.com" />
          </el-form-item>

          <div class="row">
            <el-form-item label="默认货币">
              <el-select v-model="form.currency">
                <el-option label="USD · 美元" value="USD" />
                <el-option label="EUR · 欧元" value="EUR" />
                <el-option label="GBP · 英镑" value="GBP" />
              </el-select>
            </el-form-item>

            <el-form-item label="目录每页条数">
              <el-input-number v-model="form.pageSize" :min="6" :max="48" :step="6" />
            </el-form-item>
          </div>

          <el-form-item label="默认排序">
            <el-select v-model="form.defaultSort">
              <el-option label="推荐优先" value="featured" />
              <el-option label="名称 A–Z" value="name" />
              <el-option label="产品最多" value="products" />
              <el-option label="生产最快" value="lead" />
            </el-select>
          </el-form-item>

          <el-form-item label="维护模式">
            <div class="switch-row">
              <el-switch v-model="form.maintenance" />
              <span>{{ form.maintenance ? '业务端将展示维护提示' : '业务端正常访问' }}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <aside class="side">
        <div class="panel info">
          <h2>环境信息</h2>
          <dl>
            <div><dt>业务端</dt><dd>{{ webUrl }}</dd></div>
            <div><dt>后台端</dt><dd>localhost:5174</dd></div>
            <div><dt>数据来源</dt><dd>静态 mock</dd></div>
            <div><dt>版本</dt><dd>v1.0.0</dd></div>
          </dl>
          <a class="open-site" :href="webUrl" target="_blank" rel="noopener">
            打开业务端
            <i class="el-icon-top-right"></i>
          </a>
        </div>

        <div class="panel tip">
          <h3>使用提示</h3>
          <p>设置保存在浏览器本地，刷新后仍会保留；接入接口后改为服务端存储。</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'pod-admin-settings'
const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

const defaults = {
  siteName: 'PrintOnDemandBusiness',
  domain: 'printondemandbusiness.com',
  currency: 'USD',
  pageSize: 12,
  defaultSort: 'featured',
  maintenance: false
}

export default {
  name: 'SettingsPage',
  data() {
    return {
      webUrl,
      saving: false,
      form: { ...defaults }
    }
  },
  created() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved) this.form = { ...defaults, ...saved }
    } catch (e) {
      this.form = { ...defaults }
    }
  },
  methods: {
    save() {
      this.saving = true
      window.setTimeout(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.form))
        this.saving = false
        this.$message.success('设置已保存')
      }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';

.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  align-items: start;

  @include down(1000px) {
    grid-template-columns: 1fr;
  }
}

.form-panel {
  padding: 22px 24px 8px;

  h2 {
    margin-bottom: 18px;
    font-size: 15px;
  }
}

.form {
  max-width: 520px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: $muted;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info {
  padding: 20px 22px;

  h2 {
    margin-bottom: 14px;
    font-size: 15px;
  }

  dl {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 18px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 12.5px;
    }

    dt {
      color: $muted;
    }

    dd {
      margin: 0;
      font-weight: 600;
      color: $ink-soft;
      text-align: right;
      word-break: break-all;
    }
  }
}

.open-site {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 11px;
  }
}

.tip {
  padding: 18px 22px;

  h3 {
    margin-bottom: 8px;
    font-size: 13.5px;
    font-weight: 700;
  }

  p {
    font-size: 12.5px;
    line-height: 1.7;
    color: $muted;
  }
}
</style>
