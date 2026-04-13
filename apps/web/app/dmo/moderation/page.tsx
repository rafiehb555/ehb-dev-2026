"use client";

/**
 * DMO — Complaint Moderation
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

type ComplaintStatus = "PENDING" | "AI_REVIEW" | "HUMAN_REVIEW" | "RESOLVED" | "DISMISSED";
type ComplaintType = "FAKE_PRODUCT" | "NOT_DELIVERED" | "FRAUD" | "QUALITY_ISSUE" | "FAKE_REVIEW" | "HARASSMENT";

type Complaint = {
  id: string;
  complainantId: string;
  targetId: string;
  targetType: string;
  type: ComplaintType;
  description: string;
  status: ComplaintStatus;
  aiReviewNote: string | null;
  createdAt: string;
};

const DEMO: Complaint[] = [
  { id: "CMP-301", complainantId: "usr-buyer-01", targetId: "seller-goselr-pk", targetType: "SELLER", type: "FAKE_PRODUCT", description: "Product received does not match listing photos — counterfeit brand tag.", status: "PENDING", aiReviewNote: null, createdAt: "2026-04-12T08:00:00Z" },
  { id: "CMP-300", complainantId: "usr-buyer-02", targetId: "seller-wms-isb", targetType: "SELLER", type: "NOT_DELIVERED", description: "Order placed 14 days ago, tracking shows stuck in transit since day 3.", status: "AI_REVIEW", aiReviewNote: "AI confidence 0.87: Likely logistics failure, not seller fraud.", createdAt: "2026-04-11T15:30:00Z" },
  { id: "CMP-299", complainantId: "usr-buyer-03", targetId: "seller-agts-mul", targetType: "SELLER", type: "FRAUD", description: "Seller collected payment via external link, bypassing escrow.", status: "HUMAN_REVIEW", aiReviewNote: "AI flagged: Payment bypass detected. High-risk signal.", createdAt: "2026-04-11T12:00:00Z" },
  { id: "CMP-298", complainantId: "usr-buyer-04", targetId: "seller-hps-khi", targetType: "SELLER", type: "QUALITY_ISSUE", description: "Educational material outdated — references 2019 curriculum, not 2025.", status: "RESOLVED", aiReviewNote: "Seller issued replacement + 15% credit.", createdAt: "2026-04-10T09:00:00Z" },
  { id: "CMP-297", complainantId: "usr-buyer-05", targetId: "review-jps-01", targetType: "REVIEW", type: "FAKE_REVIEW", description: "5-star review posted by seller's second account — same IP.", status: "DISMISSED", aiReviewNote: "AI inconclusive: IP match but not definitive.", createdAt: "2026-04-09T16:00:00Z" },
  { id: "CMP-296", complainantId: "usr-buyer-06", targetId: "seller-ols-lhr", targetType: "SELLER", type: "HARASSMENT", description: "Seller sent threatening messages after negative review.", status: "PENDING", aiReviewNote: null, createdAt: "2026-04-12T06:30:00Z" },
];

const STATUS_TONE: Record<ComplaintStatus, VerificationTone> = {
  PENDING: "amber",
  AI_REVIEW: "cyan",
  HUMAN_REVIEW: "purple",
  RESOLVED: "green",
  DISMISSED: "red",
};

const TYPE_TONE: Record<ComplaintType, VerificationTone> = {
  FAKE_PRODUCT: "red",
  NOT_DELIVERED: "amber",
  FRAUD: "red",
  QUALITY_ISSUE: "purple",
  FAKE_REVIEW: "teal",
  HARASSMENT: "red",
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

export default function DmoModerationPage() {
  const [rows] = useState<Complaint[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ComplaintStatus>("ALL");
  const [active, setActive] = useState<Complaint | null>(null);

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((c) => c.status === "PENDING").length,
    aiReview: rows.filter((c) => c.status === "AI_REVIEW").length,
    humanReview: rows.filter((c) => c.status === "HUMAN_REVIEW").length,
    resolved: rows.filter((c) => c.status === "RESOLVED").length,
  }), [rows]);

  const visible = statusFilter === "ALL" ? rows : rows.filter((c) => c.status === statusFilter);

  const columns: RowColumn<Complaint>[] = [
    {
      key: "complaint",
      header: "Complaint",
      width: "minmax(0,2.2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.id}</div>
          <div className="truncate text-sm font-semibold text-white">{r.type.replace(/_/g, " ")}</div>
          <div className="truncate text-[10px] text-white/50">{r.description}</div>
        </div>
      ),
    },
    { key: "status", header: "Status", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status.replace(/_/g, " ")}</VerificationChip> },
    { key: "type", header: "Type", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.type]} size="xs">{r.type.replace(/_/g, " ")}</VerificationChip> },
    {
      key: "ai",
      header: "AI note",
      width: "minmax(0,1fr)",
      render: (r) => r.aiReviewNote
        ? <span className="text-[10px] text-cyan-200/70 line-clamp-2">{r.aiReviewNote}</span>
        : <span className="text-[10px] text-white/30">—</span>,
    },
    { key: "date", header: "Filed", width: "minmax(0,0.8fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F0A030 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Moderation</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Complaint Moderation</h1>
            <p className="max-w-2xl text-sm text-white/65">
              3-step resolution: AI Review → Human Review → Final Decision (72hr SLA).
              Fake products, fraud, delivery issues — sab yahaan moderate hota hai.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="amber" label="Pending" value={stats.pending} sub="awaiting review" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="AI review" value={stats.aiReview} sub="AI processing" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Human review" value={stats.humanReview} sub="operator decision" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="Resolved" value={stats.resolved} sub="closed cases" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Pipeline distribution" hint="3-step flow" />
        <SeverityMeter segments={[
          { label: "Pending", value: stats.pending, tone: "amber" },
          { label: "AI review", value: stats.aiReview, tone: "cyan" },
          { label: "Human review", value: stats.humanReview, tone: "purple" },
          { label: "Resolved", value: stats.resolved, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Moderation" title="Complaint queue" hint="Click row for detail + action" right={<span className="text-[10px] text-white/45">{visible.length} case(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | ComplaintStatus>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "PENDING" as const, label: `Pending · ${stats.pending}` },
              { value: "AI_REVIEW" as const, label: `AI review · ${stats.aiReview}` },
              { value: "HUMAN_REVIEW" as const, label: `Human · ${stats.humanReview}` },
              { value: "RESOLVED" as const, label: `Resolved · ${stats.resolved}` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<Complaint>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No complaints in this filter"
            emptyHint="Adjust filter to see cases."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.type.replace(/_/g, " ")} — ${active.id}` : "Complaint detail"}
        subtitle={active ? `Filed ${fmtTime(active.createdAt)}` : undefined}
        severity={active?.type === "FRAUD" || active?.type === "HARASSMENT" ? "critical" : active?.status === "PENDING" ? "warning" : "info"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={TYPE_TONE[active.type]}>{active.type.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status.replace(/_/g, " ")}</VerificationChip>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">
              {active.description}
            </div>

            {active.aiReviewNote ? (
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/60 mb-1">AI review note</p>
                <p className="text-[12px] text-cyan-200/80">{active.aiReviewNote}</p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Complaint ID" value={active.id} mono />
              <InfoCell label="Type" value={active.type.replace(/_/g, " ")} />
              <InfoCell label="Complainant" value={active.complainantId} mono />
              <InfoCell label="Target" value={active.targetId} mono />
              <InfoCell label="Target type" value={active.targetType} />
              <InfoCell label="Filed" value={fmtTime(active.createdAt)} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Resolve</button>
              <button type="button" className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-white/60 transition-colors hover:border-white/25 hover:bg-white/[0.08]">Dismiss</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
