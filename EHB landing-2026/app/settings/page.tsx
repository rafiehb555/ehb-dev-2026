import Link from "next/link";

const sections = [
  "Account Profile",
  "Notifications",
  "Security & Sessions",
  "Language & Region",
  "Wallet Preferences",
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-violet-300">EHB Super App</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">Settings</h1>
          <p className="text-sm text-ehb-textBody mt-2">
            Manage account preferences, security, alerts, and system behavior.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          {sections.map((name) => (
            <div key={name} className="ehb-card-elevated">
              <h2 className="text-sm font-semibold text-white">{name}</h2>
              <p className="text-xs text-ehb-textMuted mt-1">Configuration panel for {name.toLowerCase()}.</p>
            </div>
          ))}
        </section>

        <section className="ehb-card-elevated">
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/profile" className="ehb-btn-secondary ehb-press">
              Edit Profile
            </Link>
            <Link href="/super" className="ehb-btn-primary ehb-press">
              Back to Super App
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

