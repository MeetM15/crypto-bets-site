module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6d28d9",
        secondary: "#4c1d95",
        secondaryDark: "#5b21b6",
        secondaryLight: "#8b5cf6",
        btn1: "#f59e0b",
        btn2: "#f97316",
      },
      width: {
        128: "32rem",
        132: "33rem",
        144: "36rem",
        152: "38rem",
        160: "40rem",
        192: "48rem",
      },
    },
  },
  plugins: [],
};
