import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@gifs': path.resolve(__dirname, '../firmware/src/resouces/animaciones/gif'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.gif'],
})