import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Ki%C5%9Fisel_web/' : '/',
  root: '../',
  build: {
    target: 'es2022',
    minify: 'terser',
    terserOptions: { 
      compress: { 
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn', 'console.info']
      } 
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL('../', import.meta.url)), 'index.html')
      },
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    open: true,
    port: 3000,
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});
