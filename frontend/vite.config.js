import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/ask': 'http://localhost:4000',
      '/transactions': 'http://localhost:4000',
      '/summary': 'http://localhost:4000',
    }
  }
})
