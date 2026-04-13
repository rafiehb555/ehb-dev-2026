"use client";

/**
 * DMO — Blockchain Control
 *   - VerificationUI primitives only (no <table>, no local Kpi/Row)
 *   - Gradient accent bars, corner decorations
 *   - On-chain anchor viewer + gas budget + STL rotation
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

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type AnchorKind = "STL_SNAPSHOT" | "CRB_CERT" | "WALLET_ESCROW" | "AUDIT_LOG";
type AnchorStatus = "confirmed" | "pending" | "failed";

type OnChainAnchor = {
  id: string;
  kind: AnchorKind;
  hash: string;
  block: number;
  when: string;
  status: AnchorStatus;
  gasUsedGwei: number;
};

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const DEMO: OnChainAnchor[] = [
  { id: "BC-88210", kind: "STL_SNAPSHOT", hash: "0xa1f2…c7e8", block: 19_482_301, when: "2026-04-11T10:40:00Z", status: "confirmed", gasUsedGwei: 12.4 },
  { id: "BC-88209", kind: "CRB_CERT", hash: "0x88de…9042", block: 19_482_287, when: "2026-04-11T10:12:00Z", status: "confirmed", gasUsedGwei: 9.8 },
  { id: "BC-88208", kind: "WALLET_ESCROW", hash: "0x7c01…3fa6", block: 19_482_250, when: "2026-04-11T09:48:00Z", status: "pending", gasUsedGwei: 0 },
  { id: "BC-88207", kind: "AUDIT_LOG", hash: "0xee5a…b1c2", block: 19_482_211, when: "2026-04-11T09:20:00Z", status: "confirmed", gasUsedGwei: 4.1 },
  { id: "BC-88206", kind: "STL_SNAPSHOT", hash: "0x12aa…7765", block: 19_482_100, when: "2026-04-11T08:30:00Z", status: "failed", gasUsedGwei: 0 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const KIND_TONE: Record<AnchorKind, VerificationTone> = {
  STL_SNAPSHOT: "purple",
  CRB_CERT: "cyan",
  WALLET_ESCROW: "amber",
  AUDIT_LOG: "teal",
};

const STATUS_TONE: Record<AnchorStatus, VerificationTone> = {
  confirmed: "green",
  pending: "amber",
  failed: "red",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function MetricRow({ label, value, hex }: { label: string; value: string; hex: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1A1D33]/70 p-3 transition-colors hover:border-white/18 hover:bg-[#1A1D33]/90">
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/55">{label}</span>
      <span className="text-sm font-semibold" style={{ color: hex }}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BlockchainControlPage() {
  const [filter, setFilter] = useState<"ALL" | AnchorKind>("ALL");
  const [active, setActive] = useState<OnChainAnchor | null>(null);

  const visible = useMemo(
    () => (filter === "ALL" ? DEMO : DEMO.filter((a) => a.kind === filter)),
    [filter]
  );

  const kpis = useMemo(
    () => ({
      anchors24h: DEMO.length,
      confirmed: DEMO.filter((a) => a.status === "confirmed").length,
      pending: DEMO.filter((a) => a.status === "pending").length,
      failed: DEMO.filter((a) => a.status === "failed").length,
    }),
    []
  );

  const columns: RowColumn<OnChainAnchor>[] = [
    {
      key: "anchor",
      header: "Anchor",
      width: "minmax(0,1.4fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.id}</div>
          <div className="text-[10px] text-white/50">{fmtTime(r.when)}</div>
        </div>
      ),
    },
    {
      key: "kind",
      header: "Kind",
      width: "minmax(0,1.1fr)",
      render: (r) => (
        <VerificationChip tone={KIND_TONE[r.kind]}>
          {r.kind.replace(/_/g, " ")}
        </VerificationChip>
      ),
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
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="font-mono text-[11px] text-white/70">#{r.block.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.9fr)",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip>,
    },
    {
      key: "gas",
      header: "Gas",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-[11px] text-white/70">
          {r.gasUsedGwei > 0 ? `${r.gasUsedGwei.toFixed(1)} gwei` : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#2BBFA0]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Blockchain</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Blockchain Control</h1>
            <p className="max-w-2xl text-sm text-white/65">
              EHB Polkadot layer pa STL snapshots, CRB certificates, wallet escrow aur audit
              logs ke on-chain anchors. Har anchor ka explorer deep-link + gas monitor yahaan
              milega.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0]">
              Chain: Polkadot · healthy
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Anchors (24h)"
          value={kpis.anchors24h}
          sub="total on-chain writes"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="green"
          label="Confirmed"
          value={kpis.confirmed}
          sub="finalized on chain"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Pending"
          value={kpis.pending}
          sub="awaiting confirmation"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Failed"
          value={kpis.failed}
          sub="needs retry"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
      </section>

      {/* Status distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Anchor health" hint="Confirmed vs pending vs failed" />
        <SeverityMeter
          segments={[
            { label: "Confirmed", value: kpis.confirmed, tone: "green" },
            { label: "Pending", value: kpis.pending, tone: "amber" },
            { label: "Failed", value: kpis.failed, tone: "red" },
          ]}
        />
      </section>

      {/* Anchors grid */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          eyebrow="Polkadot EHB parachain"
          title="Recent anchors"
          hint="Latest first · click row for detail"
          right={<span className="text-[10px] text-white/45">{visible.length} anchor(s)</span>}
        />
        <div className="mt-3">
          <FilterChipRow<"ALL" | AnchorKind>
            options={[
              { value: "ALL", label: `All · ${DEMO.length}` },
              { value: "STL_SNAPSHOT", label: "STL snapshot" },
              { value: "CRB_CERT", label: "CRB cert" },
              { value: "WALLET_ESCROW", label: "Wallet escrow" },
              { value: "AUDIT_LOG", label: "Audit log" },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<OnChainAnchor>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No anchors in this filter"
            emptyHint="Adjust filter to see on-chain records."
          />
        </div>
      </section>

      {/* Info panels */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-[#13162A]/60 p-5 pt-[22px]">
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
            style={{ background: "linear-gradient(90deg, transparent, #7B6EF6, transparent)" }}
          />
          <div className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 rounded-tl border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
          <SectionHeader title="STL proof rotation" hint="Daily seller STL snapshots Merkle root" />
          <div className="mt-3 space-y-2">
            <MetricRow label="Last rotation" value="10:40 UTC" hex="#2BBFA0" />
            <MetricRow label="Next rotation" value="in 14h 20m" hex="#A098F8" />
            <MetricRow label="Sellers in snapshot" value="4,812" hex="#FFFFFF" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#13162A]/60 p-5 pt-[22px]">
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
            style={{ background: "linear-gradient(90deg, transparent, #67E8F9, transparent)" }}
          />
          <div className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 rounded-tl border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
          <SectionHeader title="Gas budget" hint="Monthly gas envelope + consumption curve" />
          <div className="mt-3 space-y-2">
            <MetricRow label="Budget (April)" value="1.20 DOT" hex="#FFFFFF" />
            <MetricRow label="Used so far" value="0.43 DOT (36%)" hex="#38C878" />
            <MetricRow label="Est. month-end" value="1.06 DOT (88%)" hex="#F0A030" />
          </div>
        </div>
      </section>

      {/* Drawer */}
      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.kind.replace(/_/g, " ")} anchor` : "Anchor detail"}
        subtitle={active ? `${active.id} · block #${active.block.toLocaleString()}` : undefined}
        severity={active?.status === "failed" ? "high" : active?.status === "pending" ? "warning" : "info"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={KIND_TONE[active.kind]}>
                {active.kind.replace(/_/g, " ")}
              </VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Anchor ID" value={active.id} mono />
              <InfoCell label="Block" value={`#${active.block.toLocaleString()}`} mono />
              <InfoCell label="Hash" value={active.hash} mono />
              <InfoCell label="Gas" value={active.gasUsedGwei > 0 ? `${active.gasUsedGwei} gwei` : "—"} mono />
              <InfoCell label="Timestamp" value={fmtTime(active.when)} />
              <InfoCell label="Status" value={active.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-2 text-[11px] font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/20"
              >
                View in explorer
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20"
              >
                Retry anchor
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
