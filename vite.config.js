import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // 使用相对路径，确保构建产物在 file://（Electron EXE）或任意子路径部署下均可正常加载
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173,
    open: true
  },
  build: {
    // Electron 打包需要产物目录为 dist，Vite 默认已是 dist
    outDir: 'dist',
    emptyOutDir: true
  }
})
