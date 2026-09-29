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
        obsidian: {
          DEFAULT: "#08090D",
          surface: "#12131A",
          card: "rgba(18, 19, 26, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.03)",
        },
        racing: {
          lime: "#d2ff00",
          glow: "rgba(210, 255, 0, 0.35)",
        },
        beacon: {
          cyan: "#00f0ff",
          glow: "rgba(0, 240, 255, 0.35)",
        },
        flame: {
          orange: "#ff4d00",
          glow: "rgba(255, 77, 0, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      transitionTimingFunction: {
        "f1-brake": "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring-tight": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "scanline": "scanline 8s linear infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
