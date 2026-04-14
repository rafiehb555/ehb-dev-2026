"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  EHB — STL User Card
 *  Premium trust badge card for sellers, buyers, providers, products.
 *  Powered by @ehb/trust-engine (single source of truth for labels/colors).
 *
 *  Variants:
 *   - compact  → small inline chip (tables, lists, product cards)
 *   - standard → full glass card with avatar + label + score bar (default)
 *   - hero     → large cinematic card for profile/verification pages
 *
 *  Usage:
 *   <STLUserCard name="Ali Raza" role="Seller" stl={7} pss={8} crb={6} dmo={7} score={84}/>
 *   <STLUserCard variant="compact" stl={5} name="Aamir"/>
 * ═══════════════════════════════════════════════════════════════════════
 */

import { stlColor, stlLabel, type TrustLevel } from "@ehb/trust-engine";

export type STLUserCardVariant = "compact" | "standard" | "hero";

export interface STLUserCardProps {
  name: string;
  role?: "Seller" | "Buyer" | "Provider" | "Company" | "Franchise" | "Owner" | string;
  avatarUrl?: string;
  stl: TrustLevel;
  pss?: TrustLevel | null;
  crb?: TrustLevel | null;
  dmo?: TrustLevel | null;
  score?: number; // 0-100
  verified?: boolean;
  industry?: string;
  industryAccent?: string; // hex
  variant?: STLUserCardVariant;
  onClick?: () => void;
  className?: string;
}

