import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://constrain-skyline-cubical.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['recharts', 'lucide-react', 'react-router-dom', 'axios'],
  },
})
