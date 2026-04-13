"use client";

/**
 * DMO — Blockchain Control — STL Proofs
 *   - On-chain STL level verification proofs (Polkadot-based)
 *   - VerificationUI primitives (no framer-motion, no emojis, no legacy classes)
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

type ProofStatus = "VERIFIED" | "PENDING" | "FAILED";

type StlProofRow = {
  id: string;
  entityName: string;
  stlLevel: number;
  proofHash: string;
  chainBlock: number;
  verifiedAt: string;
  status: ProofStatus;
  gasUsed: number;
};

/* ── Demo data — 8 realistic on-chain STL proofs ── */
const DEMO: StlProofRow[] = [
  {
    id: "PROOF-STL-001",
    entityName: "Muhammad Ali Khan",
    stlLevel: 7,
    proofHash: "0x7f3a4b2e8c9d1f5a6b8e9c0d1e2f3a4b5c6d7e8f",
    chainBlock: 14892,
    verifiedAt: "2026-04-11T14:32:00Z",
    status: "VERIFIED",
    gasUsed: 145230,
  },
  {
    id: "PROOF-STL-002",
    entityName: "TechVision Solutions",
    stlLevel: 6,
    proofHash: "0x8e4c5d3f7a9b2e6c1d4f8a5b9e2c3f7a6d9c1e4f",
    chainBlock: 14890,
    verifiedAt: "2026-04-11T13:15:00Z",
    status: "VERIFIED",
    gasUsed: 142180,
  },
  {
    id: "PROOF-STL-003",
    entityName: "Fatima Noor Ahmed",
    stlLevel: 5,
    proofHash: "0x9c5e6a4f8b2d1e7c3f5a9b4e2d8c1f7a5b9e2c3d",
    chainBlock: 14888,
    verifiedAt: "2026-04-11T11:48:00Z",
    status: "VERIFIED",
    gasUsed: 139450,
  },
  {
    id: "PROOF-STL-004",
    entityName: "Usman Raza",
    stlLevel: 4,
    proofHash: "0xa1d3f5b8c4e7a2c9f6d1e3b8a5c7f2d9e4a1c6b3",
    chainBlock: 14886,
    verifiedAt: "2026-04-11T10:22:00Z",
    status: "VERIFIED",
    gasUsed: 137820,
  },
  {
    id: "PROOF-STL-005",
    entityName: "Saif Ul Islam",
    stlLevel: 3,
    proofHash: "0xb2e4f6c9d5a8b1e3f7c2d4a9b6e1f8c3d5a7e2f9",
    chainBlock: 14884,
    verifiedAt: "2026-04-11T09:10:00Z",
    status: "PENDING",
    gasUsed: 0,
  },
  {
    id: "PROOF-STL-006",
    entityName: "Elite Trading Company",
    stlLevel: 8,
    proofHash: "0xc3f5a7d1e8c2f4b9d6a3e1c7f2b9d4a6e3f1c8b5",
    chainBlock: 14882,
    verifiedAt: "2026-04-11T08:05:00Z",
    status: "FAILED",
    gasUsed: 156200,
  },
  {
    id: "PROOF-STL-007",
    entityName: "Sara Malik",
    stlLevel: 6,
    proofHash: "0xd4a6b8e2f9c3d5a1f8d4b7e2c9f3a5d7e1f4c8b2",
    chainBlock: 14880,
    verifiedAt: "2026-04-11T07:30:00Z",
    status: "VERIFIED",
    gasUsed: 141950,
  },
  {
    id: "PROOF-STL-008",
    entityName: "Hassan Rauf",
    stlLevel: 5,
    proofHash: "0xe5b7c9f3a1d8e2c6f4b9d7a2e5f3c8d1f6a9c3e7",
    chainBlock: 14878,
    verifiedAt: "2026-04-11T06:45:00Z",
    status: "VERIFIED",
    gasUsed: 139680,
  },
];

const STATUS_TONE: Record<ProofStatus, VerificationTone> = {
  VERIFIED: "green",
  PENDING: "amber",
  FAILED: "red",
};

function fmtHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function InfoCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function BlockchainStlProofsPage() {
  const [rows] = useState<StlProofRow[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProofStatus>("ALL");
  const [selected, setSelected] = useState<StlProofRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      totalProofs: rows.length,
      thisMonth: rows.filter((r) => {
        const d = new Date(r.verifiedAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      verified: rows.filter((r) => r.status === "VERIFIED").length,
      failed: rows.filter((r) => r.status === "FAILED").length,
    };
    return st;
  }, [rows]);

  const statusBreakdown = useMemo(() => {
    const by: Record<ProofStatus, number> = { VERIFIED: 0, PENDING: 0, FAILED: 0 };
    for (const r of rows) {
      by[r.status] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<StlProofRow>[] = [
    {
      key: "id",
      header: "Proof ID",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0,1.4fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.entityName}
          </div>
        </div>
      ),
    },
    {
      key: "stl",
      header: "STL Level",
      width: "minmax(0,0.6fr)",
      align: "center",
      render: (r) => (
        <span className="inline-block rounded-lg bg-[#7B6EF6]/20 px-2.5 py-1 text-[10px] font-bold text-[#A098F8]">
          L{r.stlLevel}
        </span>
      ),
    },
    {
      key: "hash",
      header: "Proof Hash",
      width: "minmax(0,1.2fr)",
      render: (r) => (
        <span className="font-mono text-[9px] text-white/55">
          {fmtHash(r.proofHash)}
        </span>
      ),
    },
    {
      key: "block",
      header: "Block #",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm text-white/70">
          {r.chainBlock}
        </span>
      ),
    },
    {
      key: "verified",
      header: "Verified At",
      width: "minmax(0,1.1fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">
          {fmtTime(r.verifiedAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <VerificationChip tone={STATUS_TONE[r.status]} size="xs">
          {r.status}
        </VerificationChip>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#2BBFA0]/14 via-[#7B6EF6]/10 to-transparent blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/55">
            <Link
              href="/dmo"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              DMO
            </Link>
            <span>/</span>
            <Link
              href="/dmo/blockchain-control"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              Blockchain Control
            </Link>
            <span>/</span>
            <span className="text-white/75">STL Proofs</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            STL Verification Proofs
          </h1>
          <p className="text-sm text-white/55">
            On-chain STL level verification proofs anchored to Polkadot blockchain
          </p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
              <polyline points="12 12 20 7.5" />
              <polyline points="12 12 12 21" />
              <polyline points="12 12 4 7.5" />
            </svg>
          }
          label="Total Proofs"
          value={stats.totalProofs}
          tone="cyan"
        />
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          label="This Month"
          value={stats.thisMonth}
          tone="teal"
        />
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4l-8.97 8.97" />
            </svg>
          }
          label="Verified"
          value={stats.verified}
          tone="green"
        />
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          label="Failed"
          value={stats.failed}
          tone="red"
        />
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Proof Health"
          title="Verification Status Distribution"
          hint="Current status of all on-chain STL proofs"
        />
        <SeverityMeter
          segments={[
            {
              label: "Verified",
              value: statusBreakdown.VERIFIED,
              tone: "green",
            },
            {
              label: "Pending",
              value: statusBreakdown.PENDING,
              tone: "amber",
            },
            {
              label: "Failed",
              value: statusBreakdown.FAILED,
              tone: "red",
            },
          ]}
        />
      </div>

      {/* Filter */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Status
        </p>
        <FilterChipRow<"ALL" | ProofStatus>
          value={statusFilter}
          options={[
            { value: "ALL", label: "All" },
            { value: "VERIFIED", label: "Verified" },
            { value: "PENDING", label: "Pending" },
            { value: "FAILED", label: "Failed" },
          ]}
          onChange={setStatusFilter}
        />
      </div>

      {/* Proofs grid */}
      <VerificationRowGrid<StlProofRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => STATUS_TONE[r.status]}
        emptyIcon={
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
            <polyline points="12 12 20 7.5" />
            <polyline points="12 12 12 21" />
            <polyline points="12 12 4 7.5" />
          </svg>
        }
        emptyTitle="No proofs match filters"
        emptyHint="Try adjusting your status filter to see STL proofs"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Proof detail"}
        subtitle={selected ? `STL L${selected.stlLevel} — ${selected.entityName}` : ""}
        severity={
          selected
            ? selected.status === "FAILED"
              ? "critical"
              : selected.status === "PENDING"
              ? "warning"
              : "info"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Proof info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="Proof ID"
                value={selected.id}
                mono
              />
              <InfoCell
                label="STL Level"
                value={`L${selected.stlLevel}`}
                mono
              />
              <InfoCell
                label="Entity"
                value={selected.entityName}
              />
              <InfoCell
                label="Status"
                value={
                  <VerificationChip tone={STATUS_TONE[selected.status]} size="xs">
                    {selected.status}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Block Number"
                value={selected.chainBlock}
                mono
              />
              <InfoCell
                label="Verified At"
                value={fmtTime(selected.verifiedAt)}
              />
            </div>

            {/* Hash detail */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Proof Hash
              </p>
              <p className="mt-2 break-all font-mono text-[10px] text-white/70">
                {selected.proofHash}
              </p>
            </div>

            {/* Gas info */}
            {selected.status === "VERIFIED" && (
              <div className="rounded-xl border border-[#2BBFA0]/30 bg-[#2BBFA0]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                  On-Chain Deployment
                </p>
                <div className="mt-2 space-y-1 text-sm text-white/80">
                  <p>Gas Used: {selected.gasUsed.toLocaleString()}</p>
                  <p>Block: #{selected.chainBlock}</p>
                  <p>Status: Successfully anchored to Polkadot</p>
                </div>
              </div>
            )}

            {/* Verification action */}
            {selected.status === "FAILED" && (
              <div className="rounded-xl border border-[#F05858]/30 bg-[#F05858]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F05858]/70">
                  Verification Failed
                </p>
                <p className="mt-2 text-sm text-white/80">
                  This proof failed on-chain verification. Check entity STL data and retry.
                </p>
              </div>
            )}

            {selected.status === "PENDING" && (
              <div className="rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F0A030]/70">
                  Awaiting Confirmation
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Proof submitted and awaiting on-chain confirmation. Typically processes within 5-10 minutes.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
