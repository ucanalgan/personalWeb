/** @type {import('tailwindcss').Config} */
export default {
  content: [
    '../index.html',
    '../js/**/*.{js,ts,jsx,tsx}',
    '../components/**/*.{html,js,ts,jsx,tsx}',
    '../styles/**/*.css',
    '../*.{js,html}',
    '../utils/**/*.js'
  ],
  darkMode: 'class', // Koyu tema desteği eklemek için (class bazlı)
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary, #64ffda)',
        secondary: 'var(--secondary, #0a192f)',
        dark: 'var(--dark, #0a192f)',
        light: 'var(--light, #f8f9fa)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)', 
        'bg-accent': 'var(--bg-accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-accent': 'var(--text-accent)',
        'border-color': 'var(--border-color)',
        'primary-rgb': 'var(--primary-rgb, 100 255 218)',
        'bg-secondary-rgb': 'var(--bg-secondary-rgb, 17 34 64)',
        'gradient-start': 'var(--gradient-start, #64ffda)',
        'gradient-end': 'var(--gradient-end, #0a192f)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(100, 255, 218, 0.3)',
        'glow-lg': '0 0 40px rgba(100, 255, 218, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slideInDown': 'slideInDown 0.5s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'fadeOut': 'fadeOut 0.3s ease-in-out',
        'slideInUp': 'slideInUp 0.5s ease-out',
        'slideInLeft': 'slideInLeft 0.5s ease-out',
        'slideInRight': 'slideInRight 0.5s ease-out'
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInDown: {
          '0%': { 
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
                 fadeIn: {
           '0%': { opacity: '0' },
           '100%': { opacity: '1' }
         },
         fadeOut: {
           '0%': { opacity: '1' },
           '100%': { opacity: '0' }
         },
         slideInUp: {
           '0%': { 
             transform: 'translateY(100%)',
             opacity: '0'
           },
           '100%': { 
             transform: 'translateY(0)',
             opacity: '1'
           }
         },
         slideInLeft: {
           '0%': { 
             transform: 'translateX(-100%)',
             opacity: '0'
           },
           '100%': { 
             transform: 'translateX(0)',
             opacity: '1'
           }
         },
         slideInRight: {
           '0%': { 
             transform: 'translateX(100%)',
             opacity: '0'
           },
           '100%': { 
             transform: 'translateX(0)',
             opacity: '1'
           }
         }
       },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: [
    // CSS değişkenleri için opacity modifier desteği
    function({ addUtilities, theme, addComponents }) {
      addUtilities({
        '.bg-primary-10': {
          backgroundColor: 'rgb(var(--primary-rgb) / 0.1)',
        },
        '.bg-primary-20': {
          backgroundColor: 'rgb(var(--primary-rgb) / 0.2)',
        },
        '.bg-secondary-30': {
          backgroundColor: 'rgb(var(--bg-secondary-rgb) / 0.3)',
        },
        '.hover\\:bg-secondary-30:hover': {
          backgroundColor: 'rgb(var(--bg-secondary-rgb) / 0.3)',
        }
      });
      
      addComponents({
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      });
    }
  ],
} 
