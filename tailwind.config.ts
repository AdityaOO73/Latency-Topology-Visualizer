import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        panel: "#0f1115",
        card: "#0b0b0f"
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
