"use client";

import Link from "next/link";
import { ServiceCreationForm } from "@/components/ServiceCreationForm";

export default function CreateMyServicePage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">My Services</p>
            <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">
              Create a new service (demo)
            </h1>
            <p className="text-ehb-textMuted text-sm">Same flow as “new service”, routed for provider convenience.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        <ServiceCreationForm />
      </div>
    </main>
  );
}

