"use client";

/**
 * DMO — Blockchain Control: CRB Hashes
 *   - All CRB certificates with blockchain verification
 */

import Link from "next/link";
import { useMemo } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationChip,
  SectionHeader,
  type RowColumn,
} from "@/components/dmo/verification/VerificationUI";

type CRBHash = {
  id: string;
  certId: string;
  seller: string;
  docType: string;
  hash: string;
  blockNumber: number;
  verified: boolean;
  timestamp: string;
};

const DEMO: CRBHash[] = [
  { id: "CRBH-542", certId: "CRB-OLS-2741", seller: "OLS Karachi", docType: "Legal License", hash: "0x88de…9042", blockNumber: 19482287, verified: true, timestamp: "2026-04-11T10:12:00Z" },
  { id: "CRBH-541", certId: "CRB-WMS-2701", seller: "WMS Mumbai", docType: "Medical Certificate", hash: "0x7c01…3fa6", blockNumber: 19482250, verified: true, timestamp: "2026-04-11T09:48:00Z" },
  { id: "CRBH-540", certId: "CRB-AGTS-2680", seller: "AGTS Dubai", docType: "Travel License", hash: "0xee5a…b1c2", blockNumber: 19482211, verified: true, timestamp: "2026-04-11T09:20:00Z" },
  { id: "CRBH-539", certId: "CRB-GoSellr-2654", seller: "GoSellr Lahore", docType: "Commerce Certificate", hash: "0x12aa…7765", blockNumber: 19482100, verified: true, timestamp: "2026-04-11T08:30:00Z" },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function CRBHashesPage() {
  const stats = useMemo(
    () => ({
      total: DEMO.length,
      verified: DEMO.filter((h) => h.verified).length,
    }),
    []
  );

  const columns: RowColumn<CRBHash>[] = [
    {
      key: "cert",
      header: "Certificate",
      width: "minmax(0,1.2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/55">{r.certId}</div>
          <div className="text-[10px] text-white/50">{r.seller}</div>
        </div>
      ),
    },
    {
      key: "doctype",
      header: "Doc Type",
      width: "minmax(0,1fr)",
      render: (r) => <span className="text-sm text-white/80">{r.docType}</span>,
    },
    {
      key: "hash",
      header: "Hash",
      width: "minmax(0,1fr)",
      render: (r) => <span className="font-mono text-[11px] text-white/70">{r.hash}</span>,
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
      width: "minmax(0,0.9fr)",
      render: (r) => <span className="text-[10px] text-white/55">{fmtTime(r.timestamp)}</span>,
    },
    {
      key: "status",
      header: "Verified",
      width: "minmax(0,0.6fr)",
      render: (r) => <VerificationChip tone={r.verified ? "green" : "amber"}>{r.verified ? "Yes" : "No"}</VerificationChip>,
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
              <span className="text-[#2BBFA0]">CRB Hashes</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">CRB Certificate Hashes</h1>
            <p className="max-w-2xl text-sm text-white/65">All CRB certificates with blockchain verification status.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="cyan" label="Total certs" value={stats.total} sub="on-chain" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Verified" value={stats.verified} sub="all confirmed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Pending" value="0" sub="none waiting" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Latest" value="CRBH-542" sub="10:12 UTC" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="CRB certificate records" hint={`${DEMO.length} certificate(s) · all verified`} />
        <VerificationRowGrid<CRBHash>
          rows={DEMO}
          columns={columns}
          emptyTitle="No certificates found"
          emptyHint="CRB hashes will appear here."
        />
      </section>
    </div>
  );
}
