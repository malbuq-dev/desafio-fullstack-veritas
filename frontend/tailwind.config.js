/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#02141b",      
        primary: "#1c2c32",     
        second: "#9a9fa1ff",     
        textPrimary: "#F9F9F9",
        textSecondary: "#A0A0A0",
        accent: "#DFBE8B",
      },
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [],
};
