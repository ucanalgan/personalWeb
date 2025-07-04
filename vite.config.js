import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // React plugin
  plugins: [react()],
  
  // Base path for GitHub Pages
  base: '/Kişisel_web/',
  
  // Root directory
  root: '.',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: [
            './src/utils/theme.js',
            './src/utils/animations.js',
            './src/utils/analytics.js'
          ]
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          if (/\.(js|mjs)$/.test(assetInfo.name)) {
            return `assets/js/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    open: true
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },

  // Optimizations
  optimizeDeps: {
    include: ['react', 'react-dom']
  },

  // Define globals for production
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
}); 