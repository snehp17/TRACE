/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        archive: {
          950: '#0F0F0D',
          900: '#171714', // Official background
          850: '#1D1D19',
          800: '#23231F',
          700: '#32322C',
          600: '#48473F',
          500: '#68665B',
          400: '#8E8A7D',
          300: '#B8B3A4',
          200: '#D5D0C3',
          100: '#ECE8DD',
          50: '#F7F5EE'
        },
        paper: {
          DEFAULT: '#F4EFE6', // Official paper surface
          dark: '#EAE3D5',
          light: '#FCFAF6',
          ink: '#1D1D19',
          muted: '#635F56'
        },
        amber: {
          accent: '#D9A15C',
          light: '#F0C694',
          dark: '#AC7533',
          glow: 'rgba(217, 161, 92, 0.18)'
        },
        lavender: {
          accent: '#9B83D8',
          light: '#BEAEE8',
          dark: '#7357B8',
          glow: 'rgba(155, 131, 216, 0.18)'
        },
        sage: {
          accent: '#7CB49C',
          light: '#A3D2BD',
          dark: '#548C74',
          glow: 'rgba(124, 180, 156, 0.18)'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
        'glow-amber': '0 0 25px rgba(217, 161, 92, 0.25)',
        'glow-lavender': '0 0 25px rgba(155, 131, 216, 0.25)',
        'glow-sage': '0 0 25px rgba(124, 180, 156, 0.25)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
