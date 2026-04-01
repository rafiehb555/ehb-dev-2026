"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/fetchJson";
import { getJpsOverview, type JpsOverview } from "@/lib/jpsData";

export default function JobsPage() {
  const [jpsData, setJpsData] = useState<JpsOverview>(getJpsOverview());

  useEffect(() => {
    void fetchJson<JpsOverview>("/api/jps", getJpsOverview()).then(setJpsData);
  }, []);

  const jobs = useMemo(
    () =>
      jpsData.profiles.flatMap((profile) =>
        profile.jobs.map((jobTitle, index) => ({
          id: `${profile.id}-${index}`,
          title: jobTitle,
          type: profile.industry,
          city: profile.city,
          candidate: profile.name,
        }))
      ),
    [jpsData]
  );

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300">JPS Jobs</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">Jobs & Activity</h1>
          <p className="text-sm text-slate-300 mt-2">Apply to jobs that match your profile and track application activity.</p>
        </section>

        <section className="ehb-card-elevated">
          <h2 className="text-sm font-semibold text-white mb-3">Suggested Jobs</h2>
          <div className="space-y-2">
            {jobs.map((j) => (
              <div key={j.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white font-semibold">{j.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {j.type} · {j.city} · Best match: {j.candidate}
                  </div>
                </div>
                <div className="text-xs text-emerald-300">JPS Match</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ehb-card-elevated">
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/profile" className="ehb-btn-secondary ehb-press">
              Improve Profile Match
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

