/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'white',
            a: {
              color: '#818cf8',
              '&:hover': {
                color: '#6366f1',
              },
            },
            strong: {
              color: 'white',
            },
            code: {
              color: 'white',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}