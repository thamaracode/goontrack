/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        goon: {
          bg: '#100B1F',
          surface: '#1A1230',
          surfaceLight: '#261B45',
          surfaceBorder: '#37265F',
          purple: '#8B5CF6',
          purpleLight: '#A78BFA',
          pink: '#F472B6',
          coral: '#FB7185',
          yellow: '#FACC15',
          cyan: '#22D3EE',
          green: '#34D399',
          text: '#F8FAFC',
          muted: '#A1A1AA',
          darkMuted: '#6B7280',
        },
      },
      boxShadow: {
        'chunky-purple': '0px 4px 0px 0px #6D28D9',
        'chunky-pink': '0px 4px 0px 0px #BE185D',
        'chunky-yellow': '0px 4px 0px 0px #B45309',
        'chunky-green': '0px 4px 0px 0px #059669',
        'chunky-cyan': '0px 4px 0px 0px #0E7490',
        'chunky-dark': '0px 4px 0px 0px #0A0614',
        'card-glow': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'float-mascot': 'floatMascot 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatMascot: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(244, 114, 182, 0.8))' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
};
