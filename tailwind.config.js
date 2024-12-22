/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    screens: {
      sm: '340px',
      md: '540px',
      lg: '768px',
      xl: '1180px'
    },
    extend: {},
    fontFamily: {
      Babes: ["Bebas Neue", "serif"]
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px',
        md: '32px'
      }
    }
  },
  plugins: [],
}