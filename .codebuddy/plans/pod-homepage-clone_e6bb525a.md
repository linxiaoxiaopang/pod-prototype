---
name: pod-homepage-clone
overview: 按 printondemandbusiness.com 真实首页结构与文案，用 Vue 2 + Element UI + Sass 重做单页静态原型：公告条、带搜索的 Hero、平台背书、Featured Suppliers 四卡、邮件订阅、双入口卡、最新文章、8 条 FAQ、页脚，视觉素材全部用内联 SVG/渐变。
design:
  architecture:
    framework: vue
  fontSystem:
    fontFamily: Plus Jakarta Sans
    heading:
      size: clamp(38px, 5vw, 62px)
      weight: 800
    subheading:
      size: 28px
      weight: 700
    body:
      size: 15px
      weight: 400
  colorSystem:
    primary:
      - "#5B4BFF"
      - "#4030D8"
      - "#EEE9FF"
    background:
      - "#FFFFFF"
      - "#F6F7FD"
      - "#0B0D24"
    text:
      - "#0D1030"
      - "#4A4F6B"
      - "#858AA3"
    functional:
      - "#FF6B35"
      - "#16B981"
      - "#E7E9F4"
todos:
  - id: rewrite-content
    content: 重写 content.js 真实文案与 App.vue 骨架，删除 8 个旧区块组件及 index.html 标题
    status: completed
  - id: header-announcement
    content: 新增公告条组件，改造 AppHeader 为 sticky 导航 + 移动抽屉
    status: completed
    dependencies:
      - rewrite-content
  - id: hero-proof
    content: 重写 Hero 搜索区与平台背书区，新增 SupplierLogo 占位组件
    status: completed
    dependencies:
      - header-announcement
  - id: suppliers-newsletter
    content: 实现 Featured Suppliers 四卡与邮件订阅区，接入校验与提示
    status: completed
    dependencies:
      - hero-proof
  - id: discover-articles
    content: 实现双入口卡、最新文章区与 ArticleCover 几何封面
    status: completed
    dependencies:
      - suppliers-newsletter
  - id: faq-footer
    content: 重写 FAQ 为真实 8 问并重做页脚三列导航
    status: completed
    dependencies:
      - discover-articles
  - id: verify-build
    content: 构建并用 [skill:playwright-cli] 截图校验桌面与移动端布局交互
    status: completed
    dependencies:
      - faq-footer
---

## 产品概述
在业务端（`apps/web`）新增「以图搜图」能力：用户把商品图片拖到首页搜索卡片上，系统调用视觉模型识别图片中的品类、主色与关键词，先定位到最匹配的供应商，再进入该供应商产品目录并按相似度排序展示；用户可在结果页切换供应商、清除识别条件。

## 核心功能
- **拖拽上传**：首页 Hero 搜索卡片支持拖入图片（`image/*`，单张，≤8MB），拖拽时卡片出现虚线高亮与「松开以识别图片」提示；移动端无拖拽，提供点击相机按钮唤起文件选择的降级入口
- **相机入口**：搜索卡片右侧新增相机按钮，与 Search 按钮并排，点击可直接选择图片
- **识别过程**：上传后弹出识别弹窗，展示图片缩略图、识别进度（骨架/加载态），完成后展示识别结果标签（品类、主色色块、关键词、置信度）与推荐供应商（Top 3，含匹配理由与命中产品数）
- **匹配规则**：先按识别出的品类与关键词为 12 家供应商打分，选中得分最高者；进入其产品目录后，在该供应商产品范围内按品类命中、关键词命中、主色接近度对产品排序，仅展示有匹配分的产品
- **结果页**：供应商产品页顶部新增识别结果条（可关闭），显示历史图片小缩略图、识别标签、匹配数量与「切换供应商」下拉；切换后沿用同一识别结果在该供应商目录内重新排序，不重复调用模型；清除后回到常规目录
- **降级与容错**：未配置 API key、限流、超时或识别失败时，自动改用浏览器端启发式（主色 + 画面比例 + 可选品类）完成匹配，结果页仍可用并标注「本地匹配」；页面不出现报错中断
- **状态可回溯**：识别结果与筛选状态写入 URL（新增 `v` 参数，保留原有 `q`/`cat`/`sort`/`p`），刷新或分享后可恢复；识别上下文缺失时静默忽略并回落到正常目录

