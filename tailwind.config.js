/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oxford-blue': '#002147',
        'teal': '#008080',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #002147 0%, #008080 50%, #ffffff 100%)',
        'gradient-secondary': 'linear-gradient(45deg, #008080 0%, #002147 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

