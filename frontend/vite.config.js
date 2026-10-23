import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Crear dirname compatible con ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // El frontend llama al backend con rutas relativas (/api/..., /uploads/...)
  // y Vite se las pasa al backend (puerto 5000). Así la página funciona
  // igual desde el computador (localhost) que desde un celular en la misma
  // red Wi-Fi (http://IP-del-computador:5173), por ejemplo para aceptar la
  // firma de un préstamo desde el enlace del correo.
  server: {
    host: true, // acepta conexiones desde la red, no solo desde este equipo
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
  preview: {
    host: true,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Cuando veas @, interprétalo como /scr
    }
  }
})
