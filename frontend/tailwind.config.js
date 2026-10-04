/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B263B', // Navy blue
          light: '#415A77',
          dark: '#0D1B2A',
        },
        accent: {
          DEFAULT: '#E0A96D', // Subtle gold
          light: '#F8E9A1',
        },
        background: '#F9FAFB',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
