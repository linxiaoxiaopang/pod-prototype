<template>
  <div id="app">
    <AppHeader />
    <main class="site-main">
      <router-view />
    </main>
    <AppFooter />
    <el-backtop :right="26" :bottom="26" />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter }
}
</script>

<style lang="scss">
@use './styles/variables' as *;

.site-main {
  display: block;
  min-height: 60vh;
}
</style>
