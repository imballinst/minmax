const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.gray,
      white: colors.white,
      black: colors.black,
      teal: {
        50: '#E6FFFA',
        100: '#B2F5EA',
        200: '#81E6D9',
        300: '#4FD1C5',
        400: '#38B2AC',
        500: '#319795',
        600: '#2C7A7B',
        700: '#285E61',
        800: '#234E52',
        900: '#1D4044'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
