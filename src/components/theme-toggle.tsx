"use client";

import { MoonIcon } from "@phosphor-icons/react/dist/icons/Moon";
import { SunIcon } from "@phosphor-icons/react/dist/icons/Sun";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const themeStorageKey = "harnessmatch-theme";

function storedTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be unavailable in restricted browsing contexts; the in-page theme still works.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initial = storedTheme() ?? preferred;
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    persistTheme(next);
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {/* Both glyphs render on the server; the theme attribute set before first paint picks one,
          so the icon never flashes the wrong state while hydration catches up. */}
      <SunIcon className="theme-toggle-sun" aria-hidden="true" size={18} weight="regular" />
      <MoonIcon className="theme-toggle-moon" aria-hidden="true" size={18} weight="regular" />
    </button>
  );
}
