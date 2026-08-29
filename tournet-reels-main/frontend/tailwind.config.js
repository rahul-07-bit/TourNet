/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dusk: {
          950: '#080B10',
          900: '#0D1119',
          800: '#141A24',
          700: '#1D2530',
          600: '#2A3441'
        },
        trail: {
          DEFAULT: '#FF7A45',
          light: '#FF9666',
          dark: '#E8611F'
        },
        horizon: {
          DEFAULT: '#34D8C4',
          dark: '#1FA895'
        },
        sand: {
          DEFAULT: '#F5F1EA',
          muted: '#9AA3B2'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 122, 69, 0.25)'
      }
    }
  },
  plugins: []
};
