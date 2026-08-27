import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Frontend-only CORS workaround for local development.
// Browser calls /api/... on the Vite origin; Vite forwards them to Spring Boot.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
