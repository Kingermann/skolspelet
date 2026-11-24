import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Content Security Policy: sidan får bara ladda kod, stil, typsnitt, bilder och data
 * från sin egen adress. Läggs bara in i den färdiga versionen (npm run build) –
 * utvecklingsservern behöver lösare regler för att kunna ladda om sidan direkt.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  // Små typsnittsfiler bakas in i koden som data: av Vite.
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY }, injectTo: 'head-prepend' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentSecurityPolicy()],
  server: {
    // Bara den här datorn kommer åt utvecklingsservern. För att testa på telefonen
    // hemma: `npm run dev:lan` (lyssnar då på hela nätverket – använd inte på
    // offentliga eller okända nätverk).
    port: 5173,
  },
})
