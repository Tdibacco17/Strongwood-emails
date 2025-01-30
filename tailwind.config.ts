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
        dark: "var(--dark)",
        light: "var(--light)",
        lightHover: "var(--light-hover)",
        cotton: "var(--cotton)",
        gray1: "var(--bg-gray-1)",
        gray2: "var(--bg-gray-2)",
        gray3: "var(--bg-gray-3)",
        gray4: "var(--bg-gray-4)",
        gray5: "var(--bg-gray-5)",
        muted: 'var(--muted)',
        warning: "var(--warning)",
        warning2: "var(--warning2)",
      },
      fontFamily: {
        'geistSans': ['var(--font-geist-sans)']
      },
    },
  },
  plugins: [],
} satisfies Config;
