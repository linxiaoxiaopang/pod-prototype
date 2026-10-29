import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { selector: to.hash, offset: { x: 0, y: 88 } }
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: () => import('@/views/SuppliersPage.vue')
    },
    {
      path: '/suppliers/:id/products',
      name: 'supplier-products',
      component: () => import('@/views/SupplierProductsPage.vue')
    },
    {
      path: '/suppliers/:id',
      name: 'supplier-detail',
      component: () => import('@/views/SupplierDetailPage.vue')
    },
    {
      path: '/comparisons',
      name: 'comparisons',
      component: () => import('@/views/ComparisonsPage.vue')
    },
    {
      path: '/comparisons/:id',
      name: 'comparison-detail',
      component: () => import('@/views/ComparisonDetailPage.vue')
    },
    {
      path: '/cost-index',
      name: 'cost-index',
      component: () => import('@/views/CostIndexPage.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/views/ToolsPage.vue')
    },
    { path: '*', redirect: '/' }
  ]
})
