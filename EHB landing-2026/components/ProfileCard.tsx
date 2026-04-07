import Link from "next/link";
import type { JpsProfile } from "@/lib/jps/profiles";

export function ProfileCard({ profile }: { profile: JpsProfile }) {
  return (
    <div className="glass-panel card-hover rounded-2xl p-6 space-y-4 border border-white/10">
      <div className="flex items-start gap-4">
        <div
          className="h-14 w-14 rounded-2xl bg-slate-900/40 border border-white/10 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <img src={profile.photo} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-white leading-tight">{profile.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ehb-textBody">
            <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px]">
              @{profile.username}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-[2px]">
              {profile.sqlLevel}
            </span>
          </div>
        </div>
      </div>

      <p className="text-ehb-textMuted text-sm leading-relaxed">{profile.bio}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Verification</p>
          <p className="text-sm font-semibold text-white leading-relaxed">{profile.verificationStatus}</p>
          <p className="text-[11px] text-slate-500 mt-2">Meaning shown across trust badges</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Rating</p>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {profile.rating.toFixed(1)} / 5.0
          </p>
          <p className="text-[11px] text-slate-500 mt-2">Trusted outcomes (demo)</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {profile.skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px] text-[11px] text-slate-200"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
        >
          Open dashboard
          <span className="text-xs ml-2" aria-hidden>
            →
          </span>
        </Link>
        <Link
          href="/ai-marketplace"
          className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
        >
          Find verified tools
        </Link>
      </div>
    </div>
  );
}

