"use client";

/**
 * GlobalThemeSwitcher — Compact theme toggle for the main app topbar.
 *
 * Reads/writes `data-ehb-theme` on <html> and persists to localStorage.
 * Works independently of DmoThemeProvider — both sync via the same
 * localStorage key and DOM attribute.
 *
 * Renders as a row of 4 small colored dots with active ring indicator.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ehb-dmo-theme";
type Theme = "dark" | "white" | "purple" | "midnight";

const THEMES: { key: Theme; label: string; dot: string; ring: string }[] = [
  { key: "white", label: "White", dot: "#ECEDF6", ring: "rgba(91,78,214,0.55)" },
  { key: "dark", label: "Dark", dot: "#7B6EF6", ring: "rgba(123,110,246,0.60)" },
  { key: "purple", label: "Purple", dot: "#C45AFF", ring: "rgba(196,90,255,0.60)" },
  { key: "midnight", label: "Midnight", dot: "#00D4FF", ring: "rgba(0,212,255,0.55)" },
];

export function GlobalThemeSwitcher() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ["dark", "white", "purple", "midnight"].includes(stored)) {
        setThemeState(stored);
      }
    } catch {}
    setMounted(true);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-ehb-theme", t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-1.5 py-1">
      {THEMES.map((t) => {
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setTheme(t.key)}
            className="group relative flex items-center justify-center rounded-md p-1 transition-all duration-200"
            style={{
              background: isActive ? `${t.ring.replace(/[\d.]+\)$/, "0.15)")}` : "transparent",
            }}
            aria-label={`${t.label} theme`}
            aria-pressed={isActive}
            title={t.label}
          >
            <span
              className="block h-3 w-3 rounded-full transition-all duration-200"
              style={{
                backgroundColor: t.dot,
                boxShadow: isActive
                  ? `0 0 0 2px ${t.ring}, 0 0 10px ${t.ring}`
                  : "none",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
