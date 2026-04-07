import Link from "next/link";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";

export default function DmoFranchiseMenuPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">DMO · Franchise Model</p>
          <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Franchise Dashboards</h1>
          <p className="text-ehb-textBody max-w-2xl">
            Open the franchise control layer by operating level and review industry-aware queues, trust signals, and workload context.
          </p>
        </header>

        <DmoTopNav />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/dmo/franchise/country", title: "Country Franchise", accent: "#00eaff" },
            { href: "/dmo/franchise/corporate", title: "Corporate Franchise", accent: "#3b82f6" },
            { href: "/dmo/franchise/master", title: "Master Franchise", accent: "#22c55e" },
            { href: "/dmo/franchise/sub", title: "Sub Franchise", accent: "#f59e0b" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="glass-card card-hover rounded-2xl border p-5 flex flex-col justify-between min-h-[120px]"
              style={{ borderColor: `${c.accent}40`, boxShadow: `0 0 26px ${c.accent}12` }}
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">{c.title}</div>
                <div className="text-[10px] text-ehb-textMuted">Industry-aware KPIs, queue routing, and operational summaries</div>
              </div>
              <div className="text-[11px] text-ehb-textBody pt-3">↗ Open dashboard</div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

