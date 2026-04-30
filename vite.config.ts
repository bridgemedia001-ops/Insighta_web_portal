import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      writeBundle() {
        const redirectsPath = path.resolve(__dirname, 'public/_redirects')
        if (existsSync(redirectsPath)) {
          const distPath = path.resolve(__dirname, 'dist')
          if (!existsSync(distPath)) {
            mkdirSync(distPath, { recursive: true })
          }
          copyFileSync(redirectsPath, path.join(distPath, '_redirects'))
        }
      }
    }
  ],
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
