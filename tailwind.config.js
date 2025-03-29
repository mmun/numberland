/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Neue"', "cursive"],
      },
      colors: {
        primary: "#7b68ee",
        secondary: "#4caf50",
        background: "#f9f4ff",
        text: "#213547",
      },
      fontSize: {
        "4xl": "2.5rem",
        "5xl": "3rem",
        "6xl": "3.5rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
      },
      boxShadow: {
        equation: "0 16px 50px rgba(0, 0, 0, 0.1)",
        button: "0 8px 16px rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px)" },
          "40%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-10px)" },
          "80%": { transform: "translateX(10px)" },
        },
        fall: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        levelUp: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)", color: "#4caf50" },
        },
        levelDown: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)", color: "#ff9800" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        fall: "fall 2s forwards",
        "level-up": "levelUp 1s ease",
        "level-down": "levelDown 1s ease",
      },
    },
  },
  plugins: [],
};
