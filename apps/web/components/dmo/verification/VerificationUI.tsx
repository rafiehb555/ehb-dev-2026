"use client";

/**
 * VerificationUI — shared primitives for DMO Verification modules.
 *
 * Canonical spec: design-system/EHB-UIUX-SYSTEM.md §7.1–§7.7 + §7.11 +
 * design-system/ai-behavior.md §2 (auto-upgrade rule) §3 (component table)
 * §7 (5-level ladder) §10 (forbidden list: NO <table>, NO spinners, NO
 * stat-without-icon, NO card-without-hover).
 *
 * Used by:
 *   - apps/web/app/dmo/stl/page.tsx      (STL Management)
 *   - apps/web/app/dmo/pss/page.tsx      (PSS Monitoring)
 *   - apps/web/app/dmo/crb/page.tsx      (CRB Monitoring)
 *   - apps/web/app/dmo/up-guard/page.tsx (Up-Guard Monitoring)
 *
 * Design tokens (§2 EHB-UIUX-SYSTEM.md):
 *   bg          #0C0E1A
 *   card        #13162A
 *   nested      #1A1D33
 *   purple      #7B6EF6 / #A098F8
 *   teal        #2BBFA0
 *   amber       #F0A030
 *   red         #F05858
 *   green       #38C878
 *
 * NOTE: This file is prototype-only (no backend wiring) per Rafi's current
 * UI/UX-first plan. Real API wiring is deferred until Phase 2 data pass.
 */

import { type ReactNode, useEffect } from "react";

/* ------------------------------------------------------------------ */
/* Tone system                                                         */
/* ------------------------------------------------------------------ */

export type VerificationTone =
  | "purple"
  | "teal"
  | "amber"
  | "red"
  | "green"
  | "cyan";

const TONE: Record<
  VerificationTone,
  { fg: string; bg: string; border: string; glow: string; hoverBorder: string }
> = {
  purple: {
    fg: "#A098F8",
    bg: "rgba(123,110,246,0.15)",
    border: "rgba(123,110,246,0.35)",
    glow: "0 0 24px rgba(123,110,246,0.22)",
    hoverBorder: "rgba(123,110,246,0.65)",
  },
  teal: {
    fg: "#2BBFA0",
    bg: "rgba(43,191,160,0.15)",
    border: "rgba(43,191,160,0.35)",
    glow: "0 0 24px rgba(43,191,160,0.22)",
    hoverBorder: "rgba(43,191,160,0.65)",
  },
  amber: {
    fg: "#F0A030",
    bg: "rgba(240,160,48,0.15)",
    border: "rgba(240,160,48,0.38)",
    glow: "0 0 24px rgba(240,160,48,0.22)",
    hoverBorder: "rgba(240,160,48,0.68)",
  },
  red: {
    fg: "#F05858",
    bg: "rgba(240,88,88,0.17)",
    border: "rgba(240,88,88,0.45)",
    glow: "0 0 28px rgba(240,88,88,0.32)",
    hoverBorder: "rgba(240,88,88,0.75)",
  },
  green: {
    fg: "#38C878",
    bg: "rgba(56,200,120,0.15)",
    border: "rgba(56,200,120,0.38)",
    glow: "0 0 24px rgba(56,200,120,0.22)",
    hoverBorder: "rgba(56,200,120,0.65)",
  },
  cyan: {
    fg: "#67E8F9",
    bg: "rgba(103,232,249,0.12)",
    border: "rgba(103,232,249,0.35)",
    glow: "0 0 24px rgba(103,232,249,0.20)",
    hoverBorder: "rgba(103,232,249,0.65)",
  },
};

export function toneClass(tone: VerificationTone) {
  return TONE[tone];
}

/* ------------------------------------------------------------------ */
/* VerificationStatCard — §7.5 compliant                               */
/* ------------------------------------------------------------------ */
/**
 * Clickable stat card with icon + label + value + sub-label.
 * Rendered as a <button> for a11y. Hover lifts -2px, boosts shadow.
 * §7.5 mandates: icon left, 24px bold value, 11px label, 9px sub-label.
 */
