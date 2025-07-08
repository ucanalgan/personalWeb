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

    // Build configuration with aggressive optimization
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      cssMinify: true,
      // Target modern browsers for smaller bundles
      target: ['es2020', 'chrome91', 'firefox89', 'safari15'],
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          // Optimized asset naming
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
            if (/\.(woff2|woff|ttf|eot)$/.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            return `assets/misc/[name]-[hash].${ext}`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        },
        // Tree shaking configuration
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
        }
      },
      // Terser options with safe React-compatible settings
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 1,
          pure_funcs: ['console.log', 'console.info'],
          // Remove unsafe optimizations that break React
          unsafe: false,
          unsafe_arrows: false,
          unsafe_comps: false,
          unsafe_Function: false,
          unsafe_math: false,
          unsafe_symbols: false,
          unsafe_methods: false,
          unsafe_proto: false,
          unsafe_regexp: false,
          unsafe_undefined: false,
          pure_getters: false
        },
        mangle: {
          // Don't mangle properties to avoid breaking React
          properties: false
        },
        format: {
          comments: false
        }
      },
      // Chunk size warning limit
      chunkSizeWarningLimit: 600
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