## 视觉与交互基调
- 相机按钮沿用现有搜索卡片的白底圆角风格，图标按钮 hover 变主题紫；拖拽悬停时整卡出现 2px 虚线边框 + 淡紫底 + 中心提示语
- 识别弹窗使用 Element UI 对话框，左侧图片预览（圆角、细边框），右侧识别标签与供应商推荐卡；推荐卡含品牌色 Logo 方块、供应商名、命中数、匹配理由，行为整卡可点
- 结果页顶部条为浅紫渐变胶囊条，含小缩略图、识别标签 chips、供应商切换下拉与关闭按钮，与现有 Hero/筛选区层级分离不抢视线


## 技术栈
- 前端：Vue 2.7（Options API）+ Element UI 2.15 + Sass（沿用现有 `apps/web` 工程与设计变量）
- 视觉服务：OpenAI Chat Completions（vision + `response_format: json_object`），模型 `gpt-4o-mini`（可用 `OPENAI_VISION_MODEL` 覆盖）
- 代理层：Node 原生 `http` + 全局 `fetch`（Node 20），**不新增任何 npm 依赖**
- 开发环境代理：Vite `configureServer` 中间件，挂载 `/api/visual-search`（无需新端口、无 CORS）
- 生产/预览：`apps/web/server/standalone.js` 静态托管 `dist` 并挂同一处理函数，`node --env-file=.env` 启动

## 实现方案

### 1. 整体链路
1. 前端 `canvas` 压缩图片（最长边 ≤768px，JPEG 0.82）→ `dataURL`
2. `POST /api/visual-search`，body `{ image, locale }`
3. 服务端校验（大小/MIME/速率）→ 调用 OpenAI（`image_url` 为 dataURL、`detail: low`、`max_tokens: 300`、`temperature: 0`）→ 归一化输出（品类白名单映射、颜色转 hex）
4. 前端拿到 `recognition` → 纯函数打分（供应商 / 产品）→ 打开弹窗展示推荐
5. 确认后写入结果缓存（`sessionStorage` + 内存 Map，30 分钟 TTL）→ 路由跳转 `/suppliers/:id/products?v=<id>`
6. 产品页读取 `v` → 取缓存 → 按识别结果排序；切换供应商复用同一 payload

### 2. 关键决策与取舍
- **服务端只做视觉理解，不做业务匹配**：识别结果与产品目录解耦，目录打分留在前端（数据已在前端，零额外往返；也便于后续换模型/换供应商数据）
- **嵌入式 Vite 中间件而非独立 Express 服务**：保持 `npm run dev:web` 单命令启动；同时提供 `server/standalone.js` 覆盖生产环境，避免只做 dev-only
- **结果通过 id 暂存而非长 URL**：识别 JSON 体积大，URL 只带 `v=<uuid>`，避免与现有 `q/cat/sort/p` 同步逻辑冲突、避免超长链接
- **零新依赖**：使用 Node 内置 `fetch` 与自写限流/缓存，避免为一个接口引入 express/multer/dotenv
- **图片先压缩再上传**：控制 token 与带宽（约 150–250KB），并用图片 SHA-256 做结果缓存（内存 LRU 50 条），重复拖同一张图不重复计费

