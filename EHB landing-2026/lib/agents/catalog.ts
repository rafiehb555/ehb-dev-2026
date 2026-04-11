import type {
  AgentChooserRecommendation,
  AgentDefinition,
  AgentDetail,
  AgentGroup,
  AgentGroupKey,
  AgentGuidanceCard,
  AgentHandoffRecord,
  AgentLifecycleEvent,
  AgentRecommendationResult,
  AgentRuntimeHistoryEvent,
  AgentRuntimeStatus,
  AgentStatusInfo,
} from "@/lib/agents/schemas";

export const agentGroups: AgentGroup[] = [
  {
    key: "core",
    title: "Core Agents",
    detail: "Main routing and execution layer",
    agents: [
      {
        id: "ceo-orchestrator-agent",
        group: "core",
        summary: "Main business-facing entry point that routes work to the right specialists.",
        owner: "Intake and routing",
      },
      {
        id: "product-roadmap-agent",
        group: "core",
        summary: "Owns sequencing, dependency order, and what should be built first.",
        owner: "Roadmap and prioritization",
      },
      {
        id: "user-flow-agent",
        group: "core",
        summary: "Maps journeys, route impact, and reused user-facing flows.",
        owner: "Cross-page flow",
      },
      {
        id: "ui-design-system-agent",
        group: "core",
        summary: "Protects shared UI patterns and visual consistency across EHB.",
        owner: "Reusable UI",
      },
      {
        id: "data-architecture-agent",
        group: "core",
        summary: "Decides source-of-truth, storage location, and API/schema direction.",
        owner: "Data structure",
      },
      {
        id: "deploy-sync-ops-agent",
        group: "core",
        summary: "Handles local run, build, Git, GitHub, and deploy parity verification.",
        owner: "Operational safety",
      },
    ],
  },
  {
    key: "domain",
    title: "Domain Agents",
    detail: "EHB-specific business and operating areas",
    agents: [
      {
        id: "docs-knowledge-agent",
        group: "domain",
        summary: "Keeps docs, project memory, and owner-facing explanations aligned.",
        owner: "Documentation and knowledge",
      },
      {
        id: "admin-dmo-agent",
        group: "domain",
        summary: "Owns admin and DMO workspace structure and management logic.",
        owner: "Admin and DMO operations",
      },
      {
        id: "franchise-agent",
        group: "domain",
        summary: "Owns franchise public flows, operator flows, bookings, and inspections.",
        owner: "Franchise systems",
      },
      {
        id: "trust-systems-agent",
        group: "domain",
        summary: "Protects STL, verification, review integrity, and trust-sensitive behavior.",
        owner: "Trust systems",
      },
    ],
  },
  {
    key: "advanced",
    title: "Advanced Agents",
    detail: "Risk, measurement, memory, and control-center design",
    agents: [
      {
        id: "agent-governance-risk-agent",
        group: "advanced",
        summary: "Reviews approval boundaries, rollout guardrails, and high-risk changes.",
        owner: "Risk and approvals",
      },
      {
        id: "agent-observability-metrics-agent",
        group: "advanced",
        summary: "Defines useful health signals, monitoring views, and failure visibility.",
        owner: "Observability and metrics",
      },
      {
        id: "integration-memory-agent",
        group: "advanced",
        summary: "Tracks reuse, continuity, and long-term decision memory across modules.",
        owner: "Memory and reuse",
      },
      {
        id: "agent-ui-dashboard-agent",
        group: "advanced",
        summary: "Designs how the development agent system should appear in UI.",
        owner: "Agent dashboard UX",
      },
    ],
  },
];

export const agentStatuses: AgentStatusInfo[] = [
  { name: "idle", meaning: "No active work." },
  { name: "reading-context", meaning: "Collecting files, docs, or code context." },
  { name: "planning", meaning: "Deciding how to handle the task." },
  { name: "waiting-for-input", meaning: "Blocked until the owner answers or approves." },
  { name: "working", meaning: "Actively producing output or implementation." },
  { name: "verifying", meaning: "Checking correctness, routes, build, or rules." },
  { name: "blocked", meaning: "Stopped by a dependency, conflict, or missing resource." },
  { name: "failed", meaning: "The task failed and needs retry or manual intervention." },
  { name: "completed", meaning: "The task reached the expected verified outcome." },
];

export const agentHandoffOrder: string[] = [
  "ceo-orchestrator-agent",
  "product-roadmap-agent",
  "user-flow-agent",
  "ui-design-system-agent",
  "data-architecture-agent",
  "docs-knowledge-agent",
  "admin-dmo-agent",
  "franchise-agent",
  "trust-systems-agent",
  "agent-governance-risk-agent",
  "agent-observability-metrics-agent",
  "integration-memory-agent",
  "agent-ui-dashboard-agent",
  "deploy-sync-ops-agent",
];

export const agentGuidanceCards: AgentGuidanceCard[] = [
  {
    title: "Start Here",
    body: "For normal work, start with ceo-orchestrator-agent so the owner does not have to decide the technical path manually.",
  },
  {
    title: "Risk Review",
    body: "Use agent-governance-risk-agent when trust, money, permissions, approvals, or misleading claims are involved.",
  },
  {
    title: "Verification Gate",
    body: "Use deploy-sync-ops-agent before treating release-sensitive work as complete across local, GitHub, and deployed environments.",
  },
];

