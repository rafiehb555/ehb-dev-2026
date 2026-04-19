"use client";

/**
 * DMO — Blockchain Control: STL Proofs
 *   - Verified STL certificates on-chain
 *   - Blockchain hash, block number, timestamp
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type STLProof = {
  id: string;
  sellerId: string;
  level: string;
  merkleRoot: string;
  blockNumber: number;
  txHash: string;
  timestamp: string;
  verified: boolean;
};

const DEMO: STLProof[] = [
  { id: "STLP-821", sellerId: "SEL-94821", level: "L7", merkleRoot: "0x82a1…9e3b", blockNumber: 19482301, txHash: "0xa1f2…c7e8", timestamp: "2026-04-11T10:40:00Z", verified: true },
  { id: "STLP-820", sellerId: "SEL-94820", level: "L6", merkleRoot: "0x71b2…8c2a", blockNumber: 19482287, txHash: "0x88de…9042", timestamp: "2026-04-11T10:12:00Z", verified: true },
  { id: "STLP-819", sellerId: "SEL-94819", level: "L7", merkleRoot: "0x59c3…7f5d", blockNumber: 19482250, txHash: "0x7c01…3fa6", timestamp: "2026-04-11T09:48:00Z", verified: true },
  { id: "STLP-818", sellerId: "SEL-94818", level: "L5", merkleRoot: "0x44d4…6e9c", blockNumber: 19482211, txHash: "0xee5a…b1c2", timestamp: "2026-04-11T09:20:00Z", verified: true },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function STLProofsPage() {
  const [filter, setFilter] = useState<"ALL" | string>("ALL");

  const visible = filter === "ALL" ? DEMO : DEMO.filter((p) => p.level === filter);

  const stats = useMemo(
    () => ({
      total: DEMO.length,
      verified: DEMO.filter((p) => p.verified).length,
    }),
    []
  );

  const columns: RowColumn<STLProof>[] = [
    {
      key: "proof",
      header: "Proof ID",
      width: "minmax(0,1fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/55">{r.id}</div>
          <div className="text-[10px] text-white/50">{r.sellerId}</div>
        </div>
      ),
    },
    {
      key: "level",
      header: "Level",
      width: "minmax(0,0.6fr)",
      render: (r) => <VerificationChip tone="purple">{r.level}</VerificationChip>,
    },
    {
      key: "merkle",
      header: "Merkle Root",
      width: "minmax(0,1fr)",
      render: (r) => <span className="font-mono text-[11px] text-white/70">{r.merkleRoot}</span>,
    },
    {
      key: "block",
      header: "Block",
      width: "minmax(0,0.8fr)",
      render: (r) => <span className="font-mono text-[11px] text-white/70">#{r.blockNumber.toLocaleString()}</span>,
    },
    {
      key: "time",
      header: "Time",
      width: "minmax(0,1fr)",
      render: (r) => <span className="text-[10px] text-white/55">{fmtTime(r.timestamp)}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.7fr)",
      render: (r) => <VerificationChip tone={r.verified ? "green" : "amber"}>{r.verified ? "Verified" : "Pending"}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Blockchain Control</span>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">STL Proofs</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">STL Proofs on Chain</h1>
            <p className="max-w-2xl text-sm text-white/65">Verified STL certificates anchored on Polkadot blockchain.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total proofs" value={stats.total} sub="on-chain" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Verified" value={stats.verified} sub="confirmed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Latest proof" value="STLP-821" sub="10:40 UTC" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Success rate" value="100%" sub="all verified" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Filter by STL level" hint="View proofs by seller level" />
        <FilterChipRow<"ALL" | string>
          options={[
            { value: "ALL", label: `All · ${DEMO.length}` },
            { value: "L7", label: "L7 · 2" },
            { value: "L6", label: "L6 · 1" },
            { value: "L5", label: "L5 · 1" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="STL proof records" hint={`${visible.length} proof(s) · click for details`} />
        <VerificationRowGrid<STLProof>
          rows={visible}
          columns={columns}
          emptyTitle="No proofs found"
          emptyHint="Adjust filter to see STL proofs."
        />
      </section>
    </div>
  );
}
