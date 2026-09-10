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
  const versionMatch = aceContent.match(/__version__\s*=\s*['"](v[\d\.]+)['"]/)
  if (versionMatch && versionMatch[1]) {
    appVersion = versionMatch[1]
  }
} catch (e) {
  console.warn("Could not read ace.py for version extraction")
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32x32.png', 'logo.svg'],
      manifest: {
        name: 'ACE Widget',
        short_name: 'ACE',
        description: 'A Cuanto Esta - Real-time Venezuelan exchange rates widget.',
        theme_color: '#ffffff',
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
            src: 'logo-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
