import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Production-only meta headers (meta CSP cannot set frame-ancestors). */
const productionSecurityMeta = `
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
    />`

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: 'html-security-meta',
      transformIndexHtml(html) {
        if (command !== 'build') return html
        return html.replace('<head>', `<head>${productionSecurityMeta}`)
      },
    },
  ],
  // Default: localhost only. For phone/LAN testing: npm run dev:host
  server: {
    host: false,
  },
}))
