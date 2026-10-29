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
          path: 'suppliers/new',
          name: 'supplier-create',
          component: () => import('@/views/SupplierFormPage.vue'),
          meta: { title: '创建供应商', crumb: '供应商' }
        },
        {
          path: 'suppliers/:id/edit',
          name: 'supplier-edit',
          component: () => import('@/views/SupplierFormPage.vue'),
          meta: { title: '编辑供应商', crumb: '供应商' }
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/ProductsAdminPage.vue'),
          meta: { title: '产品目录', crumb: '产品' }
        },
        {
          path: 'products/new',
          name: 'product-create',
          component: () => import('@/views/ProductFormPage.vue'),
          meta: { title: '创建产品', crumb: '产品' }
        },
        {
          path: 'products/:id/edit',
          name: 'product-edit',
          component: () => import('@/views/ProductFormPage.vue'),
          meta: { title: '编辑产品', crumb: '产品' }
        },
        {
          path: 'extension',
          name: 'extension',
          component: () => import('@/views/ExtensionAdminPage.vue'),
          meta: { title: '谷歌插件管理', crumb: '采集插件' }
        },
        {
          path: 'help',
          name: 'help-center',
          component: () => import('@/views/HelpCenterAdminPage.vue'),
          meta: { title: '帮助中心管理', crumb: '帮助中心' }
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
