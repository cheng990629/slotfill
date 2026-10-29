import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 开发时把 /api 代理到后端，避免跨域和硬编码地址；生产部署时把前端静态文件
// 和后端同域部署，或把 VITE_API_BASE 改成后端地址即可，不用改组件代码。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
