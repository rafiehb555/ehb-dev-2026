"use client";

import Link from "next/link";
import { ServiceCreationForm } from "@/components/ServiceCreationForm";

export default function NewServicePage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const locationQs = (() => {
    const sp = new URLSearchParams();
    if (searchParams?.country) sp.set("country", searchParams.country);
    if (searchParams?.state) sp.set("state", searchParams.state);
    if (searchParams?.city) sp.set("city", searchParams.city);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Dashboard</p>
            <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">
              Create a new service listing
            </h1>
            <p className="text-ehb-textMuted text-sm">
              Select industry and service type, then add price and location. Demo flow.
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
              href={`/ai-marketplace${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
            >
              AI Marketplace
            </Link>
          </div>
        </div>

        <ServiceCreationForm />
      </div>
    </main>
  );
}

