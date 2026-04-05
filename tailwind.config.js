/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D85A30',
          dark:    '#B84820',
          light:   '#FDF1EC',
        },
        gray: {
          50:  '#F9F9F9',
          100: '#F4F4F4',
          200: '#E8E8E8',
          400: '#9A9A9A',
          600: '#6B6B6B',
          800: '#1F1F1F',
          900: '#111111',
        },
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      maxWidth: {
        container: '75rem',
      },
      borderRadius: {
        sm:   '0.5rem',
        md:   '0.75rem',
        lg:   '1rem',
        xl:   '1.5rem',
        '2xl':'2rem',
      },
    },
  },
  plugins: [],
}