export const agentChooserRecommendations: AgentChooserRecommendation[] = [
  {
    id: "new-feature-planning",
    category: "planning",
    title: "I want to build a new EHB feature",
    ownerNeed: "Turn a broad feature idea into a safe starting point.",
    primaryAgentId: "ceo-orchestrator-agent",
    supportingAgentIds: ["product-roadmap-agent", "user-flow-agent", "data-architecture-agent"],
    reason: "Start with orchestration, then confirm sequencing, route impact, and source-of-truth decisions.",
  },
  {
    id: "button-card-impact",
    category: "flow",
    title: "I changed a button or card and need impact tracing",
    ownerNeed: "Find where the same UI or flow appears across EHB.",
    primaryAgentId: "user-flow-agent",
    supportingAgentIds: ["ui-design-system-agent", "data-architecture-agent"],
    reason: "Flow tracing identifies impacted routes, then UI and data review prevent drift.",
  },
  {
    id: "admin-dmo-placement",
    category: "operations",
    title: "I need to know where a management feature should live",
    ownerNeed: "Choose the right place in admin or DMO before implementation starts.",
    primaryAgentId: "admin-dmo-agent",
    supportingAgentIds: ["ceo-orchestrator-agent", "user-flow-agent"],
    reason: "Admin and DMO placement should be decided with workflow and routing context first.",
  },
  {
    id: "franchise-workflow",
    category: "franchise",
    title: "I want to change franchise pages or workflows",
    ownerNeed: "Keep public franchise pages and operator logic aligned.",
    primaryAgentId: "franchise-agent",
    supportingAgentIds: ["admin-dmo-agent", "trust-systems-agent"],
    reason: "Franchise work often crosses public pages, operator workflows, and trust-sensitive approvals.",
  },
  {
    id: "trust-or-verification",
    category: "trust",
    title: "I want to change STL, verification, or trust logic",
    ownerNeed: "Protect trust signals before rollout.",
    primaryAgentId: "trust-systems-agent",
    supportingAgentIds: ["agent-governance-risk-agent", "deploy-sync-ops-agent"],
    reason: "Trust-sensitive changes need both domain review and rollout safety verification.",
  },
  {
    id: "deploy-and-sync",
    category: "deploy",
    title: "I need local run, GitHub push, or deploy verification",
    ownerNeed: "Check local, git, and deployed state safely.",
    primaryAgentId: "deploy-sync-ops-agent",
    supportingAgentIds: ["ceo-orchestrator-agent"],
    reason: "Operational verification should stay separate from planning or UI decisions.",
  },
];

export const agentChooserCategories = [
  { id: "all", label: "All scenarios" },
  { id: "planning", label: "Planning" },
  { id: "flow", label: "Flow & UI" },
  { id: "operations", label: "Admin & DMO" },
  { id: "franchise", label: "Franchise" },
  { id: "trust", label: "Trust & Risk" },
  { id: "deploy", label: "Deploy & Sync" },
] as const;

export const agentRuntimeStatuses: AgentRuntimeStatus[] = [
  { agentId: "ceo-orchestrator-agent", status: "working", queueSize: 3, healthScore: 91, lastTask: "Routing feature and deploy requests", mode: "mock", lastUpdatedAt: "2026-04-06T14:39:44.619Z", lastUpdatedLabel: "Updated just now" },
  { agentId: "product-roadmap-agent", status: "planning", queueSize: 2, healthScore: 88, lastTask: "Sequencing multi-phase EHB features", mode: "mock", lastUpdatedAt: "2026-04-06T14:37:44.619Z", lastUpdatedLabel: "Updated 2m ago" },
  { agentId: "user-flow-agent", status: "verifying", queueSize: 1, healthScore: 90, lastTask: "Checking route and role impact", mode: "mock", lastUpdatedAt: "2026-04-06T14:38:44.619Z", lastUpdatedLabel: "Updated 1m ago" },
  { agentId: "ui-design-system-agent", status: "idle", queueSize: 0, healthScore: 86, lastTask: "Waiting for reusable UI review", mode: "mock", lastUpdatedAt: "2026-04-06T14:35:44.619Z", lastUpdatedLabel: "Updated 4m ago" },
  { agentId: "data-architecture-agent", status: "working", queueSize: 2, healthScore: 92, lastTask: "Reviewing source-of-truth decisions", mode: "mock", lastUpdatedAt: "2026-04-06T14:39:44.619Z", lastUpdatedLabel: "Updated just now" },
  { agentId: "deploy-sync-ops-agent", status: "verifying", queueSize: 1, healthScore: 94, lastTask: "Comparing local and deploy behavior", mode: "mock", lastUpdatedAt: "2026-04-06T14:39:44.619Z", lastUpdatedLabel: "Updated just now" },
  { agentId: "docs-knowledge-agent", status: "completed", queueSize: 0, healthScore: 89, lastTask: "Syncing docs with current agent system", mode: "mock", lastUpdatedAt: "2026-04-06T14:33:44.619Z", lastUpdatedLabel: "Updated 6m ago" },
  { agentId: "admin-dmo-agent", status: "reading-context", queueSize: 1, healthScore: 84, lastTask: "Inspecting admin and DMO structure", mode: "mock", lastUpdatedAt: "2026-04-06T14:36:44.619Z", lastUpdatedLabel: "Updated 3m ago" },
  { agentId: "franchise-agent", status: "idle", queueSize: 0, healthScore: 83, lastTask: "Waiting for franchise workflow request", mode: "mock", lastUpdatedAt: "2026-04-06T14:34:44.619Z", lastUpdatedLabel: "Updated 5m ago" },
  { agentId: "trust-systems-agent", status: "blocked", queueSize: 1, healthScore: 72, lastTask: "Awaiting trust rule confirmation", mode: "mock", lastUpdatedAt: "2026-04-06T14:32:44.619Z", lastUpdatedLabel: "Updated 7m ago" },
  { agentId: "agent-governance-risk-agent", status: "waiting-for-input", queueSize: 1, healthScore: 80, lastTask: "Waiting for approval-sensitive decision", mode: "mock", lastUpdatedAt: "2026-04-06T14:37:44.619Z", lastUpdatedLabel: "Updated 2m ago" },
  { agentId: "agent-observability-metrics-agent", status: "planning", queueSize: 1, healthScore: 87, lastTask: "Designing useful status signals", mode: "mock", lastUpdatedAt: "2026-04-06T14:37:44.619Z", lastUpdatedLabel: "Updated 2m ago" },
  { agentId: "integration-memory-agent", status: "working", queueSize: 1, healthScore: 85, lastTask: "Recording reuse and continuity links", mode: "mock", lastUpdatedAt: "2026-04-06T14:38:44.619Z", lastUpdatedLabel: "Updated 1m ago" },
  { agentId: "agent-ui-dashboard-agent", status: "completed", queueSize: 0, healthScore: 90, lastTask: "Preparing control-center UX layer", mode: "mock", lastUpdatedAt: "2026-04-06T14:36:44.619Z", lastUpdatedLabel: "Updated 3m ago" },
];

