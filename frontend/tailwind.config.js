/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        midnight: {
          50:  '#f0f1ff',
          100: '#e4e5ff',
          200: '#cdcfff',
          300: '#a9acff',
          400: '#7c7fff',
          500: '#5850ff',
          600: '#432bf7',
          700: '#361ae3',
          800: '#2d17be',
          900: '#0B0F19',
          950: '#07090f',
        },
        navy: {
          DEFAULT: '#111827',
          light:   '#1a2540',
          deep:    '#0a1020',
        },
        purple: {
          rpg: '#1E1B4B',
          light: '#C084FC',
          muted: '#7C3AED',
          glow:  '#8B5CF6',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dark:    '#D97706',
          glow:    '#FDE68A',
        },
        starlight: {
          DEFAULT: '#E2E8F0',
          dim:     '#94A3B8',
          bright:  '#F8FAFC',
        },
        lavender: {
          DEFAULT: '#C084FC',
          muted:   '#A78BFA',
          dark:    '#7C3AED',
        },
      },
      backgroundImage: {
        'starlight-gradient': 'linear-gradient(135deg, #0B0F19 0%, #111827 40%, #1E1B4B 100%)',
        'gold-gradient':      'linear-gradient(135deg, #F59E0B, #D97706)',
        'purple-gradient':    'linear-gradient(135deg, #7C3AED, #4F46E5)',
        'card-gradient':      'linear-gradient(135deg, rgba(30,27,75,0.8), rgba(17,24,39,0.9))',
        'hero-gradient':      'radial-gradient(ellipse at top, #1E1B4B 0%, #0B0F19 60%)',
      },
      boxShadow: {
        'gold-glow':    '0 0 20px rgba(245,158,11,0.4)',
        'purple-glow':  '0 0 20px rgba(139,92,246,0.4)',
        'starlight':    '0 0 40px rgba(192,132,252,0.2)',
        'card':         '0 4px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        'float':        'float 3s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'star-twinkle': 'starTwinkle 4s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(139,92,246,0.3)' },
          '50%':      { boxShadow: '0 0 30px rgba(139,92,246,0.7)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%':      { opacity: 1 },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
