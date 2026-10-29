import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174,
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