export const agentRuntimeHistory: AgentRuntimeHistoryEvent[] = [
  {
    id: "evt-orchestrator-1",
    agentId: "ceo-orchestrator-agent",
    status: "reading-context",
    title: "Request intake started",
    detail: "Collected owner request context for feature and deploy planning.",
    occurredAt: "2026-04-06T14:30:44.619Z",
    occurredAtLabel: "9m ago",
    mode: "mock",
  },
  {
    id: "evt-orchestrator-2",
    agentId: "ceo-orchestrator-agent",
    status: "working",
    title: "Specialists routed",
    detail: "Assigned roadmap, flow, and data review to supporting agents.",
    occurredAt: "2026-04-06T14:37:44.619Z",
    occurredAtLabel: "2m ago",
    mode: "mock",
  },
  {
    id: "evt-roadmap-1",
    agentId: "product-roadmap-agent",
    status: "planning",
    title: "Phase order reviewed",
    detail: "Checked dependencies before recommending the next implementation wave.",
    occurredAt: "2026-04-06T14:35:44.619Z",
    occurredAtLabel: "4m ago",
    mode: "mock",
  },
  {
    id: "evt-flow-1",
    agentId: "user-flow-agent",
    status: "verifying",
    title: "Route impact verified",
    detail: "Confirmed route and role impact for the current admin agent work.",
    occurredAt: "2026-04-06T14:38:44.619Z",
    occurredAtLabel: "1m ago",
    mode: "mock",
  },
  {
    id: "evt-data-1",
    agentId: "data-architecture-agent",
    status: "working",
    title: "Shared source-of-truth aligned",
    detail: "Validated shared agent catalog and API ownership before UI integration.",
    occurredAt: "2026-04-06T14:36:44.619Z",
    occurredAtLabel: "3m ago",
    mode: "mock",
  },
  {
    id: "evt-deploy-1",
    agentId: "deploy-sync-ops-agent",
    status: "verifying",
    title: "Local route checks running",
    detail: "Compared agent routes and APIs against the local app environment.",
    occurredAt: "2026-04-06T14:39:44.619Z",
    occurredAtLabel: "Just now",
    mode: "mock",
  },
  {
    id: "evt-docs-1",
    agentId: "docs-knowledge-agent",
    status: "completed",
    title: "Agent docs aligned",
    detail: "Updated docs references to match the current development-agent model.",
    occurredAt: "2026-04-06T14:33:44.619Z",
    occurredAtLabel: "6m ago",
    mode: "mock",
  },
  {
    id: "evt-admin-1",
    agentId: "admin-dmo-agent",
    status: "reading-context",
    title: "Admin placement reviewed",
    detail: "Checked how the agent control center should sit inside the admin shell.",
    occurredAt: "2026-04-06T14:36:44.619Z",
    occurredAtLabel: "3m ago",
    mode: "mock",
  },
  {
    id: "evt-franchise-1",
    agentId: "franchise-agent",
    status: "idle",
    title: "No active franchise task",
    detail: "Franchise-specific workflow review is waiting for a new request.",
    occurredAt: "2026-04-06T14:34:44.619Z",
    occurredAtLabel: "5m ago",
    mode: "mock",
  },
  {
    id: "evt-trust-1",
    agentId: "trust-systems-agent",
    status: "blocked",
    title: "Trust rule confirmation pending",
    detail: "Awaiting clarification before approving trust-sensitive wording changes.",
    occurredAt: "2026-04-06T14:32:44.619Z",
    occurredAtLabel: "7m ago",
    mode: "mock",
  },
  {
    id: "evt-risk-1",
    agentId: "agent-governance-risk-agent",
    status: "waiting-for-input",
    title: "Approval gate waiting",
    detail: "Risk review is waiting for the final owner decision on rollout sensitivity.",
    occurredAt: "2026-04-06T14:37:44.619Z",
    occurredAtLabel: "2m ago",
    mode: "mock",
  },
  {
    id: "evt-observability-1",
    agentId: "agent-observability-metrics-agent",
    status: "planning",
    title: "Metrics plan drafted",
    detail: "Defining practical runtime and dashboard signals for the agent system.",
    occurredAt: "2026-04-06T14:37:44.619Z",
    occurredAtLabel: "2m ago",
    mode: "mock",
  },
  {
    id: "evt-memory-1",
    agentId: "integration-memory-agent",
    status: "working",
    title: "Decision memory recorded",
    detail: "Stored reuse relationships between chooser, detail pages, and runtime feed.",
    occurredAt: "2026-04-06T14:38:44.619Z",
    occurredAtLabel: "1m ago",
    mode: "mock",
  },
  {
    id: "evt-dashboard-1",
    agentId: "agent-ui-dashboard-agent",
    status: "completed",
    title: "Control-center iteration shipped",
    detail: "Delivered the current admin-facing agent dashboard iteration.",
    occurredAt: "2026-04-06T14:36:44.619Z",
    occurredAtLabel: "3m ago",
    mode: "mock",
  },
];

export const agentRuntimeHandoffs: AgentHandoffRecord[] = [];

