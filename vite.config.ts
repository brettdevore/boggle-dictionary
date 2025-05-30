import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Prevent search engine crawling and indexing
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
      // Additional security headers
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    }
  }
})
