const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5faff',
          100: '#e0f2ff',
          200: '#b3e0ff',
          300: '#80ccff',
          400: '#4db8ff',
          500: '#1aa3ff',
          600: '#008ae6',
          700: '#006bb3',
          800: '#004d80',
          900: '#002e4d',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
