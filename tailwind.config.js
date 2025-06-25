/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'vietnamese': ['Inter', 'system-ui', 'sans-serif'],
        },
        animation: {
          'bounce-slow': 'bounce 2s infinite',
          'pulse-slow': 'pulse 3s infinite',
        }
      },
    },
    plugins: [],
  }