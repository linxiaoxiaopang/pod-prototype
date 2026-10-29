<template>
  <div class="page">
    <header class="page-head">
      <div>
        <button class="back" type="button" @click="back">
          <i class="el-icon-arrow-left"></i>
          返回产品目录
        </button>
        <h1>{{ isEdit ? '编辑产品' : '创建产品' }}</h1>
        <p>{{ isEdit ? '调整价格与规格后，业务端产品列表会同步更新。' : '为供应商目录新增一条产品记录，支持价格、规格与上架状态配置。' }}</p>
      </div>
      <div class="head-actions">
        <el-button round @click="back">取消</el-button>
        <el-button v-if="isEdit" round type="danger" plain icon="el-icon-delete" @click="remove">
          删除
        </el-button>
        <el-button round :loading="saving" @click="saveDraft">保存草稿</el-button>
        <el-button type="primary" round icon="el-icon-check" :loading="saving" @click="submit">
          {{ isEdit ? '保存修改' : '创建产品' }}
        </el-button>
      </div>
    </header>

    <el-form ref="form" :model="form" :rules="rules" label-position="top" class="layout">
      <div class="main-panel">
        <section class="section">
          <h2>基础信息</h2>
          <p class="section-hint">产品名称与所属供应商会展示在业务端产品卡片上。</p>

          <div class="grid-2">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="form.name" maxlength="50" show-word-limit placeholder="例如：中性重磅T恤" />
            </el-form-item>

            <el-form-item label="产品编号（SKU）">
              <el-input v-model="form.sku" maxlength="32" placeholder="例如：SP-TEE-001" />
            </el-form-item>
          </div>

          <div class="grid-2">
            <el-form-item label="所属供应商" prop="supplier">
              <el-select v-model="form.supplier" placeholder="请选择供应商" filterable>
                <el-option v-for="item in supplierOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item label="品类" prop="category">
              <el-select v-model="form.category" placeholder="请选择品类" filterable allow-create>
                <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="产品描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              maxlength="200"
              show-word-limit
              placeholder="面料、克重、印刷方式等卖点说明"
            />
          </el-form-item>
        </section>

        <section class="section">
          <h2>价格与履约</h2>
          <p class="section-hint">基础价用于目录展示，建议零售价仅作运营参考。</p>

          <div class="grid-3">
            <el-form-item label="基础价（USD）" prop="price">
              <el-input-number v-model="form.price" :min="0.5" :max="999" :precision="2" :step="1" controls-position="right" />
            </el-form-item>

            <el-form-item label="建议零售价（USD）">
              <el-input-number v-model="form.retailPrice" :min="0.5" :max="1999" :precision="2" :step="1" controls-position="right" />
            </el-form-item>

            <el-form-item label="生产时效（天）" prop="productionDays">
              <el-input-number v-model="form.productionDays" :min="1" :max="30" controls-position="right" />
            </el-form-item>
          </div>

          <el-form-item label="上架状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="item in productStatusOptions" :key="item.value" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </section>

        <section class="section">
          <h2>规格与印刷</h2>
          <p class="section-hint">规格会影响业务端产品筛选与详情页选项。</p>

          <el-form-item label="可选颜色">
            <el-select
              v-model="form.colors"
              multiple
              filterable
              allow-create
              class="full"
              placeholder="选择或输入颜色"
            >
              <el-option v-for="item in colorOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item label="可选尺码">
            <el-checkbox-group v-model="form.sizes" class="chips">
              <el-checkbox v-for="item in sizeOptions" :key="item" :label="item">{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div class="grid-2">
            <el-form-item label="印刷位置">
              <el-select v-model="form.printArea" placeholder="请选择">
                <el-option v-for="item in printAreaOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item label="印刷工艺">
              <el-select v-model="form.printMethod" placeholder="请选择">
                <el-option v-for="item in printMethodOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </div>
        </section>
      </div>

      <aside class="side">
        <div class="preview">
          <h3>产品预览</h3>

          <div class="thumb">
            <span>{{ initials }}</span>
            <em>{{ form.category || '品类' }}</em>
          </div>

          <div class="preview-head">
            <div>
              <strong>{{ form.name || '产品名称' }}</strong>
              <small>{{ form.supplier || '未选择供应商' }}</small>
            </div>
            <b class="price">${{ Number(form.price || 0).toFixed(2) }}</b>
          </div>

          <div class="preview-tags">
            <span v-if="form.category">{{ form.category }}</span>
            <span v-for="item in form.sizes.slice(0, 4)" :key="item">{{ item }}</span>
            <span v-if="!form.category && !form.sizes.length">暂无规格</span>
          </div>

          <dl class="preview-facts">
            <div><dt>SKU</dt><dd>{{ form.sku || '—' }}</dd></div>
            <div><dt>建议零售价</dt><dd>${{ Number(form.retailPrice || 0).toFixed(2) }}</dd></div>
            <div><dt>生产时效</dt><dd>{{ form.productionDays }} 天</dd></div>
            <div><dt>颜色</dt><dd>{{ form.colors.length }} 种</dd></div>
          </dl>
        </div>

        <div class="side-panel">
          <h3>发布提示</h3>
          <p class="form-tip">
            「已上架」的产品会出现在业务端目录；「草稿」仅后台可见。数据保存在浏览器本地。
          </p>
        </div>
      </aside>
    </el-form>
  </div>
</template>

<script>
import {
  productStatusOptions,
  productCategoryOptions,
  productColorOptions,
  productSizeOptions,
  printMethodOptions
} from '@/data/adminData'
import { findProduct, listProducts, listSuppliers, removeProduct, slugify, today, upsertProduct } from '@/data/adminStore'

const printAreaOptions = ['正面', '背面', '双面', '左胸', '全幅', '包装']

export default {
  name: 'ProductFormPage',
  data() {
    return {
      saving: false,
      productStatusOptions,
      categoryOptions: productCategoryOptions,
      colorOptions: productColorOptions,
      sizeOptions: productSizeOptions,
      printMethodOptions,
      printAreaOptions,
      supplierOptions: listSuppliers().map((item) => item.name),
      form: {
        name: '',
        sku: '',
        supplier: '',
        category: '',
        description: '',
        price: 19.9,
        retailPrice: 29.9,
        productionDays: 2,
        status: 'draft',
        colors: ['白色', '黑色'],
        sizes: ['S', 'M', 'L', 'XL'],
        printArea: '正面',
        printMethod: 'DTG'
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { max: 50, message: '名称不超过 50 个字符', trigger: 'blur' }
        ],
        supplier: [{ required: true, message: '请选择所属供应商', trigger: 'change' }],
        category: [{ required: true, message: '请选择产品品类', trigger: 'change' }],
        price: [{ required: true, message: '请填写基础价', trigger: 'change' }],
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
      return (this.form.name || 'PD').slice(0, 2).toUpperCase()
    }
  },
  created() {
    if (!this.isEdit) return
    const product = findProduct(this.routeId)
    if (!product) {
      this.$message.error('产品不存在或已被删除')
      this.back()
      return
    }
    this.form = {
      ...this.form,
      ...product,
      colors: [...(product.colors || ['白色', '黑色'])],
      sizes: [...(product.sizes || ['S', 'M', 'L', 'XL'])],
      retailPrice: product.retailPrice || Number((product.price * 1.6).toFixed(2)),
      sku: product.sku || '',
      description: product.description || '',
      printArea: product.printArea || '正面',
      printMethod: product.printMethod || 'DTG'
    }
  },
  methods: {
    back() {
      this.$router.push('/products').catch(() => {})
    },
    buildId() {
      const base = slugify(`${this.form.supplier}-${this.form.name}`)
      const existing = listProducts()
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
        sku: this.form.sku.trim(),
        supplier: this.form.supplier,
        category: this.form.category,
        description: this.form.description.trim(),
        price: this.form.price,
        retailPrice: this.form.retailPrice,
        productionDays: this.form.productionDays,
        colors: [...this.form.colors],
        sizes: [...this.form.sizes],
        printArea: this.form.printArea,
        printMethod: this.form.printMethod,
        status,
        updated: today()
      }

      this.saving = true
      window.setTimeout(() => {
        upsertProduct(payload)
        this.saving = false
        this.$message.success(this.isEdit ? `「${payload.name}」已更新` : `「${payload.name}」已创建`)
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
        this.$message.error('请先填写产品名称')
        return
      }
      if (!this.form.supplier) {
        this.$message.error('请先选择所属供应商')
        return
      }
      this.persist('draft')
    },
    remove() {
      this.$confirm(`删除后「${this.form.name}」将从产品目录中移除，确定继续？`, '删除产品', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeProduct(this.routeId)
          this.$message.success('产品已删除')
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

.full {
  width: 100%;
}

.thumb {
  position: relative;
  display: grid;
  place-items: center;
  height: 120px;
  margin-bottom: 14px;
  border-radius: $radius;
  background: linear-gradient(150deg, #efecff 0%, #f7f8ff 55%, #e9f6ff 100%);

  span {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: rgba(91, 75, 255, 0.55);
  }

  em {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 3px 9px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.85);
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: $ink-soft;
  }
}

.price {
  margin-left: auto;
  font-size: 16px;
  font-weight: 800;
  color: $ink;
}
</style>
