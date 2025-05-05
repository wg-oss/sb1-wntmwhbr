import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sb1-wntmwhbr/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
