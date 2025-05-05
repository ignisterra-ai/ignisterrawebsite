/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse-slow 8s infinite ease-in-out',
        'float-slow': 'float-slow 12s infinite ease-in-out',
        'wave': 'wave 2.5s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: '0.9' },
        },
        'float-slow': {
          '0%': { transform: 'translate(-50%, -50%) translateY(0)' },
          '50%': { transform: 'translate(-50%, -50%) translateY(-20px)' },
          '100%': { transform: 'translate(-50%, -50%) translateY(0)' },
        },
        'wave': {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        'primary-red': '#8B0000',
        'primary-blue': '#002366',
        'accent-orange': '#FF8C00',
        'accent-gold': '#FFD700',
      },
      scale: {
        '120': '1.2',
      },
    },
  },
  plugins: [],
}