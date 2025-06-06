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
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  server: {
    host: true,
    port: 5173,
  },
  test: {
    globals: true,  
    environment: 'jsdom', 
    setupFiles: ['./src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: './coverage'
    }
  },
  build: {
    target: 'esnext',
  }
});
