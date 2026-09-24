import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E9E6DC",
        "paper-dark": "#DDD8C9",
        ink: "#1B1B18",
        "ink-soft": "#4A473F",
        rust: "#C1440E",
        clearance: "#2B4570",
        moss: "#3F6B4F",
        line: "#B8B2A0",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
