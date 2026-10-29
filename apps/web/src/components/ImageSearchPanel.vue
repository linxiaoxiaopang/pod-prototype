<template>
  <div class="lens-root">
    <transition name="lens-fade">
      <div v-show="visible" class="lens-overlay" @click.self="close">
        <div
          ref="shell"
          class="lens"
          role="dialog"
          aria-modal="true"
          aria-label="以图搜索"
          tabindex="-1"
          @keydown.esc.stop="close"
        >
          <header class="lens-head">
            <div class="lens-heading">
              <span class="lens-mark" aria-hidden="true"><i class="el-icon-camera"></i></span>
              <div>
                <h2>以图搜索</h2>
                <p>上传产品图片，按品类、风格与主色匹配供应商</p>
              </div>
            </div>
            <button type="button" class="lens-close" aria-label="关闭以图搜索" @click="close">
              <i class="el-icon-close"></i>
            </button>
          </header>

          <!-- 未选择图片：拖拽 / 上传 / 粘贴 -->
          <div v-if="!preview" class="lens-empty">
            <div
              class="dropzone"
              :class="{ 'is-dragging': dragging }"
              role="button"
              tabindex="0"
              aria-label="上传产品图片"
              @click="pick"
              @keydown.enter.prevent="pick"
              @keydown.space.prevent="pick"
              @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false"
              @drop.prevent="onDrop"
            >
              <span class="drop-icon"><i class="el-icon-upload"></i></span>
              <h3>把图片拖到这里</h3>
              <p>支持 JPG、PNG 或 WebP，大小不超过 12MB</p>
              <span class="drop-cta">上传图片</span>
            </div>

            <ul class="lens-tips">
              <li><i class="el-icon-document-copy"></i>按 Ctrl / ⌘ + V 粘贴截图</li>
              <li><i class="el-icon-scissors"></i>图片在浏览器内压缩到 1024px</li>
              <li><i class="el-icon-cpu"></i>识别品类、风格与主色</li>
            </ul>

            <p v-if="error" class="lens-error">{{ error }}</p>
          </div>

          <!-- 已选择图片：预览 + 识别结果 -->
          <div v-else class="lens-body">
            <aside class="lens-preview">
              <div
                class="shot"
                :class="{ 'is-dragging': dragging }"
                @dragover.prevent="dragging = true"
                @dragleave.prevent="dragging = false"
                @drop.prevent="onDrop"
              >
                <img :src="preview.thumb" alt="已上传的产品图片" />
                <span v-if="busy" class="shot-loading">
                  <i class="el-icon-loading"></i>
                  {{ stage === 'preparing' ? '处理中' : '识别中' }}
                </span>
              </div>

              <div class="preview-actions">
                <el-button size="mini" round icon="el-icon-refresh" :disabled="busy" @click="pick">
                  更换图片
                </el-button>
                <el-button size="mini" round :disabled="busy" @click="reset">清空</el-button>
              </div>

              <dl class="lens-meta">
                <div>
                  <dt>尺寸</dt>
                  <dd>{{ preview.width }} × {{ preview.height }}</dd>
                </div>
                <div>
                  <dt>主色</dt>
                  <dd>
                    <span
                      class="swatch"
                      :style="{ background: preview.color ? preview.color.hex : '#e7e9f4' }"
                    ></span>
                    {{ preview.color ? preview.color.hex : '未识别' }}
                  </dd>
                </div>
              </dl>

              <div v-if="analysis" class="lens-analysis">
                <h3>识别结果</h3>

                <ul v-if="analysis.categories.length" class="chips">
                  <li
                    v-for="category in analysis.categories"
                    :key="category"
                    class="chip chip--solid"
                  >
                    {{ category }}
                  </li>
                </ul>

                <ul v-if="keywordChips.length" class="chips">
                  <li v-for="keyword in keywordChips" :key="keyword" class="chip">{{ keyword }}</li>
                </ul>

                <p v-if="analysis.subject || analysis.style" class="read-line">
                  <span v-if="analysis.subject">{{ analysis.subject }}</span>
                  <em v-if="analysis.style">· {{ analysis.style }}</em>
                </p>

                <div class="analysis-foot">
                  <span class="provider" :class="{ 'is-fallback': isFallback }">
                    <i :class="isFallback ? 'el-icon-warning-outline' : 'el-icon-cpu'"></i>
                    {{ providerLabel }}
                  </span>
                  <span class="confidence">置信度 {{ confidencePercent }}%</span>
                </div>

                <p v-if="notice" class="notice-text">{{ notice }}</p>
              </div>

              <p v-if="error" class="lens-error">{{ error }}</p>
            </aside>

            <section class="lens-results" aria-live="polite">
              <header class="results-head">
                <div>
                  <h3>匹配的供应商</h3>
                  <p v-if="stage === 'done'">
                    {{
                      suppliers.length
                        ? '按产品目录重合度与色彩匹配度排序。'
                        : '没有找到目录重合的产品。'
                    }}
                  </p>
                  <p v-else>正在用这张图片比对所有供应商的产品目录…</p>
                </div>
                <el-button
                  v-if="stage === 'done' && suppliers.length"
                  size="mini"
                  round
                  icon="el-icon-refresh-right"
                  :disabled="busy"
                  @click="retry"
                >
                  重新识别
                </el-button>
              </header>

              <div v-if="busy" class="skeletons">
                <div v-for="n in 2" :key="n" class="skeleton">
                  <span class="skeleton-line w-40"></span>
                  <span class="skeleton-line w-70"></span>
                  <span class="skeleton-line w-55"></span>
                </div>
              </div>

              <div v-else-if="!suppliers.length" class="empty">
                <i class="el-icon-picture-outline"></i>
                <strong>没有足够接近的结果</strong>
                <p>让产品在画面中占比更大，或使用纯色背景的图片再试一次。</p>
                <el-button size="mini" round @click="pick">换一张图片</el-button>
              </div>

              <div v-else class="matches">
                <article
                  v-for="(supplier, index) in suppliers"
                  :key="supplier.supplierId"
                  class="match"
                >
                  <header class="match-head">
                    <span class="rank">0{{ index + 1 }}</span>
                    <div class="who">
                      <router-link :to="`/suppliers/${supplier.supplierId}`" @click.native="close">
                        {{ supplier.supplierName }}
                      </router-link>
                      <small>目录中有 {{ supplier.matchCount }} 个高匹配产品</small>
                    </div>
                    <span class="score">
                      <b>{{ supplierPercent(supplier) }}%</b>
                      <small>匹配度</small>
                    </span>
                  </header>

                  <ul class="match-items">
                    <li v-for="item in supplier.items" :key="item.product.id">
                      <router-link
                        class="match-item"
                        :to="`/suppliers/${supplier.supplierId}/products?p=${item.product.id}`"
                        @click.native="close"
                      >
                        <span class="item-thumb">
                          <ProductThumb
                            :shape="item.product.shape"
                            :accent="item.product.accent"
                            :label="item.product.name"
                          />
                        </span>
                        <span class="item-body">
                          <strong>{{ item.product.name }}</strong>
                          <small>{{ subtitle(item.product) }}</small>
                        </span>
                        <span class="item-side">
                          <b>${{ item.product.price.toFixed(2) }}</b>
                          <small>{{ item.percent }}%</small>
                        </span>
                      </router-link>
                    </li>
                  </ul>

                  <router-link
                    class="match-more"
                    :to="`/suppliers/${supplier.supplierId}/products`"
                    @click.native="close"
                  >
                    查看完整产品目录 <i class="el-icon-arrow-right"></i>
                  </router-link>
                </article>
              </div>
            </section>
          </div>

          <!-- 常驻 input：切换图片时复用 -->
          <input
            ref="input"
            class="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @click.stop
            @change="onPick"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ProductThumb from '@/components/ProductThumb.vue'
