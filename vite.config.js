import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Calculadora de Objetivo Mensual',
        short_name: 'Objetivo Mensual',
        description: 'Gestiona tus ingresos y objetivos mensuales de forma simple y efectiva',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/CalculadoraObjetivoMensual/',
        start_url: '/CalculadoraObjetivoMensual/',
        icons: [
          {
            src: 'https://i.postimg.cc/Pvd8HHty/Gemini-Generated-Image-5pusps5pusps5pus-(2).png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://i.postimg.cc/Pvd8HHty/Gemini-Generated-Image-5pusps5pusps5pus-(2).png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/i\.postimg\.cc\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/CalculadoraObjetivoMensual/',
})
