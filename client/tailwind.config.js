/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#070A11',
          900: '#0B0F17',
          850: '#111724',
          800: '#172033',
          700: '#23304B',
          600: '#32456B',
          500: '#476396',
        },
        cyan: {
          400: '#38BDF8',
          500: '#06B6D4',
          accent: '#00F2FE',
        },
        emerald: {
          accent: '#10B981',
        },
        amber: {
          accent: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