export const agentOwnershipHighlights: string[] = [
  "`ceo-orchestrator-agent` owns request intake and task routing.",
  "`data-architecture-agent` owns source-of-truth and storage-location decisions.",
  "`admin-dmo-agent` owns admin and DMO workspace structure.",
  "`trust-systems-agent` owns trust score, verification, and review integrity logic.",
  "`agent-governance-risk-agent` handles approval-sensitive and risky changes.",
  "`deploy-sync-ops-agent` closes release-sensitive work with verification.",
];

export const agentDashboardPurpose: string[] = [
  "Understand which development agents currently exist.",
  "Learn the shared status vocabulary before live signals are added.",
  "See the expected handoff path before implementing real workflow wiring.",
  "Separate development-agent operations from future platform AI operations.",
];

export const agentLifecycleEvents: AgentLifecycleEvent[] = [
  "context.started",
  "plan.ready",
  "input.required",
  "work.started",
  "verify.started",
  "handoff.requested",
  "handoff.accepted",
  "handoff.returned",
  "task.completed",
  "task.failed",
  "task.blocked",
];

export const flatAgentDefinitions: AgentDefinition[] = agentGroups.flatMap((group) => group.agents);

export const agentDashboardSummary = {
  totalAgents: flatAgentDefinitions.length,
  coreAgents: agentGroups.find((group) => group.key === "core")?.agents.length ?? 0,
  domainAgents: agentGroups.find((group) => group.key === "domain")?.agents.length ?? 0,
  advancedAgents: agentGroups.find((group) => group.key === "advanced")?.agents.length ?? 0,
  sharedStatuses: agentStatuses.length,
  defaultStartingAgent: "ceo-orchestrator-agent",
  telemetryMode: "reference-only",
  maxSpecialistsPerRequest: 3,
};

export const agentRuntimeSummary = {
  activeAgents: agentRuntimeStatuses.filter((item) => ["working", "planning", "verifying", "reading-context"].includes(item.status)).length,
  blockedAgents: agentRuntimeStatuses.filter((item) => item.status === "blocked").length,
  waitingAgents: agentRuntimeStatuses.filter((item) => item.status === "waiting-for-input").length,
  completedAgents: agentRuntimeStatuses.filter((item) => item.status === "completed").length,
  mockModeAgents: agentRuntimeStatuses.filter((item) => item.mode === "mock").length,
  totalHistoryEvents: agentRuntimeHistory.length,
};

export const agentWorkflowContractSummary = {
  defaultStartingAgent: "ceo-orchestrator-agent",
  maxSpecialistsPerRequest: 3,
  verificationRequired: true,
  routeRiskThrough: "agent-governance-risk-agent",
  routeMemoryThrough: "integration-memory-agent",
  releaseVerificationThrough: "deploy-sync-ops-agent",
};