import { variantName } from '@/data/products'
import {
  prepareImage,
  requestVisualAnalysis,
  buildLocalAnalysis,
  rankSuppliers
} from '@/utils/visualSearch'

export default {
  name: 'ImageSearchPanel',
  components: { ProductThumb },
  data() {
    return {
      visible: false,
      lockedOverflow: '',
      stage: 'idle',
      dragging: false,
      error: '',
      notice: '',
      preview: null,
      analysis: null,
      suppliers: []
    }
  },
  computed: {
    busy() {
      return this.stage === 'preparing' || this.stage === 'analyzing'
    },
    isFallback() {
      return !!this.analysis && this.analysis.provider === 'local'
    },
    providerLabel() {
      if (!this.analysis) return ''
      if (this.analysis.provider === 'local') return '本地主色推断'
      if (this.analysis.provider === 'mock') return '演示视觉模式'
      if (this.analysis.model) return `视觉模型：${this.analysis.model}`
      return '视觉分析'
    },
    confidencePercent() {
      return this.analysis ? Math.round(this.analysis.confidence * 100) : 0
    },
    // 关键词与品类同义时只在品类 chips 里展示一次
    keywordChips() {
      if (!this.analysis) return []
      const categories = this.analysis.categories.map((item) => String(item).toLowerCase())
      return this.analysis.keywords.filter(
        (item) => !categories.includes(String(item).toLowerCase())
      )
    }
  },
  mounted() {
    // 弹层整体挂到 body，避免被 hero 的 overflow / reveal 变换裁切
    document.body.appendChild(this.$el)
    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('paste', this.onPaste)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('paste', this.onPaste)
    if (this.visible) document.body.style.overflow = this.lockedOverflow || ''
    if (this.$el && this.$el.parentNode) this.$el.parentNode.removeChild(this.$el)
  },
  methods: {
    // 供搜索框调用：打开面板，可直接带入剪贴板里的图片
    open(file) {
      if (!this.visible) {
        this.lockedOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
      this.visible = true
      this.$nextTick(() => {
        if (this.$refs.shell) this.$refs.shell.focus()
      })
      if (file) this.handleFile(file)
    },
    close() {
      if (!this.visible) return
      this.visible = false
      // 识别过程允许中途关闭，重新打开即可看到结果
      document.body.style.overflow = this.lockedOverflow || ''
    },
    onKeydown(event) {
      if (event.key === 'Escape' && this.visible) this.close()
    },
    onPaste(event) {
      if (!this.visible) return
      const file = this.clipboardFile(event)
      if (!file) return
      event.preventDefault()
      this.handleFile(file)
    },
    clipboardFile(event) {
      const items = (event.clipboardData && event.clipboardData.items) || []
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].kind === 'file' && /^image\//i.test(items[i].type)) {
          return items[i].getAsFile()
        }
      }
      return null
    },
    pick() {
      if (this.busy) return
      if (this.$refs.input) this.$refs.input.click()
    },
    onPick(event) {
      const file = event.target.files && event.target.files[0]
      event.target.value = ''
      this.handleFile(file)
    },
    onDrop(event) {
      this.dragging = false
      if (this.busy) return
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]
      this.handleFile(file)
    },
    async handleFile(file) {
      if (!file) return

      this.error = ''
      this.notice = ''
      this.stage = 'preparing'

      let prepared
      try {
        prepared = await prepareImage(file)
      } catch (error) {
        this.error = error.message || '图片处理失败，请换一张再试。'
        this.stage = this.preview ? 'done' : 'idle'
        return
      }

      this.preview = prepared
      await this.runAnalysis(prepared)
    },
    async runAnalysis(prepared) {
      this.stage = 'analyzing'
      this.notice = ''

      try {
        this.analysis = await requestVisualAnalysis({ dataUrl: prepared.dataUrl })
      } catch (error) {
        // 接口不可用/超时/未配置：退回本地按主色推断，保证结果区永远有内容
        this.analysis = buildLocalAnalysis({
          color: prepared.color,
          aspectRatio: prepared.width / prepared.height
        })
        this.notice =
          error.code === 'CLIENT_TIMEOUT'
            ? '视觉服务响应超时，以下结果基于图片主色推断。'
            : '视觉服务暂时不可用，以下结果基于图片主色推断。'
      }

      this.suppliers = rankSuppliers(this.analysis, { limit: 3 })
      this.stage = 'done'
    },
    retry() {
      if (this.preview && !this.busy) this.runAnalysis(this.preview)
    },
    reset() {
      this.preview = null
      this.analysis = null
      this.suppliers = []
      this.error = ''
      this.notice = ''
      this.stage = 'idle'
    },
    supplierPercent(supplier) {
      if (typeof supplier.percent === 'number') return supplier.percent
      return supplier.items.length ? supplier.items[0].percent : 0
    },
    subtitle(product) {
      const variant = variantName(String(product.variant || '').trim())
      const category = String(product.category || '').trim()
      if (!variant || variant === category) return category
      return `${variant} · ${category}`
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.lens-overlay {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 6vh 20px;
  background: rgba(13, 16, 48, 0.46);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.lens {
  width: min(920px, 100%);
  background: #fff;
  border-radius: $radius-lg;
  box-shadow: 0 40px 90px -34px rgba(13, 16, 48, 0.55);
  outline: none;
}

.lens-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid $line;
}

.lens-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  h2 {
    font-size: 16px;
    letter-spacing: -0.01em;
  }

  p {
    margin-top: 2px;
    font-size: 12.5px;
    color: $muted;
  }
}

