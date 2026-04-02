"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/fetchJson";
import { getJpsOverview, type JpsOverview } from "@/lib/jps/data";

type DmoSectionKey =
  | "applications"
  | "approvals"
  | "jps"
  | "pss"
  | "crb"
  | "franchise"
  | "stl"
  | "industry"
  | "automation"
  | "refilling"
  | "affiliate"
  | "notifications"
  | "penalty"
  | "settings";

type ViewMeta = {
  key: string;
  label: string;
  title: string;
  description: string;
};

type SectionMeta = {
  key: DmoSectionKey;
  icon: string;
  label: string;
  href: string;
  description: string;
  views: ViewMeta[];
};

type TablePresentation = {
  title: string;
  description: string;
  stats: Array<{ label: string; value: string | number }>;
  columns: string[];
  rows: Array<{ id: string; values: Array<string | number> }>;
  notes?: string[];
  emptyState: string;
};

type ApplicationRow = {
  id: string;
  type: string;
  status: string;
  assignedToId?: string | null;
  assignedTo?: { name?: string | null; role?: string | null } | null;
  applicant?: { name?: string | null; email?: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

type ApprovalRow = {
  id: string;
  applicationId: string;
  decision: string;
  notes?: string | null;
  createdAt: string;
  approvedBy?: { name?: string | null; role?: string | null } | null;
};

type AuditRow = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  actor?: { name?: string | null } | null;
};

type PssCase = {
  id: string;
  user?: { name?: string | null; email?: string | null } | null;
  status: string;
  risk?: string;
  riskScore?: number;
  stage: string;
  updatedAt: string;
  refillAlert?: string;
  refillDaysRemaining?: number | null;
};

type CrbApplication = {
  id: string;
  type: string;
  industry: string;
  status: string;
  createdAt: string;
  applicant?: { name?: string | null; email?: string | null } | null;
  documents?: Array<{ id: string; type: string; fileUrl: string }>;
  inspection?: { id: string; status: string; score?: number | null; inspectorId?: string | null } | null;
  certificate?: { id: string; status: string; issuedAt?: string; expiryDate?: string } | null;
};

type FranchiseTask = {
  id: string;
  status: string;
  dueDate?: string;
  updatedAt?: string;
  inspectorId?: string | null;
  franchise?: { name?: string | null; city?: string | null; level?: string | null } | null;
  crbApplication?: { id: string; industry: string; type: string } | null;
  report?: { id: string; score?: number | null; fraudSuspected?: boolean | null } | null;
};

type StlScoreRow = {
  id: string;
  entityId: string;
  entityType: string;
  score: number | string;
  level: number;
  breakdown?: Record<string, unknown> | null;
  lastUpdated: string;
};

type StlLogRow = {
  id: string;
  entityId: string;
  entityType: string;
  change: number | string;
  reason: string;
  createdAt: string;
};

type IndustryRow = {
  id: string;
  name: string;
  description?: string | null;
};

type IndustryVerification = {
  id: string;
  entityType: string;
  entityId: string;
  status: string;
  score?: number | null;
  weight: number;
  updatedAt: string;
  industry?: { name?: string | null } | null;
};

type AutomationPayload = {
  stats: {
    activeRules: number;
    triggersToday: number;
    autoDecisions: number;
    fraudAlerts: number;
  };
  rules: Array<{ id: string; event: string; action: string; active: boolean }>;
  suggestions?: string[];
};

type RefillingRow = {
  id: string;
  user: { name: string };
  type: string;
  dueDate: string;
  status: string;
  stlImpact: string;
};

type AffiliatePayload = {
  total: number;
  today: number;
  referrals: number;
  active: number;
  link: string;
  users: Array<{ id: string; name: string; level: number; earnings: number; status: string }>;
  suggestions?: string[];
};

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  type: "CRITICAL" | "WARNING" | "INFO";
  time: string;
  nextAction?: string;
};

type PenaltyRow = {
  id: string;
  user: { name: string };
  type: string;
  amount: number;
  reason: string;
  status: "ACTIVE" | "RESOLVED" | "APPEAL";
  createdAt?: string;
  stlImpact?: number;
};

type DmoUser = { id: string; name: string; email: string; role: string };

type SectionDataMap = {
  applications: { applications: ApplicationRow[]; approvals: ApprovalRow[]; audit: AuditRow[] };
  approvals: { applications: ApplicationRow[]; approvals: ApprovalRow[]; audit: AuditRow[] };
  jps: JpsOverview;
  pss: { cases: PssCase[] };
  crb: { applications: CrbApplication[] };
  franchise: { tasks: FranchiseTask[] };
  stl: { scores: StlScoreRow[]; logs: StlLogRow[] };
  industry: { industries: IndustryRow[]; verifications: IndustryVerification[] };
  automation: AutomationPayload;
  refilling: { rows: RefillingRow[] };
  affiliate: AffiliatePayload;
  notifications: { rows: NotificationRow[] };
  penalty: { rows: PenaltyRow[] };
  settings: { users: DmoUser[] };
};

