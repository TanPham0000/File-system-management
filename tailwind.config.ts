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
        atomicBlack: "#0F0F0F",
        almostWhite: "#FAF7F5",
        vividOrange: "#FF9813",
        // Semantic aliases
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FF9813",
      },
      fontFamily: {
        heading: ["var(--font-switser)", "sans-serif"],
        body: ["var(--font-be-vietnam-pro)", "sans-serif"],
        special: ["var(--font-instrumental)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
export default config;
