import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    // React plugin with optimized config
    plugins: [
      react({
        // Enable React Fast Refresh
        fastRefresh: !isProduction
      }),
      // Bundle analyzer (only in build)
      isProduction && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ].filter(Boolean),
    
    // Base path for GitHub Pages (only in production)
    base: isProduction ? '/Kişisel_web/' : '/',
    
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
        input: {
          main: resolve(__dirname, 'index.html')
        },
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
      // Terser options for aggressive minification
      terserOptions: {
        compress: {
          arguments: true,
          booleans_as_integers: true,
          drop_console: true,
          drop_debugger: true,
          passes: 2,
          pure_funcs: ['console.log', 'console.info'],
          pure_getters: true,
          unsafe: true,
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_Function: true,
          unsafe_math: true,
          unsafe_symbols: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true
        },
        mangle: {
          properties: {
            regex: /^_/
          }
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
      exclude: [
        // Exclude large libraries that should be loaded separately
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