/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
    './src/components/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary accent — driven by the Cobalt palette layer so light and
        // dark themes can re-weight the same hue.
        primary: {
          DEFAULT: 'var(--brand-primary-500)',
          dark: 'var(--brand-primary-600)',
          light: 'var(--brand-primary-400)'
        },

        // Surface colors using semantic naming
        surface: {
          DEFAULT: 'var(--bg-secondary)',
          secondary: 'var(--bg-tertiary)',
          hover: 'var(--bg-card)'
        },

        // Text colors
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)'
        },

        // Border colors
        border: {
          DEFAULT: 'var(--border-color)',
          hover: 'var(--border-light)'
        }
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'typing': 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        },
        'blink-caret': {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'var(--brand-primary-500)' }
        }
      },

      backdropBlur: {
        xs: '2px'
      },

      boxShadow: {
        'glow': '0 0 20px rgba(76, 141, 255, 0.28)',
        'glow-lg': '0 0 40px rgba(76, 141, 255, 0.36)'
      }
    }
  },
  plugins: [],
  // Enable JIT mode for better performance
  mode: 'jit',
  // Safelist critical utility classes
  safelist: [
    'fade-in-up',
    'fade-in-left',
    'fade-in-right',
    'scale-in',
    'revealed',
    'reveal-pending',
    'component-loaded',
    'animate-in',
    'animate-fadeInUp',
    'animate-fadeInLeft',
    'animate-fadeInRight',
    'animate-scaleIn'
  ]
};
