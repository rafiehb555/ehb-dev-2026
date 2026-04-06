export type DmoRoadmapPhase = {
  phase: string;
  range: string;
  desc: string;
  done: boolean;
  progress: number;
  statusLabel: string;
  outcomes: string[];
  nextFocus: string[];
};

export const DMO_ROADMAP_PHASES: DmoRoadmapPhase[] = [
  {
    phase: "Phase 1-3",
    range: "Setup",
    desc: "Platform infrastructure and core systems",
    done: true,
    progress: 100,
    statusLabel: "Complete",
    outcomes: [
      "Core DMO foundation and platform shell established",
      "Initial routing, layouts, and control surfaces connected",
      "Core trust system direction aligned with platform architecture",
    ],
    nextFocus: [],
  },
  {
    phase: "Phase 4-10",
    range: "Foundation",
    desc: "Identity, security, wallet, logistics live",
    done: true,
    progress: 100,
    statusLabel: "Complete",
    outcomes: [
      "Identity, PSS, wallet, STL, and certificates surfaced in DMO",
      "Franchise and inspection workflows linked into operational views",
      "Shared trust and governance blocks connected across modules",
    ],
    nextFocus: [],
  },
  {
    phase: "Phase 11-30",
    range: "Growth",
    desc: "AI Fraud Detection · AI Recommendations · GoSellr + DMO Integration",
    done: true,
    progress: 100,
    statusLabel: "Complete",
    outcomes: [
      "AI fraud orchestration: PSS/CRB/STL signals, DMO risk sync, block + analytics APIs",
      "AI surfaces: insights, trending, search suggest, match + feedback APIs on key pages",
      "GoSellr + DMO: seller onboarding API, high-value order review apps, escrow extend, complaint PATCH",
      "Unified DMO queue + analytics: applications, fraud, complaints, seller onboarding, order reviews, compliance",
    ],
    nextFocus: [
      "Harden production checks: rate limits and monitoring on fraud + AI routes",
      "Phase 31–50: industry verification depth, UK/EU launch prep, multi-currency wallet",
    ],
  },
  {
    phase: "Phase 31-50",
    range: "Scale",
    desc: "4 Priority Industries · UK/Europe Launch · 32 Industries Complete",
    done: false,
    progress: 20,
    statusLabel: "Planned",
    outcomes: [
      "4 industries fully verified + live: IT & AI, Health, Education, Logistics",
      "UK market live: GBP payments, GDPR compliant, UK franchise operational",
      "EU market live: Germany, Netherlands, Sweden, France (EUR, SEPA)",
      "All 32 industries with active landing pages and verified providers",
      "Multi-currency wallet: PKR, GBP, EUR, USD, AED",
    ],
    nextFocus: [
      "Phase 31–35: Verification standards for IT, Health, Education, Logistics industries",
      "Phase 36–40: UK/EU infrastructure — Stripe GBP/EUR, GDPR, UK franchise setup",
      "Phase 41–45: Country franchise layer — Pakistan → UK → EU scaling",
      "Phase 46–50: All 32 industries with landing pages, providers, DMO queues",
    ],
  },
  {
    phase: "Phase 51-80",
    range: "Global",
    desc: "4 Regional Hubs · AI Auto-Penalties · 50+ Countries · Full Governance",
    done: false,
    progress: 10,
    statusLabel: "Planned",
    outcomes: [
      "4 regional hubs operational: Asia (Lahore/Dubai), Europe (London), Americas (New York), Africa (Nairobi)",
      "AI auto-penalty system: automatic enforcement for rule violations across all countries",
      "50+ countries live with localized compliance, currency, and franchise",
      "Global Trust Score (0–1000) on every profile — unified across all modules",
      "DMO fully live: real-time operational data, no placeholders",
    ],
    nextFocus: [
      "Phase 51–55: Hub infrastructure — 4 regional DMO dashboards, hub franchise model",
      "Phase 56–62: AI penalty engine — rule engine, auto-trigger, appeal system",
      "Phase 63–70: 50+ countries — Asia Hub (UAE, India), Europe Hub (UK, Germany), Americas",
      "Phase 71–80: Global governance — audit system, policy control, community voting, GTS",
    ],
  },
];

export const DMO_COMPLETED_PHASES = DMO_ROADMAP_PHASES.filter((phase) => phase.done).length;
export const DMO_TOTAL_PHASES = DMO_ROADMAP_PHASES.length;
export const DMO_CURRENT_PHASE_MARKER = 30;
export const DMO_PHASE_PROGRESS = Math.round(
  DMO_ROADMAP_PHASES.reduce((sum, phase) => sum + phase.progress, 0) / DMO_ROADMAP_PHASES.length
);
