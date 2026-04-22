import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/Pilvipalvelut_web-kehityksess-/', 
  plugins: [react()],
})