import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Pilvipalvelut_web-kehityksess-/matrix-way/', 
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
})