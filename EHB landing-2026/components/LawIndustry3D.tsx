"use client";

/**
 * LawIndustry3D
 *
 * Stylised 3D-like trust + legal verification flow for the Law industry landing page.
 */

export function LawIndustry3D({ accentColor = "#6B7280" }: { accentColor?: string }) {
  const accent2 = "#3B82F6";
  const accent3 = "#F59E0B";

  const orbitItems = [
    { label: "PSS", sub: "Verify lawyers", x: "14%", y: "14%" },
    { label: "DMO", sub: "Case & doc quality", x: "82%", y: "18%" },
    { label: "JPS", sub: "Match legal needs", x: "16%", y: "82%" },
    { label: "Refilling", sub: "Availability updates", x: "82%", y: "82%" },
    { label: "Franchise", sub: "Local legal centers", x: "6%", y: "50%" },
    { label: "EHB‑STL", sub: "Secure settlement", x: "92%", y: "50%" },
  ];

  const leftInputs = [
    { title: "Client", desc: "Needs contract, case support, or legal advice." },
    { title: "Lawyer", desc: "Provides verified legal services and representation." },
    { title: "Legal Firm / Court", desc: "Runs hearings, document handling, and review." },
  ];

  const rightOutputs = [
    { title: "Contract drafted", desc: "Clear terms with verified document flow." },
    { title: "Case supported", desc: "Guided steps with quality monitoring." },
    { title: "Court-ready docs", desc: "Prepared paperwork with traceable checks." },
    { title: "Secure legal record", desc: "Verified record saved after settlement." },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        How Legal Work Flows on EHB
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Verified legal services with safe steps
      </h2>
      <p className="text-ehb-textMuted max-w-3xl mb-8 text-sm md:text-base">
        EHB helps clients find verified lawyers, draft documents safely, and complete legal steps
        with secure payments and quality monitoring.
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
                "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.18), transparent 55%), radial-gradient(circle at 0% 80%, rgba(245,158,11,0.14), transparent 55%), radial-gradient(circle at 100% 80%, rgba(107,114,128,0.12), transparent 55%)",
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
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: `${accentColor}` }}>
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Center law core */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[320px] aspect-square">
              <div
                className="absolute inset-[12%] rounded-full border"
                style={{ borderColor: `${accentColor}60` }}
              />
              <div
                className="absolute inset-[26%] rounded-full border"
                style={{ borderColor: `${accent3}45` }}
              />

              {/* law verification check line */}
              <svg className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id="lawFlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={accent2} stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 62 C 28 40, 44 44, 55 56 S 80 78, 94 36"
                  fill="none"
                  stroke="url(#lawFlow)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>

              {/* orbiting system labels */}
              {orbitItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="absolute rounded-xl bg-slate-950/75 border px-2.5 py-1.5 text-[10px] text-slate-100 shadow-[0_0_18px_rgba(156,163,175,0.55)] animate-float"
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
                    "radial-gradient(circle at 50% 15%, rgba(248,250,252,0.95), transparent 55%), radial-gradient(circle at 50% 70%, rgba(59,130,246,0.95), transparent 65%)",
                  boxShadow: `0 0 40px ${accentColor}aa, 0 0 80px rgba(59,130,246,0.6)`,
                }}
              />

              <div
                className="absolute inset-[20%] rounded-full border animate-spin-slow pointer-events-none"
                style={{ borderColor: `${accent2}70` }}
              />

              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-200 mb-1">
                    EHB LAW CORE
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-50 mb-1">
                    Verified Legal AI
                  </p>
                  <p className="text-[10px] text-slate-100">
                    Client → AI Match → Verified docs → Safe settlement
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
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: `${accentColor}` }}>
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[10px] text-slate-500 text-center relative">
          Stylised legal flow. In production, documents, verification, and secure settlement use the
          same verified system layers.
        </p>
      </div>
    </section>
  );
}

