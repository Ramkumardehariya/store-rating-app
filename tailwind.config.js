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
          50:  '#f5faff',
          100: '#e0f2ff',
          200: '#b9e6ff',
          300: '#7cd4ff',
          400: '#36bffa',
          500: '#0ba5e9',
          600: '#0086c9', // ✅ bg-primary-600 works now
          700: '#026aa2',
          800: '#065986',
          900: '#0b4a6f',
        },
      },
    },
  },
  plugins: [],
};