export const agentDetails: AgentDetail[] = [
  {
    id: "ceo-orchestrator-agent",
    group: "core",
    summary: "Main business-facing entry point that routes work to the right specialists.",
    owner: "Intake and routing",
    purpose: "Translate broad owner requests into small, safe, specialist-driven execution.",
    whenToUse: [
      "The request is broad or non-technical.",
      "More than one ownership area may be involved.",
      "The owner wants one simple answer instead of managing technical details manually.",
    ],
    whenNotToUse: [
      "The task already clearly belongs to one specialist with no routing uncertainty.",
    ],
    outputs: [
      "What the user wants",
      "Which 1 to 3 specialist agents should work",
      "Why those agents were selected",
      "What final verification is needed",
    ],
    verification: [
      "Check ownership boundaries before routing.",
      "Escalate to flow or data review if impact is unclear.",
      "Require deploy verification when runtime or release behavior matters.",
    ],
    risks: [
      "Wrong routing can waste time or hide dependencies.",
      "Broad requests can affect more systems than the owner realizes.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/ceo-orchestrator-agent/SKILL.md" },
      { label: "Ownership", path: "docs/agents/AGENT_OWNERSHIP.md" },
      { label: "Handoffs", path: "docs/agents/AGENT_HANDOFFS.md" },
    ],
    samplePrompts: [
      "Break this EHB request into the right agent steps.",
      "Tell me which agents should handle this feature first.",
      "Route this request safely because it touches admin, data, and deployment.",
    ],
  },
  {
    id: "product-roadmap-agent",
    group: "core",
    summary: "Owns sequencing, dependency order, and what should be built first.",
    owner: "Roadmap and prioritization",
    purpose: "Turn broad feature ideas into realistic phased work with dependency awareness.",
    whenToUse: [
      "The owner asks what should be built next.",
      "A feature idea touches many modules or phases.",
      "Progress, remaining work, or milestone planning is needed.",
    ],
    whenNotToUse: [
      "The request is only a small implementation task with clear scope already defined.",
    ],
    outputs: [
      "Current phase",
      "Done work",
      "Remaining work",
      "Dependencies",
      "Best next step",
    ],
    verification: [
      "Separate demo progress from production readiness.",
      "Check that critical dependencies are not skipped.",
    ],
    risks: [
      "Planning can overstate completion if demo work is treated as production-ready.",
      "Bad sequencing can block later platform layers.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/product-roadmap-agent/SKILL.md" },
      { label: "Docs Index", path: "docs/INDEX.md" },
      { label: "Development Tracker", path: "docs/development/DEVELOPMENT_TRACKER.md" },
    ],
    samplePrompts: [
      "What should we build next in EHB and what should wait?",
      "Turn this broad EHB feature into a phased plan.",
    ],
  },
  {
    id: "user-flow-agent",
    group: "core",
    summary: "Maps journeys, route impact, and reused user-facing flows.",
    owner: "Cross-page flow",
    purpose: "Protect route and role integrity by tracing what a change affects across the app.",
    whenToUse: [
      "A button, link, or card affects more than one page.",
      "The owner asks which roles or routes are affected.",
      "Admin, DMO, franchise, or public journeys need tracing.",
    ],
    whenNotToUse: [
      "The request is only about storage or schema design with no route-level effect.",
    ],
    outputs: [
      "Start point",
      "Affected roles",
      "Affected routes",
      "Reusable elements touched",
      "High-risk dependency areas",
    ],
    verification: [
      "Trace start page, target route, and role clearly.",
      "Check layouts and shared entry points before approving change impact.",
    ],
    risks: [
      "Single-page assumptions can break connected flows.",
      "Route changes often hide shared content or shared component dependencies.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/user-flow-agent/SKILL.md" },
      { label: "Navigation Rule", path: ".cursor/rules/navigation-complete.md" },
      { label: "DMO Workspace", path: "ehb-landing-demo/components/dmo/DmoSectionWorkspace.tsx" },
    ],
    samplePrompts: [
      "If I change this button, which EHB pages and roles are affected?",
      "Trace where this card or data item is reused across EHB.",
    ],
  },
  {
    id: "ui-design-system-agent",
    group: "core",
    summary: "Protects shared UI patterns and visual consistency across EHB.",
    owner: "Reusable UI",
    purpose: "Keep design patterns consistent across landing, home, admin, DMO, and franchise surfaces.",
    whenToUse: [
      "Cards, buttons, colors, spacing, or layout patterns are changing.",
      "A page should visually match another EHB surface.",
      "Responsive or consistency work is requested.",
    ],
    whenNotToUse: [
      "The request is only about data placement or backend structure.",
    ],
    outputs: [
      "Shared component or pattern involved",
      "Impacted pages",
      "Proposed design direction",
      "Consistency checks required",
    ],
    verification: [
      "Check reuse across related pages.",
      "Review mobile, tablet, and desktop impact.",
    ],
    risks: [
      "One-off UI edits can create long-term design drift.",
      "Marketing and operational UI can accidentally mix the wrong pattern language.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/ui-design-system-agent/SKILL.md" },
      { label: "UI Rule", path: ".cursor/rules/ui-design-system.md" },
      { label: "Components", path: "ehb-landing-demo/components/" },
    ],
    samplePrompts: [
      "Review these cards and tell me what shared UI pattern EHB should use.",
      "Check whether this visual change will create design drift.",
    ],
  },
  {
    id: "data-architecture-agent",
    group: "core",
    summary: "Decides source-of-truth, storage location, and API/schema direction.",
    owner: "Data structure",
    purpose: "Define where EHB data should live and stop repeated or drifting data definitions.",
    whenToUse: [
      "The owner asks where data should live.",
      "The same concept appears in more than one file or layer.",
      "API, schema, config, or database changes are involved.",
    ],
    whenNotToUse: [
      "The request is only about visual styling with no data impact.",
    ],
    outputs: [
      "Recommended source of truth",
      "Reason for storage choice",
      "Affected files and modules",
      "Demo vs real behavior notes",
      "Validation required after change",
    ],
    verification: [
      "Identify whether the concept is static content, shared operational data, or persistent data.",
      "Flag duplicate or drifting definitions immediately.",
    ],
    risks: [
      "Mixed file, API, and database data can cause inconsistency.",
      "Hardcoded duplication can silently drift across pages.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/data-architecture-agent/SKILL.md" },
      { label: "Schema", path: "ehb-landing-demo/prisma/schema.prisma" },
      { label: "Shared Store", path: "ehb-landing-demo/lib/appDataStore.ts" },
    ],
    samplePrompts: [
      "Where should this EHB data live: config, file store, API, or database?",
      "Tell me the source of truth for this repeated data and content.",
    ],
  },
  {
    id: "deploy-sync-ops-agent",
    group: "core",
    summary: "Handles local run, build, Git, GitHub, and deploy parity verification.",
    owner: "Operational safety",
    purpose: "Protect local development, git workflows, and deployment parity before work is called complete.",
    whenToUse: [
      "The app needs to run locally.",
      "Git pull, merge, push, or deploy checks are needed.",
      "Local vs deployed mismatch is reported.",
    ],
    whenNotToUse: [
      "The request is only about design, planning, or docs with no verification need.",
    ],
    outputs: [
      "Git state",
      "Local health",
      "Build result",
      "Deploy or parity result",
      "Any risk or blocker",
    ],
    verification: [
      "Check git state first.",
      "Separate git sync from real data sync.",
      "Confirm local success is not mistaken for deployed success.",
    ],
    risks: [
      "Risky git state can invalidate later work.",
      "Deployment assumptions can fail if only local success is checked.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/deploy-sync-ops-agent/SKILL.md" },
      { label: "Parity Checklist", path: "docs/development/LOCAL_DEPLOY_PARITY_CHECKLIST.md" },
      { label: "Auto Sync Doc", path: "AUTO_GITHUB_SYNC.md" },
    ],
    samplePrompts: [
      "Check local, build, and deployment verification for this EHB change.",
      "Compare local vs GitHub vs Vercel parity for this route.",
    ],
  },
  {
    id: "docs-knowledge-agent",
    group: "domain",
    summary: "Keeps docs, project memory, and owner-facing explanations aligned.",
    owner: "Documentation and knowledge",
    purpose: "Keep documentation aligned with implemented reality and explain changes for non-technical owners.",
    whenToUse: [
      "A major workflow or agent changed.",
      "Docs may be outdated after implementation.",
      "A non-technical explanation is needed.",
    ],
    whenNotToUse: [
      "The task is only runtime verification with no documentation impact.",
    ],
    outputs: [
      "What changed",
      "Which docs are affected",
      "What should be added or updated",
      "Whether docs reflect code reality or future intent",
    ],
    verification: [
      "Compare documentation claims against current implementation.",
      "Update indexes when new core docs are added.",
    ],
    risks: [
      "Docs can overstate production readiness.",
      "Architecture plans can be confused with implemented behavior.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/docs-knowledge-agent/SKILL.md" },
      { label: "Docs Index", path: "docs/INDEX.md" },
      { label: "Agent Quickstart", path: "docs/agents/AGENT_QUICKSTART.md" },
    ],
    samplePrompts: [
      "Update the EHB docs to match this new workflow or agent change.",
      "Explain this technical change in simple non-technical language.",
    ],
  },
  {
    id: "admin-dmo-agent",
    group: "domain",
    summary: "Owns admin and DMO workspace structure and management logic.",
    owner: "Admin and DMO operations",
    purpose: "Keep the EHB management layer structured across admin, DMO, and operational workflows.",
    whenToUse: [
      "A management feature needs the right home.",
      "DMO modules or admin sections are changing.",
      "Operational queues or role-specific views are affected.",
    ],
    whenNotToUse: [
      "The request is only public marketing UI with no management impact.",
    ],
    outputs: [
      "Affected admin or DMO area",
      "Impacted sections and views",
      "Cross-domain dependencies",
      "Recommended ownership handoffs",
    ],
    verification: [
      "Check whether the work belongs in admin, DMO, or both.",
      "Confirm roles and operational flow still make sense.",
    ],
    risks: [
      "Management actions can be placed in the wrong workspace.",
      "DMO screens can look simple while hiding complex workflow dependencies.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/admin-dmo-agent/SKILL.md" },
      { label: "DMO Layout", path: "ehb-landing-demo/app/dmo/layout.tsx" },
      { label: "DMO Workspace", path: "ehb-landing-demo/components/dmo/DmoSectionWorkspace.tsx" },
    ],
    samplePrompts: [
      "Where should this management feature live in admin or DMO?",
      "Review this DMO request and tell me which sections are affected.",
    ],
  },
  {
    id: "franchise-agent",
    group: "domain",
    summary: "Owns franchise public flows, operator flows, bookings, and inspections.",
    owner: "Franchise systems",
    purpose: "Align franchise marketing, bookings, inspections, and operator logic across EHB.",
    whenToUse: [
      "Franchise home, bookings, inspections, or dashboards are changing.",
      "Public franchise messaging must match operator workflow.",
      "Franchise hierarchy affects the request.",
    ],
    whenNotToUse: [
      "The request is generic admin work unrelated to franchise flows.",
    ],
    outputs: [
      "Affected franchise layer",
      "Affected pages and APIs",
      "Public vs operator impact",
      "DMO or trust dependencies",
    ],
    verification: [
      "Separate public franchise content from operator workflow logic.",
      "Check whether inspections or approvals trigger trust review.",
    ],
    risks: [
      "Marketing and operator logic can drift apart.",
      "Hierarchy assumptions can break country, corporate, master, or sub-franchise flows.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/franchise-agent/SKILL.md" },
      { label: "Franchise App", path: "ehb-landing-demo/app/franchise/" },
      { label: "Franchise APIs", path: "ehb-landing-demo/app/api/franchise/" },
    ],
    samplePrompts: [
      "Review this franchise feature and separate public impact from operator impact.",
      "Tell me how this booking or inspection flow should work across EHB franchise surfaces.",
    ],
  },
  {
    id: "trust-systems-agent",
    group: "domain",
    summary: "Protects STL, verification, review integrity, and trust-sensitive behavior.",
    owner: "Trust systems",
    purpose: "Protect platform credibility by owning trust-sensitive scoring, verification, and review logic.",
    whenToUse: [
      "STL or verification logic is changing.",
      "Trust badges, approvals, reviews, or audits are involved.",
      "A user-visible trust signal may be affected.",
    ],
    whenNotToUse: [
      "The request is only visual polish with no trust meaning.",
    ],
    outputs: [
      "Trust signal affected",
      "Affected pages, APIs, and data paths",
      "Score or status impact",
      "Validation or audit risks",
    ],
    verification: [
      "Trace where the trust signal appears across product areas.",
      "Verify wording, badges, or score logic before approval.",
    ],
    risks: [
      "Misleading trust signals can damage platform credibility.",
      "Badges and score logic can silently affect many surfaces.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/trust-systems-agent/SKILL.md" },
      { label: "STL Engine", path: "ehb-landing-demo/lib/stl/engine.ts" },
      { label: "STL API", path: "ehb-landing-demo/app/api/stl/" },
    ],
    samplePrompts: [
      "Review this STL or verification change and tell me the trust impact.",
      "Trace how this trust signal affects profile, marketplace, franchise, and DMO behavior.",
    ],
  },
  {
    id: "agent-governance-risk-agent",
    group: "advanced",
    summary: "Reviews approval boundaries, rollout guardrails, and high-risk changes.",
    owner: "Risk and approvals",
    purpose: "Review sensitive work for approval needs, rollout safety, and cross-domain risk.",
    whenToUse: [
      "Trust, money, permissions, moderation, or approval logic is involved.",
      "A change may create misleading claims or unsafe automation.",
      "The owner wants safer rollout guidance before implementation.",
    ],
    whenNotToUse: [
      "The request is a low-risk docs-only update.",
    ],
    outputs: [
      "Risk summary",
      "Affected domains",
      "Required approval or guardrails",
      "Safe rollout recommendation",
    ],
    verification: [
      "Distinguish technical safety risk from business risk.",
      "Check whether stronger approval gates are needed.",
    ],
    risks: [
      "High-risk changes can be treated as normal implementation work.",
      "Approval-sensitive features can create misleading user-facing behavior.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/agent-governance-risk-agent/SKILL.md" },
      { label: "Ownership", path: "docs/agents/AGENT_OWNERSHIP.md" },
      { label: "Workflow Contract", path: "docs/agents/AGENT_WORKFLOW_CONTRACT.md" },
    ],
    samplePrompts: [
      "Review this EHB change for risk, approvals, and rollout safety.",
      "Tell me what should be blocked or require approval before this goes live.",
    ],
  },
  {
    id: "agent-observability-metrics-agent",
    group: "advanced",
    summary: "Defines useful health signals, monitoring views, and failure visibility.",
    owner: "Observability and metrics",
    purpose: "Make EHB workflows measurable by defining honest signals, metrics, and reporting views.",
    whenToUse: [
      "The owner asks what should be measured.",
      "A dashboard needs status meaning or failure visibility.",
      "Build, route, sync, or workflow health needs reporting.",
    ],
    whenNotToUse: [
      "There is no real or realistic signal source and only decorative metrics are being requested.",
    ],
    outputs: [
      "Metrics or signals to track",
      "Where they should come from",
      "What failure looks like",
      "Recommended reporting view",
    ],
    verification: [
      "Prefer actionable metrics over vanity metrics.",
      "State clearly when a signal is planned instead of live.",
    ],
    risks: [
      "Fake real-time visibility can mislead operators.",
      "Metrics without sources create false operational confidence.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/agent-observability-metrics-agent/SKILL.md" },
      { label: "Status Model", path: "docs/agents/AGENT_STATUS_MODEL.md" },
      { label: "Dashboard Plan", path: "docs/agents/AGENT_DASHBOARD_PLAN.md" },
    ],
    samplePrompts: [
      "Tell me what metrics and health signals we should track for this workflow.",
      "What failure signals should we monitor before we call this stable?",
    ],
  },
  {
    id: "integration-memory-agent",
    group: "advanced",
    summary: "Tracks reuse, continuity, and long-term decision memory across modules.",
    owner: "Memory and reuse",
    purpose: "Preserve reusable context so future EHB work does not forget source-of-truth and prior decisions.",
    whenToUse: [
      "The same concept appears in more than one place.",
      "The owner asks where a rule, value, or feature is reused.",
      "Important decisions should be recorded for future work.",
    ],
    whenNotToUse: [
      "The request is only an isolated implementation detail with no reuse impact.",
    ],
    outputs: [
      "Reused entities or decisions",
      "Connected modules or files",
      "Source-of-truth recommendation",
      "Memory items that should be recorded",
    ],
    verification: [
      "Separate current reuse from proposed future reuse.",
      "Check the reuse claim against code and docs evidence.",
    ],
    risks: [
      "False dependency assumptions can spread bad decisions.",
      "Missing memory can cause repeated reasoning and drifting source-of-truth choices.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/integration-memory-agent/SKILL.md" },
      { label: "Workflow Contract", path: "docs/agents/AGENT_WORKFLOW_CONTRACT.md" },
      { label: "Catalog Source", path: "ehb-landing-demo/lib/agents/catalog.ts" },
    ],
    samplePrompts: [
      "Record the source-of-truth and reuse map for this EHB feature.",
      "Tell me where this same concept already appears in the codebase and docs.",
    ],
  },
  {
    id: "agent-ui-dashboard-agent",
    group: "advanced",
    summary: "Designs how the development agent system should appear in UI.",
    owner: "Agent dashboard UX",
    purpose: "Make the development-agent system understandable through a clear admin-facing control-center UI.",
    whenToUse: [
      "The owner wants an agent dashboard or control center.",
      "Agent statuses, queues, or handoffs need a visual structure.",
      "Admin or DMO should expose the agent system in UI.",
    ],
    whenNotToUse: [
      "The request is purely backend workflow behavior with no presentation need.",
    ],
    outputs: [
      "Target dashboard user",
      "Primary views or cards needed",
      "Status and handoff elements",
      "Dependencies on data or monitoring",
    ],
    verification: [
      "Use the shared status and handoff models consistently.",
      "Keep the first view understandable for a non-technical owner.",
    ],
    risks: [
      "Low-value signals can clutter the dashboard.",
      "Reference-only data can be misread as live telemetry if not labeled clearly.",
    ],
    references: [
      { label: "Skill", path: ".cursor/skills/agent-ui-dashboard-agent/SKILL.md" },
      { label: "Dashboard Plan", path: "docs/agents/AGENT_DASHBOARD_PLAN.md" },
      { label: "Admin Agent Page", path: "ehb-landing-demo/app/admin/agents/page.tsx" },
    ],
    samplePrompts: [
      "Design the first EHB agent dashboard view for a non-technical owner.",
      "Tell me which agent cards, statuses, and handoff elements should appear first.",
    ],
  },
];

