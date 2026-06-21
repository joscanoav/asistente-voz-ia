/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        speakPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.6)' },
          '50%': { boxShadow: '0 0 0 25px rgba(34, 197, 94, 0)' },
        },
      },
      animation: {
        speak: 'speakPulse 1.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};