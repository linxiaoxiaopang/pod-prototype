<template>
  <div class="page">
    <header class="page-head">
      <div>
        <button class="back" type="button" @click="back">
          <i class="el-icon-arrow-left"></i>
          返回供应商列表
        </button>
        <h1>{{ isEdit ? '编辑供应商' : '创建供应商' }}</h1>
        <p>{{ isEdit ? '修改后的信息会同步到业务端目录与筛选。' : '填写基础信息与供货能力，创建后会出现在业务端目录中。' }}</p>
      </div>
      <div class="head-actions">
        <el-button round @click="back">取消</el-button>
        <el-button v-if="isEdit" round type="danger" plain icon="el-icon-delete" @click="remove">
          删除
        </el-button>
        <el-button round :loading="saving" @click="saveDraft">保存草稿</el-button>
        <el-button type="primary" round icon="el-icon-check" :loading="saving" @click="submit">
          {{ isEdit ? '保存修改' : '创建供应商' }}
        </el-button>
      </div>
    </header>

    <el-form ref="form" :model="form" :rules="rules" label-position="top" class="layout">
      <div class="main-panel">
        <section class="section">
          <h2>基础信息</h2>
          <p class="section-hint">对外展示的名称与官网，会显示在业务端供应商卡片和详情页。</p>

          <div class="grid-2">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="form.name" maxlength="40" show-word-limit placeholder="例如：Simple Print" />
            </el-form-item>

            <el-form-item label="成立年份">
              <el-input-number v-model="form.since" :min="1990" :max="2026" :step="1" controls-position="right" />
            </el-form-item>
          </div>

          <el-form-item label="官方网站" prop="website">
            <el-input v-model="form.website" placeholder="https://example.com" />
          </el-form-item>

          <div class="grid-2">
            <el-form-item label="国家 / 地区" prop="country">
              <el-select v-model="form.country" placeholder="请选择" filterable allow-create>
                <el-option v-for="item in countryOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item label="城市">
              <el-input v-model="form.city" placeholder="例如：加州" />
            </el-form-item>
          </div>

          <el-form-item label="简介">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              maxlength="160"
              show-word-limit
              placeholder="一句话说明供应商的定位与优势"
            />
          </el-form-item>
        </section>

        <section class="section">
          <h2>品类与能力</h2>
          <p class="section-hint">用于业务端目录筛选，至少选择一个主营品类。</p>

          <el-form-item label="主营品类" prop="categories">
            <el-checkbox-group v-model="form.categories" class="chips">
              <el-checkbox v-for="item in categoryOptions" :key="item" :label="item">{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="印刷工艺">
            <el-checkbox-group v-model="form.printMethods" class="chips">
              <el-checkbox v-for="item in printMethodOptions" :key="item" :label="item">{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="集成平台">
            <el-checkbox-group v-model="form.platforms" class="chips">
              <el-checkbox v-for="item in integrationOptions" :key="item" :label="item">{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </section>

        <section class="section">
          <h2>生产与配送</h2>
          <p class="section-hint">生产时效会影响业务端“生产最快”排序。</p>

          <div class="grid-3">
            <el-form-item label="生产时效（天）" prop="productionDays">
              <el-input-number v-model="form.productionDays" :min="1" :max="30" controls-position="right" />
            </el-form-item>

            <el-form-item label="最小起订量">
              <el-input-number v-model="form.minOrder" :min="1" :max="999" controls-position="right" />
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="form.status">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="配送范围">
            <el-checkbox-group v-model="form.shipsTo" class="chips">
              <el-checkbox v-for="item in shipRegionOptions" :key="item" :label="item">{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="内部备注">
            <el-input
              v-model="form.notes"
              type="textarea"
              :rows="3"
              placeholder="仅后台可见，例如对接人、结算方式、合作条款"
            />
          </el-form-item>
        </section>
      </div>

      <aside class="side">
        <div class="side-panel">
          <h3>目录状态</h3>
          <el-radio-group v-model="form.status" class="status-list">
            <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </div>

        <div class="preview">
          <h3>卡片预览</h3>
          <div class="preview-head">
            <span class="preview-avatar">{{ initials }}</span>
            <div>
              <strong>{{ form.name || '供应商名称' }}</strong>
              <small>{{ location || '国家 · 城市' }}</small>
            </div>
          </div>

          <div class="preview-tags">
            <span v-for="item in form.categories.slice(0, 3)" :key="item">{{ item }}</span>
            <span v-if="!form.categories.length">暂无品类</span>
          </div>

          <dl class="preview-facts">
            <div><dt>生产时效</dt><dd>{{ form.productionDays }} 天</dd></div>
            <div><dt>最小起订</dt><dd>{{ form.minOrder }} 件</dd></div>
            <div><dt>集成平台</dt><dd>{{ form.platforms.length }} 个</dd></div>
            <div><dt>配送</dt><dd>{{ form.shipsTo.length ? form.shipsTo.join(' / ') : '—' }}</dd></div>
          </dl>
        </div>

        <div class="side-panel">
          <h3>发布提示</h3>
          <p class="form-tip">
            「草稿」不会出现在业务端；选择「运营中」并保存后即可被搜索到，数据保存在浏览器本地。
          </p>
        </div>
      </aside>
    </el-form>
  </div>
</template>

<script>
import {
  statusOptions,
  supplierCategoryOptions,
  integrationOptions,
  printMethodOptions,
  shipRegionOptions
} from '@/data/adminData'
import { findSupplier, listSuppliers, removeSupplier, slugify, today, upsertSupplier } from '@/data/adminStore'

const countryOptions = ['美国', '中国', '德国', '挪威', '英国', '越南', '加拿大', '澳大利亚', '日本']

export default {
  name: 'SupplierFormPage',
  data() {
    return {
      saving: false,
      statusOptions,
      categoryOptions: supplierCategoryOptions,
      integrationOptions,
      printMethodOptions,
      shipRegionOptions,
      countryOptions,
      form: {
        name: '',
        website: '',
        country: '美国',
        city: '',
        since: 2024,
        description: '',
        categories: [],
        printMethods: ['DTG'],
        platforms: ['Shopify'],
        productionDays: 2,
        minOrder: 1,
        shipsTo: ['美国'],
        status: 'draft',
        notes: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
          { max: 40, message: '名称不超过 40 个字符', trigger: 'blur' }
        ],
        website: [
          { required: true, message: '请输入官方网站', trigger: 'blur' },
          {
            pattern: /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*)?$/,
            message: '请输入合法的网址',
            trigger: 'blur'
          }
        ],
        country: [{ required: true, message: '请选择国家 / 地区', trigger: 'change' }],
        categories: [{ type: 'array', required: true, message: '至少选择一个主营品类', trigger: 'change' }],
        productionDays: [{ required: true, message: '请填写生产时效', trigger: 'change' }]
      }
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id || ''
    },
    isEdit() {
      return Boolean(this.routeId)
    },
    initials() {
      return (this.form.name || 'PG').slice(0, 2).toUpperCase()
    },
    location() {
      return [this.form.country, this.form.city].filter(Boolean).join(' · ')
    }
  },
  created() {
    if (!this.isEdit) return
    const supplier = findSupplier(this.routeId)
    if (!supplier) {
      this.$message.error('供应商不存在或已被删除')
      this.back()
      return
    }
    const [country = '美国', city = ''] = String(supplier.location || '').split(' · ')
    this.form = {
      ...this.form,
      ...supplier,
      country: supplier.country || country,
      city: supplier.city || city,
      since: supplier.since || 2020,
      description: supplier.description || '',
      categories: [...(supplier.categories || [])],
      printMethods: [...(supplier.printMethods || ['DTG'])],
      platforms: [
        ...(supplier.platforms || integrationOptions.slice(0, Math.min(supplier.integrations || 1, 7)))
      ],
      shipsTo: [...(supplier.shipsTo || ['美国'])],
      notes: supplier.notes || ''
    }
  },
  methods: {
    back() {
      this.$router.push('/suppliers').catch(() => {})
    },
    buildId() {
      const base = slugify(this.form.name)
      const existing = listSuppliers()
        .filter((item) => item.id !== this.routeId)
        .map((item) => item.id)
      let id = base
      let index = 2
      while (existing.includes(id)) {
        id = `${base}-${index}`
        index += 1
      }
      return id
    },
    persist(status) {
      const payload = {
        id: this.isEdit ? this.routeId : this.buildId(),
        name: this.form.name.trim(),
        location: this.location || '美国',
        country: this.form.country,
        city: this.form.city.trim(),
        website: this.form.website.trim(),
        since: this.form.since,
        description: this.form.description.trim(),
        categories: [...this.form.categories],
        printMethods: [...this.form.printMethods],
        platforms: [...this.form.platforms],
        integrations: this.form.platforms.length,
        productionDays: this.form.productionDays,
        minOrder: this.form.minOrder,
        shipsTo: [...this.form.shipsTo],
        notes: this.form.notes.trim(),
        status,
        updated: today()
      }

      this.saving = true
      window.setTimeout(() => {
        upsertSupplier(payload)
        this.saving = false
        const statusLabel = (statusOptions.find((item) => item.value === status) || {}).label || '草稿'
        this.$message.success(
          this.isEdit ? `「${payload.name}」已更新` : `「${payload.name}」已创建，状态：${statusLabel}`
        )
        this.back()
      }, 380)
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('请补充必填信息后再提交')
          return
        }
        this.persist(this.form.status)
      })
    },
    saveDraft() {
      if (!this.form.name.trim()) {
        this.$message.error('请先填写供应商名称')
        return
      }
      this.persist('draft')
    },
    remove() {
      this.$confirm(`删除后「${this.form.name}」将从目录中移除，确定继续？`, '删除供应商', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeSupplier(this.routeId)
          this.$message.success('供应商已删除')
          this.back()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';
@use './admin-form';
</style>