const L = (n: TrustLevel) => `L${n}`;
const hexAlpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// ─── COMPACT CHIP ──────────────────────────────────────────────────────
function CompactCard({ name, stl, verified, onClick, className }: STLUserCardProps) {
  const color = stlColor(stl);
  const label = stlLabel(stl);
  const glow = stl >= 5;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 transition-all ${className ?? ""}`}
      style={{
        background: hexAlpha(color, 0.15),
        border: `1px solid ${hexAlpha(color, 0.3)}`,
        boxShadow: glow ? `0 0 12px ${hexAlpha(color, 0.35)}` : "none",
      }}
    >
      <span className="text-[10px] font-semibold tracking-wide" style={{ color }}>
        {L(stl)} · {label}
      </span>
      {name && <span className="text-[11px] text-white/70">{name}</span>}
      {verified && (
        <span className="text-[10px]" style={{ color: "#22B14C" }} aria-label="verified">✓</span>
      )}
    </button>
  );
}

// ─── STANDARD GLASS CARD ───────────────────────────────────────────────
function StandardCard(props: STLUserCardProps) {
  const { name, role, avatarUrl, stl, pss, crb, dmo, score, verified, industry, industryAccent, onClick, className } = props;
  const color = stlColor(stl);
  const label = stlLabel(stl);
  const glow = stl >= 5;
  const initials = name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
  const accent = industryAccent ?? color;
  const scoreVal = typeof score === "number" ? Math.max(0, Math.min(100, score)) : null;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
      style={{
        background: "rgba(19,22,42,0.85)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${hexAlpha(color, 0.25)}`,
        boxShadow: glow ? `0 0 28px ${hexAlpha(color, 0.18)}` : "0 4px 14px rgba(0,0,0,0.25)",
      }}
    >
      {/* ambient accent corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ background: accent }}
      />

      {/* Header: avatar + name + STL chip */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{
            background: avatarUrl ? `url(${avatarUrl}) center/cover` : `linear-gradient(135deg, ${accent} 0%, ${color} 100%)`,
            border: `2px solid ${hexAlpha(color, 0.4)}`,
          }}
        >
          {!avatarUrl && initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold text-white">{name}</span>
            {verified && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "#22B14C" }}
                aria-label="verified"
              >✓</span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45">
            {role && <span>{role}</span>}
            {role && industry && <span>·</span>}
            {industry && <span style={{ color: accent }}>{industry}</span>}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center rounded-lg px-2.5 py-1.5"
          style={{
            background: hexAlpha(color, 0.15),
            border: `1px solid ${hexAlpha(color, 0.3)}`,
          }}
        >
          <span className="text-[10px] uppercase tracking-wider text-white/45">STL</span>
          <span className="text-base font-bold leading-tight" style={{ color }}>{L(stl)}</span>
          <span className="text-[9px] font-medium" style={{ color }}>{label}</span>
        </div>
      </div>

      {/* Score bar */}
      {scoreVal !== null && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/45">
            <span>Trust Score</span>
            <span className="font-semibold text-white/80">{scoreVal}/100</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${scoreVal}%`,
                background: `linear-gradient(90deg, ${color} 0%, ${accent} 100%)`,
                boxShadow: glow ? `0 0 8px ${hexAlpha(color, 0.5)}` : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* PSS / CRB / DMO breakdown */}
      {(pss != null || crb != null || dmo != null) && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Sub label="PSS" level={pss} />
          <Sub label="CRB" level={crb} />
          <Sub label="DMO" level={dmo} />
        </div>
      )}
    </div>
  );
}

function Sub({ label, level }: { label: string; level?: TrustLevel | null }) {
  const isNA = level == null;
  const color = isNA ? "rgba(255,255,255,0.25)" : stlColor(level as TrustLevel);
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md py-1.5"
      style={{
        background: "rgba(26,29,51,0.6)",
        border: `1px solid ${isNA ? "rgba(255,255,255,0.05)" : hexAlpha(color, 0.2)}`,
      }}
    >
      <span className="text-[9px] uppercase tracking-wider text-white/35">{label}</span>
      <span className="text-xs font-bold" style={{ color }}>{isNA ? "N/A" : L(level as TrustLevel)}</span>
    </div>
  );
}

// ─── HERO CARD ─────────────────────────────────────────────────────────
function HeroCard(props: STLUserCardProps) {
  const { name, role, avatarUrl, stl, pss, crb, dmo, score, verified, industry, industryAccent, className } = props;
  const color = stlColor(stl);
  const label = stlLabel(stl);
  const accent = industryAccent ?? color;
  const initials = name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
  const scoreVal = typeof score === "number" ? Math.max(0, Math.min(100, score)) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, rgba(19,22,42,0.95) 0%, ${hexAlpha(color, 0.12)} 50%, rgba(19,22,42,0.95) 100%)`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${hexAlpha(color, 0.35)}`,
        boxShadow: `0 0 60px ${hexAlpha(color, 0.2)}, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* ambient mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${hexAlpha(accent, 0.25)}, transparent 50%), radial-gradient(circle at 80% 80%, ${hexAlpha(color, 0.2)}, transparent 50%)`,
        }}
      />

      <div className="relative flex items-center gap-5">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{
            background: avatarUrl ? `url(${avatarUrl}) center/cover` : `linear-gradient(135deg, ${accent} 0%, ${color} 100%)`,
            border: `3px solid ${hexAlpha(color, 0.5)}`,
            boxShadow: `0 0 24px ${hexAlpha(color, 0.4)}`,
          }}
        >
          {!avatarUrl && initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[22px] font-bold text-white">{name}</h3>
            {verified && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#22B14C", boxShadow: "0 0 8px rgba(34,177,76,0.5)" }}
              >✓</span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[13px] text-white/55">
            {role && <span>{role}</span>}
            {role && industry && <span>·</span>}
            {industry && (
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: hexAlpha(accent, 0.15), color: accent, border: `1px solid ${hexAlpha(accent, 0.3)}` }}
              >{industry}</span>
            )}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center rounded-xl px-4 py-3"
          style={{
            background: hexAlpha(color, 0.18),
            border: `1px solid ${hexAlpha(color, 0.4)}`,
            boxShadow: `0 0 20px ${hexAlpha(color, 0.3)}`,
          }}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/50">STL</span>
          <span className="text-3xl font-bold leading-none" style={{ color }}>{L(stl)}</span>
          <span className="mt-0.5 text-[11px] font-semibold" style={{ color }}>{label}</span>
        </div>
      </div>

      {scoreVal !== null && (
        <div className="relative mt-5">
          <div className="flex justify-between text-[11px] text-white/55">
            <span>Trust Score</span>
            <span className="font-bold text-white">{scoreVal}/100</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${scoreVal}%`,
                background: `linear-gradient(90deg, ${color} 0%, ${accent} 100%)`,
                boxShadow: `0 0 12px ${hexAlpha(color, 0.6)}`,
              }}
            />
          </div>
        </div>
      )}

      <div className="relative mt-5 grid grid-cols-3 gap-3">
        <Sub label="PSS" level={pss} />
        <Sub label="CRB" level={crb} />
        <Sub label="DMO" level={dmo} />
      </div>
    </div>
  );
}

// ─── ENTRY ─────────────────────────────────────────────────────────────
export function STLUserCard(props: STLUserCardProps) {
  const variant = props.variant ?? "standard";
  if (variant === "compact") return <CompactCard {...props} />;
  if (variant === "hero") return <HeroCard {...props} />;
  return <StandardCard {...props} />;
}

export default STLUserCard;
