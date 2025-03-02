import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'draw-check': {
          '0%': { 'stroke-dashoffset': '100' },
          '100%': { 'stroke-dashoffset': '0', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'scale-up': 'scale-up 0.5s ease-out',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'draw-check': 'draw-check 0.8s ease-out forwards',
      },
      colors: {
        primary: '#1f8844',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
