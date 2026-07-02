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
        charcoal: "#0F0F0F",
        cream: "#F8F4ED",
        ember: "#FF7A00",
        saffron: "#FF9A3D",
        smoke: "#181818",
        pearl: "#F2E8D8",
        amber: "#F5A623",
        coriander: "#4F7B58",
        chilli: "#D84A2B"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(255, 122, 0, 0.18)",
        soft: "0 12px 32px rgba(15, 15, 15, 0.08)",
        raised: "0 20px 48px rgba(15, 15, 15, 0.14)"
      },
      opacity: {
        7: "0.07",
        8: "0.08",
        12: "0.12",
        14: "0.14",
        15: "0.15",
        18: "0.18",
        26: "0.26",
        34: "0.34",
        38: "0.38",
        45: "0.45",
        55: "0.55",
        62: "0.62",
        65: "0.65",
        68: "0.68",
        72: "0.72",
        78: "0.78",
        85: "0.85",
        92: "0.92",
        96: "0.96"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"]
      },
      borderRadius: {
        card: "1.25rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
