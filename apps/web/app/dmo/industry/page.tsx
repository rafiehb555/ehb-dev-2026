"use client";

/**
 * DMO — Multi-Industry Verification
 *   - VerificationUI primitives only (no <table>, no framer-motion)
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

type VerifStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
type EntityType = "COMPANY" | "SERVICE" | "PRODUCT";

type IndustryVerification = {
  id: string;
  industryName: string;
  industrySlug: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  status: VerifStatus;
  score: number | null;
  weight: number;
  updatedAt: string;
  dmoTaskId: string | null;
};

const DEMO: IndustryVerification[] = [
  { id: "IV-001", industryName: "E-commerce", industrySlug: "ecommerce", entityType: "COMPANY", entityId: "cmp-goselr", entityName: "GoSellr PK", status: "VERIFIED", score: 88, weight: 1.2, updatedAt: "2026-04-11T09:00:00Z", dmoTaskId: "T-4400" },
  { id: "IV-002", industryName: "Legal", industrySlug: "legal", entityType: "SERVICE", entityId: "svc-ols-lhr", entityName: "OLS Lahore", status: "VERIFIED", score: 92, weight: 1.5, updatedAt: "2026-04-10T14:30:00Z", dmoTaskId: "T-4395" },
  { id: "IV-003", industryName: "Medical", industrySlug: "medical", entityType: "COMPANY", entityId: "cmp-wms-isb", entityName: "WMS Islamabad", status: "PENDING", score: null, weight: 1.0, updatedAt: "2026-04-11T11:00:00Z", dmoTaskId: "T-4410" },
  { id: "IV-004", industryName: "Education", industrySlug: "education", entityType: "SERVICE", entityId: "svc-hps-khi", entityName: "HPS Karachi", status: "PENDING", score: null, weight: 0.8, updatedAt: "2026-04-12T06:00:00Z", dmoTaskId: null },
  { id: "IV-005", industryName: "Travel", industrySlug: "travel", entityType: "COMPANY", entityId: "cmp-agts-mul", entityName: "AGTS Multan", status: "REJECTED", score: 34, weight: 1.0, updatedAt: "2026-04-09T16:20:00Z", dmoTaskId: "T-4388" },
  { id: "IV-006", industryName: "Jobs", industrySlug: "jobs", entityType: "PRODUCT", entityId: "prd-jps-01", entityName: "JPS Matching Engine", status: "VERIFIED", score: 79, weight: 1.3, updatedAt: "2026-04-08T12:00:00Z", dmoTaskId: "T-4375" },
  { id: "IV-007", industryName: "E-commerce", industrySlug: "ecommerce", entityType: "PRODUCT", entityId: "prd-gs-track", entityName: "GoSellr Tracking API", status: "EXPIRED", score: 65, weight: 0.9, updatedAt: "2026-03-15T10:00:00Z", dmoTaskId: "T-4210" },
];

const STATUS_TONE: Record<VerifStatus, VerificationTone> = {
  PENDING: "amber",
  VERIFIED: "green",
  REJECTED: "red",
  EXPIRED: "purple",
};

const ENTITY_TONE: Record<EntityType, VerificationTone> = {
  COMPANY: "purple",
  SERVICE: "teal",
  PRODUCT: "cyan",
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

const PHASE1_INDUSTRIES = [
  { slug: "ecommerce", name: "GoSellr", icon: "🛒", color: "#7B6EF6", users: 3420, status: "verified" },
  { slug: "legal", name: "OLS", icon: "⚖️", color: "#A098F8", users: 1240, status: "verified" },
  { slug: "medical", name: "WMS", icon: "🏥", color: "#2BBFA0", users: 2150, status: "verified" },
  { slug: "education", name: "HPS/OBS", icon: "🎓", color: "#F0A030", users: 4890, status: "verified" },
  { slug: "jobs", name: "JPS", icon: "💼", color: "#38C878", users: 8940, status: "verified" },
  { slug: "travel", name: "AGTS", icon: "✈️", color: "#67E8F9", users: 980, status: "verified" },
];

export default function DmoIndustryPage() {
  const [rows] = useState<IndustryVerification[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | VerifStatus>("ALL");
  const [active, setActive] = useState<IndustryVerification | null>(null);

  const stats = useMemo(() => {
    const total = rows.length;
    const verified = rows.filter((v) => v.status === "VERIFIED").length;
    const pending = rows.filter((v) => v.status === "PENDING").length;
    const avgScore = verified > 0
      ? Math.round(rows.filter((v) => v.status === "VERIFIED").reduce((s, v) => s + (v.score ?? 0), 0) / verified)
      : 0;
    return { total, verified, pending, avgScore };
  }, [rows]);

  const visible = statusFilter === "ALL" ? rows : rows.filter((r) => r.status === statusFilter);

  const columns: RowColumn<IndustryVerification>[] = [
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0,2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.entityName}</div>
          <div className="text-[10px] text-white/50">{r.industryName} · {r.entityType}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", width: "minmax(0,0.8fr)", render: (r) => <VerificationChip tone={ENTITY_TONE[r.entityType]}>{r.entityType}</VerificationChip> },
    { key: "status", header: "Status", width: "minmax(0,0.8fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip> },
    { key: "score", header: "Score", width: "minmax(0,0.6fr)", align: "right", render: (r) => <span className="font-mono text-sm text-white/80">{r.score ?? "—"}</span> },
    { key: "weight", header: "Weight", width: "minmax(0,0.6fr)", align: "right", render: (r) => <span className="font-mono text-sm text-white/70">{r.weight.toFixed(2)}</span> },
    { key: "updated", header: "Updated", width: "minmax(0,1fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.updatedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #67E8F9 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-cyan-300">Industry</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Multi-Industry Verification</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Global trust layer: verify entity across multiple sectors with weighted score impact.
              Phase 1 (6 industries) live — Phase 2/3 queue expanding to 32 industries.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="cyan" label="Verifications" value={stats.total} sub="total records" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Verified" value={stats.verified} sub="approved entities" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Pending" value={stats.pending} sub="awaiting decision" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Avg score" value={stats.avgScore} sub="verified entities" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Status distribution" />
        <SeverityMeter segments={[
          { label: "Verified", value: stats.verified, tone: "green" },
          { label: "Pending", value: stats.pending, tone: "amber" },
          { label: "Rejected", value: rows.filter((r) => r.status === "REJECTED").length, tone: "red" },
          { label: "Expired", value: rows.filter((r) => r.status === "EXPIRED").length, tone: "purple" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Trust layer" title="Verification queue" hint="Click row for detail + decision" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | VerifStatus> options={[
            { value: "ALL", label: `All · ${rows.length}` },
            { value: "PENDING", label: `Pending · ${stats.pending}` },
            { value: "VERIFIED", label: `Verified · ${stats.verified}` },
            { value: "REJECTED", label: "Rejected" },
            { value: "EXPIRED", label: "Expired" },
          ]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<IndustryVerification> rows={visible} columns={columns} onRowClick={(r) => setActive(r)} getRowTone={(r) => STATUS_TONE[r.status]} emptyTitle="No verifications in this filter" emptyHint="Adjust filter to see records." />
        </div>
      </section>

      {/* Phase-1 Industries Hub */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Phase 1" title="Live industries" hint="6 industries verified" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHASE1_INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={`/dmo/industry/${ind.slug}`}
              className="group relative overflow-hidden rounded-xl border bg-[#13162A]/85 p-4 transition-all duration-300 hover:-translate-y-[2px]"
              style={{ borderColor: `${ind.color}55` }}
            >
              <span aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${ind.color}, transparent)` }} />
              <div className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{ind.icon}</span>
                  <VerificationChip tone="teal">Live</VerificationChip>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{ind.name}</h3>
                  <p className="text-[10px] text-white/50 mt-1">{ind.users.toLocaleString()} users</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active ? active.entityName : "Verification detail"} subtitle={active ? `${active.id} · ${active.industryName} · ${active.entityType}` : undefined} severity={active?.status === "REJECTED" ? "high" : active?.status === "PENDING" ? "warning" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={ENTITY_TONE[active.entityType]}>{active.entityType}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
              <VerificationChip tone="cyan">{active.industryName}</VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Entity" value={active.entityName} />
              <InfoCell label="Entity ID" value={active.entityId} mono />
              <InfoCell label="Industry" value={active.industryName} />
              <InfoCell label="Score" value={active.score ?? "Not scored"} mono />
              <InfoCell label="Weight" value={active.weight.toFixed(2)} mono />
              <InfoCell label="DMO task" value={active.dmoTaskId ?? "—"} mono />
              <InfoCell label="Updated" value={fmtTime(active.updatedAt)} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Approve (verify)</button>
              <button type="button" className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20">Reject</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