.lens-mark {
  @include flex-center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(140deg, $primary, #8f5bff 62%, $accent 145%);
  color: #fff;
  font-size: 18px;
  box-shadow: 0 10px 22px -12px rgba(91, 75, 255, 0.95);
}

.lens-close {
  @include flex-center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 1px solid $line;
  border-radius: 50%;
  background: #fff;
  color: $muted;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s $ease, border-color 0.2s $ease, background 0.2s $ease;

  &:hover {
    color: $ink;
    border-color: rgba(91, 75, 255, 0.35);
    background: $bg-soft;
  }
}

/* ---------------- 空态 ---------------- */
.lens-empty {
  padding: 22px;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 52px 24px;
  border-radius: $radius;
  border: 1.5px dashed rgba(91, 75, 255, 0.32);
  background: radial-gradient(ellipse 62% 82% at 50% 0%, rgba(91, 75, 255, 0.09), transparent 72%),
    $bg-soft;
  cursor: pointer;
  transition: border-color 0.25s $ease, background 0.25s $ease, transform 0.25s $ease;

  h3 {
    font-size: 17px;
    margin-bottom: 6px;
  }

  p {
    font-size: 13px;
    color: $ink-soft;
  }

  &:hover,
  &:focus-visible,
  &.is-dragging {
    border-color: $primary;
    background: radial-gradient(ellipse 62% 82% at 50% 0%, rgba(91, 75, 255, 0.16), transparent 72%),
      #fff;
    transform: translateY(-2px);
    outline: none;
  }
}

.drop-icon {
  @include flex-center;
  width: 54px;
  height: 54px;
  margin-bottom: 16px;
  border-radius: 17px;
  background: #fff;
  color: $primary;
  font-size: 23px;
  box-shadow: $shadow-sm;
}

.drop-cta {
  margin-top: 18px;
  padding: 10px 22px;
  border-radius: 99px;
  background: $primary;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 16px 30px -18px rgba(91, 75, 255, 0.95);
}

.lens-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-top: 18px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 11px;
    border-radius: 99px;
    border: 1px solid $line;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    color: $muted;

    i {
      font-size: 12px;
      color: $primary;
    }
  }
}

