# POD Business — 目录站原型（业务端 + 后台端）

复刻 [printondemandbusiness.com](https://www.printondemandbusiness.com/) 的 **POD 供应商目录 / 对比站**。
仓库内包含两个独立子项目：

| 子项目 | 目录 | 说明 | 默认端口 |
|---|---|---|---|
| 业务端（C 端） | `apps/web` | 首页、供应商目录/详情、产品目录、平台对比、成本指数、工具 | `5173` |
| 后台端（管理台） | `apps/admin` | 登录、运营概览、供应商/产品/对比管理、站点设置 | `5174` |

两端都是独立的 Vue 2 + Vite 工程，可单独开发、构建与部署，共用同一套设计语言与依赖版本。

## 技术栈

- Vue 2.7（Options API）+ vue-router 3（hash 模式，静态托管免配置）
- Element UI 2.15（两端共用）
- Sass（`@use` 模块化，变量与 mixin 分别位于两端 `src/styles/variables.scss`）
- Vite 5 + `@vitejs/plugin-vue2`

## 快速开始

```bash
npm install          # 只在仓库根目录安装一次（依赖统一提升到根 node_modules）

npm run dev:web      # 业务端  http://localhost:5173/#/
npm run dev:admin    # 后台端  http://localhost:5174/#/  （账号 admin / admin123）

npm run build        # 依次构建两端，输出 apps/web/dist、apps/admin/dist
npm run build:web    # 仅构建业务端
npm run build:admin  # 仅构建后台端

npm run preview:web
npm run preview:admin
```

> 依赖说明：未使用 npm workspaces（Windows 下创建 workspace 符号链接需要开发者模式或管理员权限），
> 依赖集中在根 `package.json`，两端通过 `npm --prefix apps/<app> run ...` 调用。
> 由于 `node_modules` 位于仓库根，两端 `vite.config.js` 中通过 `server.fs.allow` 放行了上级目录，
> 否则 Element UI 的图标字体会被开发服务器拦截（403）。

## 业务端页面（`apps/web`）

| 路由 | 页面 | 能力 |
|---|---|---|
| `/` | 首页 | 公告条、Hero 搜索联想（供应商 / 对比 / 产品）、以图搜索弹层（拖拽 / 上传 / 粘贴 + 匹配排序）、平台背书、精选供应商、订阅、文章、FAQ |
| `/suppliers` | 供应商目录 | 关键词搜索 + 品类/配送/集成筛选 + 4 种排序 + URL 深链 + 空状态 + 移动端筛选抽屉 |
| `/suppliers/:id` | 供应商详情 | 网站截图、Hero 与快捷事实、评分、产品清单、印刷工艺、集成、配送、工厂、样品表单、相似供应商 |
| `/suppliers/:id/products` | 供应商产品目录 | 对应供应商官网的产品列表：搜索、品类筛选、排序、深链高亮（`?p=`） |
| `/comparisons` | 平台对比 | 6 组并排字段矩阵 |
| `/comparisons/:id` | 对比详情 | Verdict、速览表、评估维度、适用场景、Pros、结论、FAQ |
| `/cost-index` | 成本指数 | 20 个 SKU 的最低价供应商、落地成本、生产与总时效 |
| `/tools` | 工具目录 | 3 类工具分组 |

## 后台端页面（`apps/admin`）

| 路由 | 页面 | 能力 |
|---|---|---|
| `/login` | 登录 | 演示账号校验、记住登录、登录后回跳 |
| `/dashboard` | 运营概览 | 4 个统计卡、最近更新供应商表格、操作动态、快捷入口 |
| `/suppliers` | 供应商管理 | 搜索、状态筛选、目录展示开关、分页、跳转业务端详情 |
| `/products` | 产品目录 | 搜索、供应商/品类筛选、上架开关、分页 |
| `/comparisons` | 对比内容 | 状态筛选、发布/转草稿、预览业务端对比页 |
| `/settings` | 站点设置 | 站点信息、货币、分页、默认排序、维护模式（本地持久化） |

登录态存于 `localStorage`（未勾选“记住登录状态”时存 `sessionStorage`），路由守卫拦截未登录访问。

## 目录结构

```
.
├── package.json                 # 根脚本：dev:web / dev:admin / build:web / build:admin
├── apps
│   ├── web                      # 业务端
│   │   ├── index.html
│   │   ├── vite.config.js       # 端口 5173，@ -> src，fs.allow 上级目录
│   │   ├── package.json
│   │   └── src
│   │       ├── App.vue / main.js
│   │       ├── router/index.js
│   │       ├── data/            # content、suppliers、supplierDetails、products、comparisons、costIndex
│   │       ├── utils/           # supplierQuery、debounce、nav、visualSearch
│   │       ├── styles/          # variables.scss、index.scss
│   │       ├── views/           # HomePage、SuppliersPage、SupplierDetailPage、SupplierProductsPage…
│   │       └── components/      # AppHeader、HeroSearch、ImageSearchPanel、SupplierCard、ProductCard…
│   ├── api                      # 以图搜图接口：vitePlugin（开发中间件）/ server（独立服务）
│   │   ├── visualSearchRoute.js # 入参校验、限流
│   │   ├── visualSearchService.js # OpenAI 视觉调用与结果归一化
│   │   └── config.js / catalog.js / http.js / errors.js
│   └── admin                    # 后台端
│       ├── index.html
│       ├── vite.config.js       # 端口 5174，@ -> src
│       ├── package.json
│       └── src
│           ├── App.vue / main.js
│           ├── router/index.js  # 路由守卫 + 登录态
│           ├── layouts/AdminLayout.vue
│           ├── data/adminData.js
│           ├── styles/          # variables.scss、index.scss
│           ├── views/           # LoginPage、DashboardPage、Suppliers/Products/Comparisons AdminPage、SettingsPage
│           └── components/      # StatusTag
```

## 以图搜图接口

`apps/web` 首页 Hero 搜索框的相机入口（`ImageSearchPanel`）会把图片压缩到最长边 1024px 的 JPEG，再 POST 到 `/api/visual-search`：

- 开发环境：`apps/api/vitePlugin.js` 以 Vite 中间件形式挂载，无需单独启动进程；
- 生产环境：`node apps/api/server.js` 提供同一接口（默认 `8787`，可用 `PORT` / `STATIC_DIR` 调整），并可直接托管 `apps/web/dist`；
- 未配置 `OPENAI_API_KEY` 或接口超时/报错时，前端自动降级为「按图片主色 + 画幅推断品类」的本地匹配，结果区始终有内容。

| 环境变量 | 作用 | 默认值 |
|---|---|---|
| `OPENAI_API_KEY` | 视觉分析密钥，缺省时走前端本地降级 | 空 |
| `OPENAI_VISION_MODEL` | 视觉模型 | `gpt-4o-mini` |
| `MOCK_VISION=1` | 返回固定假结果，便于无 key 联调 | 关闭 |
| `VITE_VISUAL_SEARCH_ENDPOINT` | 前端请求地址 | `/api/visual-search` |

## 说明

- 除以图搜图外，所有数据为静态 mock；后台端的开关与设置仅在浏览器内生效，刷新后保留（`localStorage`）。
- 视觉素材全部为内联 SVG / CSS 渐变，无外链图片；业务端网站截图与后台数据均为演示内容。
- 两端均使用 hash 路由，`dist` 可直接静态托管或本地打开；切换 history 模式需修改各自 `src/router/index.js` 并配置服务器回退。
- 若后续需要两端共享数据层，可在根目录新增 `packages/shared`（纯 JS 数据与工具函数），两端以别名引用。