const agentGroupMeta: Record<
  AgentGroupKey,
  {
    badgeLabel: string;
    badgeClassName: string;
    borderClassName: string;
  }
> = {
  core: {
    badgeLabel: "Core",
    badgeClassName: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
    borderClassName: "hover:border-cyan-400/40",
  },
  domain: {
    badgeLabel: "Domain",
    badgeClassName: "border-violet-400/20 bg-violet-500/10 text-violet-200",
    borderClassName: "hover:border-violet-400/40",
  },
  advanced: {
    badgeLabel: "Advanced",
    badgeClassName: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    borderClassName: "hover:border-amber-400/40",
  },
};

const agentStatusMeta: Record<
  AgentRuntimeStatus["status"],
  {
    label: string;
    className: string;
  }
> = {
  idle: {
    label: "Idle",
    className: "border-slate-400/20 bg-slate-500/10 text-ehb-textBody",
  },
  "reading-context": {
    label: "Reading",
    className: "border-sky-400/20 bg-sky-500/10 text-sky-200",
  },
  planning: {
    label: "Planning",
    className: "border-violet-400/20 bg-violet-500/10 text-violet-200",
  },
  "waiting-for-input": {
    label: "Waiting",
    className: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  },
  working: {
    label: "Working",
    className: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  },
  verifying: {
    label: "Verifying",
    className: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  },
  blocked: {
    label: "Blocked",
    className: "border-rose-400/20 bg-rose-500/10 text-rose-200",
  },
  failed: {
    label: "Failed",
    className: "border-red-400/20 bg-red-500/10 text-red-200",
  },
  completed: {
    label: "Completed",
    className: "border-lime-400/20 bg-lime-500/10 text-lime-200",
  },
};

