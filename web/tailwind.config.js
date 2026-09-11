/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'ace-bcv': '#0038a8',
        'ace-paralelo': '#059669',
        'ace-binance': '#d97706',
        'ace-euro': '#4338ca',
        'brutal-yellow': '#fff000',
        'brutal-red': '#ff003c',
        'brutal-blue': '#003cff',
        'brutal-green': '#00ff3c',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      animation: {
        'obfuscate': 'obfuscate 1.5s infinite alternate',
      },
      keyframes: {
        obfuscate: {
          '0%': { filter: 'blur(4px)', opacity: '0.6' },
          '100%': { filter: 'blur(2px)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
