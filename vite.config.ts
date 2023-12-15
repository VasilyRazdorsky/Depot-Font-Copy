import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true, // Set to true to exit if port is already in use, instead of automatically trying the next available port.
    port: 44563,
  },
})