export function VerificationStatCard({
  icon,
  label,
  value,
  sub,
  tone,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  tone: VerificationTone;
  onClick?: () => void;
}) {
  const t = TONE[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className="ehb-vstat group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border bg-[#13162A]/85 p-4 pt-[18px] text-left transition-all duration-300 ease-out hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B6EF6]/60"
      style={{
        borderColor: t.border,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        fontFamily: "inherit",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = t.glow;
        (e.currentTarget as HTMLButtonElement).style.borderColor = t.hoverBorder;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
        (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
      }}
    >
      {/* gradient accent bar (top edge) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${t.fg} 50%, transparent 100%)`,
          boxShadow: `0 0 12px ${t.fg}`,
        }}
      />

      {/* corner decorations — L-shape marks (top-left + bottom-right) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 opacity-50 transition-opacity group-hover:opacity-90"
        style={{
          borderLeft: `1.5px solid ${t.fg}`,
          borderTop: `1.5px solid ${t.fg}`,
          borderTopLeftRadius: "3px",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 opacity-50 transition-opacity group-hover:opacity-90"
        style={{
          borderRight: `1.5px solid ${t.fg}`,
          borderBottom: `1.5px solid ${t.fg}`,
          borderBottomRightRadius: "3px",
        }}
      />

      {/* ambient glow orb */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: t.fg }}
      />

      <span
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition-transform duration-300 group-hover:scale-[1.06]"
        style={{
          background: t.bg,
          border: `1px solid ${t.border}`,
          color: t.fg,
          boxShadow: `inset 0 0 18px ${t.fg}22`,
        }}
      >
        {icon}
      </span>
      <span className="relative flex min-w-0 flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
          {label}
        </span>
        <span
          className="text-2xl font-black leading-none tabular-nums"
          style={{ color: t.fg, textShadow: `0 0 18px ${t.fg}55` }}
        >
          {value}
        </span>
        {sub ? (
          <span className="text-[10px] font-medium text-white/45">{sub}</span>
        ) : null}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* VerificationChip — §7.4                                             */
/* ------------------------------------------------------------------ */
export function VerificationChip({
  children,
  tone,
  size = "sm",
}: {
  children: ReactNode;
  tone: VerificationTone;
  size?: "xs" | "sm";
}) {
  const t = TONE[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wide ${
        size === "xs" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-0.5 text-[10px]"
      }`}
      style={{
        color: t.fg,
        background: t.bg,
        borderColor: t.border,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* VerificationRowGrid — replaces <table> (forbidden per §10)          */
/* ------------------------------------------------------------------ */
/**
 * Row grid for drillable item lists. Each row is a clickable <button>
 * with lift-on-hover. Empty state uses illustration + helper copy.
 *
 * Columns are defined declaratively. Last column auto-right-aligns
 * unless marked.
 */
export type RowColumn<T> = {
  key: string;
  header: string;
  width?: string; // e.g. "1.6fr" | "120px"
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
};

export function VerificationRowGrid<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyIcon,
  emptyTitle = "No rows to show",
  emptyHint = "Adjust filters or wait for new activity.",
  onRowClick,
  getRowTone,
}: {
  columns: RowColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyHint?: string;
  onRowClick?: (row: T) => void;
  getRowTone?: (row: T) => VerificationTone | undefined;
}) {
  const gridTemplate = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 backdrop-blur-xl">
      {/* header strip */}
      <div
        className="hidden items-center gap-0 border-b border-white/8 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 md:grid"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((c) => (
          <span
            key={c.key}
            className={
              c.align === "right"
                ? "text-right"
                : c.align === "center"
                ? "text-center"
                : "text-left"
            }
          >
            {c.header}
          </span>
        ))}
      </div>

      {/* loading skeleton */}
      {loading ? (
        <div className="divide-y divide-white/5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="grid animate-pulse items-center gap-0 px-4 py-3"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((c) => (
                <div
                  key={c.key}
                  className="h-3 w-24 rounded-full bg-white/10"
                />
              ))}
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} hint={emptyHint} />
      ) : (
        <div className="divide-y divide-white/5">
          {rows.map((row) => {
            const tone = getRowTone?.(row);
            const t = tone ? TONE[tone] : undefined;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => onRowClick?.(row)}
                className="group grid w-full items-center gap-0 px-4 py-3 text-left transition-all duration-150 hover:-translate-y-[1px] hover:bg-white/[0.035] focus-visible:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B6EF6]/55 md:gap-0"
                style={{
                  gridTemplateColumns: gridTemplate,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxShadow: t ? `inset 3px 0 0 0 ${t.fg}` : undefined,
                }}
              >
                {columns.map((c) => (
                  <div
                    key={c.key}
                    className={`min-w-0 text-xs text-white/80 ${
                      c.align === "right"
                        ? "text-right"
                        : c.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {c.render(row)}
                  </div>
                ))}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmptyState                                                          */
/* ------------------------------------------------------------------ */
export function EmptyState({
  icon,
  title,
  hint,
  cta,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  cta?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center text-white/30">{icon ?? <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.4" /></svg>}</div>
      <div className="text-sm font-semibold text-white/85">{title}</div>
      {hint ? (
        <div className="max-w-sm text-[11px] text-white/50">{hint}</div>
      ) : null}
      {cta ? <div className="mt-3">{cta}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VerificationDrawer — §7.7                                           */
/* ------------------------------------------------------------------ */
/**
 * Right-side slide-in drawer for drill-in details. Esc closes. Overlay
 * click closes. Red gradient when severity === "high" or "critical".
 */
export function VerificationDrawer({
  open,
  onClose,
  title,
  subtitle,
  severity,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  severity?: "info" | "warning" | "high" | "critical";
  children: ReactNode;
  footer?: ReactNode;
}) {
  // Esc to close (per design-system a11y rules)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isCritical = severity === "high" || severity === "critical";

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity"
      />
      {/* drawer panel */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute right-0 top-0 flex h-full w-full max-w-[720px] flex-col border-l border-white/10 bg-[#0C0E1A]/96 p-5 shadow-[0_32px_80px_rgba(10,12,24,0.55)] backdrop-blur-2xl"
        style={{
          animation: "ehb-drawer-slide 260ms cubic-bezier(.2,.8,.2,1)",
          background: isCritical
            ? "linear-gradient(180deg, rgba(240,88,88,0.10) 0%, rgba(12,14,26,0.96) 40%, rgba(12,14,26,0.98) 100%)"
            : undefined,
        }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
          <div className="min-w-0 space-y-1">
            {severity ? (
              <VerificationChip
                tone={
                  severity === "critical"
                    ? "red"
                    : severity === "high"
                    ? "red"
                    : severity === "warning"
                    ? "amber"
                    : "purple"
                }
                size="xs"
              >
                {severity}
              </VerificationChip>
            ) : null}
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle ? (
              <p className="text-xs text-white/55">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/75 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B6EF6]/60"
          >
            Close · Esc
          </button>
        </header>
        <div className="flex-1 overflow-y-auto pr-1 pt-4">{children}</div>
        {footer ? (
          <footer className="mt-3 border-t border-white/8 pt-3">
            {footer}
          </footer>
        ) : null}
      </section>

      <style jsx>{`
        @keyframes ehb-drawer-slide {
          from {
            transform: translateX(26px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeader — consistent section headers                          */
/* ------------------------------------------------------------------ */
export function SectionHeader({
  eyebrow,
  title,
  hint,
  right,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A098F8]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-base font-bold text-white">{title}</h2>
        {hint ? <p className="text-[11px] text-white/50">{hint}</p> : null}
      </div>
      {right ? <div className="flex flex-wrap gap-2">{right}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SeverityMeter — horizontal segmented bar for severity breakdowns    */
/* ------------------------------------------------------------------ */
export function SeverityMeter({
  segments,
}: {
  segments: Array<{ label: string; value: number; tone: VerificationTone }>;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {segments.map((s) => {
          const t = TONE[s.tone];
          return (
            <div
              key={s.label}
              className="transition-[width] duration-500 ease-out"
              style={{
                width: `${(s.value / total) * 100}%`,
                background: t.fg,
                boxShadow: `0 0 12px ${t.fg}55`,
              }}
              aria-label={`${s.label}: ${s.value}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-wider">
        {segments.map((s) => {
          const t = TONE[s.tone];
          return (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 text-white/60"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: t.fg, boxShadow: `0 0 6px ${t.fg}` }}
              />
              {s.label} · {s.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FilterChipRow — reusable filter chip row                            */
/* ------------------------------------------------------------------ */
export function FilterChipRow<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
              active
                ? "border-[#7B6EF6]/60 bg-[#7B6EF6]/22 text-white shadow-[0_0_16px_rgba(123,110,246,0.35)]"
                : "border-white/12 bg-white/[0.04] text-white/55 hover:border-white/25 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STL Level metadata — canonical L1..L10 config for EHB platform      */
/* ------------------------------------------------------------------ */
/**
 * Canonical STL definitions per ehb-uiux-auto-designer skill:
 *   L1=FREE → L10=SUPREME. Score bands, coin locks, tones, labels.
 *   Dark-theme only (production design system §6 enforces single dark theme).
 */
export type StlLevelNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type StlLevelMeta = {
  level: StlLevelNumber;
  label: string;
  scoreMin: number;
  scoreMax: number;
  coinLock: number; // EHBGC
  tone: VerificationTone;
  accent: string; // hex for crown/ribbon
  glow: string;
  isLocked?: boolean; // L9+L10 locked by default in prototype
  badge?: "VIP" | "ELITE" | "SUPREME";
};

export const STL_LEVELS: StlLevelMeta[] = [
  { level: 1, label: "FREE",     scoreMin: 0,  scoreMax: 20, coinLock: 0,     tone: "cyan",   accent: "#94A3B8", glow: "rgba(148,163,184,0.30)" },
  { level: 2, label: "BASIC",    scoreMin: 21, scoreMax: 40, coinLock: 20,    tone: "cyan",   accent: "#67E8F9", glow: "rgba(103,232,249,0.35)" },
  { level: 3, label: "NORMAL",   scoreMin: 41, scoreMax: 55, coinLock: 50,    tone: "green",  accent: "#38C878", glow: "rgba(56,200,120,0.35)" },
  { level: 4, label: "STANDARD", scoreMin: 56, scoreMax: 65, coinLock: 100,   tone: "green",  accent: "#2BBFA0", glow: "rgba(43,191,160,0.35)" },
  { level: 5, label: "ADVANCED", scoreMin: 66, scoreMax: 75, coinLock: 200,   tone: "teal",   accent: "#2BBFA0", glow: "rgba(43,191,160,0.40)" },
  { level: 6, label: "HIGH",     scoreMin: 76, scoreMax: 85, coinLock: 500,   tone: "purple", accent: "#A098F8", glow: "rgba(160,152,248,0.40)" },
  { level: 7, label: "PRO",      scoreMin: 86, scoreMax: 92, coinLock: 1000,  tone: "purple", accent: "#7B6EF6", glow: "rgba(123,110,246,0.45)" },
  { level: 8, label: "VIP",      scoreMin: 93, scoreMax: 96, coinLock: 2000,  tone: "amber",  accent: "#F0A030", glow: "rgba(240,160,48,0.55)", badge: "VIP" },
  { level: 9, label: "ELITE",    scoreMin: 97, scoreMax: 98, coinLock: 4000,  tone: "amber",  accent: "#FB923C", glow: "rgba(251,146,60,0.55)", isLocked: true,  badge: "ELITE" },
  { level: 10, label: "SUPREME", scoreMin: 99, scoreMax: 100, coinLock: 10000, tone: "purple", accent: "#C4B5FD", glow: "rgba(196,181,253,0.60)", isLocked: true, badge: "SUPREME" },
];

export function getStlMeta(level: number): StlLevelMeta {
  const clamped = Math.max(1, Math.min(10, Math.round(level))) as StlLevelNumber;
  return STL_LEVELS[clamped - 1]!;
}

/* ------------------------------------------------------------------ */
/* STLBadge — Crown + Shield + Number + Stars + Ribbon                 */
/* ------------------------------------------------------------------ */
/**
 * Premium STL trust badge per ehb-uiux-auto-designer skill.
 * Shield silhouette with number, stars (qty = level), crown (L8+),
 * ribbon strip, verification tick for L9/L10.
 */
export function STLBadge({
  level,
  size = "md",
}: {
  level: number;
  size?: "sm" | "md" | "lg";
}) {
  const meta = getStlMeta(level);
  const dimMap = {
    sm: { w: 56, numberSize: 16, labelSize: 8, starSize: 7 },
    md: { w: 84, numberSize: 26, labelSize: 9, starSize: 9 },
    lg: { w: 120, numberSize: 38, labelSize: 11, starSize: 12 },
  } as const;
  const d = dimMap[size];

  const stars = Math.min(5, Math.max(1, Math.round(meta.level / 2)));
  const showCrown = meta.level >= 8;
  const showTick = meta.level >= 9;
  const showFBadge = meta.level === 10;

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: d.w, fontFamily: "inherit" }}
    >
      {/* Crown (L8+) */}
      {showCrown ? (
        <div
          className="mb-[-4px] text-[14px] leading-none"
          style={{
            filter: `drop-shadow(0 0 6px ${meta.accent})`,
            color: meta.accent,
          }}
          aria-hidden
        >
          ♛
        </div>
      ) : null}

      {/* Shield */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: d.w,
          height: d.w * 1.12,
          background: `linear-gradient(160deg, ${meta.accent}30 0%, ${meta.accent}10 50%, transparent 100%)`,
          borderRadius: "12px 12px 46% 46% / 12px 12px 46% 46%",
          border: `1.5px solid ${meta.accent}`,
          boxShadow: `0 0 24px ${meta.glow}, inset 0 0 18px ${meta.accent}22`,
        }}
      >
        {/* inner rim */}
        <div
          className="absolute inset-1 rounded-[inherit] opacity-40"
          style={{
            borderRadius: "10px 10px 46% 46% / 10px 10px 46% 46%",
            border: `1px dashed ${meta.accent}55`,
          }}
          aria-hidden
        />
        {/* number */}
        <div
          className="relative z-10 font-black leading-none tabular-nums"
          style={{
            color: meta.accent,
            fontSize: d.numberSize,
            textShadow: `0 0 12px ${meta.accent}`,
            letterSpacing: "-1px",
          }}
        >
          L{meta.level}
        </div>

        {/* verification tick (L9+) */}
        {showTick ? (
          <div
            className="absolute right-[6px] top-[6px] flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black leading-none"
            style={{
              background: meta.level === 10 ? "#F0A030" : "#3B82F6",
              color: "#0C0E1A",
              boxShadow: `0 0 8px ${meta.level === 10 ? "#F0A030" : "#3B82F6"}`,
            }}
            aria-label="Verified"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
          </div>
        ) : null}

        {/* F-badge (L10 only) */}
        {showFBadge ? (
          <div
            className="absolute left-[6px] top-[6px] flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black leading-none"
            style={{
              background: "#F0A030",
              color: "#0C0E1A",
              boxShadow: "0 0 8px #F0A030",
            }}
            aria-label="Franchiser"
          >
            F
          </div>
        ) : null}
      </div>

      {/* Stars */}
      <div
        className="mt-1 flex items-center gap-[1px]"
        aria-label={`${stars} of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: d.starSize,
              color: i < stars ? meta.accent : "rgba(255,255,255,0.18)",
              textShadow: i < stars ? `0 0 4px ${meta.accent}` : undefined,
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* Ribbon */}
      <div
        className="relative mt-1 px-2 py-[3px] text-center font-black uppercase"
        style={{
          fontSize: d.labelSize,
          letterSpacing: "0.14em",
          color: "#0C0E1A",
          background: `linear-gradient(90deg, ${meta.accent} 0%, ${meta.accent}cc 100%)`,
          clipPath:
            "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
          boxShadow: `0 0 14px ${meta.glow}`,
          minWidth: d.w - 8,
        }}
      >
        {meta.label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STLLevelTrack — horizontal L1→L10 progress rail                     */
/* ------------------------------------------------------------------ */
/**
 * Horizontal FREE → SUPREME track:
 *   - Done levels (< activeLevel): gold/tone checkmark
 *   - Active level: glowing crown circle
 *   - Locked (L9/L10 by default, or beyond active): lock icon, gray
 */
export function STLLevelTrack({
  activeLevel,
  compact = false,
}: {
  activeLevel: number; // 1..10
  compact?: boolean;
}) {
  const active = Math.max(1, Math.min(10, Math.round(activeLevel)));

  return (
    <div className="relative w-full">
      {/* rail line */}
      <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-white/8" aria-hidden />
      <div
        className="absolute left-0 top-[18px] h-[2px] transition-all duration-700 ease-out"
        style={{
          width: `${((active - 1) / 9) * 100}%`,
          background:
            "linear-gradient(90deg, #2BBFA0 0%, #7B6EF6 55%, #F0A030 100%)",
          boxShadow: "0 0 14px rgba(123,110,246,0.55)",
        }}
        aria-hidden
      />

      <div className="relative grid grid-cols-10 gap-1">
        {STL_LEVELS.map((lvl) => {
          const isActive = lvl.level === active;
          const isDone = lvl.level < active;
          const isLocked = lvl.isLocked && lvl.level > active;
          const showAsLocked = isLocked && !isActive && !isDone;

          return (
            <div
              key={lvl.level}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`relative flex items-center justify-center rounded-full border text-[10px] font-black transition-all duration-300 ${
                  isActive ? "animate-pulse" : ""
                }`}
                style={{
                  width: compact ? 28 : 36,
                  height: compact ? 28 : 36,
                  background: isActive
                    ? `radial-gradient(circle, ${lvl.accent}44 0%, ${lvl.accent}11 70%, transparent 100%)`
                    : isDone
                    ? `${lvl.accent}22`
                    : "rgba(255,255,255,0.04)",
                  borderColor: isActive
                    ? lvl.accent
                    : isDone
                    ? `${lvl.accent}77`
                    : "rgba(255,255,255,0.10)",
                  color: isActive
                    ? lvl.accent
                    : isDone
                    ? lvl.accent
                    : "rgba(255,255,255,0.35)",
                  boxShadow: isActive
                    ? `0 0 22px ${lvl.glow}, inset 0 0 12px ${lvl.accent}33`
                    : isDone
                    ? `0 0 8px ${lvl.accent}33`
                    : undefined,
                }}
                aria-label={`L${lvl.level} ${lvl.label}${isActive ? " (current)" : isDone ? " (achieved)" : showAsLocked ? " (locked)" : ""}`}
              >
                {isActive ? (
                  <span className="text-[13px] leading-none">♛</span>
                ) : isDone ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                ) : showAsLocked ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                ) : (
                  <span className="tabular-nums">L{lvl.level}</span>
                )}
              </div>
              {!compact ? (
                <span
                  className="text-center text-[8px] font-bold uppercase tracking-wider"
                  style={{
                    color: isActive
                      ? lvl.accent
                      : isDone
                      ? "rgba(255,255,255,0.70)"
                      : "rgba(255,255,255,0.35)",
                  }}
                >
                  {lvl.label}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
