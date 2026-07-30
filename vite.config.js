import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ _command, mode }) => {
  const isProduction = mode === 'production';

  return {
    // React plugin (Fast Refresh is enabled automatically in development)
    plugins: [react()],

    // Base path for GitHub Pages (only in production)
    base: isProduction ? '/personalWeb/' : '/',

    // Root directory
    root: '.',

    // Simplified build configuration for React compatibility
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: true, // Oxc, Vite 8's default minifier
      cssMinify: true,
      // Standard target for better compatibility
      target: 'es2020',
      rollupOptions: {
        output: {
          // Simple asset naming
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
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
      cors: true,
      // Enable HTTP/2 for dev server
      https: false,
      // Optimize HMR
      hmr: {
        overlay: false
      }
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
      open: true,
      // Enable compression in preview
      headers: {
        'Cache-Control': 'public, max-age=31536000'
      }
    },

    // CSS configuration with optimization
    css: {
      preprocessorOptions: {
        css: {
          charset: false
        }
      },
      // Enable CSS code splitting
      codeSplit: true,
      // PostCSS optimization will be handled by postcss.config.js
      postcss: './postcss.config.js'
    },

    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime'
      ],
      // Force optimization of certain packages
      force: true
    },

    // Define globals for production
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __DEV__: !isProduction,
      __PROD__: isProduction
    },


    // Worker configuration
    worker: {
      format: 'es'
    }
  };
});
