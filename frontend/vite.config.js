import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      "/api/authentication": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/dues": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/certificates": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/admin/analytics": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      
    }
  }
})
