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
    href: "/dmo",
    items: [
      { key: "applications-all", label: "All Applications", href: "/dmo" },
      { key: "applications-queue", label: "My Queue", href: "/dmo" },
      { key: "applications-high-risk", label: "High Risk", href: "/dmo" },
      { key: "applications-sla", label: "SLA Breach", href: "/dmo" },
    ],
  },
  {
    key: "approvals",
    icon: "✅",
    label: "Approvals",
    href: "/dmo",
    items: [
      { key: "approvals-pending", label: "Pending Decisions", href: "/dmo" },
      { key: "approvals-approved", label: "Approved", href: "/dmo" },
      { key: "approvals-rejected", label: "Rejected", href: "/dmo" },
      { key: "approvals-history", label: "History", href: "/dmo" },
    ],
  },
  {
    key: "jps",
    icon: "👤",
    label: "JPS",
    href: "/dmo/module/jps",
    items: [
      { key: "jps-profiles", label: "Profiles", href: "/dmo/module/jps" },
      { key: "jps-skills", label: "Skills", href: "/dmo/module/jps" },
      { key: "jps-services", label: "Services", href: "/dmo/module/jps" },
      { key: "jps-jobs", label: "Jobs", href: "/dmo/module/jps" },
    ],
  },
  {
    key: "pss",
    icon: "🔐",
    label: "PSS",
    href: "/dmo/pss",
    items: [
      { key: "pss-cases", label: "Cases", href: "/dmo/pss" },
      { key: "pss-steps", label: "Verification Steps", href: "/dmo/pss" },
      { key: "pss-risk", label: "Risk Analysis", href: "/dmo/pss" },
      { key: "pss-fraud", label: "Fraud Detection", href: "/dmo/pss" },
      { key: "pss-refilling", label: "Refilling", href: "/dmo/pss" },
    ],
  },
  {
    key: "crb",
    icon: "🏛",
    label: "CRB",
    href: "/dmo/crb",
    items: [
      { key: "crb-applications", label: "Applications", href: "/dmo/crb" },
      { key: "crb-docs", label: "Document Review", href: "/dmo/crb" },
      { key: "crb-inspection", label: "Inspection", href: "/dmo/crb" },
      { key: "crb-certificates", label: "Certificates", href: "/dmo/crb" },
      { key: "crb-expiry", label: "Expiry", href: "/dmo/crb" },
    ],
  },
  {
    key: "franchise",
    icon: "🏢",
    label: "Franchise",
    href: "/dmo/module/franchise",
    items: [
      { key: "franchise-tasks", label: "Tasks", href: "/dmo/module/franchise" },
      { key: "franchise-in-progress", label: "In Progress", href: "/franchise/inspections" },
      { key: "franchise-reports", label: "Reports", href: "/franchise/inspections" },
      { key: "franchise-escalations", label: "Escalations", href: "/dmo/module/franchise" },
    ],
  },
  {
    key: "stl",
    icon: "📊",
    label: "EHB-STL",
    href: "/dmo/stl",
    items: [
      { key: "stl-scores", label: "Scores", href: "/dmo/stl" },
      { key: "stl-breakdown", label: "Breakdown", href: "/dmo/stl" },
      { key: "stl-history", label: "History", href: "/dmo/stl" },
      { key: "stl-ranking", label: "Ranking", href: "/dmo/stl" },
    ],
  },
  {
    key: "industry",
    icon: "🌐",
    label: "Industry",
    href: "/dmo/industry",
    items: [
      { key: "industry-list", label: "Industry List", href: "/dmo/industry" },
      { key: "industry-verification", label: "Verification", href: "/dmo/industry" },
      { key: "industry-mapping", label: "Mapping", href: "/dmo/industry" },
      { key: "industry-scores", label: "Scores", href: "/dmo/industry" },
    ],
  },
  {
    key: "automation",
    icon: "🤖",
    label: "Automation",
    href: "/dmo/automation",
    items: [
      { key: "automation-rules", label: "Rules", href: "/dmo/automation" },
      { key: "automation-triggers", label: "Triggers", href: "/dmo/automation" },
      { key: "automation-decisions", label: "Auto Decisions", href: "/dmo/automation" },
      { key: "automation-fraud", label: "Fraud Alerts", href: "/dmo/automation" },
    ],
  },
  {
    key: "refilling",
    icon: "🔁",
    label: "Refilling",
    href: "/dmo/refilling",
    items: [
      { key: "refilling-active", label: "Active", href: "/dmo/refilling" },
      { key: "refilling-expiring", label: "Expiring Soon", href: "/dmo/refilling" },
      { key: "refilling-expired", label: "Expired", href: "/dmo/refilling" },
      { key: "refilling-completed", label: "Completed", href: "/dmo/refilling" },
    ],
  },
  {
    key: "affiliate",
    icon: "💸",
    label: "Affiliate",
    href: "/dmo/affiliate",
    items: [
      { key: "affiliate-dashboard", label: "Dashboard", href: "/dmo/affiliate" },
      { key: "affiliate-referrals", label: "Referrals", href: "/dmo/affiliate" },
      { key: "affiliate-earnings", label: "Earnings", href: "/dmo/affiliate" },
      { key: "affiliate-network", label: "Network", href: "/dmo/affiliate" },
    ],
  },
  {
    key: "notifications",
    icon: "🔔",
    label: "Notifications",
    href: "/dmo/notifications",
    items: [
      { key: "notifications-all", label: "All", href: "/dmo/notifications" },
      { key: "notifications-critical", label: "Critical", href: "/dmo/notifications" },
      { key: "notifications-warnings", label: "Warnings", href: "/dmo/notifications" },
      { key: "notifications-system", label: "System Alerts", href: "/dmo/notifications" },
    ],
  },
  {
    key: "penalty",
    icon: "⚖️",
    label: "Penalty",
    href: "/dmo/penalty",
    items: [
      { key: "penalty-all", label: "All Penalties", href: "/dmo/penalty" },
      { key: "penalty-active", label: "Active", href: "/dmo/penalty" },
      { key: "penalty-appeals", label: "Appeals", href: "/dmo/penalty" },
      { key: "penalty-history", label: "History", href: "/dmo/penalty" },
    ],
  },
  {
    key: "settings",
    icon: "⚙️",
    label: "Settings",
    href: "/dmo/module/settings",
    items: [
      { key: "settings-users", label: "Users", href: "/dmo/module/settings" },
      { key: "settings-roles", label: "Roles", href: "/dmo/module/settings" },
      { key: "settings-permissions", label: "Permissions", href: "/dmo/module/settings" },
      { key: "settings-config", label: "System Config", href: "/dmo/module/settings" },
    ],
  },
];

