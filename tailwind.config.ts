import type { Config } from "tailwindcss";

// Colors come from CSS variables defined in app/theme.css, so the same
// classes (bg-paper, text-ink, border-line...) re-color the whole site when
// the Classic / Colorful switch is toggled.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: v("paper"),
        "paper-dark": v("paper-dark"),
        ink: v("ink"),
        "ink-soft": v("ink-soft"),
        rust: v("rust"),
        clearance: v("clearance"),
        moss: v("moss"),
        line: v("line"),
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