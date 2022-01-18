module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4338CA",
        secondary: "#3730A3",
        secondaryDark: "#312E81",
        secondaryLight: "#4F46E5",
        btn1: "#f59e0b",
        btn2: "#f97316",
      },
      width: {
        38: "9.5rem",
        42: "10.5rem",
        46: "11.5rem",
        76: "19rem",
        80: "20rem",
        84: "21rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
        132: "33rem",
        144: "36rem",
        152: "38rem",
        160: "40rem",
        192: "48rem",
      },
      height: {
        112: "28rem",
        120: "30rem",
        128: "32rem",
        132: "33rem",
        144: "36rem",
        152: "38rem",
        160: "40rem",
        192: "48rem",
      },
      screens: {
        xsm: "480px",
        // => @media (min-width: 540px) { ... }
      },
    },
  },
  plugins: [],
};
