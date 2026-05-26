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
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        velvet: {
          primary: "#0E0E12",
          surface: "#1A1A22",
          elevated: "#22222E",
          light: "#F5F3EF",
          accent: "#80465E",
          "accent-soft": "#B3909E",
          "text-primary": "#F0EDE6",
          "text-muted": "#7A7870",
          "text-light": "#14131A",
          border: "rgba(255,255,255,0.07)",
          plum: "#2C1E40",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "velvet-gradient": "linear-gradient(to top, rgba(14,14,18,0.7), transparent)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
