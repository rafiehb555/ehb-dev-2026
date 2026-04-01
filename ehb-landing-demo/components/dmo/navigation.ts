export type DmoNavItem = {
  key: string;
  label: string;
  href: string;
};

export type DmoNavSection = {
  key: string;
  icon: string;
  label: string;
  href: string;
  items: DmoNavItem[];
};

export const DMO_NAV_SECTIONS: DmoNavSection[] = [
  {
    key: "dashboard",
    icon: "🏠",
    label: "Dashboard",
    href: "/dmo",
    items: [{ key: "dashboard-overview", label: "Overview", href: "/dmo" }],
  },
  {
    key: "applications",
    icon: "📋",
    label: "Applications",
    href: "/dmo/applications",
    items: [
      { key: "applications-all", label: "All Applications", href: "/dmo/applications/all" },
      { key: "applications-queue", label: "My Queue", href: "/dmo/applications/queue" },
      { key: "applications-high-risk", label: "High Risk", href: "/dmo/applications/high-risk" },
      { key: "applications-sla", label: "SLA Breach", href: "/dmo/applications/sla-breach" },
    ],
  },
  {
    key: "approvals",
    icon: "✅",
    label: "Approvals",
    href: "/dmo/approvals",
    items: [
      { key: "approvals-pending", label: "Pending Decisions", href: "/dmo/approvals/pending" },
      { key: "approvals-approved", label: "Approved", href: "/dmo/approvals/approved" },
      { key: "approvals-rejected", label: "Rejected", href: "/dmo/approvals/rejected" },
      { key: "approvals-history", label: "History", href: "/dmo/approvals/history" },
    ],
  },
  {
    key: "jps",
    icon: "👤",
    label: "JPS",
    href: "/dmo/jps",
    items: [
      { key: "jps-profiles", label: "Profiles", href: "/dmo/jps/profiles" },
      { key: "jps-skills", label: "Skills", href: "/dmo/jps/skills" },
      { key: "jps-services", label: "Services", href: "/dmo/jps/services" },
      { key: "jps-jobs", label: "Jobs", href: "/dmo/jps/jobs" },
    ],
  },
  {
    key: "pss",
    icon: "🔐",
    label: "PSS",
    href: "/dmo/pss",
    items: [
      { key: "pss-cases", label: "Cases", href: "/dmo/pss/cases" },
      { key: "pss-steps", label: "Verification Steps", href: "/dmo/pss/steps" },
      { key: "pss-risk", label: "Risk Analysis", href: "/dmo/pss/risk" },
      { key: "pss-fraud", label: "Fraud Detection", href: "/dmo/pss/fraud" },
      { key: "pss-refilling", label: "Refilling", href: "/dmo/pss/refilling" },
    ],
  },
  {
    key: "crb",
    icon: "🏛",
    label: "CRB",
    href: "/dmo/crb",
    items: [
      { key: "crb-applications", label: "Applications", href: "/dmo/crb/applications" },
      { key: "crb-docs", label: "Document Review", href: "/dmo/crb/docs" },
      { key: "crb-inspection", label: "Inspection", href: "/dmo/crb/inspection" },
      { key: "crb-certificates", label: "Certificates", href: "/dmo/crb/certificates" },
      { key: "crb-expiry", label: "Expiry", href: "/dmo/crb/expiry" },
    ],
  },
  {
    key: "franchise",
    icon: "🏢",
    label: "Franchise",
    href: "/dmo/franchise",
    items: [
      { key: "franchise-tasks", label: "Tasks", href: "/dmo/franchise/tasks" },
      { key: "franchise-in-progress", label: "In Progress", href: "/dmo/franchise/in-progress" },
      { key: "franchise-reports", label: "Reports", href: "/dmo/franchise/reports" },
      { key: "franchise-escalations", label: "Escalations", href: "/dmo/franchise/escalations" },
    ],
  },
  {
    key: "stl",
    icon: "📊",
    label: "EHB-STL",
    href: "/dmo/stl",
    items: [
      { key: "stl-scores", label: "Scores", href: "/dmo/stl/scores" },
      { key: "stl-breakdown", label: "Breakdown", href: "/dmo/stl/breakdown" },
      { key: "stl-history", label: "History", href: "/dmo/stl/history" },
      { key: "stl-ranking", label: "Ranking", href: "/dmo/stl/ranking" },
    ],
  },
  {
    key: "industry",
    icon: "🌐",
    label: "Industry",
    href: "/dmo/industry",
    items: [
      { key: "industry-list", label: "Industry List", href: "/dmo/industry/list" },
      { key: "industry-verification", label: "Verification", href: "/dmo/industry/verification" },
      { key: "industry-mapping", label: "Mapping", href: "/dmo/industry/mapping" },
      { key: "industry-scores", label: "Scores", href: "/dmo/industry/scores" },
    ],
  },
  {
    key: "automation",
    icon: "🤖",
    label: "Automation",
    href: "/dmo/automation",
    items: [
      { key: "automation-rules", label: "Rules", href: "/dmo/automation/rules" },
      { key: "automation-triggers", label: "Triggers", href: "/dmo/automation/triggers" },
      { key: "automation-decisions", label: "Auto Decisions", href: "/dmo/automation/decisions" },
      { key: "automation-fraud", label: "Fraud Alerts", href: "/dmo/automation/fraud" },
    ],
  },
  {
    key: "refilling",
    icon: "🔁",
    label: "Refilling",
    href: "/dmo/refilling",
    items: [
      { key: "refilling-active", label: "Active", href: "/dmo/refilling/active" },
      { key: "refilling-expiring", label: "Expiring Soon", href: "/dmo/refilling/expiring" },
      { key: "refilling-expired", label: "Expired", href: "/dmo/refilling/expired" },
      { key: "refilling-completed", label: "Completed", href: "/dmo/refilling/completed" },
    ],
  },
  {
    key: "affiliate",
    icon: "💸",
    label: "Affiliate",
    href: "/dmo/affiliate",
    items: [
      { key: "affiliate-dashboard", label: "Dashboard", href: "/dmo/affiliate/dashboard" },
      { key: "affiliate-referrals", label: "Referrals", href: "/dmo/affiliate/referrals" },
      { key: "affiliate-earnings", label: "Earnings", href: "/dmo/affiliate/earnings" },
      { key: "affiliate-network", label: "Network", href: "/dmo/affiliate/network" },
    ],
  },
  {
    key: "notifications",
    icon: "🔔",
    label: "Notifications",
    href: "/dmo/notifications",
    items: [
      { key: "notifications-all", label: "All", href: "/dmo/notifications/all" },
      { key: "notifications-critical", label: "Critical", href: "/dmo/notifications/critical" },
      { key: "notifications-warnings", label: "Warnings", href: "/dmo/notifications/warnings" },
      { key: "notifications-system", label: "System Alerts", href: "/dmo/notifications/system" },
    ],
  },
  {
    key: "penalty",
    icon: "⚖️",
    label: "Penalty",
    href: "/dmo/penalty",
    items: [
      { key: "penalty-all", label: "All Penalties", href: "/dmo/penalty/all" },
      { key: "penalty-active", label: "Active", href: "/dmo/penalty/active" },
      { key: "penalty-appeals", label: "Appeals", href: "/dmo/penalty/appeals" },
      { key: "penalty-history", label: "History", href: "/dmo/penalty/history" },
    ],
  },
  {
    key: "settings",
    icon: "⚙️",
    label: "Settings",
    href: "/dmo/settings",
    items: [
      { key: "settings-users", label: "Users", href: "/dmo/settings/users" },
      { key: "settings-roles", label: "Roles", href: "/dmo/settings/roles" },
      { key: "settings-permissions", label: "Permissions", href: "/dmo/settings/permissions" },
      { key: "settings-config", label: "System Config", href: "/dmo/settings/config" },
    ],
  },
];

