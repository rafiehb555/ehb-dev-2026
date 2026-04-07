import Link from "next/link";

const notifications = [
  "Your DMO decision was recorded successfully.",
  "New job matches your profile skills.",
  "Wallet payout processed for last cycle.",
  "Verification reminder: one pending check.",
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Super App</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">Notifications</h1>
          <p className="text-sm text-ehb-textBody mt-2">Recent platform alerts and system updates.</p>
        </section>

        <section className="ehb-card-elevated">
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-ehb-textBody">
                {n}
              </div>
            ))}
          </div>
        </section>

        <section className="ehb-card-elevated">
          <Link href="/super" className="ehb-btn-primary ehb-press text-xs">
            Back to Super App
          </Link>
        </section>
      </div>
    </main>
  );
}

