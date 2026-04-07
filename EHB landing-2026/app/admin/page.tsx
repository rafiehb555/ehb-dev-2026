import { KpiCard } from "@/components/ui/KpiCard";
import { agentDashboardSummary } from "@/lib/agents/catalog";

const dashboardStats = {
  industriesTotal: 32,
  industriesActive: 6,
  usersTotal: "â€”",
  providersTotal: "â€”",
  franchisesTotal: "â€”",
  aiToolsActive: "â€”",
  validators: "â€”",
  walletTx: "â€”"
};

const coreSystems = [
  "AI Department",
  "Blockchain Department",
  "Finance Department",
  "Affiliate System",
  "Franchise System",
  "JPS â€“ Job Profile & Skill",
  "Verification Systems (PSS, CRB, STL)",
  "DMO â€“ Decentralized Management Office"
];

const franchiseLevels = [
  "Global Super Admin",
  "Country Franchise",
  "Corporate Franchise",
  "Sub Franchise"
];

function Panel(props: { title: string; path?: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel card-hover p-3 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[10px] xs:text-[11px] font-semibold text-white">{props.title}</h2>
        {props.path ? (
          <span className="text-[10px] text-[#00eaff]/80">Path: {props.path}</span>
        ) : null}
      </div>
      {props.children}
    </section>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 glass-panel p-1.5 rounded-lg">
      <span className="text-[10px] xs:text-[11px] text-ehb-textBody">{props.label}</span>
      <span className="text-xs font-semibold text-white">{props.value}</span>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Super Admin Â· Control Panel</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">
              EHB Global Super Admin
            </h1>
            <p className="text-ehb-textBody max-w-2xl">
              Command center for managing industries, core systems, franchise network, AI marketplace,
              finance, blockchain and platform health.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200">
              â† Back to Landing
            </a>
            <a href="/admin/agents" className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200">
              View Agent Center
            </a>
            <a href="/development" className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow">
              View Development Center
            </a>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Industries" value={`${dashboardStats.industriesTotal}`} detail={`Active: ${dashboardStats.industriesActive}`} />
          <KpiCard label="Users / Providers" value={dashboardStats.usersTotal} detail={`Providers: ${dashboardStats.providersTotal}`} />
          <KpiCard label="Franchises" value={dashboardStats.franchisesTotal} detail="Global Â· Country Â· Corporate Â· Sub" />
          <KpiCard label="AI / Blockchain" value={dashboardStats.aiToolsActive} detail={`Validators: ${dashboardStats.validators} Â· Wallet tx: ${dashboardStats.walletTx}`} />
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <Panel title="Core Systems Monitoring" path="/admin/core-systems">
            <ul className="space-y-1 text-slate-200">
              {coreSystems.map((s) => (
                <li key={s}>â€¢ {s}</li>
              ))}
            </ul>
            <div className="mt-2 rounded-lg glass-panel border border-emerald-500/30 p-2 text-emerald-100">
              <div className="font-semibold mb-0.5 text-[10px] xs:text-[11px]">Example: AI Department</div>
              <p>Status: Active Â· Modules: 9 Â· Industries Connected: 6</p>
            </div>
          </Panel>
          <Panel title="JPS Import Management" path="/admin/jps-import">
            <p className="text-ehb-textBody mb-1">
              Manage real JPS profile imports with validation, preview counts, and fallback restore.
            </p>
            <div className="glass-panel rounded-lg p-2 space-y-1.5">
              <div className="font-semibold text-white">Connected Sources</div>
              <p className="text-ehb-textBody">
                API: <span className="text-cyan-300">/api/jps</span> Â· Import:{" "}
                <span className="text-cyan-300">/api/jps/import</span>
              </p>
              <p className="text-ehb-textMuted">
                Save imported data and it will instantly flow into DMO JPS, jobs, and profile pages.
              </p>
            </div>
            <div className="mt-2">
              <a
                href="/admin/jps-import"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
              >
                Open JPS Import Manager
              </a>
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <Panel title="Industry Management" path="/admin/industries">
            <p className="text-ehb-textBody mb-1">Create, activate, pause and assign franchise for each industry.</p>
            <div className="glass-panel rounded-lg p-2">
              <div className="font-semibold text-white mb-0.5">Legal Services (EHB OLS)</div>
              <p className="text-ehb-textBody">
                Status: <span className="text-emerald-400 font-semibold">Active</span> Â· Categories: 12 Â· Services: 64 Â· Providers: 1,245
              </p>
              <p className="mt-1 text-ehb-textMuted">
                Flow: Create Industry â†’ Add Categories â†’ Add Services â†’ Assign Franchise â†’ <span className="font-semibold text-[#00eaff]">Industry Live</span>
              </p>
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <Panel title="Franchise Management" path="/franchise">
            <p className="text-ehb-textBody mb-1">Multi-layer franchise network for global, country, corporate and sub franchises.</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {franchiseLevels.map((lvl) => (
                <span key={lvl} className="inline-flex items-center rounded-full glass-panel px-2 py-0.5 text-[10px] text-slate-100">
                  {lvl}
                </span>
              ))}
            </div>
            <ul className="space-y-1 text-ehb-textBody">
              <li>• Countries Active: 4</li>
              <li>• Corporate Franchises: 12</li>
              <li>• Sub Franchises: 120</li>
            </ul>
            <div className="mt-2 text-ehb-textBody">
              Actions: <span className="text-white">approve · suspend · assign industry rights · view revenue</span>
            </div>
          </Panel>
          <Panel title="AI Marketplace Management" path="/admin/ai-tools">
            <p className="text-ehb-textBody mb-1">Configure AI tools, pricing and which industries can use each tool.</p>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {["AI Lawyer", "AI Doctor", "AI Resume Builder", "AI Contract Generator", "AI Marketing Assistant", "AI Code Generator"].map((tool) => (
                <span key={tool} className="inline-flex items-center rounded-lg glass-panel px-2 py-1 text-[10px] text-ehb-textBody">
                  {tool}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 text-ehb-textBody">
              <Metric label="Total AI Tools" value="â€”" />
              <Metric label="Industries Using AI" value="â€”" />
              <Metric label="API Usage" value="â€”" />
              <Metric label="AI Revenue" value="â€”" />
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <Panel title="Finance & Wallet Monitoring" path="/admin/finance">
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ Total Wallet Balance</li>
              <li>â€¢ Transactions Today</li>
              <li>â€¢ Escrow Active</li>
              <li>â€¢ Affiliate Payouts</li>
              <li>â€¢ Franchise Revenue</li>
            </ul>
            <p className="mt-1 text-ehb-textMuted">Wallets: User Â· Provider Â· Franchise Â· System.</p>
          </Panel>
          <Panel title="Blockchain Monitoring" path="/admin/blockchain">
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ Active Validators</li>
              <li>â€¢ Total Transactions</li>
              <li>â€¢ Smart Contracts Active</li>
              <li>â€¢ Network Status</li>
            </ul>
            <p className="mt-1 text-ehb-textMuted">Validator snapshot: Validator ID Â· Country Â· Stake Amount Â· Status.</p>
          </Panel>
          <Panel title="Affiliate System Management" path="/admin/affiliate">
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ Total Affiliates</li>
              <li>â€¢ Total Referrals</li>
              <li>â€¢ Commission Paid</li>
              <li>â€¢ Top Affiliates</li>
            </ul>
            <p className="mt-1 text-ehb-textMuted">Actions: approve affiliate Â· set commission rates Â· track referrals.</p>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          <Panel title="Development Monitoring" path="/admin/development">
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ AI Department â€“ 40%</li>
              <li>â€¢ Blockchain â€“ 10%</li>
              <li>â€¢ Finance â€“ 35%</li>
              <li>â€¢ Affiliate System â€“ 20%</li>
              <li>â€¢ Franchise System â€“ 15%</li>
              <li>â€¢ Industries â€“ 5%</li>
            </ul>
            <div className="mt-2 rounded-lg glass-panel border border-amber-500/30 p-2 text-amber-100">
              <div className="font-semibold mb-0.5 text-[10px] xs:text-[11px]">Example Alerts</div>
              <ul className="space-y-1">
                <li>â€¢ AI recommendation not connected to Marketplace.</li>
                <li>â€¢ Wallet escrow missing for booking service.</li>
                <li>â€¢ STL engine now supports user, service, and product trust recalculation.</li>
              </ul>
            </div>
          </Panel>
          <Panel title="Development Agent System" path="/admin/agents">
            <p className="text-ehb-textBody mb-1">
              Read-only control center for the 14 EHB development agents, their ownership model,
              status language, and normal handoff order.
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-ehb-textBody">
              <Metric label="Total Agents" value={`${agentDashboardSummary.totalAgents}`} />
              <Metric label="Shared Statuses" value={`${agentDashboardSummary.sharedStatuses}`} />
              <Metric
                label="Core / Domain / Advanced"
                value={`${agentDashboardSummary.coreAgents} / ${agentDashboardSummary.domainAgents} / ${agentDashboardSummary.advancedAgents}`}
              />
              <Metric label="Default Start" value="CEO" />
            </div>
            <div className="mt-2 rounded-lg glass-panel border border-cyan-500/30 p-2 text-cyan-100">
              <div className="font-semibold mb-0.5 text-[10px] xs:text-[11px]">Version 1 guardrail</div>
              <p>Reference dashboard only. Live telemetry should be added later when real signals exist.</p>
            </div>
            <div className="mt-2">
              <a
                href="/admin/agents"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
              >
                Open Agent Control Center
              </a>
            </div>
          </Panel>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <Panel title="Platform Health" path="/admin/platform-health">
              <ul className="space-y-1 text-ehb-textBody">
                <li>â€¢ API response time</li>
                <li>â€¢ Server load</li>
                <li>â€¢ Database health</li>
                <li>â€¢ AI system performance</li>
                <li>â€¢ Blockchain status</li>
              </ul>
            </Panel>
            <Panel title="Search, Content & Permissions" path="/admin/search">
              <p className="text-ehb-textBody mb-1">Controls for global search, content and role-based access.</p>
              <ul className="space-y-1 text-ehb-textBody">
                <li>â€¢ Boost providers, services and industries.</li>
                <li>â€¢ Control recommendation AI.</li>
                <li>â€¢ Manage landing / industry pages and marketplace content.</li>
                <li>â€¢ Roles: Super Admin, System Admin, Industry Admin, Franchise Admin, Moderator.</li>
              </ul>
            </Panel>
          </div>
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <Panel title="Phase 81 â€” Fraud Detection" path="/admin/fraud">
            <p className="text-ehb-textBody mb-1">
              Fake providers/orders/listings detect + admin risk flags. (UI mock)
            </p>
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ Duplicate listing patterns</li>
              <li>â€¢ Location mismatch signals</li>
              <li>â€¢ Risk score + severity workflow</li>
            </ul>
          </Panel>

          <Panel title="Phase 82 â€” Business Analytics" path="/admin/ai-analytics">
            <p className="text-ehb-textBody mb-1">
              Auto reports for franchise, provider, and platform teams. (UI mock)
            </p>
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ Industry / Franchise / Provider tabs</li>
              <li>â€¢ Period: 30d / This month / This quarter</li>
              <li>â€¢ Template + later AI NLG</li>
            </ul>
          </Panel>

          <Panel title="Phase 83 â€” Location Intelligence" path="/admin/location-insights">
            <p className="text-ehb-textBody mb-1">City/region demand insights + STL-adjusted gaps. (UI mock)</p>
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ City dropdown</li>
              <li>â€¢ Industry dropdown</li>
              <li>â€¢ Insight cards</li>
            </ul>
          </Panel>

          <Panel title="Phase 84 â€” AI Automation" path="/admin/ai-automation">
            <p className="text-ehb-textBody mb-1">AI action suggestions (activate service/add product/apply). (UI mock)</p>
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ City + industry context</li>
              <li>â€¢ Confirm action flow (mock)</li>
            </ul>
          </Panel>

          <Panel title="Phase 85 â€” Data Pipeline" path="/admin/ai-data-pipeline">
            <p className="text-ehb-textBody mb-1">Ingestion â†’ storage â†’ scoring â†’ publish (UI mock).</p>
            <ul className="space-y-1 text-ehb-textBody">
              <li>â€¢ Run pipeline now (mock)</li>
              <li>â€¢ Stage status cards</li>
            </ul>
          </Panel>
        </section>
      </div>
    </main>
  );
}
