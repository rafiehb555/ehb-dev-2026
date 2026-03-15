import { KpiCard } from "@/components/ui/KpiCard";

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-10 space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              EHB Home · Operations View
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              Single home for industries, trust systems, finance, AI &amp; governance.
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-2">
              Ye page owner / operator ke liye clean overview hai – yahan se aap EHB ke core modules
              (DMO, PSS, CRB, STL, Wallet, Affiliate) ka status samajh sakte hain.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs">
            <a
              href="/"
              className="px-3 py-1.5 rounded-full glass-panel text-slate-200 hover:text-white hover:shadow-neon-blue transition-all duration-200"
            >
              Landing
            </a>
            <a
              href="/admin"
              className="px-3 py-1.5 rounded-full glass-panel text-slate-200 hover:text-[#00eaff] hover:shadow-neon-blue transition-all duration-200"
            >
              Super Admin
            </a>
            <a
              href="/development"
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] text-slate-950 font-semibold btn-glow"
            >
              Development Map
            </a>
          </nav>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-3 text-xs">
          <KpiCard
            label="Core Systems"
            value="8"
            detail="AI, Blockchain, Finance, Affiliate, Franchise, JPS, PSS/CRB/STL, DMO."
          />
          <KpiCard
            label="Industries (Phase‑1)"
            value="6 / 32"
            detail="E‑commerce, Legal, Medical, Education, Jobs, Travel."
          />
          <KpiCard
            label="Shared Tools Reuse"
            value="≈70%"
            detail="Booking, payments, messaging, reviews, analytics."
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2 text-xs items-start">
          <div className="space-y-3">
            <div className="glass-panel card-hover p-4 space-y-2">
              <h2 className="text-sm font-semibold text-white">Core Modules</h2>
              <ul className="space-y-1 text-slate-300">
                <li>• DMO – Decentralized Management Office</li>
                <li>• PSS – Proof &amp; Security System (KYC, documents, fraud)</li>
                <li>• CRB – Certification &amp; Registry Board (inspections, licenses)</li>
                <li>• STL – Service Trust Level (AI scoring)</li>
                <li>• Wallet – Escrow, payouts, franchise revenue</li>
                <li>• Affiliate – Referral &amp; commission engine</li>
              </ul>
            </div>
            <div className="glass-panel card-hover p-4 space-y-2">
              <h2 className="text-sm font-semibold text-white">Flows from here</h2>
              <p className="text-slate-300">
                Yahan se future mein user, provider, franchise aur AI marketplace dashboards open
                honge. Abhi hum sirf clean demo UI bana rahe hain – backend later connect hoga.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="glass-panel card-hover p-4 space-y-2">
              <h2 className="text-sm font-semibold text-white">Wallet &amp; Trust Snapshot</h2>
              <p className="text-slate-300">
                Example numbers (demo): balance, pending, STL level – sirf layout samajhne ke liye.
              </p>
              <div className="grid gap-2 grid-cols-2">
                <div>
                  <p className="text-[11px] text-slate-400">Wallet balance</p>
                  <p className="text-sm font-semibold text-white">$4,921.40</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">STL level</p>
                  <p className="text-sm font-semibold text-white">High (84/100)</p>
                </div>
              </div>
            </div>
            <div className="glass-panel card-hover p-4 space-y-2">
              <h2 className="text-sm font-semibold text-white">What's next?</h2>
              <ul className="space-y-1 text-slate-300">
                <li>• Identity + verification APIs connect karna.</li>
                <li>• Real data ke liye Postgres + microservices use karna.</li>
                <li>• Har module ka dedicated dashboard (DMO, PSS, CRB, STL, Wallet, Affiliate).</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
