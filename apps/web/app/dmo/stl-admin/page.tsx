"use client";

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  VerificationRowGrid,
  SectionHeader,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type STLOverride = {
  id: string;
  sellerId: string;
  currentLevel: number;
  targetLevel: number;
  reason: string;
  status: "pending" | "applied" | "reverted";
  auditTrail: string[];
  appliedBy: string;
  appliedAt: string;
};

type STLSource = {
  source: string;
  maxCap: number;
  description: string;
};

const STL_OVERRIDES: STLOverride[] = [
  { id: "OVR-001", sellerId: "SELLER-4429", currentLevel: 5, targetLevel: 3, reason: "Fraud investigation — multiple disputes", status: "applied", auditTrail: ["Override created", "Manual audit verified", "Change committed"], appliedBy: "dmo.sara", appliedAt: "2026-04-12T14:30:00Z" },
  { id: "OVR-002", sellerId: "SELLER-8821", currentLevel: 7, targetLevel: 6, reason: "Chargeback spike (3 in 48h)", status: "pending", auditTrail: ["Override created", "Pending approval"], appliedBy: "dmo.hamza", appliedAt: "2026-04-12T15:45:00Z" },
  { id: "OVR-003", sellerId: "SELLER-1203", currentLevel: 4, targetLevel: 5, reason: "Perfect performance milestone", status: "applied", auditTrail: ["Manual promotion", "Reviewed"], appliedBy: "dmo.ayesha", appliedAt: "2026-04-11T09:20:00Z" },
];

const STL_SOURCES: STLSource[] = [
  { source: "PSS", maxCap: 5, description: "Proof & Security System verification level" },
  { source: "Franchise", maxCap: 8, description: "Franchise tier hierarchy limit" },
  { source: "CRB", maxCap: 9, description: "Central Record Blockchain approval" },
  { source: "DMO", maxCap: 10, description: "Decentralized Management Office override" },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const columns: RowColumn<STLOverride>[] = [
  {
    key: "seller",
    header: "Seller",
    width: "minmax(0,1.2fr)",
    render: (r) => (
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-white/45">{r.sellerId}</div>
        <div className="text-sm font-semibold text-white">{r.id}</div>
      </div>
    ),
  },
  {
    key: "level",
    header: "Level Change",
    width: "minmax(0,0.9fr)",
    render: (r) => (
      <span className="font-semibold text-white">L{r.currentLevel} → L{r.targetLevel}</span>
    ),
  },
  {
    key: "reason",
    header: "Reason",
    width: "minmax(0,2fr)",
    render: (r) => <span className="text-[11px] text-white/65">{r.reason}</span>,
  },
  {
    key: "status",
    header: "Status",
    width: "minmax(0,0.8fr)",
    render: (r) => {
      const tone = r.status === "applied" ? "green" : r.status === "pending" ? "amber" : "purple";
      return <VerificationChip tone={tone as VerificationTone}>{r.status}</VerificationChip>;
    },
  },
];

export default function STLAdminPage() {
  const [selectedOverride, setSelectedOverride] = useState<STLOverride | null>(null);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#7B6EF6]">STL Admin</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">STL Admin Controls</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Manual STL override with audit trail — freeze/unfreeze STL,
              source cap configuration, bulk recalculation trigger.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Pending Overrides" value={STL_OVERRIDES.filter((o) => o.status === "pending").length} sub="awaiting approval" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4l3 2M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="Applied Overrides" value={STL_OVERRIDES.filter((o) => o.status === "applied").length} sub="total changes" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="teal" label="Source Caps" value={STL_SOURCES.length} sub="configured sources" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="amber" label="Last Bulk Run" value="2h ago" sub="STL recalc" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Manual STL Overrides" hint="With immutable audit trail" right={<button className="text-[11px] font-semibold text-[#7B6EF6] hover:text-[#A098F8]">+ New override</button>} />
        <div className="mt-4">
          <VerificationRowGrid<STLOverride>
            rows={STL_OVERRIDES}
            columns={columns}
            onRowClick={(r) => setSelectedOverride(r)}
            getRowTone={(r) => r.status === "applied" ? "green" : r.status === "pending" ? "amber" : "purple"}
            emptyTitle="No overrides"
            emptyHint="All STL levels calculated automatically."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="STL Source Caps" hint="Maximum level each source can grant" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STL_SOURCES.map((src) => (
            <div key={src.source} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{src.source}</p>
                  <p className="mt-1 text-[12px] text-white/60">{src.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-mono font-bold text-[#7B6EF6]">L{src.maxCap}</span>
                  <button className="text-[10px] text-white/50 hover:text-white/90">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Bulk Actions" hint="System-wide operations" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-4 py-3 text-[11px] font-semibold text-[#7B6EF6] transition-colors hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/20">
            Trigger Nightly Recalculation
          </button>
          <button className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-4 py-3 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20">
            Freeze All STL Levels
          </button>
          <button className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-4 py-3 text-[11px] font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/20">
            Unfreeze All STL Levels
          </button>
          <button className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-4 py-3 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20">
            Downgrade All Below L4
          </button>
        </div>
      </section>
    </div>
  );
}
