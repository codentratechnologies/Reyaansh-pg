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
    cors: {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    },
    proxy: {
      '/api': {
        target: 'https://tinderbox-bouncing-superbowl.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['recharts', 'lucide-react', 'react-router-dom', 'axios'],
  },
})
