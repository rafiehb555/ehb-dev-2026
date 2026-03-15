import { KpiCard } from "@/components/ui/KpiCard";
import { DmoCard } from "@/components/ui/DmoCard";

const dmoModules = [
  "Identity & JPS Profiles",
  "PSS – Proof & Security System",
  "CRB – Certification & Registry Board",
  "STL – Trust Level Engine",
  "Wallet & Finance",
  "Applications & Approvals",
  "Certificates & Registry",
  "Notifications & Compliance",
  "Blockchain Anchoring"
];

export default function DmoPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <section className="space-y-1.5">
          <p className="inline-flex items-center gap-2 rounded-full glass-panel border border-[#00eaff]/40 px-3 py-1.5 text-[10px] xs:text-[11px] font-medium text-[#00eaff]">
            DMO · Decentralized Management Office
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight gradient-text">
            Core operating layer connecting verification, trust, wallet and governance.
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Ye page sirf demo UI hai – real development mein isi dashboard ko DMO microservices ke
            saath connect kiya jayega (PSS, CRB, STL, Wallet, Applications & Approvals, Blockchain).
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a href="/home" className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200">← Back to EHB Home</a>
            <a href="/admin" className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 font-semibold text-slate-950 btn-glow">Open Super Admin Panel</a>
          </div>
        </section>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <KpiCard label="Core Modules" value={dmoModules.length} detail="Identity, PSS, CRB, STL, Wallet, Workflow, Registry, Notifications, Blockchain." />
          <KpiCard label="Primary Data Domains" value="4" detail="Identity · Verification · Trust & Finance · Workflow & System." />
          <KpiCard label="Connected Apps" value="4+" detail="GoSellr, WMS, OLS, AGTS – and future EHB modules." />
        </section>

        <section>
          <DmoCard />
        </section>

        <section className="grid gap-3 grid-cols-1 lg:grid-cols-3 items-start">
          <div className="space-y-2 glass-panel card-hover p-3 lg:col-span-2">
            <h2 className="text-xs font-semibold text-slate-100">DMO Modules & Responsibilities</h2>
            <p className="text-slate-300">
              Neeche har module ke liye sirf UI level demo copy hai; real backend later microservices se implement hoga.
            </p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {dmoModules.map((m) => (
                <div key={m} className="glass-panel rounded-lg p-2 space-y-0.5">
                  <div className="text-[10px] xs:text-[11px] font-semibold text-slate-100">{m}</div>
                  <p className="text-[10px] xs:text-[11px] text-slate-300">
                    Demo: config only – future state mein yahan se filters, queues aur detailed dashboards open honge.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 glass-panel card-hover border border-[#00eaff]/40 p-3">
            <h2 className="text-xs font-semibold text-[#00eaff]">Applications & Approvals (Workflow Engine)</h2>
            <p className="text-slate-200">
              Ye module license, certification, franchise aur government services ki applications ko
              officer workflows ke through route karta hai.
            </p>
            <ul className="space-y-1 text-slate-300">
              <li>• Demo queues: New, In Review, Inspection, Approved, Rejected.</li>
              <li>• Entity types: Provider license, Clinic approval, Franchise application, etc.</li>
              <li>• Future: Direct integration with CRB inspections & blockchain hashes.</li>
            </ul>
            <div className="pt-1 flex flex-wrap gap-1.5">
              <button className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#8b5cf6] px-3 py-1.5 text-[10px] xs:text-[11px] font-semibold text-slate-950 btn-glow">
                Open Applications Board (demo)
              </button>
              <span className="inline-flex items-center rounded-full glass-panel px-2 py-0.5 text-[9px] xs:text-[10px] text-slate-200">
                Operated directly from DMO home
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
