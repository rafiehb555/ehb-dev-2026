"use client";

/**
 * EHBDepartmentsFlow
 *
 * Horizontal pipeline-style visual showing how a request
 * moves through EHB departments, inspired by Web3 / node diagrams.
 */

const STEPS = [
  {
    id: "submission",
    label: "User / Provider",
    desc: "Submits service, product, or profile.",
    emoji: "👤",
  },
  {
    id: "pss",
    label: "PSS",
    desc: "Verifies identity and documents.",
    emoji: "🛡️",
  },
  {
    id: "dmo",
    label: "DMO",
    desc: "Monitors quality & activity.",
    emoji: "📋",
  },
  {
    id: "jps",
    label: "JPS",
    desc: "Connects with jobs & listings.",
    emoji: "🤝",
  },
  {
    id: "refilling",
    label: "Refilling",
    desc: "Keeps supply active & updated.",
    emoji: "🔄",
  },
  {
    id: "verified",
    label: "Verified Services & Products",
    desc: "Ready to show to users.",
    emoji: "✅",
  },
  {
    id: "ehb-stl",
    label: "EHB‑STL",
    desc: "Handles secure transactions.",
    emoji: "🔒",
  },
];

export function EHBDepartmentsFlow({
  accentColor = "#22d3ee",
  subtitle = "From submission → verification → live & secure.",
}: {
  accentColor?: string;
  subtitle?: string;
}) {
  const accent2 = "#38bdf8";
  const accent3 = "#8b5cf6";

  return (
    <div className="relative rounded-3xl glass-card border border-sky-400/40 p-6 md:p-7 overflow-hidden">
      {/* background glow + grid */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 0%, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at 85% 100%, rgba(129,140,248,0.22), transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.95) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.95) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className="px-3 py-1 rounded-full bg-slate-950/70 text-[11px] font-semibold text-sky-100"
            style={{
              border: `1px solid ${accentColor}70`,
              boxShadow: `0 0 16px ${accentColor}aa`,
            }}
          >
            EHB Intelligent Departments
          </span>
          <span className="text-[11px] text-ehb-textBody">
            {subtitle}
          </span>
        </div>

        {/* SVG pipeline */}
        <div className="relative mt-2 mb-3">
          <svg
            className="w-full h-28 md:h-32"
            viewBox="0 0 1000 200"
            role="img"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ehbLine" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
                <stop offset="50%" stopColor={accent2} stopOpacity="0.9" />
                <stop offset="100%" stopColor={accent3} stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* main line */}
            <path
              d="M 40 100 L 960 100"
              stroke="url(#ehbLine)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 10"
              style={{ opacity: 0.7 }}
            />
          </svg>

          {/* step nodes laid out with CSS, matching pipeline positions */}
          <div className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center gap-1 min-w-[72px]"
                style={{
                  animation: "float 6s ease-in-out infinite",
                  animationDelay: `${idx * 0.2}s`,
                }}
              >
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-950/80 border border-white/25 flex items-center justify-center"
                  style={{
                    borderColor: `${accentColor}55`,
                    boxShadow: `0 0 18px ${accentColor}aa`,
                  }}
                >
                  <span
                    className="text-[14px] leading-none"
                    aria-hidden
                    title={step.label}
                  >
                    {step.emoji}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* floating particles along the pipeline */}
          <div className="pointer-events-none absolute inset-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="absolute top-1/2 h-2 w-2 rounded-full"
                style={{
                  left: `${12 + i * 19}%`,
                  transform: "translate(-50%, -50%)",
                  background: `${accentColor}`,
                  opacity: 0.35,
                  boxShadow: `0 0 18px ${accentColor}aa`,
                  animation: `float ${5 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* legends under pipeline */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.slice(1, -1).map((step) => (
            <div
              key={step.id}
              className="rounded-2xl glass-panel border border-white/15 p-3 shadow-[0_0_12px_rgba(15,23,42,0.9)]"
            >
              <p
                className="text-[11px] font-semibold mb-1"
                style={{ color: `${accentColor}` }}
              >
                {step.label}
              </p>
              <p className="text-[10px] text-ehb-textBody">{step.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-ehb-textMuted pt-1">
          Every listing and profile passes through these layers so that 700+ services remain
          high‑quality, verified, and safe for users and partners.
        </p>
      </div>
    </div>
  );
}