const DMO_SECTION_META: Record<DmoSectionKey, SectionMeta> = {
  applications: {
    key: "applications",
    icon: "📋",
    label: "Applications",
    href: "/dmo/applications",
    description: "Governance queue for intake, ownership, high risk screening, and SLA health.",
    views: [
      { key: "all", label: "All Applications", title: "All Applications", description: "Complete DMO intake list across all application types." },
      { key: "queue", label: "My Queue", title: "My Queue", description: "Items currently assigned or ready for active handling." },
      { key: "high-risk", label: "High Risk", title: "High Risk Applications", description: "Applications requiring urgent review because of risk or inspection impact." },
      { key: "sla-breach", label: "SLA Breach", title: "SLA Breach", description: "Applications at or beyond the decision-time threshold." },
    ],
  },
  approvals: {
    key: "approvals",
    icon: "✅",
    label: "Approvals",
    href: "/dmo/approvals",
    description: "Decision desk for pending, approved, rejected, and historical approvals.",
    views: [
      { key: "pending", label: "Pending Decisions", title: "Pending Decisions", description: "Applications waiting for final decision." },
      { key: "approved", label: "Approved", title: "Approved Applications", description: "Applications already approved by DMO." },
      { key: "rejected", label: "Rejected", title: "Rejected Applications", description: "Applications rejected by DMO or policy review." },
      { key: "history", label: "History", title: "Approval History", description: "Recorded approval actions, notes, and actors." },
    ],
  },
  jps: {
    key: "jps",
    icon: "👤",
    label: "JPS",
    href: "/dmo/jps",
    description: "Job profile system for professional identity, service mapping, and job readiness.",
    views: [
      { key: "profiles", label: "Profiles", title: "JPS Profiles", description: "Professional profiles under DMO visibility." },
      { key: "skills", label: "Skills", title: "Skill Matrix", description: "Tracked skill clusters for JPS users." },
      { key: "services", label: "Services", title: "Mapped Services", description: "Services connected to profiles and skills." },
      { key: "jobs", label: "Jobs", title: "Jobs & Opportunities", description: "Open jobs linked with JPS capability tracking." },
    ],
  },
  pss: {
    key: "pss",
    icon: "🔐",
    label: "PSS",
    href: "/dmo/pss",
    description: "Proof and Security System for verification, risk, fraud, and refill readiness.",
    views: [
      { key: "cases", label: "Cases", title: "PSS Cases", description: "Verification cases with live status and stage." },
      { key: "steps", label: "Verification Steps", title: "Verification Steps", description: "Stage-level view of PSS progress." },
      { key: "risk", label: "Risk Analysis", title: "Risk Analysis", description: "Risk score and risk bucket monitoring for PSS." },
      { key: "fraud", label: "Fraud Detection", title: "Fraud Detection", description: "Potential fraud cases requiring escalation." },
      { key: "refilling", label: "Refilling", title: "PSS Refilling", description: "Users approaching refill or re-verification deadlines." },
    ],
  },
  crb: {
    key: "crb",
    icon: "🏛",
    label: "CRB",
    href: "/dmo/crb",
    description: "Certification board flow for review, inspections, certificates, and renewals.",
    views: [
      { key: "applications", label: "Applications", title: "CRB Applications", description: "Incoming certification applications." },
      { key: "docs", label: "Document Review", title: "Document Review", description: "Applications with uploaded CRB document packs." },
      { key: "inspection", label: "Inspection", title: "Inspection Queue", description: "Applications in or requiring inspection." },
      { key: "certificates", label: "Certificates", title: "Issued Certificates", description: "Approved CRB applications with certificates." },
      { key: "expiry", label: "Expiry", title: "Certificate Expiry", description: "Certificates approaching expiry and renewal." },
    ],
  },
  franchise: {
    key: "franchise",
    icon: "🏢",
    label: "Franchise",
    href: "/dmo/franchise",
    description: "Operational bridge between DMO and local inspection/franchise execution.",
    views: [
      { key: "tasks", label: "Tasks", title: "Franchise Tasks", description: "Assigned inspection tasks and operational workload." },
      { key: "in-progress", label: "In Progress", title: "In Progress Tasks", description: "Tasks actively under execution on the ground." },
      { key: "reports", label: "Reports", title: "Inspection Reports", description: "Completed inspection reports ready for review." },
      { key: "escalations", label: "Escalations", title: "Escalations", description: "Escalated franchise cases requiring higher-level action." },
    ],
  },
  stl: {
    key: "stl",
    icon: "📊",
    label: "EHB-STL",
    href: "/dmo/stl",
    description: "Trust score engine for ranking, scoring, history, and breakdown review.",
    views: [
      { key: "scores", label: "Scores", title: "STL Scores", description: "Current trust scores across tracked entities." },
      { key: "breakdown", label: "Breakdown", title: "STL Breakdown", description: "Score composition and scoring factors." },
      { key: "history", label: "History", title: "STL History", description: "Score-change history and STL movement." },
      { key: "ranking", label: "Ranking", title: "STL Ranking", description: "Top-ranked and low-ranked entities by trust level." },
    ],
  },
  industry: {
    key: "industry",
    icon: "🌐",
    label: "Industry",
    href: "/dmo/industry",
    description: "Industry verification, entity mapping, and weighted score visibility.",
    views: [
      { key: "list", label: "Industry List", title: "Industry List", description: "Tracked industries available inside EHB." },
      { key: "verification", label: "Verification", title: "Industry Verification", description: "Verification queue and current industry status." },
      { key: "mapping", label: "Mapping", title: "Entity Mapping", description: "Entities mapped to one or more industries." },
      { key: "scores", label: "Scores", title: "Industry Scores", description: "Weighted scores attached to industry verifications." },
    ],
  },
  automation: {
    key: "automation",
    icon: "🤖",
    label: "Automation",
    href: "/dmo/automation",
    description: "System rules, triggers, automated decisions, and AI fraud signals.",
    views: [
      { key: "rules", label: "Rules", title: "Automation Rules", description: "Configured rules driving DMO automation." },
      { key: "triggers", label: "Triggers", title: "Automation Triggers", description: "Events that activate system automation." },
      { key: "decisions", label: "Auto Decisions", title: "Auto Decisions", description: "Decisions generated or supported by automation." },
      { key: "fraud", label: "Fraud Alerts", title: "Fraud Alerts", description: "Automation-assisted fraud detection signals." },
    ],
  },
  refilling: {
    key: "refilling",
    icon: "🔁",
    label: "Refilling",
    href: "/dmo/refilling",
    description: "Refill lifecycle for PSS and industry verification renewals.",
    views: [
      { key: "active", label: "Active", title: "Active Refills", description: "Refill items currently healthy and tracked." },
      { key: "expiring", label: "Expiring Soon", title: "Expiring Soon", description: "Refills nearing due date." },
      { key: "expired", label: "Expired", title: "Expired Refills", description: "Refills already overdue and impacting trust." },
      { key: "completed", label: "Completed", title: "Completed Refills", description: "Successfully completed refill workflows." },
    ],
  },
  affiliate: {
    key: "affiliate",
    icon: "💸",
    label: "Affiliate",
    href: "/dmo/affiliate",
    description: "Referral network performance, earnings, and active affiliate health.",
    views: [
      { key: "dashboard", label: "Dashboard", title: "Affiliate Dashboard", description: "Top-line affiliate performance and earnings." },
      { key: "referrals", label: "Referrals", title: "Affiliate Referrals", description: "Referral user list and activation status." },
      { key: "earnings", label: "Earnings", title: "Affiliate Earnings", description: "Revenue contribution from the affiliate network." },
      { key: "network", label: "Network", title: "Affiliate Network", description: "Network structure by level and activity." },
    ],
  },
  notifications: {
    key: "notifications",
    icon: "🔔",
    label: "Notifications",
    href: "/dmo/notifications",
    description: "Operational alerts, critical warnings, and system messages.",
    views: [
      { key: "all", label: "All", title: "All Notifications", description: "Full notification stream." },
      { key: "critical", label: "Critical", title: "Critical Alerts", description: "Highest-priority notifications needing action." },
      { key: "warnings", label: "Warnings", title: "Warnings", description: "Warning-level notifications for follow-up." },
      { key: "system", label: "System Alerts", title: "System Alerts", description: "Informational and system-driven alerts." },
    ],
  },
  penalty: {
    key: "penalty",
    icon: "⚖️",
    label: "Penalty",
    href: "/dmo/penalty",
    description: "Penalty tracking for delays, refill misses, fraud, and appeals.",
    views: [
      { key: "all", label: "All Penalties", title: "All Penalties", description: "Complete penalty ledger." },
      { key: "active", label: "Active", title: "Active Penalties", description: "Penalties currently active and unresolved." },
      { key: "appeals", label: "Appeals", title: "Appeals", description: "Penalty cases under appeal or dispute." },
      { key: "history", label: "History", title: "Penalty History", description: "Resolved and historical penalty activity." },
    ],
  },
  settings: {
    key: "settings",
    icon: "⚙️",
    label: "Settings",
    href: "/dmo/settings",
    description: "DMO operator accounts, role logic, permissions, and system rules.",
    views: [
      { key: "users", label: "Users", title: "DMO Users", description: "Assignable and privileged users in DMO context." },
      { key: "roles", label: "Roles", title: "Roles", description: "Role catalog used across DMO operations." },
      { key: "permissions", label: "Permissions", title: "Permissions", description: "Permission matrix for key DMO actions." },
      { key: "config", label: "System Config", title: "System Config", description: "Config groups and control rules for DMO." },
    ],
  },
};

const jpsOverviewFallback: SectionDataMap["jps"] = getJpsOverview();

