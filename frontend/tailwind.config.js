/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ro: {
          bg: '#0a0e17',
          surface: '#111827',
          card: '#161f30',
          'card-hover': '#1d2a42',
          border: '#24324a',
          'border-light': '#334769',
          gold: {
            DEFAULT: '#f59e0b',
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f'
          },
          crystal: {
            DEFAULT: '#38bdf8',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7'
          },
          text: {
            primary: '#f3f4f6',
            secondary: '#9ca3af',
            muted: '#6b7280'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        display: ['Cinzel', 'Outfit', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'crystal-glow': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'card-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'rune-pattern': 'radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 0)',
      }
    },
  },
  plugins: [],
}
