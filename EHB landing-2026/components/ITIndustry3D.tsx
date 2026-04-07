"use client";

/**
 * ITIndustry3D
 *
 * Stylised 3D-like visual for the IT industry landing page.
 * Mirrors the EHBSystem3D structure but focused on developers, clients, and projects.
 */

export function ITIndustry3D() {
  const accent = "#3B82F6";

  const orbitItems = [
    { label: "PSS", sub: "Verify developers", x: "14%", y: "14%" },
    { label: "DMO", sub: "Quality checks", x: "82%", y: "18%" },
    { label: "JPS", sub: "Job matching", x: "16%", y: "82%" },
    { label: "Refilling", sub: "New projects", x: "82%", y: "82%" },
    { label: "Franchise", sub: "Local ops", x: "6%", y: "50%" },
    { label: "EHB‑STL", sub: "Secure payment", x: "92%", y: "50%" },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        How IT Projects Flow on EHB
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Developers, clients, and AI working together
      </h2>
      <p className="text-ehb-textMuted max-w-3xl mb-8 text-sm md:text-base">
        Clients post projects, EHB AI finds the best developers, and every step is verified – from
        first message to final payment and rating.
      </p>

      <div className="relative rounded-3xl glass-card border border-sky-500/30 px-4 sm:px-6 py-8 md:py-10 overflow-hidden">
        {/* background */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at 0% 80%, rgba(96,165,250,0.18), transparent 55%), radial-gradient(circle at 100% 80%, rgba(45,212,191,0.14), transparent 55%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.9) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
            }}
          />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.3fr)] items-center">
          {/* Left inputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "Client",
                desc: "Posts a project: website, app, or custom software.",
              },
              {
                title: "Developer",
                desc: "Shares skills in web, mobile, backend, UI/UX, and more.",
              },
              {
                title: "Company",
                desc: "Manages multiple projects, teams, and long‑term work.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border border-sky-500/50 px-4 py-3 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
              >
                <p className="text-[11px] font-semibold text-sky-200 mb-0.5">{item.title}</p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Center IT core */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[320px] aspect-square">
              {/* orbit rings */}
              <div className="absolute inset-[12%] rounded-full border border-sky-400/50" />
              <div className="absolute inset-[26%] rounded-full border border-indigo-400/50" />

              {/* flow arrow lines (client -> core -> output) */}
              <svg className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id="itFlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 50 Q 30 40 50 50 Q 70 60 90 50"
                  fill="none"
                  stroke="url(#itFlow)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>

              {/* orbiting system labels */}
              {orbitItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="absolute rounded-xl bg-slate-950/70 border border-white/25 px-2.5 py-1.5 text-[10px] text-slate-100 shadow-[0_0_16px_rgba(56,189,248,0.55)] animate-float"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: "translate(-50%, -50%)",
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
                    "radial-gradient(circle at 50% 15%, rgba(248,250,252,0.9), transparent 55%), radial-gradient(circle at 50% 70%, rgba(59,130,246,0.95), transparent 65%)",
                  boxShadow:
                    "0 0 40px rgba(59,130,246,0.9), 0 0 80px rgba(45,212,191,0.65)",
                }}
              />

              {/* slow rotating ring */}
              <div className="absolute inset-[20%] rounded-full border border-cyan-400/60 animate-spin-slow pointer-events-none" />

              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100 mb-1">
                    EHB IT CORE
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-sky-50 mb-1">
                    AI Project Brain
                  </p>
                  <p className="text-[10px] text-slate-100">
                    Client → AI Matching → Developer → Verified Payment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "Completed Project",
                desc: "Websites, apps, and systems delivered with clear milestones.",
              },
              {
                title: "Secure Payment",
                desc: "EHB‑STL handles payment release only after verification.",
              },
              {
                title: "Rating & Long‑term client",
                desc: "Good work improves ratings and leads to repeat projects.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border border-emerald-500/40 px-4 py-3 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
              >
                <p className="text-[11px] font-semibold text-emerald-200 mb-0.5">
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[10px] text-slate-500 text-center">
          This visual is a stylised representation. In production, real project and payment data will
          feed into the same flow.
        </p>
      </div>
    </section>
  );
}

