import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; 
export default defineConfig({
  base: '/inventory/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),  
      '@assets': path.resolve(__dirname, './src/assets'),  
    },
  },
});