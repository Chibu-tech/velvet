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
        background: "var(--background)",
        foreground: "var(--foreground)",
        velvet: {
          black: "#0a0a0a",
          charcoal: "#121212",
          dark: "#1a1a1a",
          card: "rgba(18, 18, 18, 0.8)",
          surface: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.06)",
          silver: "#c0c0c0",
          platinum: "#f0f0f0",
          gold: {
            DEFAULT: "#c9a94e",
            light: "#e8d5a3",
            dark: "#a8883a",
            glow: "rgba(201, 169, 78, 0.15)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "velvet-gradient": "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        "gold-gradient": "linear-gradient(135deg, #c9a94e 0%, #e8d5a3 50%, #a8883a 100%)",
        "silver-gradient": "linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 50%, #707070 100%)",
        "subtle-glow": "radial-gradient(ellipse at 50% 0%, rgba(201, 169, 78, 0.06) 0%, transparent 60%)",
        "subtle-light": "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        goldPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201, 169, 78, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(201, 169, 78, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
