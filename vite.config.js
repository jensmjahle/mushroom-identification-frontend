import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': '/src', // This tells Vite that "@" should resolve to the "src" folder
    },
  },
});