### 3. 打分模型（纯函数，可测试）
```
productScore = 4*categoryHit + 2*name/variantKeywordHit + 1*subcategoryHit + 0.5*colorCloseness(accent, colors[0])
supplierScore = sum(top3 productScore) + 1.5*categoryCoverage + 0.3*featured
```
- `colorCloseness`：hex → HSL 色相距离（不做感知均匀转换，够用且无依赖）
- 供应商选择取最高分；产品列表过滤 `score > 0`，按分数降序，同分按 price 升序
- 全部无匹配时展示该供应商全部产品并提示「未找到高置信匹配，已展示完整目录」

### 4. 安全与稳定性
- key 仅从服务端 env 读取（`OPENAI_API_KEY`），不注入 `import.meta.env`、不返回前端
- 请求体上限 6MB（超限 413）；MIME 白名单 `image/jpeg|png|webp`；上游超时 25s
- 内存令牌桶限流（每 IP 10 次/分钟），返回 429；错误统一 `{ error: { code, message } }`，不转发上游原始报文
- 日志只记录耗时、状态码、模型名与图片字节数，绝不记录 base64 或 key
- `VISUAL_SEARCH_MOCK=1` 用于无 key 演示与自动化测试，返回固定识别结果（`provider: 'mock'`）

### 5. 降级策略
服务端 `NO_KEY` / `RATE_LIMITED` / `UPSTREAM_ERROR` / 超时 / JSON 解析失败 → 前端走本地启发式：
- 主导色（canvas 采样 + 颜色量化）、画面宽高比、亮度/饱和度 → 粗略品类（宽幅→Wall Art，长幅→Apparel，方形→Home & Living 等）
- 标注 `provider: 'local'`，弹窗与结果页显示「本地匹配」徽标，并允许用户手动改识别品类后重新匹配（无需再次上传）

### 6. 与现有实现的兼容
- `SupplierProductsPage` 的 `hydrate/buildQuery` 增加 `v`；清除视觉模式时删除 `v` 与缓存
- 视觉模式与关键词/品类/排序叠加：先按视觉分排序得到候选，再叠加 `q/cat` 过滤（用户可继续输入关键词收窄）
- `?p=` 深链高亮逻辑保持不变；视觉结果默认高亮 Top1 产品（不写 `p`，仅排序置顶）
- 移动端 390px：弹窗改为底部弹出（`el-dialog` 全宽、`top: auto`），拖拽区退化为点击上传

## 目录结构

```
apps/web/
├── .env.example                                   # [NEW] OPENAI_API_KEY / OPENAI_VISION_MODEL / OPENAI_BASE_URL / VISUAL_SEARCH_MOCK 示例
├── package.json                                   # [MODIFY] 新增 "serve": "node --env-file=.env server/standalone.js"
├── vite.config.js                                 # [MODIFY] loadEnv + 注册 visualSearch 插件
├── server/
│   ├── visualSearchHandler.js                     # [NEW] 请求校验、限流、OpenAI 调用、结果归一化、错误码、LRU 缓存
│   ├── vitePlugin.js                              # [NEW] configureServer 挂载 /api/visual-search（dev）
│   └── standalone.js                              # [NEW] 生产静态服务 + 同一 handler（node http）
└── src/
    ├── utils/
    │   ├── visualSearch.js                        # [NEW] 图片压缩、主导色采样、供应商/产品打分、识别结果归一化、URL payload 编解码
    │   └── visualSearchStore.js                   # [NEW] 结果暂存（内存 Map + sessionStorage，30 分钟 TTL）
    ├── components/
    │   ├── HeroSearch.vue                         # [MODIFY] 相机按钮、拖拽交互与高亮态、隐藏 file input、打开识别弹窗
    │   ├── VisualSearchDialog.vue                 # [NEW] 图片预览 + 识别态 + 标签 chips + 推荐供应商 + 确认跳转
    │   ├── VisualMatchBanner.vue                  # [NEW] 产品页顶部识别条：缩略图、标签、供应商切换、清除
    │   └── (复用 SupplierLogo / ProductCard)
    └── views/
        └── SupplierProductsPage.vue               # [MODIFY] 读取 v、视觉排序融合、横幅展示、供应商切换、URL 同步
```

