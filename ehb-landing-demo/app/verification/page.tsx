import Link from "next/link";

const checks = [
  { name: "PSS Identity", status: "Completed" },
  { name: "CRB Certification", status: "In Review" },
  { name: "Industry Verification", status: "Pending" },
];

export default function VerificationPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300">Trust System</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">Verification Center</h1>
          <p className="text-sm text-slate-300 mt-2">
            Manage identity and compliance verification to improve profile trust and ranking.
          </p>
        </section>

        <section className="ehb-card-elevated">
          <h2 className="text-sm font-semibold text-white mb-3">Verification Pipeline</h2>
          <div className="space-y-2">
            {checks.map((c) => (
              <div key={c.name} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                <span className="text-xs text-slate-200">{c.name}</span>
                <span className="text-xs text-cyan-200">{c.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ehb-card-elevated">
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/certification" className="ehb-btn-secondary ehb-press">
              Open CRB
            </Link>
            <Link href="/dmo" className="ehb-btn-primary ehb-press">
              Open DMO Queue
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

