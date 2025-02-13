import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        robotoCondensed: ['Roboto Condensed', 'sans-serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
