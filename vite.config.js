import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/personalWeb/',
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    open: true,
    port: 3000
  }
}); 