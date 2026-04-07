"use client";

import {
  GraduationCap,
  HeartPulse,
  Code2,
  TrendingUp,
  Truck,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

/**
 * Hero right: AI ecosystem — glowing globe, industry icons, connection lines, floating service cards.
 * GPU-friendly: transform + opacity only.
 */

const ORBIT_ICONS: { Icon: LucideIcon; label: string; angle: number; color: string }[] = [
  { Icon: GraduationCap, label: "Education", angle: 0, color: "#E53935" },
  { Icon: HeartPulse, label: "Health", angle: 60, color: "#00AEEF" },
  { Icon: Code2, label: "IT", angle: 120, color: "#3B82F6" },
  { Icon: TrendingUp, label: "Finance", angle: 180, color: "#F59E0B" },
  { Icon: Truck, label: "Delivery", angle: 240, color: "#FB923C" },
  { Icon: ShoppingCart, label: "Retail", angle: 300, color: "#22C55E" },
];

const FLOATING_CARDS = [
  { label: "Web Development", delay: "0s", x: "8%", y: "18%" },
  { label: "Doctor Consultation", delay: "0.8s", x: "78%", y: "22%" },
  { label: "Delivery Services", delay: "1.2s", x: "5%", y: "68%" },
  { label: "Graphic Design", delay: "0.4s", x: "82%", y: "70%" },
];

function getOrbitPosition(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(rad);
  const y = 50 + radiusPct * Math.sin(rad);
  return { x: `${x}%`, y: `${y}%` };
}

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg aspect-square flex items-center justify-center min-h-[320px]">
      {/* Floating service cards (glass, slow float) */}
      {FLOATING_CARDS.map((card, i) => (
        <div
          key={i}
          className="absolute z-10 rounded-xl glass-panel border border-white/15 px-3 py-2 backdrop-blur-md animate-float will-change-transform transition-all duration-300 hover:border-[#00AEEF]/30 hover:shadow-[0_0_16px_rgba(0,174,239,0.15)]"
          style={{
            left: card.x,
            top: card.y,
            animationDuration: "5s",
            animationDelay: card.delay,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="text-[10px] font-medium text-ehb-textBody whitespace-nowrap">{card.label}</span>
        </div>
      ))}

      {/* Central globe + orbit container */}
      <div className="relative w-[72%] aspect-square max-w-[280px] flex items-center justify-center">
        {/* Connection lines: center to each orbit icon */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          <defs>
            <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {ORBIT_ICONS.map((_, i) => {
            const pos = getOrbitPosition(ORBIT_ICONS[i].angle, 42);
            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={pos.x}
                y2={pos.y}
                stroke="url(#heroLineGrad)"
                strokeWidth="0.5"
                className="animate-pulse"
                style={{ animationDuration: "3s", animationDelay: `${i * 0.2}s` }}
              />
            );
          })}
        </svg>

        {/* Orbit icons (small nodes with icon) */}
        {ORBIT_ICONS.map(({ Icon, label, angle, color }, i) => {
          const pos = getOrbitPosition(angle, 42);
          return (
            <div
              key={i}
              className="absolute w-9 h-9 rounded-full flex items-center justify-center border border-white/20 animate-float will-change-transform"
              style={{
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
                backgroundColor: `${color}18`,
                animationDuration: "4s",
                animationDelay: `${i * 0.15}s`,
              }}
              title={label}
            >
              <Icon className="w-4 h-4" style={{ color }} aria-hidden />
            </div>
          );
        })}

        {/* Central glowing globe */}
        <div
          className="absolute inset-0 rounded-full border border-[#00AEEF]/30 will-change-transform"
          style={{
            background: `
              radial-gradient(ellipse 70% 70% at 30% 30%, rgba(0,174,239,0.25), transparent 50%),
              radial-gradient(ellipse 100% 100% at 50% 50%, rgba(34,197,94,0.08), transparent 60%),
              radial-gradient(circle at 50% 50%, #001B2E 0%, #020617 70%)
            `,
            boxShadow: "0 0 60px rgba(0,174,239,0.2), inset 0 0 40px rgba(0,174,239,0.06)",
          }}
        >
          {/* Globe grid overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,234,255,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,234,255,0.6) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.2em] text-ehb-textMuted mb-0.5">AI Network</p>
            <p className="text-xl sm:text-2xl font-bold gradient-text-brand">EHB</p>
            <p className="text-[9px] text-ehb-textMuted mt-0.5">Global ecosystem</p>
          </div>
        </div>
      </div>
    </div>
  );
}
