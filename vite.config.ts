import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'https://insightiabackend-production.up.railway.app',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://insightiabackend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
