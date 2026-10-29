import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'
import { visualSearchPlugin } from '../api/vitePlugin.js'

export default defineConfig({
  base: './',
  // 开发环境把 /api/visual-search 挂到 Vite 中间件，免去单独启动 apps/api
  plugins: [vue(), visualSearchPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    // 依赖提升到仓库根目录的 node_modules，需放行上级目录（如 Element UI 图标字体）
    fs: {
      allow: [path.resolve(__dirname, '../..')]
    }
  },
  build: {
    outDir: 'dist'
  }
})
