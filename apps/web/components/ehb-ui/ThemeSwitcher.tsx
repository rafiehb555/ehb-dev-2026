"use client";

import React, { useEffect, useState, CSSProperties } from "react";
import "./ehb-theme.css";

type Theme = "ios-classic" | "diamond";

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>("diamond");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("ehb-theme") as Theme | null;
    const preferredTheme = savedTheme || "diamond";
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("theme-ios-classic", "theme-diamond");
    root.classList.add(`theme-${newTheme}`);
    localStorage.setItem("ehb-theme", newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  const containerStyle: CSSProperties = {
    display: "inline-flex",
    gap: "0.5rem",
    padding: "0.5rem",
    backgroundColor: "var(--ehb-theme-surface-secondary)",
    borderRadius: "8px",
    border: "1px solid var(--ehb-theme-border)",
  };

  const buttonBaseStyle: CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    color: "var(--ehb-theme-text)",
  };

  const iosClassicStyle: CSSProperties = {
    ...buttonBaseStyle,
    ...(theme === "ios-classic"
      ? {
          backgroundColor: "#f0a030",
          color: "#ffffff",
          boxShadow: "0 2px 8px rgba(240, 160, 48, 0.3)",
        }
      : {
          backgroundColor: "transparent",
          color: "var(--ehb-theme-text-secondary)",
        }),
  };

  const diamondStyle: CSSProperties = {
    ...buttonBaseStyle,
    ...(theme === "diamond"
      ? {
          backgroundColor: "#2898c8",
          color: "#ffffff",
          boxShadow: "0 2px 8px rgba(40, 152, 200, 0.3)",
        }
      : {
          backgroundColor: "transparent",
          color: "var(--ehb-theme-text-secondary)",
        }),
  };

  return (
    <div className={className} style={containerStyle}>
      <button
        style={iosClassicStyle}
        onClick={() => handleThemeChange("ios-classic")}
        title="Switch to iOS Classic theme"
      >
        iOS Classic
      </button>
      <button
        style={diamondStyle}
        onClick={() => handleThemeChange("diamond")}
        title="Switch to Diamond theme"
      >
        Diamond
      </button>
    </div>
  );
}

export default ThemeSwitcher;
