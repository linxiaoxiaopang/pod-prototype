// 跨页面跳转到首页的某个区块（首页内部使用平滑滚动）
export function goToSection(router, id) {
  const align = (smooth) => {
    const el = document.getElementById(id)
    if (!el) return false
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    return true
  }

  if (router.currentRoute.path === '/') {
    align(true)
    return
  }

  router
    .push('/')
    .then(() => {
      let attempts = 0
      const tick = () => {
        if (align(false)) {
          // 字体与懒加载块落位后校正一次位置
          setTimeout(() => align(false), 450)
          return
        }
        attempts += 1
        if (attempts < 24) setTimeout(tick, 60)
      }
      setTimeout(tick, 100)
    })
    .catch(() => {})
}
