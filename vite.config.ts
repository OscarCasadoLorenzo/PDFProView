import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/PDFProView/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@icons': path.resolve(__dirname, './src/icons')
    }
  },
  plugins: [react()]
})
