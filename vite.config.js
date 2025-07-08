import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ _command, mode }) => {
  const isProduction = mode === 'production';

  return {
    // React plugin with optimized config
    plugins: [
      react({
        // Enable React Fast Refresh
        fastRefresh: !isProduction
      })
    ].filter(Boolean),

    // Base path for GitHub Pages (only in production)
    base: isProduction ? '/personalWeb/' : '/',

    // Root directory
    root: '.',

    // Simplified build configuration for React compatibility
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild', // Use esbuild instead of terser
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

    // ESBuild configuration for faster builds
    esbuild: {
      // Drop console logs in production
      drop: isProduction ? ['console', 'debugger'] : [],
      // Enable tree shaking for unused imports
      treeShaking: true,
      // Target modern syntax
      target: 'es2020'
    },

    // Worker configuration
    worker: {
      format: 'es'
    }
  };
});