const recommendationKeywordRules: Array<{
  keywords: string[];
  primaryAgentId: string;
  supportingAgentIds: string[];
  reason: string;
}> = [
  {
    keywords: ["build", "feature", "new", "plan", "roadmap", "start"],
    primaryAgentId: "ceo-orchestrator-agent",
    supportingAgentIds: ["product-roadmap-agent", "user-flow-agent", "data-architecture-agent"],
    reason: "Broad feature ideas should start with orchestration, planning, flow tracing, and source-of-truth review.",
  },
  {
    keywords: ["button", "card", "flow", "journey", "page", "route", "ui"],
    primaryAgentId: "user-flow-agent",
    supportingAgentIds: ["ui-design-system-agent", "data-architecture-agent"],
    reason: "Route and UI impact requests need flow tracing first, then design and data validation.",
  },
  {
    keywords: ["admin", "dmo", "panel", "management", "approval", "operations"],
    primaryAgentId: "admin-dmo-agent",
    supportingAgentIds: ["ceo-orchestrator-agent", "user-flow-agent"],
    reason: "Management requests should be placed in the correct admin or DMO workflow with route context.",
  },
  {
    keywords: ["franchise", "booking", "inspection", "operator"],
    primaryAgentId: "franchise-agent",
    supportingAgentIds: ["admin-dmo-agent", "trust-systems-agent"],
    reason: "Franchise work crosses operator flows, admin placement, and trust-sensitive approvals.",
  },
  {
    keywords: ["trust", "stl", "verification", "review", "badge", "approval"],
    primaryAgentId: "trust-systems-agent",
    supportingAgentIds: ["agent-governance-risk-agent", "deploy-sync-ops-agent"],
    reason: "Trust-sensitive changes need domain review, risk controls, and rollout verification.",
  },
  {
    keywords: ["deploy", "github", "push", "build", "local", "vercel", "sync"],
    primaryAgentId: "deploy-sync-ops-agent",
    supportingAgentIds: ["ceo-orchestrator-agent"],
    reason: "Operational and deployment requests should route to verification and sync ownership first.",
  },
];

