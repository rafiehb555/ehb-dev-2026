"use client";

/**
 * DmoThemeSwitcher — Pill-style theme picker for DMO.
 *
 * 4 themes: White · Dark · Purple · Midnight.
 * Renders as a compact row of themed pills with icons.
 * Reads / writes via useEhbTheme() context.
 */

import { useEhbTheme } from "./DmoThemeProvider";
import { EHB_THEMES, type EhbTheme } from "@/lib/dmo/theme";

/* ------------------------------------------------------------------ */
/* Icon helpers                                                        */
/* ------------------------------------------------------------------ */

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className ?? "h-3.5 w-3.5"}>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M14.95 5.05l-1.06 1.06M6.11 13.89l-1.06 1.06"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className ?? "h-3.5 w-3.5"}>
      <path
        d="M15.5 11.5a6 6 0 01-7-7 6 6 0 107 7z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className ?? "h-3.5 w-3.5"}>
      <path
        d="M10 16s-6.5-4.35-6.5-8.18A3.5 3.5 0 0110 5.68a3.5 3.5 0 016.5 2.14C16.5 11.65 10 16 10 16z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonStarsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className ?? "h-3.5 w-3.5"}>
      <path
        d="M13.5 11.5a5 5 0 01-6-6 5.5 5.5 0 106 6z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 4l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5zM16.5 7.5l.35.7.7.35-.7.35-.35.7-.35-.7-.7-.35.7-.35z"
        fill="currentColor"
      />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  sun: SunIcon,
  moon: MoonIcon,
  heart: HeartIcon,
  "moon-stars": MoonStarsIcon,
};

/* ------------------------------------------------------------------ */
/* Theme colour accents per theme (for the active pill)                */
/* ------------------------------------------------------------------ */

const ACTIVE_STYLES: Record<EhbTheme, { bg: string; border: string; text: string; glow: string }> = {
  white: {
    bg: "rgba(91,78,214,0.14)",
    border: "rgba(91,78,214,0.42)",
    text: "#5B4ED6",
    glow: "0 0 14px rgba(91,78,214,0.25)",
  },
  dark: {
    bg: "rgba(123,110,246,0.18)",
    border: "rgba(123,110,246,0.45)",
    text: "#A098F8",
    glow: "0 0 14px rgba(123,110,246,0.25)",
  },
  purple: {
    bg: "rgba(196,90,255,0.22)",
    border: "rgba(196,90,255,0.50)",
    text: "#D89CFF",
    glow: "0 0 16px rgba(196,90,255,0.35)",
  },
  midnight: {
    bg: "rgba(0,212,255,0.15)",
    border: "rgba(0,212,255,0.45)",
    text: "#5CEFFF",
    glow: "0 0 16px rgba(0,212,255,0.30)",
  },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function DmoThemeSwitcher() {
  const { theme, setTheme } = useEhbTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 p-1 backdrop-blur-md">
      {EHB_THEMES.map((t) => {
        const isActive = theme === t.key;
        const Icon = ICON_MAP[t.icon] ?? MoonIcon;
        const active = ACTIVE_STYLES[t.key];

        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setTheme(t.key)}
            className="group relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200"
            style={
              isActive
                ? {
                    background: active.bg,
                    borderColor: active.border,
                    color: active.text,
                    boxShadow: active.glow,
                    border: `1px solid ${active.border}`,
                  }
                : {
                    background: "transparent",
                    border: "1px solid transparent",
                    color: "rgba(255,255,255,0.45)",
                  }
            }
            aria-label={`Switch to ${t.label} theme`}
            aria-pressed={isActive}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
