/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.65rem', { lineHeight: '1.2' }],
        'sm': ['0.75rem', { lineHeight: '1.3' }],
        'base': ['0.875rem', { lineHeight: '1.4' }],
        'lg': ['1rem', { lineHeight: '1.4' }],
        'xl': ['1.125rem', { lineHeight: '1.4' }],
        '2xl': ['1.25rem', { lineHeight: '1.3' }],
        '3xl': ['1.5rem', { lineHeight: '1.2' }],
        '4xl': ['1.875rem', { lineHeight: '1.1' }],
      },
      colors: {
        // BimalInstitute Neon Green Theme
        primary: {
          DEFAULT: '#74b723',
          dark: '#74970a',
          hover: '#c9ff33',
          light: 'rgba(189, 255, 0, 0.2)',
        },
        secondary: '#66ca34',
        accent: '#FFFFFF',
        success: '#00C853',
        warning: '#FFC107',
        danger: '#FF5252',
        // Deep Dark Backgrounds
        dark: {
          bg: '#050505',
          darker: '#000000',
          card: 'rgba(15, 15, 15, 0.8)',
          border: '#1f1f1f',
          borderLight: 'rgba(255, 255, 255, 0.05)',
          surface: '#1a1a1a',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B5B5B5',
          muted: '#60646C',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glass-primary': 'linear-gradient(135deg, rgba(116, 183, 35, 0.1) 0%, rgba(116, 183, 35, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(116, 183, 35, 0.3)',
        'glow-sm': '0 0 10px rgba(116, 183, 35, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-sm': '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },

    },
  },
  plugins: [],
}
