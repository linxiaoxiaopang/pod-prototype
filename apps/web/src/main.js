import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import './styles/index.scss'

Vue.use(ElementUI, { locale, size: 'medium' })

/**
 * 轻量滚动入场动画指令：v-reveal / v-reveal="{ delay: 120 }"
 */
Vue.directive('reveal', {
  inserted(el, binding) {
    const delay = (binding.value && binding.value.delay) || 0
    el.classList.add('reveal')
    el.style.transitionDelay = `${delay}ms`

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