export function getAgentGroupMeta(group: AgentGroupKey) {
  return agentGroupMeta[group];
}

export function getAgentStatusMeta(status: AgentRuntimeStatus["status"]) {
  return agentStatusMeta[status];
}

export function getAgentDetail(agentId: string) {
  return agentDetails.find((agent) => agent.id === agentId);
}

export function getAgentRuntimeStatus(agentId: string) {
  return agentRuntimeStatuses.find((agent) => agent.agentId === agentId);
}

export function getAgentRuntimeHistory(agentId: string) {
  return agentRuntimeHistory.filter((event) => event.agentId === agentId);
}

export function getAgentRelatedRecommendations(agentId: string) {
  return agentChooserRecommendations.filter(
    (item) => item.primaryAgentId === agentId || item.supportingAgentIds.includes(agentId),
  );
}

export function getRelatedAgents(agentId: string) {
  const relatedIds = new Set<string>();

  for (const recommendation of getAgentRelatedRecommendations(agentId)) {
    if (recommendation.primaryAgentId !== agentId) {
      relatedIds.add(recommendation.primaryAgentId);
    }

    for (const supportingId of recommendation.supportingAgentIds) {
      if (supportingId !== agentId) {
        relatedIds.add(supportingId);
      }
    }
  }

  return [...relatedIds]
    .map((id) => getAgentDetail(id))
    .filter((item): item is AgentDetail => Boolean(item));
}

export function getAgentNeighbors(agentId: string) {
  const currentIndex = agentDetails.findIndex((agent) => agent.id === agentId);

  if (currentIndex === -1) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: currentIndex > 0 ? agentDetails[currentIndex - 1] : undefined,
    next: currentIndex < agentDetails.length - 1 ? agentDetails[currentIndex + 1] : undefined,
  };
}

export function getAgentHandoffTimeline(agentId: string) {
  return agentHandoffOrder.map((id, index) => ({
    id,
    step: index + 1,
    isCurrent: id === agentId,
    isPast: agentHandoffOrder.indexOf(agentId) !== -1 && index < agentHandoffOrder.indexOf(agentId),
  }));
}

export function getAgentChooserRecommendation(id: string) {
  return agentChooserRecommendations.find((item) => item.id === id);
}

export function recommendAgentsForQuery(query: string): AgentRecommendationResult {
  const normalized = query.toLowerCase();
  const matchedScenarios = agentChooserRecommendations.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalized) ||
      item.ownerNeed.toLowerCase().includes(normalized) ||
      item.reason.toLowerCase().includes(normalized)
    );
  });

  const keywordRule = recommendationKeywordRules
    .map((rule) => ({
      rule,
      score: rule.keywords.filter((keyword) => normalized.includes(keyword)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.rule;

  if (keywordRule) {
    return {
      query,
      primaryAgentId: keywordRule.primaryAgentId,
      supportingAgentIds: keywordRule.supportingAgentIds,
      matchedScenarioIds: matchedScenarios.map((item) => item.id),
      reason: keywordRule.reason,
    };
  }

  return {
    query,
    primaryAgentId: "ceo-orchestrator-agent",
    supportingAgentIds: ["product-roadmap-agent", "user-flow-agent"],
    matchedScenarioIds: matchedScenarios.map((item) => item.id),
    reason: "When the owner request is unclear, start with the orchestrator and bring in planning and flow review.",
  };
}