根目录：
- `.gitignore` — [MODIFY] 增加 `.env`、`.env.*`，保留 `.env.example`
- `README.md` — [MODIFY] 新增「以图搜图」章节：env 配置、dev/prod 启动方式、降级说明、成本与限额

## 关键接口契约

```js
// POST /api/visual-search
// 请求
{ image: 'data:image/jpeg;base64,...', locale: 'en' }

// 200
{
  provider: 'openai' | 'mock' | 'local',
  recognition: {
    category: 'Apparel',        // 归一化到 8 个品类之一
    subcategory: 'hoodie',
    keywords: ['hoodie', 'fleece', 'black'],
    colors: ['#1b1b1b'],
    style: 'minimal',
    confidence: 0.78            // 0-1
  },
  cached: false,
  latencyMs: 1240
}

// 失败
{ error: { code: 'NO_KEY' | 'BAD_REQUEST' | 'RATE_LIMITED' | 'UPSTREAM_ERROR' | 'TIMEOUT', message: '...' } }
```

## 验证要点
- 无 key：`/api/visual-search` 返回 `NO_KEY`，前端自动本地匹配，弹窗与结果页显示「本地匹配」，全流程可用
- `VISUAL_SEARCH_MOCK=1`：返回固定 `hoodie/black` 识别结果，验证供应商命中（Gelato / Simple Print 等含 Hoodies 的供应商）与产品排序
- 有 key：真实图片识别（需用户提供 key；本机 `api.openai.com` 可达）
- 兼容性：现有 `?q&cat&sort&p` 深链、文本搜索、产品高亮、后台端不受影响


## 设计风格
沿用现有站点语言（现代、克制、紫色主色 + 大圆角），新增组件不引入新视觉体系。

## 交互与布局
- **首页搜索卡片**：右侧新增 36×36 图标按钮（`el-icon-camera`），与 Search 按钮间距 8px；拖拽进入时卡片 `border: 2px dashed #5b4bff`、背景 `rgba(91,75,255,.05)`、阴影加强，卡片中央浮出半透明遮罩与「松开以识别图片」文案，图标切换为上传态
- **识别弹窗（640px 宽）**：左栏 240px 图片预览（`border-radius:16px`，棋盘格底衬透明图），右栏依次为识别标签（品类/风格主标签 + 主色圆点 + 关键词 chips）、置信度条、推荐供应商列表（3 条，含 Logo 方块、名称、命中产品数、理由文案）、底部次按钮「换一张」+ 主按钮「查看匹配产品」
- **识别中**：右栏骨架屏（3 行灰条 + 2 个 chip 占位），图片上覆盖 60% 白色遮罩 + 旋转加载环，避免布局跳动
- **结果页顶部条**：`background: linear-gradient(100deg,#eeeaff,#fff)`，`border:1px solid #e7e9f4`，圆角 16px，左侧 40px 缩略图，中间识别 chips（品类可选、主色点、关键词），右侧供应商下拉（宽度 200px）与关闭按钮；移动端换行，缩略图与 chips 同行、下拉独占一行
- **降级徽标**：小号胶囊 `本地匹配`（灰底）+ 提示文案「未启用视觉模型，可手动调整品类」，点击品类 chip 打开下拉直接改判并重排

## Agent Extensions
### Skill
- **fullstack-dev**
  - Purpose: 设计并实现 `/api/visual-search` 服务端网关（上传校验、环境变量、错误处理、限流、上游调用），以及前后端接口契约与降级链路
  - Expected outcome: 一个零新增依赖、可 dev/prod 两用的 Node 视觉代理，接口契约与前端调用完全对齐
- **playwright-cli**
  - Purpose: 端到端验证拖拽上传、识别弹窗、供应商推荐、结果页排序与供应商切换，并截图核对桌面/移动端视觉
  - Expected outcome: 覆盖正常路径、无 key 降级路径与 mock 路径的验证记录，控制台无新增错误
