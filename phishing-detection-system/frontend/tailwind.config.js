/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        safe: '#10b981',
        'safe-glow': '#34d399',
        phishing: '#ef4444',
        'phishing-glow': '#f87171',
        quantum: '#8b5cf6',
        cyber: '#06b6d4',
        'cyber-dark': '#0e172a',
        'cyber-panel': 'rgba(15, 23, 42, 0.85)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'risk-fill': 'risk-fill 1s ease-out forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'risk-fill': {
          '0%': { width: '0%' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(6, 182, 212, 0.02)',
        'cyber-lg': '0 0 40px rgba(6, 182, 212, 0.25)',
        'safe-glow': '0 0 20px rgba(16, 185, 129, 0.4)',
        'phishing-glow': '0 0 20px rgba(239, 68, 68, 0.4)',
      },
    },
  },
  plugins: [],
};
