"use client";

/**
 * DMO — Unified Operations Queue
 *   - VerificationUI primitives only (no emojis, no local styles)
 *   - In-file demo data (prototype only, no fetch)
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
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type QueueItemType = "APPLICATION" | "FRAUD_ALERT" | "COMPLAINT" | "ORDER_REVIEW" | "SELLER_ONBOARDING" | "COMPLIANCE" | "APPROVAL";

type QueueItem = {
  id: string;
  type: QueueItemType;
  priority: Priority;
  title: string;
  description: string;
  entityId: string;
  createdAt: string;
  actionUrl: string;
};

const DEMO: QueueItem[] = [
  { id: "Q-001", type: "FRAUD_ALERT", priority: "CRITICAL", title: "Fraud Alert: APPLICATION", description: "Risk score 92/100 — 3 signals detected on GoSellr PK", entityId: "app-goselr-pk-01", createdAt: "2026-04-12T10:00:00Z", actionUrl: "/dmo/fraud" },
  { id: "Q-002", type: "COMPLAINT", priority: "CRITICAL", title: "Complaint: FRAUD", description: "Seller collected payment via external link, bypassing escrow", entityId: "seller-agts-mul", createdAt: "2026-04-12T09:30:00Z", actionUrl: "/dmo/moderation" },
  { id: "Q-003", type: "COMPLIANCE", priority: "CRITICAL", title: "PSS compliance expired", description: "WMS Islamabad PSS certificate expired — refill overdue 4 days", entityId: "refill-wms-01", createdAt: "2026-04-08T00:00:00Z", actionUrl: "/dmo/refilling" },
  { id: "Q-004", type: "ORDER_REVIEW", priority: "HIGH", title: "Order review required", description: "High-value order $4,200 flagged for manual verification", entityId: "ord-wms-44", createdAt: "2026-04-12T08:15:00Z", actionUrl: "/dmo/applications" },
  { id: "Q-005", type: "SELLER_ONBOARDING", priority: "HIGH", title: "Seller onboarding: TechHub LHR", description: "IN_REVIEW · risk score 45", entityId: "app-techhub-lhr", createdAt: "2026-04-11T14:00:00Z", actionUrl: "/dmo/applications" },
  { id: "Q-006", type: "APPLICATION", priority: "MEDIUM", title: "Application: FRANCHISE_UPGRADE", description: "AGTS Dubai requesting Corporate → Country tier promotion", entityId: "app-agts-dubai", createdAt: "2026-04-11T11:00:00Z", actionUrl: "/dmo/applications" },
  { id: "Q-007", type: "COMPLIANCE", priority: "MEDIUM", title: "Industry refill due", description: "OLS Lahore industry cert expiring in 5 days", entityId: "refill-ols-02", createdAt: "2026-04-11T09:00:00Z", actionUrl: "/dmo/refilling" },
  { id: "Q-008", type: "APPROVAL", priority: "LOW", title: "Approval required", description: "HPS Karachi L6 → L7 STL upgrade pending DMO sign-off", entityId: "app-hps-khi-l7", createdAt: "2026-04-10T16:00:00Z", actionUrl: "/dmo/approvals" },
];

const PRIORITY_TONE: Record<Priority, VerificationTone> = {
  CRITICAL: "red",
  HIGH: "amber",
  MEDIUM: "purple",
  LOW: "cyan",
};

const TYPE_TONE: Record<QueueItemType, VerificationTone> = {
  FRAUD_ALERT: "red",
  COMPLAINT: "amber",
  ORDER_REVIEW: "purple",
  SELLER_ONBOARDING: "cyan",
  APPLICATION: "teal",
  COMPLIANCE: "amber",
  APPROVAL: "green",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function DmoQueuePage() {
  const [rows] = useState<QueueItem[]>(DEMO);
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | Priority>("ALL");
  const [active, setActive] = useState<QueueItem | null>(null);

  const stats = useMemo(() => ({
    critical: rows.filter((i) => i.priority === "CRITICAL").length,
    high: rows.filter((i) => i.priority === "HIGH").length,
    medium: rows.filter((i) => i.priority === "MEDIUM").length,
    low: rows.filter((i) => i.priority === "LOW").length,
  }), [rows]);

  const visible = priorityFilter === "ALL" ? rows : rows.filter((i) => i.priority === priorityFilter);

  const columns: RowColumn<QueueItem>[] = [
    {
      key: "item",
      header: "Item",
      width: "minmax(0,2.2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.title}</div>
          <div className="truncate text-[10px] text-white/50">{r.description}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", width: "minmax(0,1fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.type]} size="xs">{r.type.replace(/_/g, " ")}</VerificationChip> },
    { key: "priority", header: "Priority", width: "minmax(0,0.8fr)", render: (r) => <VerificationChip tone={PRIORITY_TONE[r.priority]}>{r.priority}</VerificationChip> },
    { key: "date", header: "Created", width: "minmax(0,0.9fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 20%, #F05858 40%, #F0A030 60%, #2BBFA0 80%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#F05858]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Queue</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">DMO Unified Operations Queue</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Applications, Fraud, Complaints, Seller onboarding, Order reviews, Approvals,
              Compliance — sab ek unified priority queue mein. Critical items top pa.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Critical" value={stats.critical} sub="immediate action" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="amber" label="High" value={stats.high} sub="needs review" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Medium" value={stats.medium} sub="standard flow" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Low" value={stats.low} sub="when available" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Priority distribution" hint="Across all item types" />
        <SeverityMeter segments={[
          { label: "Critical", value: stats.critical, tone: "red" },
          { label: "High", value: stats.high, tone: "amber" },
          { label: "Medium", value: stats.medium, tone: "purple" },
          { label: "Low", value: stats.low, tone: "cyan" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Unified queue" title="Operations items" hint="Click row for detail + action" right={<span className="text-[10px] text-white/45">{visible.length} item(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | Priority>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "CRITICAL" as const, label: `Critical · ${stats.critical}` },
              { value: "HIGH" as const, label: `High · ${stats.high}` },
              { value: "MEDIUM" as const, label: `Medium · ${stats.medium}` },
              { value: "LOW" as const, label: `Low · ${stats.low}` },
            ]}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<QueueItem>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => PRIORITY_TONE[r.priority]}
            emptyTitle="No items in this priority"
            emptyHint="Adjust filter to see queue items."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.title : "Queue item detail"}
        subtitle={active ? `${active.id} · ${active.type.replace(/_/g, " ")}` : undefined}
        severity={active?.priority === "CRITICAL" ? "critical" : active?.priority === "HIGH" ? "high" : "warning"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={PRIORITY_TONE[active.priority]}>{active.priority}</VerificationChip>
              <VerificationChip tone={TYPE_TONE[active.type]}>{active.type.replace(/_/g, " ")}</VerificationChip>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">
              {active.description}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Queue ID" value={active.id} mono />
              <InfoCell label="Type" value={active.type.replace(/_/g, " ")} />
              <InfoCell label="Priority" value={active.priority} />
              <InfoCell label="Entity ID" value={active.entityId} mono />
              <InfoCell label="Created" value={fmtTime(active.createdAt)} />
              <InfoCell label="Action URL" value={active.actionUrl} mono />
            </div>

            <div className="pt-2">
              <a href={active.actionUrl} className="block w-full rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2.5 text-center text-[12px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">
                Review in module →
              </a>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
