import Vue from 'vue'
import Router from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

Vue.use(Router)

const AUTH_KEY = 'pod-admin-token'

const router = new Router({
  mode: 'hash',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardPage.vue'),
          meta: { title: '运营概览', crumb: '概览' }
        },
        {
          path: 'suppliers',
          name: 'suppliers',
          component: () => import('@/views/SuppliersAdminPage.vue'),
          meta: { title: '供应商管理', crumb: '供应商' }
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/ProductsAdminPage.vue'),
          meta: { title: '产品目录', crumb: '产品' }
        },
        {
          path: 'comparisons',
          name: 'comparisons',
          component: () => import('@/views/ComparisonsAdminPage.vue'),
          meta: { title: '对比内容', crumb: '对比' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsPage.vue'),
          meta: { title: '站点设置', crumb: '设置' }
        }
      ]
    },
    { path: '*', redirect: '/dashboard' }
  ]
})

router.beforeEach((to, from, next) => {
  const authed = Boolean(
    window.localStorage.getItem(AUTH_KEY) || window.sessionStorage.getItem(AUTH_KEY)
  )

  if (to.path === '/login') {
    if (authed) next('/dashboard')
    else next()
    return
  }

  if (!authed) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export { AUTH_KEY }
export default router
