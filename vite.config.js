import { defineConfig } from 'vite';
import { resolve } from 'path';
import critical from 'rollup-plugin-critical';

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
      },
      plugins: [
        critical({
          inline: true,
          base: 'dist/',
          css: ['dist/style.css'],
          dimensions: [
            { width: 375, height: 565 },
            { width: 1440, height: 900 }
          ]
        })
      ]
    }
  },
  server: {
    open: true,
    port: 3000
  }
}); 
