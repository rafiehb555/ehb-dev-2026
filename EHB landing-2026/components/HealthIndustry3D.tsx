"use client";

/**
 * HealthIndustry3D
 *
 * Stylised 3D-like visual for the Health industry landing page.
 * Focuses on trust, verification and safe patient–doctor flows.
 */

export function HealthIndustry3D() {
  const orbitItems = [
    { label: "PSS", sub: "Verify doctor identity", x: "14%", y: "14%" },
    { label: "DMO", sub: "Check service quality", x: "82%", y: "18%" },
    { label: "JPS", sub: "Connect patients & doctors", x: "16%", y: "82%" },
    { label: "Refilling", sub: "Ensure availability", x: "82%", y: "82%" },
    { label: "Franchise", sub: "Manage local clinics", x: "6%", y: "50%" },
    { label: "EHB‑STL", sub: "Secure payment", x: "92%", y: "50%" },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        How Health Services Flow on EHB
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Patients, doctors, and AI in a verified system
      </h2>
      <p className="text-slate-400 max-w-3xl mb-8 text-sm md:text-base">
        Patients share their need, EHB suggests the best verified doctor, and every step – from
        appointment to payment – is checked by intelligent systems.
      </p>

      <div className="relative rounded-3xl glass-card border border-sky-400/40 px-4 sm:px-6 py-8 md:py-10 overflow-hidden">
        {/* background */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.2), transparent 55%), radial-gradient(circle at 0% 80%, rgba(59,130,246,0.18), transparent 55%), radial-gradient(circle at 100% 80%, rgba(34,197,94,0.14), transparent 55%)",
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

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.3fr)] items-center">
          {/* Left inputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "Patient",
                emoji: "👤",
                desc: "Needs consultation, diagnosis, or treatment.",
              },
              {
                title: "Doctor",
                emoji: "🩺",
                desc: "Provides medical services after verification.",
              },
              {
                title: "Clinic / Hospital",
                emoji: "🏥",
                desc: "Hosts appointments, labs, and ongoing care.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border border-sky-400/60 px-4 py-3 shadow-[0_0_18px_rgba(56,189,248,0.4)]"
              >
                <p className="text-[11px] font-semibold text-sky-100 mb-0.5">
                  <span aria-hidden className="mr-2">
                    {item.emoji}
                  </span>
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Center Health core */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[320px] aspect-square">
              {/* outer rings */}
              <div className="absolute inset-[12%] rounded-full border border-sky-300/60" />
              <div className="absolute inset-[26%] rounded-full border border-cyan-300/60" />

              {/* heartbeat line */}
              <svg className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id="healthFlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <path
                  d="M 8 50 L 26 50 L 32 40 L 40 60 L 48 32 L 56 68 L 64 50 L 92 50"
                  fill="none"
                  stroke="url(#healthFlow)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>

              {/* orbiting system labels */}
              {orbitItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="absolute rounded-xl bg-slate-950/75 border border-white/30 px-2.5 py-1.5 text-[10px] text-slate-100 shadow-[0_0_18px_rgba(56,189,248,0.7)] animate-float"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: "translate(-50%, -50%)",
                    animationDuration: `${6 + idx}s`,
                    animationDelay: `${idx * 0.25}s`,
                  }}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-[9px] text-slate-300">{item.sub}</p>
                </div>
              ))}

              {/* core glow */}
              <div
                className="absolute inset-[28%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 20%, rgba(248,250,252,0.95), transparent 55%), radial-gradient(circle at 50% 70%, rgba(59,130,246,0.95), transparent 65%)",
                  boxShadow:
                    "0 0 40px rgba(59,130,246,0.95), 0 0 80px rgba(34,211,238,0.7)",
                }}
              />

              {/* slow rotating ring */}
              <div className="absolute inset-[20%] rounded-full border border-cyan-300/70 animate-spin-slow pointer-events-none" />

              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100 mb-1">
                    EHB HEALTH CORE
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-sky-50 mb-1">
                    AI Diagnosis + Smart Matching
                  </p>
                  <p className="text-[10px] text-slate-100">
                    System brain for verified patient care
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "Appointment booked",
                desc: "Patient gets a clear, confirmed time with a verified doctor.",
              },
              {
                title: "Treatment provided",
                desc: "Consultation, tests, and follow‑up guided in the safe path.",
              },
              {
                title: "Payment completed",
                desc: "Secure wallet payment is released after verification steps.",
              },
              {
                title: "Health records updated",
                desc: "Feedback captured and record saved for next appointments.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border border-emerald-400/50 px-4 py-3 shadow-[0_0_18px_rgba(52,211,153,0.4)]"
              >
                <p className="text-[11px] font-semibold text-emerald-100 mb-0.5">
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flow strip (explicit, beginner-friendly) */}
        <div
          className="mt-6 rounded-2xl glass-panel border border-sky-400/30 px-4 py-3"
          style={{
            boxShadow: "0 0 18px rgba(56,189,248,0.18)",
          }}
        >
          <p className="text-[11px] font-semibold text-sky-100 mb-1">Flow</p>
          <p className="text-[10px] text-slate-200 leading-relaxed">
            Patient → AI suggests best doctor → Appointment → Treatment → Verified → Payment → Feedback → Record saved
          </p>
        </div>

        <p className="mt-4 text-[10px] text-slate-500 text-center">
          Clean, verified, and safety-focused. In production, real doctors, appointments, and
          records move through the same EHB layers.
        </p>
      </div>
    </section>
  );
}

