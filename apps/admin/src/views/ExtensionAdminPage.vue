<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>谷歌插件管理</h1>
        <p>通过 Chrome 扩展在竞品站点采集产品信息，审核后一键入库到产品目录。</p>
      </div>
      <div class="head-actions">
        <el-button icon="el-icon-download" round @click="download">下载插件</el-button>
        <el-button type="primary" icon="el-icon-plus" round @click="openTask()">新建采集任务</el-button>
      </div>
    </header>

    <section class="stats">
      <article v-for="item in stats" :key="item.label" class="stat" :class="`tone-${item.tone}`">
        <span class="stat-icon"><i :class="item.icon"></i></span>
        <div>
          <p class="stat-label">{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span class="stat-meta">{{ item.meta }}</span>
        </div>
      </article>
    </section>

    <div class="ext-layout">
      <div class="main-col">
        <div class="panel tabs-panel">
          <el-tabs v-model="activeTab">
            <el-tab-pane name="review">
              <span slot="label">
                待审核产品
                <em v-if="pendingCount" class="tab-count">{{ pendingCount }}</em>
              </span>

              <div class="toolbar">
                <el-input
                  v-model="keyword"
                  class="search"
                  prefix-icon="el-icon-search"
                  placeholder="搜索产品名称或站点"
                  clearable
                />
                <el-select v-model="status" class="filter" placeholder="全部状态">
                  <el-option label="全部状态" value="" />
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button
                  size="small"
                  type="primary"
                  plain
                  round
                  :disabled="!pendingFiltered.length"
                  @click="approveAll"
                >
                  全部入库
                </el-button>
                <span class="result">{{ filteredItems.length }} 条结果</span>
              </div>

              <el-table :data="pagedItems" class="table">
                <el-table-column label="采集产品" min-width="250">
                  <template slot-scope="{ row }">
                    <div class="product-cell">
                      <span class="thumb" :style="thumbStyle(row)">{{ row.title.slice(0, 2) }}</span>
                      <div>
                        <strong>{{ row.title }}</strong>
                        <small>{{ row.url }}</small>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="来源站点" width="118" prop="site" />

                <el-table-column label="品类" width="110">
                  <template slot-scope="{ row }">
                    <span class="tag">{{ row.category }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="采集价" width="96">
                  <template slot-scope="{ row }">
                    <span class="money">${{ row.price.toFixed(2) }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="关联供应商" width="118" prop="supplier" />

                <el-table-column label="状态" width="96">
                  <template slot-scope="{ row }">
                    <span class="pill" :class="`is-${row.status}`">{{ itemStatusLabel(row.status) }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="采集时间" width="116" prop="collectedAt" />

                <el-table-column label="操作" width="136" align="right">
                  <template slot-scope="{ row }">
                    <template v-if="row.status === 'pending'">
                      <button class="link" type="button" @click="approve(row)">入库</button>
                      <button class="link danger" type="button" @click="ignore(row)">忽略</button>
                    </template>
                    <button v-else class="link" type="button" @click="restore(row)">重新审核</button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="pager">
                <el-pagination
                  :current-page.sync="page"
                  :page-size="pageSize"
                  :total="filteredItems.length"
                  layout="total, prev, pager, next"
                  background
                />
              </div>
            </el-tab-pane>

            <el-tab-pane name="tasks">
              <span slot="label">采集任务</span>

              <div class="toolbar">
                <p class="toolbar-note">任务在浏览器中由插件执行，后台负责配置、启停与结果审核。</p>
                <el-button size="small" icon="el-icon-plus" round @click="openTask()">新建任务</el-button>
              </div>

              <el-table :data="tasks" class="table">
                <el-table-column label="任务" min-width="230">
                  <template slot-scope="{ row }">
                    <strong class="task-name">{{ row.name }}</strong>
                    <small class="task-url">{{ row.url }}</small>
                  </template>
                </el-table-column>

                <el-table-column label="目标站点" width="120" prop="site" />

                <el-table-column label="品类 / 供应商" width="150">
                  <template slot-scope="{ row }">
                    <span class="tag">{{ row.category }}</span>
                    <small class="muted">{{ row.supplier }}</small>
                  </template>
                </el-table-column>

                <el-table-column label="频率" width="106">
                  <template slot-scope="{ row }">{{ frequencyLabel(row.frequency) }}</template>
                </el-table-column>

                <el-table-column label="状态" width="92">
                  <template slot-scope="{ row }">
                    <span class="pill" :class="`is-${row.status}`">
                      {{ row.status === 'running' ? '运行中' : '已暂停' }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="上次运行" width="116" prop="lastRun" />

                <el-table-column label="已采集" width="86" align="center">
                  <template slot-scope="{ row }">{{ row.collected }} 条</template>
                </el-table-column>

                <el-table-column label="操作" width="210" align="right">
                  <template slot-scope="{ row }">
                    <button class="link" type="button" @click="runTask(row)">立即采集</button>
                    <button class="link" type="button" @click="toggleTask(row)">
                      {{ row.status === 'running' ? '暂停' : '启用' }}
                    </button>
                    <button class="link" type="button" @click="openTask(row)">编辑</button>
                    <button class="link danger" type="button" @click="removeTask(row)">删除</button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane name="domains">
              <span slot="label">站点授权</span>

              <div class="toolbar">
                <p class="toolbar-note">仅允许插件采集下列域名的页面，未授权域名会被拒绝执行。</p>
              </div>

              <ul class="domain-list">
                <li v-for="item in domains" :key="item.domain">
                  <div class="domain-main">
                    <strong>{{ item.domain }}</strong>
                    <small>{{ item.note }}</small>
                  </div>
                  <span class="pill" :class="item.enabled ? 'is-approved' : 'is-ignored'">
                    {{ item.enabled ? '已授权' : '已停用' }}
                  </span>
                  <el-switch :value="item.enabled" @change="toggleDomain(item, $event)" />
                  <button class="link danger" type="button" @click="removeDomain(item)">移除</button>
                </li>
              </ul>

              <div class="domain-add">
                <el-input
                  v-model="newDomain"
                  size="small"
                  placeholder="example.com（无需 https://）"
                  @keyup.enter.native="addDomain"
                />
                <el-button size="small" type="primary" round @click="addDomain">添加域名</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane name="logs">
              <span slot="label">运行日志</span>

              <div class="toolbar">
                <p class="toolbar-note">最近 200 条插件心跳、采集与入库事件。</p>
                <el-button size="small" icon="el-icon-delete" round @click="clearLogs">清空日志</el-button>
              </div>

              <ul class="log-list">
                <li v-for="log in logs" :key="log.id">
                  <span class="log-dot" :class="`is-${log.level}`"></span>
                  <div>
                    <p>{{ log.message }}</p>
                    <small>{{ log.time }}</small>
                  </div>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <aside class="side">
        <div class="side-panel">
          <div class="status-head">
            <span class="status-dot" :class="{ 'is-off': extension.status !== 'connected' }"></span>
            <div>
              <strong>{{ extension.status === 'connected' ? '插件已连接' : '插件离线' }}</strong>
              <small>{{ extension.browser }}</small>
            </div>
          </div>

          <dl class="facts">
            <div>
              <dt>当前版本</dt>
              <dd>
                v{{ extension.version }}
                <em v-if="hasUpdate" class="update">可更新</em>
              </dd>
            </div>
            <div><dt>最新版本</dt><dd>v{{ extension.latestVersion }}</dd></div>
            <div><dt>最近心跳</dt><dd>{{ extension.lastHeartbeat }}</dd></div>
            <div><dt>采集任务</dt><dd>{{ runningCount }} / {{ tasks.length }} 运行中</dd></div>
          </dl>

          <div class="side-actions">
            <el-button size="small" round :loading="testing" @click="testConnection">测试连接</el-button>
            <el-button
              size="small"
              type="primary"
              plain
              round
              :disabled="!hasUpdate"
              @click="upgrade"
            >
              更新到 v{{ extension.latestVersion }}
            </el-button>
          </div>
        </div>

        <div class="side-panel">
          <h3>接口密钥</h3>
          <div class="key-row">
            <code>{{ showKey ? extension.apiKey : maskedKey }}</code>
            <button type="button" @click="showKey = !showKey">
              {{ showKey ? '隐藏' : '显示' }}
            </button>
          </div>

          <div class="key-actions">
            <el-button size="mini" round @click="copyKey">复制密钥</el-button>
            <el-button size="mini" round @click="resetKey">重置</el-button>
          </div>

          <div class="switch-row">
            <el-switch :value="extension.autoApprove" @change="setAutoApprove" />
            <span>高置信度结果自动入库</span>
          </div>

          <p class="form-tip">密钥用于插件与后台鉴权，重置后需要在插件设置中重新填写。</p>
        </div>

        <div class="side-panel">
          <h3>安装步骤</h3>
          <ol class="steps">
            <li><span>1</span><p>下载并解压插件包，在 Chrome 打开 <code>chrome://extensions</code>。</p></li>
            <li><span>2</span><p>开启「开发者模式」，点击「加载已解压的扩展程序」。</p></li>
            <li><span>3</span><p>粘贴接口密钥，选择采集任务后在竞品产品页点击采集。</p></li>
          </ol>
          <el-button
            class="download-btn"
            type="primary"
            round
            icon="el-icon-download"
            @click="download"
          >
            下载插件 v{{ extension.version }}
          </el-button>
        </div>
      </aside>
    </div>

    <el-dialog
      :title="taskEditing ? '编辑采集任务' : '新建采集任务'"
      :visible.sync="taskVisible"
      width="640px"
      :close-on-click-modal="false"
    >
      <el-form ref="taskForm" :model="taskForm" :rules="taskRules" label-position="top">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name" maxlength="40" show-word-limit placeholder="例如：Printful 服装新品" />
        </el-form-item>

        <div class="dialog-grid">
          <el-form-item label="目标站点" prop="site">
            <el-input v-model="taskForm.site" placeholder="printful.com" />
          </el-form-item>

          <el-form-item label="采集品类" prop="category">
            <el-select v-model="taskForm.category" placeholder="请选择品类" filterable allow-create>
              <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item label="关联供应商">
            <el-select v-model="taskForm.supplier" placeholder="选择供应商" filterable allow-create>
              <el-option v-for="item in supplierOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item label="采集频率">
            <el-select v-model="taskForm.frequency">
              <el-option
                v-for="item in frequencyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="起始页面 URL" prop="url">
          <el-input v-model="taskForm.url" placeholder="https://www.example.com/catalog" />
        </el-form-item>

        <el-form-item label="自动入库">
          <div class="switch-row">
            <el-switch v-model="taskForm.autoApprove" />
            <span>采集结果跳过审核，直接写入产品目录草稿</span>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="taskVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveTask">保存任务</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  crawlFrequencyOptions,
  crawlItemStatusOptions,
  productCategoryOptions
} from '@/data/adminData'
import {
  appendCrawlLog,
  getExtensionState,
  listCrawlDomains,
  listCrawlItems,
  listCrawlLogs,
  listCrawlTasks,
  listProducts,
  listSuppliers,
  nowLabel,
  saveCrawlDomains,
  saveCrawlItems,
  saveCrawlLogs,
  saveCrawlTasks,
  saveExtensionState,
  slugify,
  today,
  upsertProduct
} from '@/data/adminStore'

const accents = ['#5b4bff', '#8b5cf6', '#ff6b35', '#16b981', '#0ea5e9', '#f59e0b', '#ec4899']

const emptyTask = () => ({
  id: '',
  name: '',
  site: '',
  url: '',
  category: '',
  supplier: '',
  frequency: 'daily',
  status: 'running',
  lastRun: '尚未运行',
  collected: 0,
  autoApprove: false
})

export default {
  name: 'ExtensionAdminPage',
  data() {
    return {
      extension: getExtensionState(),
      tasks: listCrawlTasks(),
      items: listCrawlItems(),
      domains: listCrawlDomains(),
      logs: listCrawlLogs(),
      activeTab: 'review',
      keyword: '',
      status: 'pending',
      page: 1,
      pageSize: 6,
      statusOptions: crawlItemStatusOptions,
      frequencyOptions: crawlFrequencyOptions,
      categoryOptions: productCategoryOptions,
      supplierOptions: listSuppliers().map((item) => item.name),
      newDomain: '',
      showKey: false,
      testing: false,
      saving: false,
      taskVisible: false,
      taskEditing: false,
      taskForm: emptyTask(),
      taskRules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        site: [{ required: true, message: '请输入目标站点域名', trigger: 'blur' }],
        category: [{ required: true, message: '请选择采集品类', trigger: 'change' }],
        url: [{ required: true, message: '请输入起始页面 URL', trigger: 'blur' }]
      }
    }
  },
  computed: {
    pendingCount() {
      return this.items.filter((item) => item.status === 'pending').length
    },
    pendingFiltered() {
      return this.filteredItems.filter((item) => item.status === 'pending')
    },
    runningCount() {
      return this.tasks.filter((item) => item.status === 'running').length
    },
    todayCount() {
      return this.items.filter((item) => String(item.collectedAt).startsWith('今天')).length
    },
    hasUpdate() {
      return this.extension.version !== this.extension.latestVersion
    },
    maskedKey() {
      const key = this.extension.apiKey || ''
      return `${key.slice(0, 8)}${'•'.repeat(Math.max(key.length - 12, 4))}${key.slice(-4)}`
    },
    stats() {
      const sites = new Set(this.items.map((item) => item.site)).size
      return [
        {
          label: '待审核产品',
          value: this.pendingCount,
          meta: `来自 ${sites} 个竞品站点`,
          icon: 'el-icon-document-checked',
          tone: 'amber'
        },
        {
          label: '今日采集',
          value: this.todayCount,
          meta: '含自动入库结果',
          icon: 'el-icon-download',
          tone: 'violet'
        },
        {
          label: '运行中任务',
          value: this.runningCount,
          meta: `共 ${this.tasks.length} 个采集任务`,
          icon: 'el-icon-refresh',
          tone: 'green'
        },
        {
          label: '插件版本',
          value: `v${this.extension.version}`,
          meta: this.hasUpdate ? `可更新至 v${this.extension.latestVersion}` : '已是最新版本',
          icon: 'el-icon-monitor',
          tone: 'blue'
        }
      ]
    },
    filteredItems() {
      const value = this.keyword.trim().toLowerCase()
      return this.items.filter((item) => {
        if (this.status && item.status !== this.status) return false
        if (!value) return true
        return (
          String(item.title).toLowerCase().includes(value) ||
          String(item.site).toLowerCase().includes(value)
        )
      })
    },
    pagedItems() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredItems.slice(start, start + this.pageSize)
    }
  },
  watch: {
    keyword() {
      this.page = 1
    },
    status() {
      this.page = 1
    },
    activeTab() {
      this.page = 1
    }
  },
  methods: {
    itemStatusLabel(value) {
      return (crawlItemStatusOptions.find((item) => item.value === value) || {}).label || value
    },
    frequencyLabel(value) {
      return (crawlFrequencyOptions.find((item) => item.value === value) || {}).label || value
    },
    thumbStyle(row) {
      return {
        backgroundImage: `linear-gradient(135deg, ${row.accent || '#5b4bff'} 0%, #0d1030 120%)`
      }
    },
    saveExtension(patch) {
      this.extension = saveExtensionState({ ...this.extension, ...patch })
    },
    log(level, message) {
      this.logs = appendCrawlLog(level, message)
    },
    download() {
      this.$message.info('演示环境：插件包由接口下发 zip，这里仅演示下载入口')
    },
    testConnection() {
      this.testing = true
      window.setTimeout(() => {
        this.saveExtension({ status: 'connected', lastHeartbeat: nowLabel() })
        this.testing = false
        this.log('success', '插件连接测试通过，握手耗时 128ms')
        this.$message.success('插件连接正常')
      }, 600)
    },
    upgrade() {
      if (!this.hasUpdate) return
      this.saveExtension({ version: this.extension.latestVersion, lastHeartbeat: nowLabel() })
      this.log('info', `插件已更新到 v${this.extension.latestVersion}`)
      this.$message.success(`已更新到 v${this.extension.latestVersion}`)
    },
    copyKey() {
      const text = this.extension.apiKey
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => this.$message.success('密钥已复制到剪贴板'))
          .catch(() => this.$message.warning('复制失败，请手动选择密钥'))
        return
      }
      this.$message.info(`演示密钥：${text}`)
    },
    resetKey() {
      this.$confirm('重置后插件需要重新填写密钥，确定继续？', '重置接口密钥', {
        type: 'warning',
        confirmButtonText: '重置',
        cancelButtonText: '取消'
      })
        .then(() => {
          let key = 'pod_ext_'
          for (let i = 0; i < 16; i += 1) {
            key += '0123456789abcdef'[Math.floor(Math.random() * 16)]
          }
          this.saveExtension({ apiKey: key })
          this.log('warn', '接口密钥已重置，旧密钥立即失效')
          this.$message.success('密钥已重置')
        })
        .catch(() => {})
    },
    setAutoApprove(value) {
      this.saveExtension({ autoApprove: value })
      this.$message.success(value ? '已开启自动入库' : '已关闭自动入库')
    },
    createProductFromItem(row) {
      const products = listProducts()
      const base = slugify(`${row.supplier || row.site}-${row.title}`)
      let id = base
      let index = 2
      const ids = products.map((item) => item.id)
      while (ids.includes(id)) {
        id = `${base}-${index}`
        index += 1
      }

      upsertProduct({
        id,
        name: row.title,
        sku: `EXT-${String(products.length + 1).padStart(3, '0')}`,
        supplier: row.supplier || row.site,
        category: row.category,
        description: `由谷歌插件从 ${row.site} 采集，来源：${row.url}`,
        price: row.price,
        retailPrice: Number((row.price * 1.6).toFixed(2)),
        productionDays: 2,
        colors: ['白色', '黑色'],
        sizes: ['S', 'M', 'L', 'XL'],
        printArea: '正面',
        printMethod: 'DTG',
        status: 'draft',
        updated: today()
      })
    },
    approve(row) {
      this.createProductFromItem(row)
      row.status = 'approved'
      this.items = saveCrawlItems(this.items)
      this.log('success', `「${row.title}」已入库到产品目录（草稿）`)
      this.$message.success('已入库，可在产品目录继续完善信息')
    },
    ignore(row) {
      row.status = 'ignored'
      this.items = saveCrawlItems(this.items)
      this.log('info', `已忽略「${row.title}」`)
      this.$message.success('已忽略该采集结果')
    },
    restore(row) {
      row.status = 'pending'
      this.items = saveCrawlItems(this.items)
      this.$message.success('已恢复为待审核')
    },
    approveAll() {
      const targets = this.pendingFiltered
      if (!targets.length) return
      this.$confirm(`将当前筛选结果的 ${targets.length} 条采集产品入库为产品草稿，确定继续？`, '批量入库', {
        type: 'warning',
        confirmButtonText: '全部入库',
        cancelButtonText: '取消'
      })
        .then(() => {
          targets.forEach((row) => {
            this.createProductFromItem(row)
            row.status = 'approved'
          })
          this.items = saveCrawlItems(this.items)
          this.log('success', `批量入库 ${targets.length} 条采集产品`)
          this.$message.success(`已入库 ${targets.length} 条产品`)
        })
        .catch(() => {})
    },
    isDomainAllowed(site) {
      const domain = this.domains.find(
        (item) => site === item.domain || site.endsWith(`.${item.domain}`) || item.domain.includes(site)
      )
      if (!domain) return { ok: false, reason: '该站点未授权，请先在「站点授权」中添加域名' }
      if (!domain.enabled) return { ok: false, reason: `「${domain.domain}」已停用，无法采集` }
      return { ok: true }
    },
    runTask(task) {
      const check = this.isDomainAllowed(task.site)
      if (!check.ok) {
        this.$message.warning(check.reason)
        return
      }

      const seq = task.collected + 1
      const item = {
        id: `crawl-${Date.now().toString(36)}`,
        title: `${task.category}采集结果 · ${task.site} #${seq}`,
        site: task.site,
        url: task.url,
        category: task.category,
        supplier: task.supplier || task.site,
        price: Number((12 + (seq % 25) + 0.9).toFixed(2)),
        collectedAt: nowLabel(),
        status: 'pending',
        accent: accents[seq % accents.length]
      }

      task.lastRun = nowLabel()
      task.collected = seq
      this.tasks = saveCrawlTasks(this.tasks)

      if (task.autoApprove || this.extension.autoApprove) {
        item.status = 'approved'
        this.createProductFromItem(item)
        this.items = saveCrawlItems([item, ...this.items])
        this.log('success', `「${task.name}」采集完成，自动入库 1 条产品`)
        this.$message.success('采集完成，已自动入库 1 条产品')
        return
      }

      this.items = saveCrawlItems([item, ...this.items])
      this.log('success', `「${task.name}」采集完成，新增 1 条待审核产品`)
      this.$message.success('采集完成，结果已进入待审核')
    },
    toggleTask(task) {
      task.status = task.status === 'running' ? 'paused' : 'running'
      this.tasks = saveCrawlTasks(this.tasks)
      this.log(
        'info',
        `任务「${task.name}」已${task.status === 'running' ? '启用' : '暂停'}`
      )
      this.$message.success(task.status === 'running' ? '任务已启用' : '任务已暂停')
    },
    openTask(row) {
      this.taskEditing = Boolean(row)
      this.taskForm = row
        ? { ...row }
        : { ...emptyTask(), site: '', url: '', category: this.categoryOptions[0] || '' }
      this.taskVisible = true
      this.$nextTick(() => {
        if (this.$refs.taskForm) this.$refs.taskForm.clearValidate()
      })
    },
    saveTask() {
      this.$refs.taskForm.validate((valid) => {
        if (!valid) return
        const form = this.taskForm
        const payload = {
          ...form,
          id: form.id || `task-${slugify(form.name)}-${Date.now().toString(36).slice(-4)}`,
          name: form.name.trim(),
          site: form.site.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
          url: form.url.trim(),
          category: form.category,
          supplier: form.supplier || '',
          frequency: form.frequency
        }

        const next = form.id
          ? this.tasks.map((item) => (item.id === form.id ? payload : item))
          : [payload, ...this.tasks]
        this.tasks = saveCrawlTasks(next)

        this.saving = true
        window.setTimeout(() => {
          this.saving = false
          this.taskVisible = false
          this.log(
            'info',
            `${form.id ? '更新' : '创建'}采集任务「${payload.name}」（${payload.site}）`
          )
          this.$message.success(form.id ? '任务已更新' : '任务已创建')
        }, 260)
      })
    },
    removeTask(row) {
      this.$confirm(`删除任务「${row.name}」后不会影响已采集的数据，确定继续？`, '删除采集任务', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.tasks = saveCrawlTasks(this.tasks.filter((item) => item.id !== row.id))
          this.log('warn', `采集任务「${row.name}」已删除`)
          this.$message.success('任务已删除')
        })
        .catch(() => {})
    },
    addDomain() {
      const domain = this.newDomain
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .toLowerCase()
      if (!domain) {
        this.$message.error('请输入域名')
        return
      }
      if (!/^[\w-]+(\.[\w-]+)+$/.test(domain)) {
        this.$message.error('请输入合法域名，例如 printful.com')
        return
      }
      if (this.domains.some((item) => item.domain === domain)) {
        this.$message.warning('该域名已在授权列表中')
        return
      }
      this.domains = saveCrawlDomains([
        ...this.domains,
        { domain, enabled: true, note: '手动添加，待补充说明' }
      ])
      this.newDomain = ''
      this.log('info', `已授权采集域名 ${domain}`)
      this.$message.success('域名已添加并授权')
    },
    toggleDomain(row, enabled) {
      row.enabled = enabled
      this.domains = saveCrawlDomains(this.domains)
      this.log(
        enabled ? 'info' : 'warn',
        `域名 ${row.domain} 已${enabled ? '授权' : '停用'}`
      )
      this.$message.success(`${row.domain} 已${enabled ? '授权' : '停用'}`)
    },
    removeDomain(row) {
      this.$confirm(`移除后插件将无法采集 ${row.domain} 的页面，确定继续？`, '移除授权域名', {
        type: 'warning',
        confirmButtonText: '移除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.domains = saveCrawlDomains(this.domains.filter((item) => item.domain !== row.domain))
          this.log('warn', `已移除采集域名 ${row.domain}`)
          this.$message.success('域名已移除')
        })
        .catch(() => {})
    },
    clearLogs() {
      this.$confirm('确定清空全部采集日志？', '清空日志', {
        type: 'warning',
        confirmButtonText: '清空',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.logs = []
          saveCrawlLogs([])
          this.$message.success('日志已清空')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use './admin-page';

.head-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @include down(1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

.stat {
  @include card;
  display: flex;
  gap: 14px;
  padding: 16px 18px;

  strong {
    display: block;
    margin: 2px 0 3px;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
}

.stat-icon {
  @include flex-center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  font-size: 16px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $muted;
}

.stat-meta {
  font-size: 11.5px;
  color: $muted;
}

.tone-violet .stat-icon {
  background: $primary-soft;
  color: $primary;
}

.tone-green .stat-icon {
  background: rgba(22, 185, 129, 0.12);
  color: #0e9c6c;
}

.tone-blue .stat-icon {
  background: rgba(14, 165, 233, 0.12);
  color: #0b7fb0;
}

.tone-amber .stat-icon {
  background: rgba(245, 158, 11, 0.14);
  color: #b4740a;
}

.ext-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;

  @include down(1080px) {
    grid-template-columns: 1fr;
  }
}

.main-col {
  min-width: 0;
}

.tabs-panel {
  padding: 6px 20px 12px;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

:deep(.el-tabs__item) {
  height: 46px;
  font-size: 13px;
  font-weight: 700;
  color: $muted;
}

:deep(.el-tabs__item.is-active) {
  color: $primary;
}

.tab-count {
  display: inline-block;
  min-width: 18px;
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 99px;
  background: rgba(245, 158, 11, 0.16);
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  color: #b4740a;
  text-align: center;
}

.toolbar-note {
  font-size: 12.5px;
  color: $muted;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  strong {
    display: block;
    font-size: 13.5px;
    font-weight: 700;
    color: $ink;
  }

  small {
    display: block;
    max-width: 240px;
    overflow: hidden;
    font-size: 11px;
    color: $muted;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.thumb {
  @include flex-center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;

  &.is-pending {
    background: rgba(245, 158, 11, 0.14);
    color: #b4740a;
  }

  &.is-approved,
  &.is-running {
    background: rgba(22, 185, 129, 0.12);
    color: #0e9c6c;
  }

  &.is-ignored,
  &.is-paused {
    background: rgba(133, 138, 163, 0.14);
    color: #6c7189;
  }
}

.task-name {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: $ink;
}

.task-url {
  display: block;
  max-width: 260px;
  overflow: hidden;
  font-size: 11px;
  color: $muted;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.domain-list {
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 2px;
    border-bottom: 1px solid $line;

    &:last-child {
      border-bottom: none;
    }
  }
}

.domain-main {
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 13.5px;
    font-weight: 700;
    color: $ink;
  }

  small {
    display: block;
    font-size: 11.5px;
    color: $muted;
  }
}

.domain-add {
  display: flex;
  gap: 10px;
  padding: 16px 0 6px;

  :deep(.el-input) {
    max-width: 280px;
  }
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 2px 8px;

  li {
    display: flex;
    gap: 10px;
  }

  p {
    font-size: 12.5px;
    line-height: 1.6;
    color: $ink-soft;
  }

  small {
    font-size: 11px;
    color: $muted;
  }
}

.log-dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: $muted;
  flex-shrink: 0;

  &.is-success {
    background: $success;
  }

  &.is-warn {
    background: $warning;
  }

  &.is-info {
    background: #0ea5e9;
  }
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-panel {
  @include card;
  padding: 18px 20px;

  h3 {
    margin-bottom: 12px;
    font-size: 13.5px;
    font-weight: 700;
  }
}

.status-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  strong {
    display: block;
    font-size: 13.5px;
    font-weight: 700;
    color: $ink;
  }

  small {
    font-size: 11.5px;
    color: $muted;
  }
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: $success;
  box-shadow: 0 0 0 4px rgba(22, 185, 129, 0.14);

  &.is-off {
    background: $muted;
    box-shadow: 0 0 0 4px rgba(133, 138, 163, 0.16);
  }
}

.facts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid $line;

  div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
  }

  dt {
    color: $muted;
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: $ink-soft;
    text-align: right;
  }
}

.update {
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 99px;
  background: rgba(245, 158, 11, 0.16);
  font-style: normal;
  font-size: 10px;
  font-weight: 700;
  color: #b4740a;
}

.side-actions {
  display: flex;
  gap: 8px;
  padding-top: 14px;
  flex-wrap: wrap;
}

.key-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  margin-bottom: 10px;
  border: 1px solid $line;
  border-radius: 10px;
  background: $bg;

  code {
    flex: 1;
    overflow: hidden;
    font-family: 'SFMono-Regular', Consolas, monospace;
    font-size: 11.5px;
    color: $ink-soft;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  button {
    padding: 2px 6px;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-family: $font;
    font-size: 11px;
    font-weight: 700;
    color: $muted;
    cursor: pointer;

    &:hover {
      background: #fff;
      color: $primary;
    }
  }
}

.key-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: $muted;
}

.form-tip {
  margin-top: 10px;
  font-size: 11.5px;
  line-height: 1.7;
  color: $muted;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
  counter-reset: step;

  li {
    display: flex;
    gap: 9px;
  }

  span {
    @include flex-center;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: $primary-soft;
    font-size: 11px;
    font-weight: 800;
    color: $primary;
    flex-shrink: 0;
  }

  p {
    font-size: 12px;
    line-height: 1.65;
    color: $ink-soft;
  }

  code {
    padding: 1px 4px;
    border-radius: 4px;
    background: $bg;
    font-size: 11px;
    color: $ink-soft;
  }
}

.download-btn {
  width: 100%;
}

.dialog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;

  @include down(560px) {
    grid-template-columns: 1fr;
  }
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}
</style>
