import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4af37",
          600: "#d4a017",
          700: "#b8860b",
          800: "#92400e",
          900: "#78350f",
        },
        meknes: {
          light: "#d1fae5",
          DEFAULT: "#059669",
          dark: "#064e3b",
        },
        navy: {
          50: "#EEF3F9",
          100: "#d6e4f0",
          200: "#b0cfe3",
          300: "#7db2d3",
          400: "#4a95c2",
          500: "#2a6f9e",
          600: "#1e3a5f",
          700: "#16304f",
          800: "#0f172a",
          900: "#0a0f1a",
        },
      },
      fontFamily: { arabic: ["Noto Sans Arabic", "sans-serif"] },
      backgroundColor: {
        page: "#EEF3F9",
      },
    },
  },
  plugins: [],
};
export default config;
