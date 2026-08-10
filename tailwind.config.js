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
        // Colours resolve through bare RGB channels (--rgb-*) defined in the
        // Cobalt palette layer, so Tailwind's opacity modifiers work:
        // `bg-background/85`, `border-border/50` and friends. Declaring them
        // as plain var(--x) colours silently dropped those classes, which is
        // how the header ended up with a default grey border.
        primary: {
          DEFAULT: 'rgb(var(--rgb-primary) / <alpha-value>)',
          dark: 'rgb(var(--rgb-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--rgb-accent) / <alpha-value>)'
        },

        background: 'rgb(var(--rgb-bg-primary) / <alpha-value>)',
        accent: 'rgb(var(--rgb-accent) / <alpha-value>)',

        // Status colours, kept separate from the accent so state never reads
        // as branding. Components referenced these before they existed, which
        // left the online dot and the error panel unstyled.
        success: {
          400: 'rgb(var(--rgb-success) / <alpha-value>)',
          500: 'rgb(var(--rgb-success) / <alpha-value>)'
        },
        error: {
          300: 'rgb(var(--rgb-error) / <alpha-value>)',
          400: 'rgb(var(--rgb-error) / <alpha-value>)',
          500: 'rgb(var(--rgb-error) / <alpha-value>)'
        },

        surface: {
          DEFAULT: 'rgb(var(--rgb-bg-secondary) / <alpha-value>)',
          secondary: 'rgb(var(--rgb-bg-tertiary) / <alpha-value>)',
          hover: 'rgb(var(--rgb-bg-card) / <alpha-value>)'
        },

        text: {
          primary: 'rgb(var(--rgb-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--rgb-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--rgb-text-muted) / <alpha-value>)'
        },

        border: {
          DEFAULT: 'rgb(var(--rgb-border) / <alpha-value>)',
          hover: 'rgb(var(--rgb-border-light) / <alpha-value>)'
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

      // Tailwind's stock delay scale stops at 700ms; components reference
      // these longer staggers.
      transitionDelay: {
        '900': '900ms',
        '2000': '2000ms'
      },
      animationDelay: {
        '900': '900ms',
        '2000': '2000ms'
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
