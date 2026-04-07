import Link from "next/link";
import { notFound } from "next/navigation";
import { getJpsProfileByUsername } from "@/lib/jps/profiles";
import { ProfileCard } from "@/components/ProfileCard";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const profile = getJpsProfileByUsername(params.username);
  if (!profile) notFound();

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">JPS Profile</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">{profile.name}</h1>
            <p className="text-ehb-textMuted text-sm max-w-2xl">
              {profile.verificationStatus}. This profile helps match trusted services and jobs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Dashboard
            </Link>
            <Link
              href="/industries"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
            >
              Explore industries
            </Link>
          </div>
        </header>

        <ProfileCard profile={profile} />

        <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">How your JPS profile is used</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "Matching", d: "AI matches you with verified jobs and services that fit your skills." },
              { t: "Trust", d: "PSS + CRB + STL signals stay consistent across marketplace actions." },
              { t: "Earnings", d: "Once you complete tasks, the system can reward points and progress." },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm font-semibold text-white">{x.t}</p>
                <p className="text-[12px] text-ehb-textMuted mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

