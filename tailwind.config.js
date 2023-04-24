/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#EEFBF6",
          300: "#AEECD3",
          500: "#138F71",
          700: "#0E5747",
        },
      },
      fontFamily: {
        noto: ["Noto Sans Thai", "sans-serif"],
      },
      backgroundImage: {
        header: "url('../../public/assets/header-bg.png')",
      },
    },
  },
  plugins: [],
};
