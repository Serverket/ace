/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'ace-bcv': '#0038a8',
        'ace-paralelo': '#059669',
        'ace-binance': '#d97706',
        'ace-euro': '#4338ca',
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#0c8fe9',
          600: '#0171c7',
          700: '#015aa2',
          800: '#054d86',
          900: '#0a406f',
          950: '#07294a',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 30px -5px rgba(2, 132, 199, 0.3)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.3)',
        'subtle-card': '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        'glass-card': '0 20px 40px -15px rgba(15, 23, 42, 0.07), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
      },
      animation: {
        'obfuscate': 'obfuscate 1.5s infinite alternate',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        obfuscate: {
          '0%': { filter: 'blur(4px)', opacity: '0.6' },
          '100%': { filter: 'blur(2px)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