/* ---------------- 工作区 ---------------- */
.lens-body {
  display: grid;
  grid-template-columns: 292px minmax(0, 1fr);
  gap: 22px;
  padding: 22px;
}

.lens-preview {
  min-width: 0;
}

.shot {
  position: relative;
  overflow: hidden;
  border-radius: $radius-sm;
  border: 1px solid $line;
  background: $bg-soft;

  img {
    display: block;
    width: 100%;
    max-height: 240px;
    object-fit: contain;
  }

  &.is-dragging {
    outline: 2px dashed $primary;
    outline-offset: -6px;
  }
}

.shot-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(13, 16, 48, 0.52);
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
}

.preview-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.lens-meta {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px solid $line;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  dt {
    font-size: 12px;
    font-weight: 700;
    color: $muted;
  }

  dd {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: $ink;
  }
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid rgba(13, 16, 48, 0.12);
}

.lens-analysis {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid $line;

  h3 {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $muted;
    margin-bottom: 10px;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.chip {
  padding: 4px 9px;
  border-radius: 7px;
  background: $bg-soft;
  font-size: 11.5px;
  font-weight: 700;
  color: $ink-soft;

  &--solid {
    background: $primary-soft;
    color: $primary;
  }
}

.read-line {
  font-size: 12px;
  line-height: 1.6;
  color: $ink-soft;
  text-transform: capitalize;

  em {
    font-style: normal;
    color: $muted;
  }
}

.analysis-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
}

.provider {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 7px;
  background: rgba(22, 185, 129, 0.1);
  color: #0f9c6c;
  font-size: 11px;
  font-weight: 700;

  &.is-fallback {
    background: $accent-soft;
    color: #ea4f18;
  }
}

.confidence {
  font-size: 11.5px;
  font-weight: 700;
  color: $muted;
}

.notice-text {
  margin-top: 10px;
  padding: 9px 11px;
  border-radius: 10px;
  background: $bg-soft;
  font-size: 11.5px;
  line-height: 1.6;
  color: $ink-soft;
}

.lens-error {
  margin-top: 12px;
  font-size: 12.5px;
  font-weight: 700;
  color: #d93b3b;
}

/* ---------------- 结果 ---------------- */
.lens-results {
  min-width: 0;
}

.results-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;

  h3 {
    font-size: 14px;
    margin-bottom: 3px;
  }

  p {
    font-size: 12px;
    color: $muted;
  }
}

