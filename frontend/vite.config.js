import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://pixiestylistteambackend.onrender.com'
    ),
    'process.env.VITE_API_KEY': JSON.stringify(
      process.env.VITE_API_KEY || 'mock-api-key'
    ),
  },
})
