import React from "react";

type Phase = {
  no: number;
  label: string;
  focus: string;
};

const PHASES: Phase[] = [
  { no: 1, label: "Phase 1 — Foundation", focus: "DMO, PSS, CRB, STL, Wallet" },
  { no: 2, label: "Phase 2 — Marketplace", focus: "GoSellr, Products, Services" },
  { no: 3, label: "Phase 3 — Professional Network", focus: "JPS, Jobs, Freelance" },
  { no: 4, label: "Phase 4 — Service Platforms", focus: "WMS, AGTS, OLS, SOT, HPS" },
  { no: 5, label: "Phase 5 — Digital Governance", focus: "Applications, Licenses" },
  { no: 6, label: "Phase 6 — Global Expansion", focus: "Multi-country" },
  { no: 7, label: "Phase 7 — AI Ecosystem", focus: "ML, Fraud Detection, NLP" },
  { no: 8, label: "Phase 8 — Blockchain Governance", focus: "Trust Network, Smart Contracts" },
];

function PhaseRow({ p }: { p: Phase }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl glass-card border p-5 card-hover transition-all duration-300">
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-semibold border"
        style={{
          backgroundColor: "rgba(41, 171, 226,0.10)",
          borderColor: "rgba(41, 171, 226,0.35)",
          boxShadow: "0 0 26px rgba(41, 171, 226,0.14)",
        }}
        aria-hidden
      >
        Phase {p.no}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{p.label}</p>
        <p className="text-[11px] text-ehb-textBody mt-1 leading-relaxed">{p.focus}</p>
      </div>
    </div>
  );
}

export function RoadmapPhasesSection() {
  return (
    <section className="container-ultra section-pad-ultra pt-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Future plans</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">EHB Roadmap (Phases 1–8)</h2>
      <p className="text-ehb-textMuted max-w-2xl mb-6 text-sm md:text-base">
        Clear phases so everyone can understand what’s coming next: trust → marketplace → professional network → global
        growth.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {PHASES.map((p) => (
          <PhaseRow key={p.no} p={p} />
        ))}
      </div>
    </section>
  );
}