.matches {
  display: grid;
  gap: 12px;
}

.match {
  padding: 14px 14px 0;
  border: 1px solid $line;
  border-radius: $radius-sm;
  transition: box-shadow 0.25s $ease;

  &:hover {
    box-shadow: $shadow-sm;
  }
}

.match-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 11px;

  a {
    font-size: 14px;
    font-weight: 700;

    &:hover {
      color: $primary;
    }
  }

  small {
    display: block;
    margin-top: 1px;
    font-size: 11.5px;
    color: $muted;
  }
}

.rank {
  @include flex-center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: $bg-soft;
  color: $primary;
  font-size: 11.5px;
  font-weight: 800;
}

.who {
  flex: 1;
  min-width: 0;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.1;

  b {
    font-size: 15px;
  }

  small {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $muted;
  }
}

.match-items {
  border-top: 1px solid $line;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid $line;
  transition: background 0.2s $ease;

  &:hover {
    background: rgba(91, 75, 255, 0.03);

    strong {
      color: $primary;
    }
  }
}

.item-thumb {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  background: $bg-soft;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;

  strong {
    font-size: 12.5px;
    color: $ink;
    transition: color 0.2s $ease;
  }

  small {
    font-size: 11px;
    color: $muted;
    text-transform: capitalize;
  }
}

.item-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;

  b {
    font-size: 12.5px;
  }

  small {
    font-size: 10.5px;
    font-weight: 700;
    color: $muted;
  }
}

.match-more {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 0;
  font-size: 11.5px;
  font-weight: 700;
  color: $primary;

  i {
    font-size: 10px;
  }
}

/* ---------------- 加载与空态 ---------------- */
.skeletons {
  display: grid;
  gap: 12px;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 16px;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: #fff;
}

.skeleton-line {
  height: 11px;
  border-radius: 99px;
  background: linear-gradient(90deg, #eef0f8 0%, #f8f9fd 50%, #eef0f8 100%);
  background-size: 220% 100%;
  animation: shimmer 1.4s $ease infinite;

  &.w-40 {
    width: 40%;
  }

  &.w-70 {
    width: 70%;
  }

  &.w-55 {
    width: 55%;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 24px;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: #fff;

  > i {
    font-size: 22px;
    color: $primary;
  }

  strong {
    font-size: 14px;
  }

  p {
    font-size: 12.5px;
    line-height: 1.65;
    color: $ink-soft;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes shimmer {
  0% {
    background-position: 120% 0;
  }

  100% {
    background-position: -20% 0;
  }
}

.lens-fade-enter-active,
.lens-fade-leave-active {
  transition: opacity 0.22s $ease;

  .lens {
    transition: transform 0.22s $ease;
  }
}

.lens-fade-enter,
.lens-fade-leave-to {
  opacity: 0;

  .lens {
    transform: translateY(-10px) scale(0.985);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
  }
}

@include down(760px) {
  .lens-overlay {
    padding: 0;
  }

  .lens {
    width: 100%;
    min-height: 100vh;
    border-radius: 0;
  }

  .lens-body {
    grid-template-columns: 1fr;
  }

  .shot img {
    max-height: 220px;
  }
}
</style>
