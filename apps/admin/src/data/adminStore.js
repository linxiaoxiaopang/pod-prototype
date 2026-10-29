// 后台端本地数据层：读取 adminData 的演示数据，写入 localStorage，刷新后保留
import {
  adminSuppliers,
  adminProducts,
  adminHelpCategories,
  adminHelpArticles,
  helpCenterDefaults,
  extensionDefaults,
  adminCrawlTasks,
  adminCrawlItems,
  adminCrawlDomains,
  adminCrawlLogs,
  buildAdminProductSpecs
} from './adminData'

const KEYS = {
  suppliers: 'pod-admin-suppliers',
  products: 'pod-admin-products',
  helpCategories: 'pod-admin-help-categories',
  helpArticles: 'pod-admin-help-articles',
  helpSettings: 'pod-admin-help-settings',
  extension: 'pod-admin-extension-state',
  crawlTasks: 'pod-admin-crawl-tasks',
  crawlItems: 'pod-admin-crawl-items',
  crawlDomains: 'pod-admin-crawl-domains',
  crawlLogs: 'pod-admin-crawl-logs'
}

const clone = (value) => JSON.parse(JSON.stringify(value))

function readList(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return clone(fallback)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : clone(fallback)
  } catch (e) {
    return clone(fallback)
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // 隐私模式下写入失败时保持内存态，不影响页面交互
  }
}

export const today = () => new Date().toISOString().slice(0, 10)

export function slugify(value) {
  const text = String(value || '')
    .trim()
    .toLowerCase()
  const ascii = text
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii || `item-${Date.now().toString(36)}`
}

/* ---------- 供应商 ---------- */

export function listSuppliers() {
  return readList(KEYS.suppliers, adminSuppliers)
}

export function saveSuppliers(rows) {
  write(KEYS.suppliers, rows)
  return rows
}

export function findSupplier(id) {
  return listSuppliers().find((item) => item.id === id) || null
}

export function upsertSupplier(supplier) {
  const rows = listSuppliers()
  const index = rows.findIndex((item) => item.id === supplier.id)
  if (index >= 0) rows.splice(index, 1, supplier)
  else rows.unshift(supplier)
  return saveSuppliers(rows)
}

export function removeSupplier(id) {
  return saveSuppliers(listSuppliers().filter((item) => item.id !== id))
}

/* ---------- 产品 ---------- */

// 补齐第三方产品规格：旧数据或手动新建的产品按品类模板生成，保证详情页信息完整
const withProductSpecs = (row) => ({
  ...row,
  thirdParty: row.thirdParty || buildAdminProductSpecs(row)
})

export function listProducts() {
  return readList(KEYS.products, adminProducts).map(withProductSpecs)
}

export function saveProducts(rows) {
  const next = rows.map(withProductSpecs)
  write(KEYS.products, next)
  return next
}

export function findProduct(id) {
  return listProducts().find((item) => item.id === id) || null
}

export function upsertProduct(product) {
  const rows = listProducts()
  const index = rows.findIndex((item) => item.id === product.id)
  if (index >= 0) rows.splice(index, 1, product)
  else rows.unshift(product)
  return saveProducts(rows)
}

export function removeProduct(id) {
  return saveProducts(listProducts().filter((item) => item.id !== id))
}

/* ---------- 帮助中心 ---------- */

export function listHelpCategories() {
  return readList(KEYS.helpCategories, adminHelpCategories).sort((a, b) => a.order - b.order)
}

export function saveHelpCategories(rows) {
  const ordered = [...rows].sort((a, b) => a.order - b.order)
  write(KEYS.helpCategories, ordered)
  return ordered
}

export function listHelpArticles() {
  return readList(KEYS.helpArticles, adminHelpArticles)
}

export function saveHelpArticles(rows) {
  write(KEYS.helpArticles, rows)
  return rows
}

export function upsertHelpArticle(article) {
  const rows = listHelpArticles()
  const index = rows.findIndex((item) => item.id === article.id)
  if (index >= 0) rows.splice(index, 1, article)
  else rows.unshift(article)
  return saveHelpArticles(rows)
}

export function removeHelpArticle(id) {
  return saveHelpArticles(listHelpArticles().filter((item) => item.id !== id))
}

export function getHelpSettings() {
  try {
    const raw = window.localStorage.getItem(KEYS.helpSettings)
    if (!raw) return { ...helpCenterDefaults }
    return { ...helpCenterDefaults, ...JSON.parse(raw) }
  } catch (e) {
    return { ...helpCenterDefaults }
  }
}

export function saveHelpSettings(settings) {
  write(KEYS.helpSettings, settings)
  return settings
}

/* ---------- 谷歌采集插件 ---------- */

export const nowLabel = () => {
  const date = new Date()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `今天 ${hh}:${mm}`
}

export function getExtensionState() {
  try {
    const raw = window.localStorage.getItem(KEYS.extension)
    if (!raw) return { ...extensionDefaults }
    return { ...extensionDefaults, ...JSON.parse(raw) }
  } catch (e) {
    return { ...extensionDefaults }
  }
}

export function saveExtensionState(state) {
  write(KEYS.extension, state)
  return state
}

export function listCrawlTasks() {
  return readList(KEYS.crawlTasks, adminCrawlTasks)
}

export function saveCrawlTasks(rows) {
  write(KEYS.crawlTasks, rows)
  return rows
}

export function listCrawlItems() {
  return readList(KEYS.crawlItems, adminCrawlItems)
}

export function saveCrawlItems(rows) {
  write(KEYS.crawlItems, rows)
  return rows
}

export function listCrawlDomains() {
  return readList(KEYS.crawlDomains, adminCrawlDomains)
}

export function saveCrawlDomains(rows) {
  write(KEYS.crawlDomains, rows)
  return rows
}

export function listCrawlLogs() {
  return readList(KEYS.crawlLogs, adminCrawlLogs)
}

export function saveCrawlLogs(rows) {
  write(KEYS.crawlLogs, rows.slice(0, 200))
  return rows
}

export function appendCrawlLog(level, message) {
  const rows = listCrawlLogs()
  const next = [
    { id: `log-${Date.now().toString(36)}`, time: nowLabel(), level, message },
    ...rows
  ].slice(0, 200)
  write(KEYS.crawlLogs, next)
  return next
}
