"use client";

/**
 * EHBSystem3D
 *
 * A stylised "3D" system visual using layered gradients, glow and motion.
 * Optimised for performance (transform + opacity only), no heavy 3D engine.
 *
 * Layout:
 * - Left: input cards (User, Company, Service Provider)
 * - Center: EHB Core orb with orbiting departments
 * - Right: output cards (Verified Services, Products, Jobs, Earnings)
 */

export function EHBSystem3D() {
  const orbitItems = [
    { label: "PSS", sub: "Verification", x: "14%", y: "12%" },
    { label: "DMO", sub: "Quality Control", x: "82%", y: "18%" },
    { label: "JPS", sub: "Jobs System", x: "16%", y: "82%" },
    { label: "Refilling", sub: "Continuity", x: "82%", y: "82%" },
    { label: "Franchise", sub: "Local Ops", x: "6%", y: "50%" },
    { label: "EHB‑STL", sub: "Secure TX", x: "92%", y: "50%" },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        How EHB Works
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        EHB verifies, manages, and connects the whole ecosystem
      </h2>
      <p className="text-slate-400 max-w-3xl mb-8 text-sm md:text-base">
        Users, companies, and providers enter on the left. EHB Core checks everything through
        intelligent departments, then delivers verified services, products, jobs, and earnings on the
        right.
      </p>

      <div className="relative rounded-3xl glass-card border border-sky-500/25 px-4 sm:px-6 py-8 md:py-10 overflow-hidden">
        {/* subtle background grid + glow */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 10%, rgba(56,189,248,0.14), transparent 60%), radial-gradient(circle at 10% 90%, rgba(129,140,248,0.16), transparent 60%), radial-gradient(circle at 90% 80%, rgba(45,212,191,0.14), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)_minmax(0,1.2fr)] items-center">
          {/* Left inputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "User",
                desc: "Creates profile, searches and books services, applies for jobs.",
              },
              {
                title: "Company",
                desc: "Posts jobs, buys services and products across industries.",
              },
              {
                title: "Service Provider",
                desc: "Offers verified services and products in chosen industries.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border border-sky-500/40 px-4 py-3 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
              >
                <p className="text-[11px] font-semibold text-sky-200 mb-0.5">{item.title}</p>
                <p className="text-[11px] md:text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Center core with orbit */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[320px] aspect-square">
              {/* orbit lines */}
              <div className="absolute inset-[12%] rounded-full border border-sky-400/40" />
              <div className="absolute inset-[26%] rounded-full border border-violet-400/40" />

              {/* departments on orbit */}
              {orbitItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="absolute rounded-xl bg-slate-950/60 border border-white/20 px-2.5 py-1.5 text-[10px] text-slate-100 shadow-[0_0_16px_rgba(56,189,248,0.4)] animate-float"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: "translate(-50%, -50%)",
                    animationDuration: `${6 + idx}s`,
                    animationDelay: `${idx * 0.2}s`,
                  }}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-[9px] text-slate-300">{item.sub}</p>
                </div>
              ))}

              {/* center glow */}
              <div
                className="absolute inset-[28%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 20%, rgba(248,250,252,0.9), transparent 55%), radial-gradient(circle at 50% 70%, rgba(56,189,248,0.9), transparent 65%)",
                  boxShadow:
                    "0 0 40px rgba(56,189,248,0.8), 0 0 80px rgba(129,140,248,0.6)",
                }}
              />

              {/* subtle rotating ring */}
              <div className="absolute inset-[20%] rounded-full border border-cyan-400/40 animate-spin-slow pointer-events-none" />

              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-sky-100 mb-1">
                    EHB CORE
                  </p>
                  <p className="text-lg sm:text-xl font-bold gradient-text-new mb-1">
                    Verified Ecosystem
                  </p>
                  <p className="text-[10px] text-slate-100">
                    Verifies → Manages → Delivers trusted services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "Verified Services",
                desc: "Only services that pass PSS and DMO checks are promoted.",
              },
              {
                title: "Products & Jobs",
                desc: "Users discover jobs and products that match their profile.",
              },
              {
                title: "Earnings",
                desc: "Users, providers, and franchises all share in successful transactions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border border-emerald-500/40 px-4 py-3 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <p className="text-[11px] font-semibold text-emerald-200 mb-0.5">
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* simplified fallback note for very small screens */}
        <p className="mt-5 text-[10px] text-slate-500 text-center">
          On smaller or low‑power devices this visual uses a simplified 2D layout for smooth
          performance.
        </p>
      </div>
    </section>
  );
}

