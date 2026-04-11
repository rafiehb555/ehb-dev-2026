"use client";

import Link from "next/link";

export function GoSellrGSMFranchiseMini() {
  return (
    <section className="container-ultra section-pad-ultra pt-0 pb-6">
      <div className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
          <div
            className="absolute -left-24 -top-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle at 30% 30%, rgba(0,234,239,0.35), transparent 55%)" }}
          />
          <div
            className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle at 30% 30%, rgba(34, 177, 76,0.25), transparent 55%)" }}
          />
        </div>

        <style>{`
          @keyframes gsGsmGlobePulse {
            0%,100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
            50% { transform: translate(-50%, -50%) scale(1.03); filter: brightness(1.18); }
          }
          @keyframes gsGsmOrbitSpin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes gsGsmOrbitFloat {
            0%,100% { transform: translate(-50%, -50%) translateY(0); }
            50% { transform: translate(-50%, -50%) translateY(-6px); }
          }
          @keyframes gsGsmRingDash {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -80; }
          }
        `}</style>

        <div className="relative grid gap-6 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-1">
              GoSellr GSM (E-Commerce) franchise
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Book your area and start earning with the verified system
            </h2>
            <p className="text-ehb-textMuted text-sm md:text-base max-w-2xl">
              Country → Corporate → Master → Sub franchises (Levels 1–10). GoSellr GSM Ecommerce is live for booking, and other industries are coming soon.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/franchise#booking"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#29ABE2] to-[#22B14C] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
              >
                Book GoSellr GSM franchise
              </Link>
              <Link
                href="/franchise#details"
                className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-ehb-textBody hover:bg-white/10 transition-all"
              >
                More information
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full px-3 py-[5px] text-[11px] font-semibold border border-emerald-400/40 bg-emerald-500/10 text-emerald-200">
                ✅ GSM Ecommerce live
              </span>
              <span className="rounded-full px-3 py-[5px] text-[11px] font-semibold border border-sky-400/40 bg-sky-500/10 text-sky-200">
                ⏳ Other industries coming soon
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-3">
              {/* 3D-like moving globe */}
              <div className="relative hidden sm:block h-[220px]">
                {/* ring */}
                <svg
                  viewBox="0 0 200 200"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  width={200}
                  height={200}
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="gsGsmRing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0,234,239,0.9)" />
                      <stop offset="55%" stopColor="rgba(59,130,246,0.6)" />
                      <stop offset="100%" stopColor="rgba(34, 177, 76,0.5)" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r="74"
                    fill="none"
                    stroke="url(#gsGsmRing)"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    style={{ animation: "gsGsmRingDash 2.4s linear infinite" }}
                  />
                </svg>

                {/* globe core */}
                <div
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: 150,
                    height: 150,
                    transform: "translate(-50%, -50%)",
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.20), transparent 40%), radial-gradient(circle at 55% 65%, rgba(0,234,239,0.22), transparent 55%), radial-gradient(circle at 50% 50%, rgba(2,12,27,0.6), rgba(2,12,27,0.95))",
                    boxShadow: "0 0 36px rgba(51, 195, 255,0.22), 0 0 90px rgba(41, 171, 226,0.12)",
                    border: "1px solid rgba(0,234,239,0.25)",
                    animation: "gsGsmGlobePulse 2.8s ease-in-out infinite",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "repeating-linear-gradient(135deg, rgba(0,234,239,0.10) 0 2px, transparent 2px 7px), radial-gradient(circle at 50% 50%, rgba(139,92,246,0.14), transparent 55%)",
                      opacity: 0.8,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">GSM</p>
                      <p className="text-lg font-bold text-sky-50 mt-1">Global Shopping</p>
                      <p className="text-[10px] text-white mt-0.5">E-Commerce Management</p>
                    </div>
                  </div>
                </div>

                {/* orbit icons */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: 170,
                    height: 170,
                    animation: "gsGsmOrbitSpin 18s linear infinite",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {[
                    { icon: "🛒", color: "rgba(0,234,239,0.9)" },
                    { icon: "🏷️", color: "rgba(59,130,246,0.9)" },
                    { icon: "🏪", color: "rgba(34, 177, 76,0.9)" },
                    { icon: "📦", color: "rgba(245,158,11,0.9)" },
                    { icon: "🌐", color: "rgba(139,92,246,0.9)" },
                  ].map((it, idx) => {
                    const angle = (360 / 5) * idx;
                    return (
                      <div
                        key={it.icon}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-84px) rotate(${-angle}deg)`,
                          animation: `gsGsmOrbitFloat ${3.4 + idx * 0.25}s ease-in-out infinite`,
                        }}
                      >
                        <div
                          className="rounded-full flex items-center justify-center border glass-panel"
                          style={{
                            width: 30,
                            height: 30,
                            backgroundColor: "rgba(2,12,27,0.55)",
                            borderColor: it.color,
                            boxShadow: `0 0 20px ${it.color}`,
                          }}
                        >
                          <span className="text-[14px]">{it.icon}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* hierarchy cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Country", icon: "🌍", color: "rgba(0,234,239,0.20)" },
                  { label: "Corporate", icon: "🏢", color: "rgba(34, 177, 76,0.18)" },
                  { label: "Master", icon: "🏆", color: "rgba(139,92,246,0.18)" },
                  { label: "Sub (1–10)", icon: "📦", color: "rgba(245,158,11,0.18)" },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="rounded-2xl glass-card border px-4 py-4"
                    style={{
                      borderColor: "rgba(148, 163, 184, 0.22)",
                      backgroundColor: x.color,
                      boxShadow: "0 0 22px rgba(51, 195, 255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-xl">
                        {x.icon}
                      </span>
                      <p className="text-sm font-semibold text-white">{x.label}</p>
                    </div>
                    <p className="text-[11px] text-ehb-textMuted mt-1">Verified onboarding + revenue share</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

