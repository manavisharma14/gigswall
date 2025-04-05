module.exports = {
  darkMode: 'class', // <-- very important
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out both',
        'bounce-short': 'bounceShort 0.6s ease',
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'translateY(-10%)', opacity: 0 },
          '50%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],


}
