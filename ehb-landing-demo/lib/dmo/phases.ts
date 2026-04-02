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
    desc: "AI modules, marketplace expansion",
    done: false,
    progress: 45,
    statusLabel: "In Progress",
    outcomes: [
      "AI-assisted decisioning should support approvals, fraud signals, and risk triage",
      "Marketplace and GoSellr operations should feed DMO review and trust workflows",
      "Shared queues should unify applications, provider onboarding, and automation triggers",
    ],
    nextFocus: [
      "Connect AI memory, automation rules, and fraud alerts into one review layer",
      "Expand marketplace moderation, provider quality, and escrow-aware decision support",
      "Replace isolated demo summaries with more live DMO operational states where available",
    ],
  },
  {
    phase: "Phase 31-50",
    range: "Scale",
    desc: "Global rollout, 32 industries live",
    done: false,
    progress: 20,
    statusLabel: "Planned",
    outcomes: [
      "All industry domains should map into one consistent DMO operating model",
      "Country, corporate, master, and sub-franchise oversight should scale by region",
      "Cross-industry compliance, trust scoring, and workflow visibility should remain unified",
    ],
    nextFocus: [
      "Standardize industry verification, scoring, and mapping across all industry routes",
      "Strengthen regional franchise dashboards with clearer operational ownership",
      "Extend DMO analytics for multi-country and multi-industry review visibility",
    ],
  },
  {
    phase: "Phase 51-80",
    range: "Global",
    desc: "Full ecosystem - 50+ countries live",
    done: false,
    progress: 10,
    statusLabel: "Planned",
    outcomes: [
      "DMO should operate as the global trust and governance backbone across all countries",
      "Policy, audit, penalty, affiliate, and notification systems should work as one control layer",
      "Platform-wide compliance and governance should stay readable for operators and leadership",
    ],
    nextFocus: [
      "Add global operational reporting, regional policy controls, and deeper governance automation",
      "Scale notification, affiliate, and penalty systems with country-aware controls",
      "Prepare DMO for fully live ecosystem monitoring instead of roadmap-only oversight",
    ],
  },
];

export const DMO_COMPLETED_PHASES = DMO_ROADMAP_PHASES.filter((phase) => phase.done).length;
export const DMO_TOTAL_PHASES = DMO_ROADMAP_PHASES.length;
export const DMO_CURRENT_PHASE_MARKER = 10;
export const DMO_PHASE_PROGRESS = Math.round(
  DMO_ROADMAP_PHASES.reduce((sum, phase) => sum + phase.progress, 0) / DMO_ROADMAP_PHASES.length
);
