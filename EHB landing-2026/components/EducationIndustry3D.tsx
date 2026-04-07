"use client";

/**
 * EducationIndustry3D
 *
 * Stylised 3D-like trust + learning flow visual for the Education industry landing page.
 * Focuses on verification (PSS), quality (DMO), matching (JPS), and secure outcomes.
 */

export function EducationIndustry3D({ accentColor = "#E53935" }: { accentColor?: string }) {
  const accent2 = "#F97316";
  const accent3 = "#EC4899";

  const orbitItems = [
    { label: "PSS", sub: "Verify teachers" },
    { label: "DMO", sub: "Check course quality" },
    { label: "JPS", sub: "Match learners & tracks" },
    { label: "Refilling", sub: "Keep courses updated" },
    { label: "Franchise", sub: "Local learning centers" },
    { label: "EHB‑STL", sub: "Secure learning payments" },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        How Education Services Flow on EHB
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Learn with verified teachers, safe payments, and real progress
      </h2>
      <p className="text-ehb-textMuted max-w-3xl mb-8 text-sm md:text-base">
        Students get AI-matched learning paths. Teachers are verified for trust. Payments and
        progress move through secure, monitored steps.
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
                "radial-gradient(circle at 50% 0%, rgba(229,57,53,0.22), transparent 55%), radial-gradient(circle at 0% 80%, rgba(249,115,22,0.18), transparent 55%), radial-gradient(circle at 100% 80%, rgba(236,72,153,0.14), transparent 55%)",
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
                title: "Student",
                desc: "Learns a skill, course, or training track.",
              },
              {
                title: "Teacher",
                desc: "Provides verified education and mentorship.",
              },
              {
                title: "Learning Center",
                desc: "Supports labs, classes, and study programs.",
              },
            ].map((item) => (
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

          {/* Center Education core */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-[320px] aspect-square">
              {/* orbit rings */}
              <div className="absolute inset-[12%] rounded-full border" style={{ borderColor: `${accentColor}60` }} />
              <div className="absolute inset-[26%] rounded-full border" style={{ borderColor: `${accent3}45` }} />

              {/* learning progress line */}
              <svg className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id="eduFlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={accent2} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={accent3} stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 90 C 30 60, 50 60, 70 70 S 95 95, 120 80"
                  fill="none"
                  stroke="url(#eduFlow)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <path
                  d="M 40 100 L 92 60 L 120 70"
                  fill="none"
                  stroke="url(#eduFlow)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="animate-pulse"
                  opacity="0.7"
                />
              </svg>

              {/* orbiting system labels */}
              {orbitItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="absolute rounded-xl bg-slate-950/75 border px-2.5 py-1.5 text-[10px] text-slate-100 shadow-[0_0_18px_rgba(229,57,53,0.55)] animate-float"
                  style={{
                    left: idx % 2 === 0 ? `${14 + (idx * 10) % 80}%` : `${18 + (idx * 12) % 70}%`,
                    top: idx < 3 ? `${12 + idx * 18}%` : `${52 + (idx - 3) * 12}%`,
                    transform: "translate(-50%, -50%)",
                    borderColor: `${accentColor}40`,
                    animationDuration: `${6 + idx}s`,
                    animationDelay: `${idx * 0.2}s`,
                  }}
                >
                  <p className="font-semibold" style={{ color: `${accentColor}` }}>
                    {item.label}
                  </p>
                  <p className="text-[9px] text-ehb-textBody">{item.sub}</p>
                </div>
              ))}

              {/* core glow */}
              <div
                className="absolute inset-[28%] rounded-full"
                style={{
                  background: `radial-gradient(circle at 50% 15%, rgba(248,250,252,0.95), transparent 55%), radial-gradient(circle at 50% 70%, ${accentColor}cc, transparent 65%)`,
                  boxShadow: `0 0 40px ${accentColor}dd, 0 0 80px rgba(236,72,153,0.35)`,
                }}
              />

              {/* slow rotating ring */}
              <div
                className="absolute inset-[20%] rounded-full border animate-spin-slow pointer-events-none"
                style={{ borderColor: `${accent2}70` }}
              />

              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: `${accentColor}` }}>
                    EHB EDUCATION CORE
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-sky-50 mb-1">
                    Verified Learning AI
                  </p>
                  <p className="text-[10px] text-slate-100">
                    Student → AI Path → Verified teaching → Progress & records
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="space-y-3 text-xs md:text-sm">
            {[
              {
                title: "Lesson started",
                desc: "Matched content starts with verified teachers.",
              },
              {
                title: "Skills unlocked",
                desc: "Step-by-step progress through courses and practice.",
              },
              {
                title: "Verified certificate",
                desc: "Quality monitoring and completion tracking.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border px-4 py-3"
                style={{
                  borderColor: `${accentColor}50`,
                  boxShadow: `0 0 18px ${accentColor}55`,
                }}
              >
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: `${accentColor}` }}>
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
            <div
              className="rounded-2xl glass-panel border px-4 py-3"
              style={{
                borderColor: `${accent2}40`,
                boxShadow: `0 0 16px ${accent2}40`,
              }}
            >
              <p className="text-[11px] font-semibold mb-0.5" style={{ color: `${accent2}` }}>
                Payment & progress record
              </p>
              <p className="text-[11px] md:text-xs text-ehb-textBody">
                Secure payment, feedback and learning records.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-[10px] text-slate-500 text-center relative">
          Stylised education flow. In production, real courses, assignments and verification steps
          will move through the same verified system layers.
        </p>
      </div>
    </section>
  );
}

