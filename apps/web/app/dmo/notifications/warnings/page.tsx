"use client";

/**
 * DMO — Notifications / Warnings
 * Non-critical warnings and advisories.
 * DESIGN-ONLY — in-file demo data, no fetch.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type WarnCategory = "COMPLIANCE" | "PERFORMANCE" | "SECURITY" | "CAPACITY";

type Warning = {
  id: string;
  title: string;
  category: WarnCategory;
  severity: "MEDIUM" | "LOW";
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
};

const DEMO: Warning[] = [
  { id: "warn-001", title: "API Response Time Trending High", category: "PERFORMANCE", severity: "MEDIUM", occurrenceCount: 12, firstSeenAt: "2026-04-11T14:32:10Z", lastSeenAt: "2026-04-12T18:45:33Z" },
  { id: "warn-002", title: "Disk Usage Above 75%", category: "CAPACITY", severity: "MEDIUM", occurrenceCount: 3, firstSeenAt: "2026-04-12T08:15:22Z", lastSeenAt: "2026-04-12T18:52:14Z" },
  { id: "warn-003", title: "Certificate Expiry in 30 Days", category: "SECURITY", severity: "LOW", occurrenceCount: 1, firstSeenAt: "2026-04-12T09:30:45Z", lastSeenAt: "2026-04-12T09:30:45Z" },
  { id: "warn-004", title: "KYC Renewal Approaching", category: "COMPLIANCE", severity: "LOW", occurrenceCount: 5, firstSeenAt: "2026-04-10T12:00:00Z", lastSeenAt: "2026-04-12T17:22:56Z" },
  { id: "warn-005", title: "Memory Leak Detected in Auth Service", category: "PERFORMANCE", severity: "MEDIUM", occurrenceCount: 8, firstSeenAt: "2026-04-12T06:15:33Z", lastSeenAt: "2026-04-12T18:32:15Z" },
  { id: "warn-006", title: "Cache Hit Rate Below 65%", category: "PERFORMANCE", severity: "LOW", occurrenceCount: 4, firstSeenAt: "2026-04-12T12:45:22Z", lastSeenAt: "2026-04-12T18:19:48Z" },
  { id: "warn-007", title: "SSL Certificate Warning", category: "SECURITY", severity: "MEDIUM", occurrenceCount: 2, firstSeenAt: "2026-04-12T15:10:30Z", lastSeenAt: "2026-04-12T18:01:22Z" },
  { id: "warn-008", title: "Database Query Timeout Spike", category: "PERFORMANCE", severity: "MEDIUM", occurrenceCount: 6, firstSeenAt: "2026-04-12T16:22:15Z", lastSeenAt: "2026-04-12T17:44:10Z" },
];

const CATEGORY_TONE: Record<WarnCategory, VerificationTone> = {
  COMPLIANCE: "amber",
  PERFORMANCE: "cyan",
  SECURITY: "red",
  CAPACITY: "teal",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function WarningsPage() {
  const [selected, setSelected] = useState<Warning | null>(null);
  const [catFilter, setCatFilter] = useState<WarnCategory | "ALL">("ALL");

  const visible = useMemo(() => {
    if (catFilter === "ALL") return DEMO;
    return DEMO.filter((w) => w.category === catFilter);
  }, [catFilter]);

  const stats = useMemo(() => ({
    active: DEMO.length,
    resolved: 42,
    recurring: DEMO.filter((w) => w.occurrenceCount > 3).length,
    newToday: DEMO.filter((w) => {
      const dt = new Date(w.firstSeenAt);
      const now = new Date();
      return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
    }).length,
  }), []);

  const columns: RowColumn<Warning>[] = [
    {
      key: "title",
      header: "Warning",
      width: "minmax(0,2fr)",
      render: (w) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white/85">{w.title}</div>
          <div className="font-mono text-[10px] text-white/40">{w.id}</div>
        </div>
      ),
    },
    { key: "category", header: "Category", width: "minmax(0,1.1fr)", render: (w) => <VerificationChip tone={CATEGORY_TONE[w.category]}>{w.category}</VerificationChip> },
    { key: "severity", header: "Severity", width: "minmax(0,0.9fr)", render: (w) => <VerificationChip tone={w.severity === "MEDIUM" ? "amber" : "cyan"}>{w.severity}</VerificationChip> },
    { key: "count", header: "Count", width: "minmax(0,0.7fr)", align: "right", render: (w) => <span className="font-mono text-sm font-semibold text-[#A098F8]">{w.occurrenceCount}</span> },
    { key: "time", header: "Last seen", width: "minmax(0,1.1fr)", align: "right", render: (w) => <span className="text-[11px] text-white/45">{fmt(w.lastSeenAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #F0A030 30%, #A098F8 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#A098F8]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/18 via-[#A098F8]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/notifications" className="text-white/40 hover:text-white/70 transition-colors">Notifications</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Warnings</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Warnings & Advisories</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Non-critical warnings — performance, compliance, security, aur capacity advisories. Recurring patterns track honge.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/notifications/all" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">All</Link>
            <Link href="/dmo/notifications/critical" className="rounded-xl border border-[#F05858]/50 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25">Critical</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="amber" label="Active warnings" value={stats.active} sub="current issues" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Resolved" value={stats.resolved} sub="cleared this month" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Recurring" value={stats.recurring} sub="multi-occurrence" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="New today" value={stats.newToday} sub="since midnight" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 7 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Filter" title="Category" hint="Refine by type" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<WarnCategory | "ALL">
            options={[
              { value: "ALL", label: `All · ${DEMO.length}` },
              { value: "PERFORMANCE", label: `Performance · ${DEMO.filter((w) => w.category === "PERFORMANCE").length}` },
              { value: "COMPLIANCE", label: "Compliance" },
              { value: "SECURITY", label: "Security" },
              { value: "CAPACITY", label: "Capacity" },
            ]}
            value={catFilter}
            onChange={setCatFilter}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Warnings" title="Warning list" hint={`Showing ${visible.length} of ${DEMO.length}`} right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<Warning>
            rows={visible}
            columns={columns}
            onRowClick={setSelected}
            getRowTone={(w) => CATEGORY_TONE[w.category]}
            emptyTitle="No warnings match"
            emptyHint="Adjust filter."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Warning detail"}
        subtitle={selected ? `${selected.category} · Last seen ${new Date(selected.lastSeenAt).toLocaleString()}` : undefined}
        severity="warning"
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={CATEGORY_TONE[selected.category]}>{selected.category}</VerificationChip>
              <VerificationChip tone={selected.severity === "MEDIUM" ? "amber" : "cyan"}>{selected.severity}</VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Warning ID" value={selected.id} mono />
              <InfoCell label="Occurrences" value={`${selected.occurrenceCount} times`} />
              <InfoCell label="First seen" value={new Date(selected.firstSeenAt).toLocaleString()} mono />
              <InfoCell label="Last seen" value={new Date(selected.lastSeenAt).toLocaleString()} mono />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Recommendation</p>
              <p className="text-sm text-white/80 leading-relaxed">Monitor this warning and consider remediation. Multiple occurrences indicate a persistent issue.</p>
            </div>
            <button type="button" className="w-full rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2.5 text-[12px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">
              Dismiss Warning
            </button>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
