import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/personalWeb/',
  root: './',
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: { compress: { drop_console: true } },
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
