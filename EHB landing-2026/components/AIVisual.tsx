"use client";

/**
 * AIVisual – AI network visual for AI section.
 * Center glowing core + connected nodes + floating cards.
 * GPU-friendly: transform + opacity animations only.
 */

export function AIVisual() {
  const floating = [
    { label: "Global Buyers", x: "15%", y: "18%", delay: "0s" },
    { label: "Global Sellers", x: "82%", y: "24%", delay: "0.5s" },
    { label: "Verified Services", x: "12%", y: "76%", delay: "0.9s" },
    { label: "Blockchain Franchise", x: "80%", y: "72%", delay: "0.3s" },
  ];

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-700/10 via-transparent to-sky-500/10" />

      {/* Floating cards around core */}
      {floating.map((card, i) => (
        <div
          key={card.label}
          className="absolute z-10 rounded-xl glass-panel border border-white/15 px-3 py-2 text-[10px] font-medium text-ehb-textBody backdrop-blur-md animate-float will-change-transform"
          style={{
            left: card.x,
            top: card.y,
            transform: "translate(-50%, -50%)",
            animationDuration: "6s",
            animationDelay: card.delay,
          }}
        >
          {card.label}
        </div>
      ))}

      {/* Core + orbit */}
      <div className="relative w-[72%] aspect-square max-w-[260px] flex items-center justify-center">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          <defs>
            <linearGradient id="aiLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="url(#aiLineGrad)" strokeWidth="0.6" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="78%" y2="28%" stroke="url(#aiLineGrad)" strokeWidth="0.6" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="22%" y2="76%" stroke="url(#aiLineGrad)" strokeWidth="0.6" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="78%" y2="74%" stroke="url(#aiLineGrad)" strokeWidth="0.6" className="animate-pulse" />
        </svg>

        {/* Outer ring */}
        <div
          className="absolute inset-4 rounded-full border border-violet-400/40"
          style={{
            boxShadow: "0 0 40px rgba(139,92,246,0.3)",
          }}
        />

        {/* Inner core */}
        <div
          className="absolute inset-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(236, 252, 255, 0.9), transparent 55%), radial-gradient(circle at 50% 60%, rgba(139,92,246,0.8), transparent 65%)",
            boxShadow:
              "0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(56,189,248,0.4)",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-8 rounded-full opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Center label – brighter for readability */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-sky-100 mb-0.5">
              Powered by AI
            </p>
            <p className="text-[22px] font-bold gradient-text-new">EHB Core</p>
            <p className="text-[10px] text-white mt-0.5">
              Global buy &amp; sell · 32 industries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

