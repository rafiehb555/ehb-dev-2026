"use client";

type Props = {
  selectedAccent: string;
};

const INDUSTRIES = [
  { name: "Education", icon: "📚", accent: "#E53935" },
  { name: "Health", icon: "🩺", accent: "#29ABE2" },
  { name: "IT", icon: "💻", accent: "#3B82F6" },
  { name: "Finance", icon: "💰", accent: "#F59E0B" },
  { name: "Delivery", icon: "🚚", accent: "#FB923C" },
  { name: "Business", icon: "🏢", accent: "#22B14C" },
];

export function FranchiseIndustryMarquee({ selectedAccent }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl glass-panel border border-white/10 p-4"
      style={{
        boxShadow: `0 0 28px ${selectedAccent}22`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute left-[-20%] top-[-40%] h-80 w-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: selectedAccent }}
        />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">
            Other industries franchise cards
          </p>
          <span className="text-[11px] text-ehb-textMuted">slowly moving</span>
        </div>

        <div className="franchise-marquee">
          <div className="franchise-marquee-track">
            {[...INDUSTRIES, ...INDUSTRIES].map((ind, idx) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${ind.name}_${idx}`}
                className="franchise-marquee-card rounded-2xl glass-card border px-4 py-4 min-w-[190px] flex items-center gap-3"
                style={{
                  borderColor: `${ind.accent}33`,
                  boxShadow: `0 0 22px ${ind.accent}14`,
                }}
              >
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${ind.accent}18`,
                    borderColor: `${ind.accent}40`,
                    boxShadow: `0 0 22px ${ind.accent}20`,
                  }}
                  aria-hidden
                >
                  <span className="text-lg">{ind.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{ind.name} Franchise</p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[10px] font-semibold border-white/10 bg-white/5 text-ehb-textBody">
                    <span aria-hidden>⏳</span>
                    Coming soon
                  </p>
                  <p className="text-[11px] text-ehb-textMuted truncate mt-2">
                    GoSellr GSM verified system coming for this industry.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .franchise-marquee {
          position: relative;
        }
        .franchise-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: franchiseMarquee 22s linear infinite;
          will-change: transform;
        }
        @keyframes franchiseMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

