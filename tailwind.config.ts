import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#181411",
        ember: "#D94D1A",
        chilli: "#A9271C",
        saffron: "#F6A12A",
        cream: "#FFF6EA",
        parchment: "#F7E4C4",
        coriander: "#49775F",
        brass: "#B7833E"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(217, 77, 26, 0.22)",
        soft: "0 12px 35px rgba(24, 20, 17, 0.12)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["Georgia", "Cambria", "Times New Roman", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
