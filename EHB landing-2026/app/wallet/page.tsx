import Link from "next/link";

export default function WalletPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">EHB Super App</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">Wallet</h1>
          <p className="text-sm text-ehb-textBody mt-2">
            Track available balance, recent payouts, and reward credits in one place.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="ehb-card-elevated">
            <div className="text-xs ehb-text-muted">Available Balance</div>
            <div className="text-2xl font-semibold text-emerald-300 mt-1">$4,921.00</div>
          </div>
          <div className="ehb-card-elevated">
            <div className="text-xs ehb-text-muted">Pending Payouts</div>
            <div className="text-2xl font-semibold text-amber-300 mt-1">$315.00</div>
          </div>
          <div className="ehb-card-elevated">
            <div className="text-xs ehb-text-muted">Reward Credits</div>
            <div className="text-2xl font-semibold text-cyan-300 mt-1">850 EHBGC</div>
          </div>
        </section>

        <section className="ehb-card-elevated">
          <h2 className="text-sm font-semibold text-white mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/dashboard" className="ehb-btn-secondary ehb-press">
              Back to Dashboard
            </Link>
            <Link href="/super" className="ehb-btn-primary ehb-press">
              Open Super App
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

