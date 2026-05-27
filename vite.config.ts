import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '家庭厨房',
        short_name: '厨房',
        theme_color: '#f97316',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})
