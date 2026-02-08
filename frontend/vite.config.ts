import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://91.207.183.204:8081",
      "/hubs": {
        target: "http://91.207.183.204:8081",
        ws: true,
      }
    }
  }
})
