"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileStlBadge } from "@/components/features/stl/ProfileStlBadge";
import { fetchJson } from "@/lib/fetchJson";
import { getJpsOverview, type JpsOverview } from "@/lib/jps/data";

export default function ProfilePage() {
  const [jpsData, setJpsData] = useState<JpsOverview>(getJpsOverview());

  useEffect(() => {
    void fetchJson<JpsOverview>("/api/jps", getJpsOverview()).then(setJpsData);
  }, []);

  const featuredProfile = jpsData.profiles[0];

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-5">
        <section className="glass-panel border border-white/10 p-5 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">JPS Profile</p>
          <h1 className="text-2xl font-semibold gradient-text mt-1">User Profile</h1>
          <p className="text-sm text-ehb-textBody mt-2">
            Update personal profile, skills, services, and trust signals for better matching.
          </p>
          <div className="pt-1 border-t border-white/10">
            <ProfileStlBadge />
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <div className="ehb-card-elevated">
            <h2 className="text-sm font-semibold text-white">Identity</h2>
            <p className="text-xs text-ehb-textMuted mt-1">
              {featuredProfile?.name ?? "JPS Profile"} · {featuredProfile?.designation ?? "Pending"} · {featuredProfile?.city ?? "Pakistan"}
            </p>
          </div>
          <div className="ehb-card-elevated">
            <h2 className="text-sm font-semibold text-white">Skills & Services</h2>
            <p className="text-xs text-ehb-textMuted mt-1">
              {featuredProfile?.skills.slice(0, 3).join(", ") ?? "Skills pending"} · {featuredProfile?.services.slice(0, 2).join(", ") ?? "Services pending"}
            </p>
          </div>
        </section>

        <section className="ehb-card-elevated">
          <h2 className="text-sm font-semibold text-white">Featured JPS Snapshot</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2 text-xs text-ehb-textBody">
            <div>Industry: {featuredProfile?.industry ?? "Pending"}</div>
            <div>Experience: {featuredProfile?.experience ?? "Pending"}</div>
            <div>Education: {featuredProfile?.education ?? "Pending"}</div>
            <div>Status: {featuredProfile?.status ?? "Pending"}</div>
            <div className="md:col-span-2">
              Certifications: {featuredProfile?.certifications.join(", ") ?? "Pending"}
            </div>
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