const fallbackApplications: ApplicationRow[] = [
  {
    id: "app-1001",
    type: "PSS",
    status: "NEW",
    applicant: { name: "Ali Raza", email: "ali@example.com" },
    assignedTo: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-1002",
    type: "CRB_CERTIFICATION",
    status: "UNDER_INSPECTION",
    applicant: { name: "Sara Ahmed", email: "sara@example.com" },
    assignedTo: { name: "Franchise Ops", role: "FRANCHISE" },
    assignedToId: "fr-1",
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-1003",
    type: "INDUSTRY_VERIFICATION",
    status: "IN_REVIEW",
    applicant: { name: "Usman Tariq", email: "usman@example.com" },
    assignedTo: { name: "DMO Admin", role: "ADMIN" },
    assignedToId: "admin-1",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-1004",
    type: "SERVICE",
    status: "APPROVED",
    applicant: { name: "Ayesha Malik", email: "ayesha@example.com" },
    assignedTo: { name: "Super Admin", role: "SUPER_ADMIN" },
    assignedToId: "super-1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const fallbackApprovals: ApprovalRow[] = [
  {
    id: "appr-1",
    applicationId: "app-1004",
    decision: "APPROVED",
    notes: "All trust requirements completed.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: { name: "Super Admin", role: "SUPER_ADMIN" },
  },
  {
    id: "appr-2",
    applicationId: "app-0999",
    decision: "REJECTED",
    notes: "Missing industry proof.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: { name: "DMO Admin", role: "ADMIN" },
  },
];

const fallbackAudit: AuditRow[] = [
  {
    id: "audit-1",
    action: "DMO_APPLICATION_CREATED",
    targetType: "APPLICATION",
    targetId: "app-1001",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    actor: { name: "Ali Raza" },
  },
  {
    id: "audit-2",
    action: "DMO_APPROVAL_RECORDED",
    targetType: "APPROVAL",
    targetId: "appr-1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { name: "Super Admin" },
  },
];

const fallbackPssCases: PssCase[] = [
  {
    id: "pss-1",
    user: { name: "Ali Raza", email: "ali@example.com" },
    status: "PENDING",
    risk: "low",
    riskScore: 22,
    stage: "DOCUMENTS",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    refillAlert: "ok",
    refillDaysRemaining: 40,
  },
  {
    id: "pss-2",
    user: { name: "Sara Ahmed", email: "sara@example.com" },
    status: "UNDER_REVIEW",
    risk: "medium",
    riskScore: 58,
    stage: "AML_RISK",
    updatedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    refillAlert: "warning",
    refillDaysRemaining: 5,
  },
  {
    id: "pss-3",
    user: { name: "Usman Tariq", email: "usman@example.com" },
    status: "REJECTED",
    risk: "high",
    riskScore: 91,
    stage: "FINAL_DECISION",
    updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    refillAlert: "expired",
    refillDaysRemaining: -2,
  },
];

const fallbackCrbApplications: CrbApplication[] = [
  {
    id: "crb-1",
    type: "SERVICE",
    industry: "Health",
    status: "SUBMITTED",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    applicant: { name: "Sara Ahmed", email: "sara@example.com" },
    documents: [{ id: "doc-1", type: "License", fileUrl: "https://example.com/license.pdf" }],
  },
  {
    id: "crb-2",
    type: "COMPANY",
    industry: "Construction",
    status: "INSPECTION",
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    applicant: { name: "BuildCo", email: "ops@buildco.com" },
    documents: [{ id: "doc-2", type: "Tax File", fileUrl: "https://example.com/tax.pdf" }],
    inspection: { id: "insp-1", status: "ASSIGNED", score: null, inspectorId: "fr-1" },
  },
  {
    id: "crb-3",
    type: "SKILL",
    industry: "IT",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    applicant: { name: "Hamza Khan", email: "hamza@example.com" },
    documents: [{ id: "doc-3", type: "Experience Letter", fileUrl: "https://example.com/xp.pdf" }],
    certificate: {
      id: "cert-1",
      status: "ISSUED",
      issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

const fallbackFranchiseTasks: FranchiseTask[] = [
  {
    id: "task-1",
    status: "ASSIGNED",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    franchise: { name: "Lahore East", city: "Lahore", level: "SUB" },
    crbApplication: { id: "crb-2", industry: "Construction", type: "COMPANY" },
  },
  {
    id: "task-2",
    status: "COMPLETED",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    franchise: { name: "Karachi Core", city: "Karachi", level: "MASTER" },
    crbApplication: { id: "crb-3", industry: "IT", type: "SKILL" },
    report: { id: "rep-1", score: 92, fraudSuspected: false },
  },
  {
    id: "task-3",
    status: "ESCALATED",
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    franchise: { name: "Islamabad Central", city: "Islamabad", level: "CORPORATE" },
    crbApplication: { id: "crb-4", industry: "Security", type: "COMPANY" },
    report: { id: "rep-2", score: 35, fraudSuspected: true },
  },
];

const fallbackStlScores: StlScoreRow[] = [
  {
    id: "stl-1",
    entityId: "Ali Raza",
    entityType: "USER",
    score: 84,
    level: 4,
    breakdown: { pss: 20, crb: 22, performance: 19, behavior: 13, refill: 10 },
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "stl-2",
    entityId: "Sara Ahmed",
    entityType: "USER",
    score: 61,
    level: 3,
    breakdown: { pss: 18, crb: 14, performance: 12, behavior: 9, refill: 8 },
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "stl-3",
    entityId: "Usman Tariq",
    entityType: "USER",
    score: 34,
    level: 2,
    breakdown: { pss: 8, crb: 7, performance: 6, behavior: 5, refill: 8 },
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const fallbackStlLogs: StlLogRow[] = [
  { id: "log-1", entityId: "Ali Raza", entityType: "USER", change: 5, reason: "PSS_RENEWED", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "log-2", entityId: "Sara Ahmed", entityType: "USER", change: -4, reason: "REFILL_WARNING", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: "log-3", entityId: "Usman Tariq", entityType: "USER", change: -12, reason: "FRAUD_FLAG", createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
];

const fallbackIndustries: IndustryRow[] = [
  { id: "ind-1", name: "Health", description: "Healthcare providers, clinics, and medical support." },
  { id: "ind-2", name: "IT", description: "Digital services, software, networking, and support." },
  { id: "ind-3", name: "Construction", description: "Civil, project, and on-site delivery services." },
];

const fallbackVerifications: IndustryVerification[] = [
  {
    id: "ver-1",
    entityType: "COMPANY",
    entityId: "BuildCo",
    status: "PENDING",
    score: 68,
    weight: 1.4,
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    industry: { name: "Construction" },
  },
  {
    id: "ver-2",
    entityType: "SERVICE",
    entityId: "Remote IT Support",
    status: "VERIFIED",
    score: 87,
    weight: 1.1,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    industry: { name: "IT" },
  },
  {
    id: "ver-3",
    entityType: "COMPANY",
    entityId: "HealthCare Plus",
    status: "REJECTED",
    score: 41,
    weight: 1,
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    industry: { name: "Health" },
  },
];

const fallbackAutomation: AutomationPayload = {
  stats: { activeRules: 24, triggersToday: 128, autoDecisions: 42, fraudAlerts: 6 },
  rules: [
    { id: "rule-1", event: "PSS_VERIFIED", action: "Create DMO application", active: true },
    { id: "rule-2", event: "REFILL_EXPIRED", action: "Lower STL and flag listing", active: true },
    { id: "rule-3", event: "FRAUD_SIGNAL", action: "Escalate to DMO admin", active: true },
  ],
  suggestions: [
    "Low-risk verification cases can use assisted auto approval thresholds.",
    "Run refill and SLA scans daily for trust protection.",
  ],
};

const fallbackRefilling: RefillingRow[] = [
  { id: "ref-1", user: { name: "Ali Raza" }, type: "PSS", dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), status: "WARNING", stlImpact: "No impact yet" },
  { id: "ref-2", user: { name: "Sara Ahmed" }, type: "INDUSTRY", dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: "EXPIRED", stlImpact: "-10 STL if unresolved" },
  { id: "ref-3", user: { name: "Hamza Khan" }, type: "PSS", dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), status: "ACTIVE", stlImpact: "Stable" },
];

const fallbackAffiliate: AffiliatePayload = {
  total: 1250,
  today: 45,
  referrals: 32,
  active: 18,
  link: "https://ehb.com/ref/ehb-demo-admin",
  users: [
    { id: "1", name: "Ahmed", level: 1, earnings: 120, status: "Active" },
    { id: "2", name: "Sara", level: 2, earnings: 80, status: "Active" },
    { id: "3", name: "Bilal", level: 3, earnings: 40, status: "Dormant" },
  ],
  suggestions: ["Invite 5 more users to unlock +$50 bonus", "Top conversion category: services"],
};

const fallbackNotifications: NotificationRow[] = [
  {
    id: "note-1",
    title: "PSS Verification Required",
    message: "Your identity verification is pending review.",
    type: "WARNING",
    time: new Date().toISOString(),
    nextAction: "Open PSS and complete all verification steps",
  },
  {
    id: "note-2",
    title: "Refilling Expiring",
    message: "One verification will expire in 3 days.",
    type: "CRITICAL",
    time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    nextAction: "Complete refill now to avoid STL drop",
  },
  {
    id: "note-3",
    title: "Marketplace Ranking Updated",
    message: "STL refresh has updated ranking visibility.",
    type: "INFO",
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    nextAction: "No urgent action required",
  },
];

const fallbackPenalties: PenaltyRow[] = [
  { id: "pen-1", user: { name: "Ali Khan" }, type: "SLA_DELAY", amount: 50, reason: "Late response on assigned application", status: "ACTIVE", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), stlImpact: -5 },
  { id: "pen-2", user: { name: "Sara Ahmed" }, type: "REFILL_MISS", amount: 120, reason: "Missed verification renewal grace period", status: "APPEAL", createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), stlImpact: -15 },
  { id: "pen-3", user: { name: "Usman Tariq" }, type: "FRAUD", amount: 400, reason: "Repeated fraud detection signals", status: "RESOLVED", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), stlImpact: -40 },
];

const fallbackUsers: DmoUser[] = [
  { id: "user-1", name: "DMO Admin", email: "admin@ehb.com", role: "ADMIN" },
  { id: "user-2", name: "Super Admin", email: "super@ehb.com", role: "SUPER_ADMIN" },
  { id: "user-3", name: "Franchise Lead", email: "franchise@ehb.com", role: "FRANCHISE" },
];

const settingsPermissionMatrix = [
  { role: "SUPER_ADMIN", permission: "All DMO modules, approvals, config, and user management" },
  { role: "ADMIN", permission: "Application review, approvals, monitoring, and operational settings" },
  { role: "FRANCHISE", permission: "Assigned inspections, reports, local escalations, and task progress" },
  { role: "USER", permission: "Own profile, own applications, own STL and notification visibility" },
];

const systemConfigGroups = [
  { group: "Security", detail: "Session fallback, auth policy, geo/device capture, fraud escalation" },
  { group: "Queue Rules", detail: "SLA windows, queue ownership, decision routing, bulk processing" },
  { group: "Trust Engine", detail: "STL thresholds, refill penalties, risk weighting, certificate expiry" },
  { group: "Notifications", detail: "Critical alerts, warning cadence, system message delivery" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function formatNumber(value: number | string) {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? String(value) : numeric.toFixed(2);
}

function riskLevelFor(app: ApplicationRow): "LOW" | "MEDIUM" | "HIGH" {
  const ageHours = (Date.now() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60);
  if (app.status === "UNDER_INSPECTION" && ageHours > 12) return "HIGH";
  if (app.type === "CRB_CERTIFICATION" || app.type === "INDUSTRY_VERIFICATION") return "HIGH";
  if (ageHours > 6 || app.status === "IN_REVIEW") return "MEDIUM";
  return "LOW";
}

function isSlaBreach(app: ApplicationRow) {
  const ageHours = (Date.now() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60);
  return !["APPROVED", "REJECTED"].includes(app.status) && ageHours > 8;
}

async function loadSectionData(sectionKey: DmoSectionKey): Promise<SectionDataMap[DmoSectionKey]> {
  switch (sectionKey) {
    case "applications":
    case "approvals": {
      const [applicationsPayload, approvalsPayload, auditPayload] = await Promise.all([
        fetchJson<{ applications?: ApplicationRow[] }>("/api/dmo/applications?take=200&skip=0", { applications: fallbackApplications }),
        fetchJson<{ approvals?: ApprovalRow[] }>("/api/dmo/approvals?take=200&skip=0", { approvals: fallbackApprovals }),
        fetchJson<{ logs?: AuditRow[]; records?: AuditRow[] }>("/api/dmo/audit?take=200&skip=0", { logs: fallbackAudit }),
      ]);
      return {
        applications: applicationsPayload.applications ?? fallbackApplications,
        approvals: approvalsPayload.approvals ?? fallbackApprovals,
        audit: auditPayload.logs ?? auditPayload.records ?? fallbackAudit,
      } as SectionDataMap[DmoSectionKey];
    }
    case "jps":
      return (await fetchJson<JpsOverview>("/api/jps", jpsOverviewFallback)) as SectionDataMap[DmoSectionKey];
    case "pss": {
      const payload = await fetchJson<{ cases?: PssCase[] }>("/api/pss/cases?take=200&skip=0", { cases: fallbackPssCases });
      return { cases: payload.cases ?? fallbackPssCases } as SectionDataMap[DmoSectionKey];
    }
    case "crb": {
      const payload = await fetchJson<{ items?: CrbApplication[] }>("/api/crb/applications?take=200&skip=0", { items: fallbackCrbApplications });
      return { applications: payload.items ?? fallbackCrbApplications } as SectionDataMap[DmoSectionKey];
    }
    case "franchise": {
      const payload = await fetchJson<{ items?: FranchiseTask[] }>("/api/franchise/tasks?take=200&skip=0", { items: fallbackFranchiseTasks });
      return { tasks: payload.items ?? fallbackFranchiseTasks } as SectionDataMap[DmoSectionKey];
    }
    case "stl": {
      const payload = await fetchJson<{ scores?: StlScoreRow[]; logs?: StlLogRow[] }>("/api/stl/calculate?take=200&skip=0&logsTake=200", {
        scores: fallbackStlScores,
        logs: fallbackStlLogs,
      });
      return { scores: payload.scores ?? fallbackStlScores, logs: payload.logs ?? fallbackStlLogs } as SectionDataMap[DmoSectionKey];
    }
    case "industry": {
      const [industriesPayload, verificationsPayload] = await Promise.all([
        fetchJson<{ items?: IndustryRow[] }>("/api/industries?take=64&skip=0", { items: fallbackIndustries }),
        fetchJson<{ items?: IndustryVerification[] }>("/api/industry/verifications?take=200&skip=0", { items: fallbackVerifications }),
      ]);
      return {
        industries: industriesPayload.items ?? fallbackIndustries,
        verifications: verificationsPayload.items ?? fallbackVerifications,
      } as SectionDataMap[DmoSectionKey];
    }
    case "automation":
      return (await fetchJson<AutomationPayload>("/api/automation", fallbackAutomation)) as SectionDataMap[DmoSectionKey];
    case "refilling": {
      const rows = await fetchJson<RefillingRow[]>("/api/refilling", fallbackRefilling);
      return { rows } as SectionDataMap[DmoSectionKey];
    }
    case "affiliate":
      return (await fetchJson<AffiliatePayload>("/api/affiliate", fallbackAffiliate)) as SectionDataMap[DmoSectionKey];
    case "notifications": {
      const rows = await fetchJson<NotificationRow[]>("/api/notifications", fallbackNotifications);
      return { rows } as SectionDataMap[DmoSectionKey];
    }
    case "penalty": {
      const rows = await fetchJson<PenaltyRow[]>("/api/penalty", fallbackPenalties);
      return { rows } as SectionDataMap[DmoSectionKey];
    }
    case "settings": {
      const payload = await fetchJson<{ users?: DmoUser[] }>("/api/dmo/users", { users: fallbackUsers });
      return { users: payload.users ?? fallbackUsers } as SectionDataMap[DmoSectionKey];
    }
  }
}

function getViewMeta(sectionKey: DmoSectionKey, viewKey?: string) {
  const section = DMO_SECTION_META[sectionKey];
  if (!section) return null;
  if (!viewKey) return section.views[0] ?? null;
  return section.views.find((entry) => entry.key === viewKey) ?? null;
}

function buildApplicationsPresentation(section: SectionDataMap["applications"], view: string): TablePresentation {
  const apps = section.applications;
  const filtered =
    view === "queue"
      ? apps.filter((app) => Boolean(app.assignedToId || app.assignedTo))
      : view === "high-risk"
        ? apps.filter((app) => riskLevelFor(app) === "HIGH")
        : view === "sla-breach"
          ? apps.filter(isSlaBreach)
          : apps;
  return {
    title: getViewMeta("applications", view)?.title ?? "Applications",
    description: getViewMeta("applications", view)?.description ?? DMO_SECTION_META.applications.description,
    stats: [
      { label: "Total", value: apps.length },
      { label: "Pending", value: apps.filter((app) => !["APPROVED", "REJECTED"].includes(app.status)).length },
      { label: "High Risk", value: apps.filter((app) => riskLevelFor(app) === "HIGH").length },
      { label: "SLA Breach", value: apps.filter(isSlaBreach).length },
    ],
    columns: ["Application", "Applicant", "Type", "Status", "Risk", "Updated"],
    rows: filtered.map((app) => ({
      id: app.id,
      values: [
        app.id,
        app.applicant?.name ?? "Unknown",
        app.type,
        app.status,
        riskLevelFor(app),
        formatDate(app.updatedAt),
      ],
    })),
    notes: ["Risk and SLA thresholds are derived from the existing DMO dashboard logic."],
    emptyState: "No applications found for this view.",
  };
}

function buildApprovalsPresentation(section: SectionDataMap["approvals"], view: string): TablePresentation {
  if (view === "history") {
    return {
      title: getViewMeta("approvals", view)?.title ?? "Approval History",
      description: getViewMeta("approvals", view)?.description ?? DMO_SECTION_META.approvals.description,
      stats: [
        { label: "Approvals Logged", value: section.approvals.length },
        { label: "Approved", value: section.approvals.filter((item) => item.decision === "APPROVED").length },
        { label: "Rejected", value: section.approvals.filter((item) => item.decision === "REJECTED").length },
        { label: "Audit Entries", value: section.audit.length },
      ],
      columns: ["Approval", "Application", "Decision", "Actor", "Created"],
      rows: section.approvals.map((item) => ({
        id: item.id,
        values: [item.id, item.applicationId, item.decision, item.approvedBy?.name ?? "System", formatDate(item.createdAt)],
      })),
      notes: ["The history view combines audit and approval records into one trace."],
      emptyState: "No approval history found.",
    };
  }

  const apps =
    view === "pending"
      ? section.applications.filter((app) => !["APPROVED", "REJECTED"].includes(app.status))
      : view === "approved"
        ? section.applications.filter((app) => app.status === "APPROVED")
        : section.applications.filter((app) => app.status === "REJECTED");

  return {
    title: getViewMeta("approvals", view)?.title ?? "Approvals",
    description: getViewMeta("approvals", view)?.description ?? DMO_SECTION_META.approvals.description,
    stats: [
      { label: "Pending", value: section.applications.filter((app) => !["APPROVED", "REJECTED"].includes(app.status)).length },
      { label: "Approved", value: section.applications.filter((app) => app.status === "APPROVED").length },
      { label: "Rejected", value: section.applications.filter((app) => app.status === "REJECTED").length },
      { label: "Total Decisions", value: section.approvals.length },
    ],
    columns: ["Application", "Applicant", "Type", "Status", "Assigned To", "Updated"],
    rows: apps.map((app) => ({
      id: app.id,
      values: [app.id, app.applicant?.name ?? "Unknown", app.type, app.status, app.assignedTo?.name ?? "Unassigned", formatDate(app.updatedAt)],
    })),
    notes: ["Pending approvals are derived from live application status, while final decision records remain available in the history view."],
    emptyState: "No approval records found for this view.",
  };
}

function buildJpsPresentation(section: SectionDataMap["jps"], view: string): TablePresentation {
  const profiles = section.profiles;
  if (view === "skills") {
    return {
      title: getViewMeta("jps", view)?.title ?? "JPS Skills",
      description: getViewMeta("jps", view)?.description ?? DMO_SECTION_META.jps.description,
      stats: [
        { label: "Profiles", value: profiles.length },
        { label: "Skill Groups", value: section.skillCategories.length },
        { label: "Verified", value: profiles.filter((item) => item.status === "Verified").length },
        { label: "Cities", value: new Set(profiles.map((item) => item.city)).size },
      ],
      columns: ["Profile", "Designation", "Industry", "Skills", "Status"],
      rows: profiles.map((item) => ({
        id: item.id,
        values: [item.name, item.designation, item.industry, item.skills.join(", "), item.status],
      })),
      notes: section.skillCategories.map((entry) => `${entry.category}: ${entry.exampleSkills.join(", ")}`),
      emptyState: "No JPS skill records found.",
    };
  }
  if (view === "services") {
    return {
      title: getViewMeta("jps", view)?.title ?? "JPS Services",
      description: getViewMeta("jps", view)?.description ?? DMO_SECTION_META.jps.description,
      stats: [
        { label: "Profiles", value: profiles.length },
        { label: "Services", value: new Set(profiles.flatMap((item) => item.services)).size },
        { label: "Mapped Skills", value: new Set(profiles.flatMap((item) => item.skills)).size },
        { label: "Verified", value: profiles.filter((item) => item.status === "Verified").length },
      ],
      columns: ["Profile", "Industry", "Services", "Skills", "STL"],
      rows: profiles.map((item) => ({
        id: item.id,
        values: [item.name, item.industry, item.services.join(", "), item.skills.join(", "), item.stlLevel],
      })),
      emptyState: "No JPS service mapping found.",
    };
  }
  if (view === "jobs") {
    return {
      title: getViewMeta("jps", view)?.title ?? "JPS Jobs",
      description: getViewMeta("jps", view)?.description ?? DMO_SECTION_META.jps.description,
      stats: [
        { label: "Profiles", value: profiles.length },
        { label: "Open Roles", value: new Set(profiles.flatMap((item) => item.jobs)).size },
        { label: "Active Cities", value: new Set(profiles.map((item) => item.city)).size },
        { label: "Designation Ladders", value: Object.keys(section.designationLadders).length },
      ],
      columns: ["Profile", "Designation", "Jobs", "City", "Status"],
      rows: profiles.map((item) => ({
        id: item.id,
        values: [item.name, item.designation, item.jobs.join(", "), item.city, item.status],
      })),
      notes: Object.entries(section.designationLadders).map(
        ([industry, levels]) => `${industry}: ${levels.map((entry) => `${entry.level}-${entry.title}`).join(" | ")}`
      ),
      emptyState: "No JPS job records found.",
    };
  }
  return {
    title: getViewMeta("jps", view)?.title ?? "JPS Profiles",
    description: getViewMeta("jps", view)?.description ?? DMO_SECTION_META.jps.description,
    stats: [
      { label: "Profiles", value: profiles.length },
      { label: "Verified", value: profiles.filter((item) => item.status === "Verified").length },
      { label: "Cities", value: new Set(profiles.map((item) => item.city)).size },
      { label: "Service Lines", value: new Set(profiles.flatMap((item) => item.services)).size },
    ],
    columns: ["Profile", "Designation", "Industry", "Experience", "Status", "Primary Skills"],
    rows: profiles.map((item) => ({
      id: item.id,
      values: [item.name, item.designation, item.industry, item.experience, item.status, item.skills.slice(0, 2).join(", ")],
    })),
    notes: section.systemNotes,
    emptyState: "No JPS profiles found.",
  };
}

function buildPssPresentation(section: SectionDataMap["pss"], view: string): TablePresentation {
  const cases = section.cases;
  const filtered =
    view === "risk"
      ? [...cases].sort((a, b) => Number(b.riskScore ?? 0) - Number(a.riskScore ?? 0))
      : view === "fraud"
        ? cases.filter((item) => item.risk === "high" || Number(item.riskScore ?? 0) >= 75)
        : view === "refilling"
          ? cases.filter((item) => item.refillAlert && item.refillAlert !== "ok")
          : view === "steps"
            ? [...cases].sort((a, b) => a.stage.localeCompare(b.stage))
            : cases;

  return {
    title: getViewMeta("pss", view)?.title ?? "PSS",
    description: getViewMeta("pss", view)?.description ?? DMO_SECTION_META.pss.description,
    stats: [
      { label: "Cases", value: cases.length },
      { label: "High Risk", value: cases.filter((item) => item.risk === "high").length },
      { label: "Verified", value: cases.filter((item) => item.status === "VERIFIED").length },
      { label: "Refill Alerts", value: cases.filter((item) => item.refillAlert && item.refillAlert !== "ok").length },
    ],
    columns: ["User", "Status", "Stage", "Risk", "Risk Score", "Updated"],
    rows: filtered.map((item) => ({
      id: item.id,
      values: [
        item.user?.name ?? "Unknown",
        item.status,
        item.stage,
        String(item.risk ?? "—").toUpperCase(),
        item.riskScore ?? "—",
        formatDate(item.updatedAt),
      ],
    })),
    notes: view === "refilling" ? ["The refilling view shows cases where the refill alert is in warning or expired state."] : undefined,
    emptyState: "No PSS cases found for this view.",
  };
}

function buildCrbPresentation(section: SectionDataMap["crb"], view: string): TablePresentation {
  const apps = section.applications;
  const filtered =
    view === "docs"
      ? apps.filter((item) => (item.documents?.length ?? 0) > 0)
      : view === "inspection"
        ? apps.filter((item) => item.status === "INSPECTION" || Boolean(item.inspection))
        : view === "certificates"
          ? apps.filter((item) => Boolean(item.certificate))
          : view === "expiry"
            ? apps.filter((item) => Boolean(item.certificate?.expiryDate))
            : apps;

  return {
    title: getViewMeta("crb", view)?.title ?? "CRB",
    description: getViewMeta("crb", view)?.description ?? DMO_SECTION_META.crb.description,
    stats: [
      { label: "Applications", value: apps.length },
      { label: "Inspection", value: apps.filter((item) => item.status === "INSPECTION" || Boolean(item.inspection)).length },
      { label: "Certificates", value: apps.filter((item) => Boolean(item.certificate)).length },
      { label: "Docs", value: apps.filter((item) => (item.documents?.length ?? 0) > 0).length },
    ],
    columns: ["Applicant", "Type", "Industry", "Status", "Docs", "Certificate / Expiry"],
    rows: filtered.map((item) => ({
      id: item.id,
      values: [
        item.applicant?.name ?? "Unknown",
        item.type,
        item.industry,
        item.status,
        item.documents?.length ?? 0,
        item.certificate?.expiryDate ? formatDate(item.certificate.expiryDate) : item.certificate?.status ?? "—",
      ],
    })),
    emptyState: "No CRB records found for this view.",
  };
}

function buildFranchisePresentation(section: SectionDataMap["franchise"], view: string): TablePresentation {
  const tasks = section.tasks;
  const filtered =
    view === "in-progress"
      ? tasks.filter((item) => item.status === "ASSIGNED" || item.status === "IN_PROGRESS")
      : view === "reports"
        ? tasks.filter((item) => Boolean(item.report))
        : view === "escalations"
          ? tasks.filter((item) => item.status === "ESCALATED" || Boolean(item.report?.fraudSuspected))
          : tasks;

  return {
    title: getViewMeta("franchise", view)?.title ?? "Franchise",
    description: getViewMeta("franchise", view)?.description ?? DMO_SECTION_META.franchise.description,
    stats: [
      { label: "Tasks", value: tasks.length },
      { label: "In Progress", value: tasks.filter((item) => item.status === "ASSIGNED" || item.status === "IN_PROGRESS").length },
      { label: "Reports", value: tasks.filter((item) => Boolean(item.report)).length },
      { label: "Escalated", value: tasks.filter((item) => item.status === "ESCALATED").length },
    ],
    columns: ["Task", "Franchise", "Industry", "Status", "Due / Updated", "Report"],
    rows: filtered.map((item) => ({
      id: item.id,
      values: [
        item.id,
        item.franchise?.name ?? item.franchise?.city ?? "—",
        item.crbApplication?.industry ?? "—",
        item.status,
        item.dueDate ? formatDate(item.dueDate) : formatDate(item.updatedAt),
        item.report ? `Score ${item.report.score ?? "—"}` : "Pending",
      ],
    })),
    notes: ["Franchise pages use the real inspection task API, while fallback rows cover missing report or escalation data."],
    emptyState: "No franchise tasks found for this view.",
  };
}

function buildStlPresentation(section: SectionDataMap["stl"], view: string): TablePresentation {
  if (view === "history") {
    return {
      title: getViewMeta("stl", view)?.title ?? "STL History",
      description: getViewMeta("stl", view)?.description ?? DMO_SECTION_META.stl.description,
      stats: [
        { label: "Logs", value: section.logs.length },
        { label: "Positive", value: section.logs.filter((item) => Number(item.change) > 0).length },
        { label: "Negative", value: section.logs.filter((item) => Number(item.change) < 0).length },
        { label: "Tracked Scores", value: section.scores.length },
      ],
      columns: ["Entity", "Type", "Change", "Reason", "Created"],
      rows: section.logs.map((item) => ({
        id: item.id,
        values: [item.entityId, item.entityType, Number(item.change) >= 0 ? `+${formatNumber(item.change)}` : formatNumber(item.change), item.reason, formatDate(item.createdAt)],
      })),
      emptyState: "No STL history entries found.",
    };
  }

  const filtered = view === "ranking" ? [...section.scores].sort((a, b) => Number(b.score) - Number(a.score)) : section.scores;
  return {
    title: getViewMeta("stl", view)?.title ?? "STL Scores",
    description: getViewMeta("stl", view)?.description ?? DMO_SECTION_META.stl.description,
    stats: [
      { label: "Tracked", value: section.scores.length },
      { label: "Elite", value: section.scores.filter((item) => item.level >= 5).length },
      { label: "Low Trust", value: section.scores.filter((item) => item.level <= 2).length },
      { label: "Avg Score", value: section.scores.length ? Math.round(section.scores.reduce((sum, item) => sum + Number(item.score), 0) / section.scores.length) : 0 },
    ],
    columns: ["Entity", "Type", "Score", "Level", view === "breakdown" ? "Breakdown" : "Updated"],
    rows: filtered.map((item) => ({
      id: item.id,
      values: [
        item.entityId,
        item.entityType,
        formatNumber(item.score),
        `L${item.level}`,
        view === "breakdown"
          ? Object.entries(item.breakdown ?? {})
              .map(([key, value]) => `${key}:${String(value)}`)
              .join(", ")
          : formatDate(item.lastUpdated),
      ],
    })),
    emptyState: "No STL data found for this view.",
  };
}

function buildIndustryPresentation(section: SectionDataMap["industry"], view: string): TablePresentation {
  if (view === "list") {
    return {
      title: getViewMeta("industry", view)?.title ?? "Industry List",
      description: getViewMeta("industry", view)?.description ?? DMO_SECTION_META.industry.description,
      stats: [
        { label: "Industries", value: section.industries.length },
        { label: "Verifications", value: section.verifications.length },
        { label: "Verified", value: section.verifications.filter((item) => item.status === "VERIFIED").length },
        { label: "Pending", value: section.verifications.filter((item) => item.status === "PENDING").length },
      ],
      columns: ["Industry", "Description"],
      rows: section.industries.map((item) => ({
        id: item.id,
        values: [item.name, item.description ?? "—"],
      })),
      emptyState: "No industries found.",
    };
  }

  const rows =
    view === "scores"
      ? section.verifications.filter((item) => item.score !== null && item.score !== undefined)
      : section.verifications;

  return {
    title: getViewMeta("industry", view)?.title ?? "Industry",
    description: getViewMeta("industry", view)?.description ?? DMO_SECTION_META.industry.description,
    stats: [
      { label: "Verifications", value: section.verifications.length },
      { label: "Verified", value: section.verifications.filter((item) => item.status === "VERIFIED").length },
      { label: "Pending", value: section.verifications.filter((item) => item.status === "PENDING").length },
      { label: "Weighted", value: section.verifications.filter((item) => Number(item.weight) > 1).length },
    ],
    columns: ["Industry", "Entity", "Type", "Status", "Score", "Weight"],
    rows: rows.map((item) => ({
      id: item.id,
      values: [
        item.industry?.name ?? "—",
        item.entityId,
        item.entityType,
        item.status,
        item.score ?? "—",
        item.weight,
      ],
    })),
    emptyState: "No industry verification records found.",
  };
}

function buildAutomationPresentation(section: SectionDataMap["automation"], view: string): TablePresentation {
  const rules = section.rules;
  const rows =
    view === "fraud"
      ? rules.filter((item) => item.event.toLowerCase().includes("fraud") || item.action.toLowerCase().includes("fraud"))
      : rules;
  return {
    title: getViewMeta("automation", view)?.title ?? "Automation",
    description: getViewMeta("automation", view)?.description ?? DMO_SECTION_META.automation.description,
    stats: [
      { label: "Active Rules", value: section.stats.activeRules },
      { label: "Triggers Today", value: section.stats.triggersToday },
      { label: "Auto Decisions", value: section.stats.autoDecisions },
      { label: "Fraud Alerts", value: section.stats.fraudAlerts },
    ],
    columns: ["Event", "Action", "Status"],
    rows: rows.map((item) => ({
      id: item.id,
      values: [item.event, item.action, item.active ? "Active" : "Disabled"],
    })),
    notes: section.suggestions,
    emptyState: "No automation rules found for this view.",
  };
}

function buildRefillingPresentation(section: SectionDataMap["refilling"], view: string): TablePresentation {
  const rows =
    view === "expiring"
      ? section.rows.filter((item) => item.status === "WARNING")
      : view === "expired"
        ? section.rows.filter((item) => item.status === "EXPIRED")
        : view === "completed"
          ? section.rows.filter((item) => item.status === "COMPLETED")
          : section.rows.filter((item) => item.status === "ACTIVE");

  return {
    title: getViewMeta("refilling", view)?.title ?? "Refilling",
    description: getViewMeta("refilling", view)?.description ?? DMO_SECTION_META.refilling.description,
    stats: [
      { label: "Active", value: section.rows.filter((item) => item.status === "ACTIVE").length },
      { label: "Warning", value: section.rows.filter((item) => item.status === "WARNING").length },
      { label: "Expired", value: section.rows.filter((item) => item.status === "EXPIRED").length },
      { label: "Completed", value: section.rows.filter((item) => item.status === "COMPLETED").length },
    ],
    columns: ["User", "Type", "Due Date", "Status", "STL Impact"],
    rows: rows.map((item) => ({
      id: item.id,
      values: [item.user.name, item.type, formatDate(item.dueDate), item.status, item.stlImpact],
    })),
    emptyState: "No refilling items found for this view.",
  };
}

function buildAffiliatePresentation(section: SectionDataMap["affiliate"], view: string): TablePresentation {
  const rows =
    view === "earnings"
      ? [...section.users].sort((a, b) => b.earnings - a.earnings)
      : view === "network"
        ? [...section.users].sort((a, b) => b.level - a.level)
        : section.users;
  return {
    title: getViewMeta("affiliate", view)?.title ?? "Affiliate",
    description: getViewMeta("affiliate", view)?.description ?? DMO_SECTION_META.affiliate.description,
    stats: [
      { label: "Total", value: `$${section.total}` },
      { label: "Today", value: `$${section.today}` },
      { label: "Referrals", value: section.referrals },
      { label: "Active", value: section.active },
    ],
    columns: ["User", "Level", "Earnings", "Status"],
    rows: rows.map((item) => ({
      id: item.id,
      values: [item.name, item.level, `$${item.earnings}`, item.status],
    })),
    notes: [`Referral link: ${section.link}`, ...(section.suggestions ?? [])],
    emptyState: "No affiliate records found for this view.",
  };
}

function buildNotificationsPresentation(section: SectionDataMap["notifications"], view: string): TablePresentation {
  const rows =
    view === "critical"
      ? section.rows.filter((item) => item.type === "CRITICAL")
      : view === "warnings"
        ? section.rows.filter((item) => item.type === "WARNING")
        : view === "system"
          ? section.rows.filter((item) => item.type === "INFO")
          : section.rows;

  return {
    title: getViewMeta("notifications", view)?.title ?? "Notifications",
    description: getViewMeta("notifications", view)?.description ?? DMO_SECTION_META.notifications.description,
    stats: [
      { label: "Total", value: section.rows.length },
      { label: "Critical", value: section.rows.filter((item) => item.type === "CRITICAL").length },
      { label: "Warnings", value: section.rows.filter((item) => item.type === "WARNING").length },
      { label: "System", value: section.rows.filter((item) => item.type === "INFO").length },
    ],
    columns: ["Title", "Type", "Message", "Next Action", "Time"],
    rows: rows.map((item) => ({
      id: item.id,
      values: [item.title, item.type, item.message, item.nextAction ?? "—", formatDate(item.time)],
    })),
    emptyState: "No notifications found for this view.",
  };
}

function buildPenaltyPresentation(section: SectionDataMap["penalty"], view: string): TablePresentation {
  const rows =
    view === "active"
      ? section.rows.filter((item) => item.status === "ACTIVE")
      : view === "appeals"
        ? section.rows.filter((item) => item.status === "APPEAL")
        : view === "history"
          ? section.rows.filter((item) => item.status === "RESOLVED")
          : section.rows;

  return {
    title: getViewMeta("penalty", view)?.title ?? "Penalty",
    description: getViewMeta("penalty", view)?.description ?? DMO_SECTION_META.penalty.description,
    stats: [
      { label: "Total", value: section.rows.length },
      { label: "Active", value: section.rows.filter((item) => item.status === "ACTIVE").length },
      { label: "Appeals", value: section.rows.filter((item) => item.status === "APPEAL").length },
      { label: "Resolved", value: section.rows.filter((item) => item.status === "RESOLVED").length },
    ],
    columns: ["User", "Type", "Amount", "Status", "STL Impact", "Created"],
    rows: rows.map((item) => ({
      id: item.id,
      values: [item.user.name, item.type, `$${item.amount}`, item.status, item.stlImpact ?? "—", formatDate(item.createdAt)],
    })),
    emptyState: "No penalty records found for this view.",
  };
}

function buildSettingsPresentation(section: SectionDataMap["settings"], view: string): TablePresentation {
  if (view === "roles") {
    return {
      title: getViewMeta("settings", view)?.title ?? "Roles",
      description: getViewMeta("settings", view)?.description ?? DMO_SECTION_META.settings.description,
      stats: [
        { label: "Users", value: section.users.length },
        { label: "Roles", value: new Set(section.users.map((item) => item.role)).size },
        { label: "Admins", value: section.users.filter((item) => item.role.includes("ADMIN")).length },
        { label: "Franchise", value: section.users.filter((item) => item.role === "FRANCHISE").length },
      ],
      columns: ["Role", "Permission Summary"],
      rows: settingsPermissionMatrix.map((item) => ({
        id: item.role,
        values: [item.role, item.permission],
      })),
      emptyState: "No role data found.",
    };
  }
  if (view === "permissions") {
    return {
      title: getViewMeta("settings", view)?.title ?? "Permissions",
      description: getViewMeta("settings", view)?.description ?? DMO_SECTION_META.settings.description,
      stats: [
        { label: "Permission Rows", value: settingsPermissionMatrix.length },
        { label: "Roles", value: new Set(settingsPermissionMatrix.map((item) => item.role)).size },
        { label: "Users", value: section.users.length },
        { label: "Config Groups", value: systemConfigGroups.length },
      ],
      columns: ["Role", "Permission Scope"],
      rows: settingsPermissionMatrix.map((item) => ({
        id: item.role,
        values: [item.role, item.permission],
      })),
      emptyState: "No permissions found.",
    };
  }
  if (view === "config") {
    return {
      title: getViewMeta("settings", view)?.title ?? "System Config",
      description: getViewMeta("settings", view)?.description ?? DMO_SECTION_META.settings.description,
      stats: [
        { label: "Config Groups", value: systemConfigGroups.length },
        { label: "Users", value: section.users.length },
        { label: "Privileged Roles", value: 3 },
        { label: "Critical Policies", value: 4 },
      ],
      columns: ["Group", "Rule Set"],
      rows: systemConfigGroups.map((item) => ({
        id: item.group,
        values: [item.group, item.detail],
      })),
      emptyState: "No config groups found.",
    };
  }
  return {
    title: getViewMeta("settings", view)?.title ?? "Users",
    description: getViewMeta("settings", view)?.description ?? DMO_SECTION_META.settings.description,
    stats: [
      { label: "Users", value: section.users.length },
      { label: "Admins", value: section.users.filter((item) => item.role.includes("ADMIN")).length },
      { label: "Franchise", value: section.users.filter((item) => item.role === "FRANCHISE").length },
      { label: "Roles", value: new Set(section.users.map((item) => item.role)).size },
    ],
    columns: ["Name", "Email", "Role"],
    rows: section.users.map((item) => ({
      id: item.id,
      values: [item.name, item.email, item.role],
    })),
    emptyState: "No DMO users found.",
  };
}

function buildPresentation(sectionKey: DmoSectionKey, rawData: SectionDataMap[DmoSectionKey], viewKey?: string): TablePresentation {
  const resolvedView = viewKey ?? DMO_SECTION_META[sectionKey].views[0]?.key;
  switch (sectionKey) {
    case "applications":
      return buildApplicationsPresentation(rawData as SectionDataMap["applications"], resolvedView);
    case "approvals":
      return buildApprovalsPresentation(rawData as SectionDataMap["approvals"], resolvedView);
    case "jps":
      return buildJpsPresentation(rawData as SectionDataMap["jps"], resolvedView);
    case "pss":
      return buildPssPresentation(rawData as SectionDataMap["pss"], resolvedView);
    case "crb":
      return buildCrbPresentation(rawData as SectionDataMap["crb"], resolvedView);
    case "franchise":
      return buildFranchisePresentation(rawData as SectionDataMap["franchise"], resolvedView);
    case "stl":
      return buildStlPresentation(rawData as SectionDataMap["stl"], resolvedView);
    case "industry":
      return buildIndustryPresentation(rawData as SectionDataMap["industry"], resolvedView);
    case "automation":
      return buildAutomationPresentation(rawData as SectionDataMap["automation"], resolvedView);
    case "refilling":
      return buildRefillingPresentation(rawData as SectionDataMap["refilling"], resolvedView);
    case "affiliate":
      return buildAffiliatePresentation(rawData as SectionDataMap["affiliate"], resolvedView);
    case "notifications":
      return buildNotificationsPresentation(rawData as SectionDataMap["notifications"], resolvedView);
    case "penalty":
      return buildPenaltyPresentation(rawData as SectionDataMap["penalty"], resolvedView);
    case "settings":
      return buildSettingsPresentation(rawData as SectionDataMap["settings"], resolvedView);
  }
}

export function DmoSectionWorkspace({
  sectionKey,
  viewKey,
}: {
  sectionKey: string;
  viewKey?: string;
}) {
  const section = DMO_SECTION_META[sectionKey as DmoSectionKey];
  const viewMeta = section ? getViewMeta(section.key, viewKey) : null;
  const [data, setData] = useState<SectionDataMap[DmoSectionKey] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!section) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    void loadSectionData(section.key)
      .then((payload) => {
        if (!mounted) return;
        setData(payload);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load section data");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [sectionKey, viewKey, section]);

  const presentation = useMemo(() => {
    if (!section || !data) return null;
    return buildPresentation(section.key, data, viewMeta?.key);
  }, [data, section, viewMeta]);

  if (!section || !viewMeta) {
    return (
      <main className="min-h-screen text-slate-100">
        <div className="container-ehb py-6">
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5">
            <h1 className="text-lg font-semibold text-rose-100">DMO page not found</h1>
            <p className="mt-2 text-sm text-rose-100/80">The selected DMO section or sub-page is not configured yet.</p>
            <Link href="/dmo" className="mt-4 inline-flex rounded-full bg-rose-300 px-4 py-2 text-xs font-semibold text-slate-950">
              Back to DMO Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 space-y-5">
        <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">
                {section.icon} {section.label}
              </p>
              <h1 className="mt-1 text-2xl font-semibold gradient-text">{viewMeta.title}</h1>
              <p className="mt-1 max-w-3xl text-sm text-slate-300">{viewMeta.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dmo" className="ehb-btn-secondary ehb-press">
                DMO Dashboard
              </Link>
              <Link href={section.href} className="ehb-btn-secondary ehb-press">
                {section.label} Home
              </Link>
              <Link href="/home" className="ehb-btn-primary ehb-press">
                EHB Home
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {loading || !presentation
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="ehb-card-elevated animate-pulse">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="mt-3 h-7 w-16 rounded bg-white/10" />
                </div>
              ))
            : presentation.stats.map((stat) => (
                <div key={stat.label} className="ehb-card-elevated">
                  <div className="text-xs ehb-text-muted">{stat.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
                </div>
              ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="ehb-card-elevated space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-white">{presentation?.title ?? "Loading..."}</div>
                <div className="text-xs text-slate-400">{presentation?.description ?? "Preparing section data..."}</div>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                {error}
              </div>
            ) : null}

            <div className="overflow-auto rounded-xl border border-white/10">
              <table className="min-w-full text-xs">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    {(presentation?.columns ?? []).map((column) => (
                      <th key={column} className="px-3 py-2 text-left font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading || !presentation ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                        Loading section workspace...
                      </td>
                    </tr>
                  ) : presentation.rows.length === 0 ? (
                    <tr>
                      <td colSpan={presentation.columns.length} className="px-3 py-8 text-center text-slate-400">
                        {presentation.emptyState}
                      </td>
                    </tr>
                  ) : (
                    presentation.rows.map((row) => (
                      <tr key={row.id} className="border-t border-white/10">
                        {row.values.map((value, index) => (
                          <td key={`${row.id}-${index}`} className="px-3 py-2 align-top text-slate-200">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="ehb-card-elevated space-y-3">
              <div className="text-sm font-semibold text-white">Section Navigation</div>
              <div className="grid gap-2">
                {section.views.map((item) => {
                  const href = `${section.href}/${item.key}`;
                  const isActive = item.key === viewMeta.key;
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      className={[
                        "rounded-xl border px-3 py-2 text-xs transition-colors",
                        isActive
                          ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="mt-1 text-[11px] text-slate-400">{item.description}</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {presentation?.notes && presentation.notes.length > 0 ? (
              <div className="ehb-card-elevated space-y-2">
                <div className="text-sm font-semibold text-white">Working Notes</div>
                {presentation.notes.map((note) => (
                  <div key={note} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                    {note}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
