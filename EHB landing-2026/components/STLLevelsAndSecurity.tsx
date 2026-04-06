import React from "react";

type StlLevel = {
  label: string;
  industryRequirement: string;
  accent: string;
};

type SecurityLevel = {
  name: "Basic Secure" | "Medium Secure" | "High Secure" | "Premium Secure";
  arrowLine: string;
  accent: string;
};

const STL_LEVELS: StlLevel[] = [
  { label: "FREE : 0–30", industryRequirement: "Industry Requirement: None", accent: "#94a3b8" },
  {
    label: "BASIC : 31–50",
    industryRequirement: "Industry Requirement: 0–1 Industry",
    accent: "#60a5fa",
  },
  {
    label: "MEDIUM : 51–70",
    industryRequirement: "Industry Requirement: 1–2 Industries",
    accent: "#22c55e",
  },
  {
    label: "HIGH : 71–85",
    industryRequirement: "Industry Requirement: 2–3 Industries",
    accent: "#f59e0b",
  },
  { label: "VIP : 86–100", industryRequirement: "Industry Requirement: 3+ Industries", accent: "#3b82f6" },
];

const SECURITY_LEVELS: SecurityLevel[] = [
  {
    name: "Basic Secure",
    arrowLine: "→ Document Upload",
    accent: "#94a3b8",
  },
  {
    name: "Medium Secure",
    arrowLine: "→ Document + On-site Audit",
    accent: "#60a5fa",
  },
  {
    name: "High Secure",
    arrowLine: "→ CRB Inspection + Certificate",
    accent: "#f59e0b",
  },
  {
    name: "Premium Secure",
    arrowLine: "→ Multiple Industry Certifications",
    accent: "#3b82f6",
  },
];

function LevelCard({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <div
      className="rounded-2xl glass-card border p-5 card-hover transition-all duration-300"
      style={{ borderColor: `${accent}40`, boxShadow: `0 0 26px ${accent}16` }}
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{subtitle}</p>
    </div>
  );
}

export function STLLevelsAndSecurity() {
  return (
    <section className="container-ultra section-pad-ultra pt-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Verification levels</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        STL + Security (Trust made simple)
      </h2>
      <p className="text-slate-400 max-w-2xl mb-7 text-sm md:text-base">
        STL is your trust score. Security levels explain how deep your verification goes.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        {STL_LEVELS.map((l) => (
          <LevelCard
            key={l.label}
            title={l.label}
            subtitle={l.industryRequirement}
            accent={l.accent}
          />
        ))}
      </div>

      <div className="mt-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Security tiers</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY_LEVELS.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl glass-card border p-5 card-hover transition-all duration-300"
              style={{ borderColor: `${s.accent}40`, boxShadow: `0 0 26px ${s.accent}16` }}
            >
              <p className="text-sm font-semibold text-white">{s.name}</p>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{s.arrowLine}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

