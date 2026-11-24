import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Gör spelet nåbart från iPhonen på samma wifi (http://<datorns-ip>:5173)
    host: true,
    port: 5173,
  },
})
