module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          5: "#F4FBF9",
          10: "#E9F7F4",
          20: "#D3EFE9",
          60: "#7CCEBC",
          80: "#50BEA5",
          100: "#24AE8F",
        },
        secondary: "#ffffff",
        secondaryDark: "#312E81",
        secondaryLight: "#4F46E5",
        btn1: "#f59e0b",
        btn2: "#f97316",
        border: "#D3EFE9",
        inputbg: "#F3F3F3",
        formtext: "#A3A3A3",
        btntext: "#757575",
        earnlogo: "#83BF6E",
        viplogo: "#FFD700",
        lvllogo: "#b9f2ff",
        logoutlogo: "#FF6A55",
        logoutBtn: "#FFE6E2",
        logoutBtnText: "#FF472D",
      },
      width: {
        38: "9.5rem",
        42: "10.5rem",
        46: "11.5rem",
        60: "15rem",
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
        200: "50rem",
        208: "52rem",
        216: "54rem",
        256: "64rem",
      },
      height: {
        28: "7rem",
        38: "9.5rem",
        42: "10.5rem",
        46: "11.5rem",
        76: "19rem",
        80: "20rem",
        84: "21rem",
        88: "22rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
        132: "33rem",
        144: "36rem",
        152: "38rem",
        160: "40rem",
        192: "48rem",
        200: "50rem",
        208: "52rem",
        216: "54rem",
        256: "64rem",
      },
      screens: {
        xsm: "480px",
        // => @media (min-width: 540px) { ... }
      },
      fontSize: {
        xxxs: "0.5rem",
        xxs: "0.65rem",
      },
    },
  },
  plugins: [],
};
