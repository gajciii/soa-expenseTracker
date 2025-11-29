export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6E7E85',
          dark: '#1C0F13',
          light: '#B7CECE',
        },
        palette: {
          dark: '#1C0F13',
          'blue-grey': '#6E7E85',
          mint: '#B7CECE',
          lavender: '#BBBAC6',
          light: '#E2E2E2',
        },
        success: '#6E7E85',
        warning: '#BBBAC6',
        error: '#1C0F13',
        info: '#6E7E85',
      },
      backgroundColor: {
        'primary': '#E2E2E2',
        'secondary': '#B7CECE',
        'dark': '#1C0F13',
        'card': '#B7CECE',
      },
    },
  },
  plugins: [],
}

