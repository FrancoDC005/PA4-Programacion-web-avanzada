import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuración de Vite para desarrollo y build de producción
// (minificación con esbuild, code splitting y cache busting con hash).
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 700
  },
  server: {
    port: 5173
  }
})
