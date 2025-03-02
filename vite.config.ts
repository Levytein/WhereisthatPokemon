import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/WhereisthatPokemon/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:6543',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
