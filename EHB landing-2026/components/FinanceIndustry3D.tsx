"use client";

/**
 * FinanceIndustry3D
 *
 * Stylised 3D-like trust + secure transaction flow for the Finance industry landing page.
 */

export function FinanceIndustry3D({ accentColor = "#F59E0B" }: { accentColor?: string }) {
  const accent2 = "#22C55E";
  const accent3 = "#3B82F6";

  const orbitItems = [
    { label: "PSS", sub: "Verify finance providers", x: "14%", y: "14%" },
    { label: "DMO", sub: "Risk & quality checks", x: "82%", y: "18%" },
    { label: "JPS", sub: "Match investment needs", x: "16%", y: "82%" },
    { label: "Refilling", sub: "Availability & liquidity", x: "82%", y: "82%" },
    { label: "Franchise", sub: "Local finance partners", x: "6%", y: "50%" },
    { label: "EHB‑STL", sub: "Secure wallet payments", x: "92%", y: "50%" },
  ];

  const leftInputs = [
    { title: "User", desc: "Manages payments, services, and investments." },
    { title: "Business / Investor", desc: "Seeks verified deals and funding options." },
    { title: "Wallet / Bank", desc: "Holds money and releases secure payments." },
  ];

  const rightOutputs = [
    { title: "Secure payment", desc: "EHB‑STL releases funds only after checks." },
    { title: "Investment plan", desc: "AI suggests safe paths based on verified offers." },
    { title: "Reports updated", desc: "Progress and transactions stay trackable." },
    { title: "Earnings tracked", desc: "Feedback helps improve matching and outcomes." },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
        How Finance Services Flow on EHB
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Verified finance with safe payments
      </h2>
      <p className="text-ehb-textMuted max-w-3xl mb-8 text-sm md:text-base">
        EHB helps users and businesses find verified finance providers, choose secure plans,
        and complete transactions with monitored quality and protected wallet payments.
      </p>

      <div
        className="relative rounded-3xl glass-card border px-4 sm:px-6 py-8 md:py-10 overflow-hidden"
        style={{ borderColor: `${accentColor}55` }}
      >
        {/* background */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.18), transparent 55%), radial-gradient(circle at 0% 80%, rgba(34,197,94,0.14), transparent 55%), radial-gradient(circle at 100% 80%, rgba(59,130,246,0.12), transparent 55%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.9) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
            }}
          />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.5fr)_minmax(0,1.25fr)] items-center">
          {/* Left inputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {leftInputs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border px-4 py-3"
                style={{
                  borderColor: `${accentColor}60`,
                  boxShadow: `0 0 18px ${accentColor}66`,
                }}
              >
                <p
                  className="text-[11px] font-semibold mb-0.5"
                  style={{ color: `${accentColor}` }}
                >
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Center finance core */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[320px] aspect-square">
              <div
                className="absolute inset-[12%] rounded-full border"
                style={{ borderColor: `${accentColor}60` }}
              />
              <div
                className="absolute inset-[26%] rounded-full border"
                style={{ borderColor: `${accent2}45` }}
              />

              {/* finance chart pulse */}
              <svg className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id="financeFlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={accent3} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={accent2} stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 120 L 34 88 L 55 104 L 80 62 L 100 80 L 140 40"
                  fill="none"
                  stroke="url(#financeFlow)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>

              {/* orbiting system labels */}
              {orbitItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="absolute rounded-xl bg-slate-950/75 border px-2.5 py-1.5 text-[10px] text-white shadow-[0_0_18px_rgba(245,158,11,0.4)] animate-float"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: "translate(-50%, -50%)",
                    borderColor: `${accentColor}40`,
                    animationDuration: `${6 + idx}s`,
                    animationDelay: `${idx * 0.2}s`,
                  }}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-[9px] text-ehb-textBody">{item.sub}</p>
                </div>
              ))}

              {/* core glow */}
              <div
                className="absolute inset-[28%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 15%, rgba(248,250,252,0.95), transparent 55%), radial-gradient(circle at 50% 70%, rgba(245,158,11,0.95), transparent 65%)",
                  boxShadow: `0 0 40px ${accentColor}cc, 0 0 80px rgba(34,197,94,0.35)`,
                }}
              />

              <div
                className="absolute inset-[20%] rounded-full border animate-spin-slow pointer-events-none"
                style={{ borderColor: `${accent2}70` }}
              />

              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] text-ehb-textBody mb-1"
                  >
                    EHB FINANCE CORE
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-white mb-1">
                    AI Protected Transactions
                  </p>
                  <p className="text-[10px] text-white">
                    User → verified offers → secure wallet → tracked outcomes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {rightOutputs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border px-4 py-3"
                style={{
                  borderColor: `${accentColor}45`,
                  boxShadow: `0 0 18px ${accentColor}55`,
                }}
              >
                <p
                  className="text-[11px] font-semibold mb-0.5"
                  style={{ color: `${accentColor}` }}
                >
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[10px] text-ehb-textMuted text-center relative">
          Stylised finance flow. In production, real offers, wallet releases and reports will use
          the same verified system layers.
        </p>
      </div>
    </section>
  );
}

