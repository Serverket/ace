import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// Extracción dinámica de la versión del script principal para los releases
const aceScriptPath = path.resolve(import.meta.dirname, '../ace.py')
let appVersion = 'v1.1.0'
try {
  const aceContent = fs.readFileSync(aceScriptPath, 'utf-8')
  const versionMatch = aceContent.match(/__version__\s*=\s*['"](v[\d.]+)['"]/)
  if (versionMatch && versionMatch[1]) {
    appVersion = versionMatch[1]
  }
} catch {
  console.warn("Could not read ace.py for version extraction")
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon-32x32.png', 'logo.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/(ve\.dolarapi\.com|api\.yadio\.io)\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rates-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpe?g|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      manifest: {
        id: '/',
        name: 'ACE Cambio',
        short_name: 'ACE Cambio',
        description: 'A Cuánto Está — tasas de cambio venezolanas en tiempo real.',
        lang: 'es',
        dir: 'ltr',
        categories: ['finance', 'utilities'],
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'logo-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
