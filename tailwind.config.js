/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: { 950: '#0B0F17', 900: '#0F1420', 800: '#161B2A', 700: '#1E2436', 600: '#2A3144' },
        neon: { purple: '#8B5CF6', cyan: '#06B6D4', pink: '#EC4899' },
        gold: { 400: '#F59E0B', 500: '#D97706', 600: '#B45309' },
        success: { 400: '#22C55E', 500: '#16A34A' },
        warning: { 400: '#FACC15', 500: '#EAB308' },
        error: { 400: '#F87171', 500: '#EF4444' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.35), 0 0 40px rgba(6,182,212,0.15)' }, '50%': { boxShadow: '0 0 35px rgba(139,92,246,0.6), 0 0 70px rgba(6,182,212,0.3)' } },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
      },
    },
  },
  plugins: [],
};
