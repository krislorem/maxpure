import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    'import.meta.env.DASHSCOPE_API_KEY': JSON.stringify(process.env.DASHSCOPE_API_KEY)
  }
})
