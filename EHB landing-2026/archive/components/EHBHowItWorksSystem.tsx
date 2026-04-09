/** Archived - not used in production */

import React from "react";

function Connector({ index }: { index: number }) {
  return (
    <svg
      aria-hidden
      className="w-full h-6 animate-pulse"
      viewBox="0 0 220 30"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`ehbFlowGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#29ABE2" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#29ABE2" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M10 15 C 60 15, 70 15, 90 15 S 130 15, 210 15"
        fill="none"
        stroke={`url(#ehbFlowGrad-${index})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 8"
      />
      <path
        d="M198 9 L 210 15 L 198 21"
        fill="none"
        stroke={`url(#ehbFlowGrad-${index})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Node({
  icon,
  label,
  subtitle,
  accent,
}: {
  icon: string;
  label: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl glass-panel border px-4 py-3"
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 0 24px ${accent}22`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center text-lg border"
          style={{
            backgroundColor: `${accent}18`,
            borderColor: `${accent}33`,
            boxShadow: `0 0 16px ${accent}28`,
          }}
          aria-hidden
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">{label}</p>
          <p className="text-[11px] text-ehb-textBody mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function EHBHowItWorksSystem() {
  const neonA = "#29ABE2";
  const neonB = "#8B5CF6";

  const steps = [
    {
      icon: "👤",
      label: "User / Company",
      subtitle: "Submits request for a service or product",
      accent: neonA,
    },
    {
      icon: "🛡️",
      label: "PSS",
      subtitle: "Verifies identity and prevents fake accounts",
      accent: neonA,
    },
    {
      icon: "📊",
      label: "DMO",
      subtitle: "Governance + verification coordination (EAP affiliate engine control)",
      accent: neonB,
    },
    {
      icon: "🤝",
      label: "JPS",
      subtitle: "Connects with jobs, opportunities, and buyers",
      accent: neonA,
    },
    {
      icon: "🧾",
      label: "CRB",
      subtitle: "Certification & registry board records verified outcomes",
      accent: neonB,
    },
    {
      icon: "💳",
      label: "EHW",
      subtitle: "Wallet for payments, earnings, and affiliate payouts",
      accent: neonA,
    },
    {
      icon: "🔒",
      label: "STL",
      subtitle: "AI trust scoring that controls ranking and visibility",
      accent: neonB,
    },
    {
      icon: "✅",
      label: "Verified Services & Products",
      subtitle: "Only trusted listings reach users",
      accent: neonA,
    },
  ];

  return (
    <div className="relative">
      <div className="space-y-4">
        {steps.map((s, idx) => (
          <React.Fragment key={s.label}>
            <div className={idx === 0 ? "animate-fade-in" : ""} style={{ animationDuration: "600ms" }}>
              <Node icon={s.icon} label={s.label} subtitle={s.subtitle} accent={s.accent} />
            </div>
            {idx !== steps.length - 1 && <Connector index={idx} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

