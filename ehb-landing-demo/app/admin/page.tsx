import { KpiCard } from "@/components/ui/KpiCard";

const dashboardStats = {
  industriesTotal: 32,
  industriesActive: 6,
  usersTotal: "—",
  providersTotal: "—",
  franchisesTotal: "—",
  aiToolsActive: "—",
  validators: "—",
  walletTx: "—"
};

const coreSystems = [
  "AI Department",
  "Blockchain Department",
  "Finance Department",
  "Affiliate System",
  "Franchise System",
  "JPS – Job Profile & Skill",
  "Verification Systems (PSS, CRB, STL)",
  "DMO – Decentralized Management Office"
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
        <h2 className="text-[10px] xs:text-[11px] font-semibold text-slate-100">{props.title}</h2>
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
      <span className="text-[10px] xs:text-[11px] text-slate-300">{props.label}</span>
      <span className="text-xs font-semibold text-white">{props.value}</span>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Super Admin · Control Panel</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">
              EHB Global Super Admin
            </h1>
            <p className="text-slate-300 max-w-2xl">
              Command center for managing industries, core systems, franchise network, AI marketplace,
              finance, blockchain and platform health.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200">
              ← Back to Landing
            </a>
            <a href="/development" className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow">
              View Development Center
            </a>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Industries" value={`${dashboardStats.industriesTotal}`} detail={`Active: ${dashboardStats.industriesActive}`} />
          <KpiCard label="Users / Providers" value={dashboardStats.usersTotal} detail={`Providers: ${dashboardStats.providersTotal}`} />
          <KpiCard label="Franchises" value={dashboardStats.franchisesTotal} detail="Global · Country · Corporate · Sub" />
          <KpiCard label="AI / Blockchain" value={dashboardStats.aiToolsActive} detail={`Validators: ${dashboardStats.validators} · Wallet tx: ${dashboardStats.walletTx}`} />
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <Panel title="Core Systems Monitoring" path="/admin/core-systems">
            <ul className="space-y-1 text-slate-200">
              {coreSystems.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
            <div className="mt-2 rounded-lg glass-panel border border-emerald-500/30 p-2 text-emerald-100">
              <div className="font-semibold mb-0.5 text-[10px] xs:text-[11px]">Example: AI Department</div>
              <p>Status: Active · Modules: 9 · Industries Connected: 6</p>
            </div>
          </Panel>
          <Panel title="Industry Management" path="/admin/industries">
            <p className="text-slate-300 mb-1">Create, activate, pause and assign franchise for each industry.</p>
            <div className="glass-panel rounded-lg p-2">
              <div className="font-semibold text-slate-100 mb-0.5">Legal Services (EHB OLS)</div>
              <p className="text-slate-300">
                Status: <span className="text-emerald-400 font-semibold">Active</span> · Categories: 12 · Services: 64 · Providers: 1,245
              </p>
              <p className="mt-1 text-slate-400">
                Flow: Create Industry → Add Categories → Add Services → Assign Franchise → <span className="font-semibold text-[#00eaff]">Industry Live</span>
              </p>
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <Panel title="Franchise Management" path="/admin/franchise">
            <p className="text-slate-300 mb-1">Multi-layer franchise network for global, country, corporate and sub franchises.</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {franchiseLevels.map((lvl) => (
                <span key={lvl} className="inline-flex items-center rounded-full glass-panel px-2 py-0.5 text-[10px] text-slate-100">
                  {lvl}
                </span>
              ))}
            </div>
            <ul className="space-y-1 text-slate-300">
              <li>• Countries Active: 4</li>
              <li>• Corporate Franchises: 12</li>
              <li>• Sub Franchises: 120</li>
            </ul>
            <div className="mt-2 text-slate-300">
              Actions: <span className="text-slate-100">approve · suspend · assign industry rights · view revenue</span>
            </div>
          </Panel>
          <Panel title="AI Marketplace Management" path="/admin/ai-tools">
            <p className="text-slate-300 mb-1">Configure AI tools, pricing and which industries can use each tool.</p>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {["AI Lawyer", "AI Doctor", "AI Resume Builder", "AI Contract Generator", "AI Marketing Assistant", "AI Code Generator"].map((tool) => (
                <span key={tool} className="inline-flex items-center rounded-lg glass-panel px-2 py-1 text-[10px] text-slate-200">
                  {tool}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 text-slate-300">
              <Metric label="Total AI Tools" value="—" />
              <Metric label="Industries Using AI" value="—" />
              <Metric label="API Usage" value="—" />
              <Metric label="AI Revenue" value="—" />
            </div>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <Panel title="Finance & Wallet Monitoring" path="/admin/finance">
            <ul className="space-y-1 text-slate-300">
              <li>• Total Wallet Balance</li>
              <li>• Transactions Today</li>
              <li>• Escrow Active</li>
              <li>• Affiliate Payouts</li>
              <li>• Franchise Revenue</li>
            </ul>
            <p className="mt-1 text-slate-400">Wallets: User · Provider · Franchise · System.</p>
          </Panel>
          <Panel title="Blockchain Monitoring" path="/admin/blockchain">
            <ul className="space-y-1 text-slate-300">
              <li>• Active Validators</li>
              <li>• Total Transactions</li>
              <li>• Smart Contracts Active</li>
              <li>• Network Status</li>
            </ul>
            <p className="mt-1 text-slate-400">Validator snapshot: Validator ID · Country · Stake Amount · Status.</p>
          </Panel>
          <Panel title="Affiliate System Management" path="/admin/affiliate">
            <ul className="space-y-1 text-slate-300">
              <li>• Total Affiliates</li>
              <li>• Total Referrals</li>
              <li>• Commission Paid</li>
              <li>• Top Affiliates</li>
            </ul>
            <p className="mt-1 text-slate-400">Actions: approve affiliate · set commission rates · track referrals.</p>
          </Panel>
        </section>

        <section className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          <Panel title="Development Monitoring" path="/admin/development">
            <ul className="space-y-1 text-slate-300">
              <li>• AI Department – 40%</li>
              <li>• Blockchain – 10%</li>
              <li>• Finance – 35%</li>
              <li>• Affiliate System – 20%</li>
              <li>• Franchise System – 15%</li>
              <li>• Industries – 5%</li>
            </ul>
            <div className="mt-2 rounded-lg glass-panel border border-amber-500/30 p-2 text-amber-100">
              <div className="font-semibold mb-0.5 text-[10px] xs:text-[11px]">Example Alerts</div>
              <ul className="space-y-1">
                <li>• AI recommendation not connected to Marketplace.</li>
                <li>• Wallet escrow missing for booking service.</li>
                <li>• STL scoring rules incomplete.</li>
              </ul>
            </div>
          </Panel>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <Panel title="Platform Health" path="/admin/platform-health">
              <ul className="space-y-1 text-slate-300">
                <li>• API response time</li>
                <li>• Server load</li>
                <li>• Database health</li>
                <li>• AI system performance</li>
                <li>• Blockchain status</li>
              </ul>
            </Panel>
            <Panel title="Search, Content & Permissions" path="/admin/search">
              <p className="text-slate-300 mb-1">Controls for global search, content and role-based access.</p>
              <ul className="space-y-1 text-slate-300">
                <li>• Boost providers, services and industries.</li>
                <li>• Control recommendation AI.</li>
                <li>• Manage landing / industry pages and marketplace content.</li>
                <li>• Roles: Super Admin, System Admin, Industry Admin, Franchise Admin, Moderator.</li>
              </ul>
            </Panel>
          </div>
        </section>
      </div>
    </main>
  );
}
