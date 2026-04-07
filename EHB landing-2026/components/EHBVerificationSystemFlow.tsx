import React from "react";

function Step({
  icon,
  title,
  desc,
  accent,
}: {
  icon: string;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl glass-panel border px-4 py-3"
      style={{
        borderColor: `${accent}45`,
        boxShadow: `0 0 24px ${accent}22`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-11 w-11 rounded-2xl flex items-center justify-center border text-lg"
          aria-hidden
          style={{
            backgroundColor: `${accent}18`,
            borderColor: `${accent}33`,
            boxShadow: `0 0 18px ${accent}25`,
          }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[11px] text-ehb-textBody mt-0.5 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function FlowConnector({ accent }: { accent: string }) {
  return (
    <svg aria-hidden className="w-full h-6 animate-pulse" viewBox="0 0 220 40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="verLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path
        d="M 10 20 C 60 20, 70 20, 90 20 S 130 20, 210 20"
        fill="none"
        stroke="url(#verLine)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="6 10"
      />
      <path
        d="M 198 8 L 210 20 L 198 32"
        fill="none"
        stroke="url(#verLine)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EHBVerificationSystemFlow() {
  const accent = "#00AEEF";
  const accent2 = "#8B5CF6";

  const steps = [
    { icon: "📩", title: "Submission", desc: "You submit a service/product request.", accent: accent },
    { icon: "🛡️", title: "PSS Document Check", desc: "Identity documents and safety requirements are verified.", accent: accent },
    { icon: "🧪", title: "CRB Practical Certification & Registry", desc: "A practical certification proves skills, licenses, and quality. CRB registers verified outcomes in the registry board.", accent: accent2 },
    { icon: "📊", title: "DMO Monitoring", desc: "Continuous monitoring ensures consistent quality and safety.", accent: accent },
    { icon: "💬", title: "User Feedback", desc: "Users give feedback, improving matching and quality.", accent: accent2 },
    { icon: "🔄", title: "Re-verification", desc: "Re-verified every 6 months to keep trust strong.", accent: accent },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        Verification System
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">How 700+ Services Are 100% Verified</h2>

      <div className="rounded-3xl glass-card border px-4 sm:px-6 py-8 md:py-10 border-[#00eaff]/20 overflow-hidden">
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <React.Fragment key={s.title}>
              <Step icon={s.icon} title={s.title} desc={s.desc} accent={s.accent} />
              {idx !== steps.length - 1 && <FlowConnector accent={accent} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

