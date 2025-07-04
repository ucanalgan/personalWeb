import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // React specific configuration
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        IntersectionObserver: 'readonly',
        PerformanceObserver: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        self: 'readonly',
        caches: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        performance: 'readonly',
        gtag: 'readonly',
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
        __dirname: 'readonly',
        trackEvent: 'readonly'
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx']
        }
      }
    },
    rules: {
      // React Rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'warn',
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'warn',
      'react/jsx-wrap-multilines': ['warn', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line'
      }],

      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility Rules
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'warn',

      // Import Rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-duplicates': 'warn',
      'import/order': ['warn', {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'never'
      }],

      // General JavaScript Rules
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],
      'comma-dangle': ['warn', 'never'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'semi': ['warn', 'always'],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'max-len': ['warn', {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }],
      'eol-last': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],

      // Performance and Best Practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-void': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'warn'
    }
  },

  // Specific configuration for certain files
  {
    files: ['**/*.config.{js,jsx}', '**/vite.config.{js,jsx}'],
    rules: {
      'no-console': 'off'
    }
  },

  // Configuration for test files (when added)
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    rules: {
      'no-console': 'off',
      'max-len': 'off'
    }
  },

  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.git/**',
      'public/**',
      '*.min.js',
      'coverage/**'
    ]
  }
];
