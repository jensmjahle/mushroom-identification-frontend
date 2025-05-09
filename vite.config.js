import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
      process: 'process/browser',
      buffer: 'buffer',
    },
  },
  define: {
    global: 'globalThis',
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080'),
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  server: {
    host: true,
    port: 5173,
  },
});
