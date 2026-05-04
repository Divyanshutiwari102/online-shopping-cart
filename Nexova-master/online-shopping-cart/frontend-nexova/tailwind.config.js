/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff4ec',
          100: '#ffe3cc',
          200: '#ffc499',
          300: '#ff9a55',
          400: '#ff7520',
          500: '#ff6b00',
          600: '#e55a00',
          700: '#c24800',
          800: '#9e3b00',
          900: '#7a2e00',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease both',
        'shimmer':   'shimmer 1.5s infinite',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
      },
    },
  },
  plugins: [],
}
