import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// frontend/vite.config.js
export default defineConfig({
  base: '/google-maps-scraper/',
  plugins: [react()],
})