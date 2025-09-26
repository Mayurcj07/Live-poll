import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Remove proxy since we're serving from same origin
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure assets are properly referenced
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-redux', 'redux'],
          socket: ['socket.io-client']
        }
      }
    }
  },
  // Base path for production - empty for relative paths
  base: './'
})