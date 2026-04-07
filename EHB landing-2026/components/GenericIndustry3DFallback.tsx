"use client";

/**
 * GenericIndustry3DFallback
 *
 * Simpler fallback visual for industries without a bespoke 3D component.
 * (Kept lightweight to avoid build parsing issues.)
 */

export function GenericIndustry3DFallback({
  accentColor,
  industryName,
}: {
  accentColor: string;
  industryName: string;
}) {
  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
        Verified flow in {industryName}
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        PSS → DMO → JPS → Refilling → EHB‑STL
      </h2>
      <p className="text-ehb-textMuted max-w-3xl mb-8 text-sm md:text-base">
        EHB verifies providers, uses AI matching, ensures availability, and releases secure payments
        only through trusted steps.
      </p>

      <div
        className="relative rounded-3xl glass-card border px-4 sm:px-6 py-8 md:py-10 overflow-hidden"
        style={{ borderColor: `${accentColor}55` }}
      >
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, ${accentColor}2e, transparent 55%), radial-gradient(circle at 0% 80%, rgba(41, 171, 226,0.18), transparent 55%), radial-gradient(circle at 100% 80%, rgba(139,92,246,0.12), transparent 55%)`,
          }}
        />

        <div className="relative grid gap-4 lg:grid-cols-3 items-start">
          <div className="space-y-3 text-xs md:text-sm">
            {[
              { title: "User request", color: accentColor, desc: "Shares what they need in this industry." },
              { title: "Verified provider", color: accentColor, desc: "Approved after identity + quality checks." },
              { title: "AI matching", color: accentColor, desc: "Finds best fit based on need and location." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl glass-panel border px-4 py-3"
                style={{ borderColor: `${accentColor}50` }}
              >
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: item.color }}>
                  {item.title}
                </p>
                <p className="text-[11px] md:text-xs text-ehb-textBody">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl glass-panel border p-5 border-white/10">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted mb-3">
                Output steps
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Refilling", desc: "Availability ensured for active providers." },
                  { title: "Verified results", desc: "Only checked services & products." },
                  { title: "Secure payment", desc: "EHB‑STL protected transactions." },
                  { title: "Feedback & records", desc: "Proof saved for next actions." },
                ].map((o) => (
                  <div
                    key={o.title}
                    className="rounded-2xl glass-panel border px-4 py-3"
                    style={{ borderColor: `${accentColor}30` }}
                  >
                    <p className="text-[11px] font-semibold mb-1" style={{ color: accentColor }}>
                      {o.title}
                    </p>
                    <p className="text-[10px] text-ehb-textBody">{o.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[10px] text-ehb-textMuted">
              Stylised fallback. Production will feed real data into the same trust layers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

