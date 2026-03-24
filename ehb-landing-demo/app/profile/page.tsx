import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">JPS Profile</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">User Profile</h1>
          <p className="text-sm text-slate-300 mt-2">
            Update personal profile, skills, services, and trust signals for better matching.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <div className="ehb-card-elevated">
            <h2 className="text-sm font-semibold text-white">Identity</h2>
            <p className="text-xs text-slate-400 mt-1">Name, contact, location, and profile photo details.</p>
          </div>
          <div className="ehb-card-elevated">
            <h2 className="text-sm font-semibold text-white">Skills & Services</h2>
            <p className="text-xs text-slate-400 mt-1">Add categories, rates, and service availability.</p>
          </div>
        </section>

        <section className="ehb-card-elevated">
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/verification" className="ehb-btn-secondary ehb-press">
              Open Verification
            </Link>
            <Link href="/dashboard" className="ehb-btn-primary ehb-press">
              Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

