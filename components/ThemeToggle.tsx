"use client";

import { useEffect, useState } from "react";

const KEY = "cybernotes-theme";

// Classic is the default. Flipping the switch sets data-theme="colorful" on
// <html> (which swaps the CSS variables in app/theme.css) and remembers the
// choice in localStorage. The inline script in app/layout.tsx re-applies it
// before first paint so the page doesn't flash Classic on reload.
export default function ThemeToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(document.documentElement.getAttribute("data-theme") === "colorful");
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "colorful");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(KEY, next ? "colorful" : "classic");
    } catch {
      /* private mode / storage blocked — the switch still works for this visit */
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className="theme-toggle"
      title={on ? "Switch to the classic dossier theme" : "Switch to the cyber theme"}
    >
      <span>Cyber theme</span>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__knob" />
      </span>
    </button>
  );
}
