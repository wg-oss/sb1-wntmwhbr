import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  base: process.env.NODE_ENV === 'production' ? '/sb1-wntmwhbr/' : '/',
  resolve: {
    alias: {
      '@': 'src'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
