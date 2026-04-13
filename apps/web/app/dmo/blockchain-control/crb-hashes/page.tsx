"use client";

/**
 * DMO — Blockchain Control — CRB Hashes
 *   - Blockchain hash records for CRB certificates
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

type HashStatus = "ANCHORED" | "PENDING" | "REVOKED";

type CrbHashRow = {
  id: string;
  certId: string;
  entityName: string;
  hashValue: string;
  anchoredAt: string;
  blockNumber: number;
  status: HashStatus;
};

/* ── Demo data — 8 realistic CRB certificate hashes ── */
const DEMO: CrbHashRow[] = [
  {
    id: "HASH-CRB-001",
    certId: "CRB-2026-04-001",
    entityName: "Muhammad Ali Khan",
    hashValue: "0xa1f5c2e7b9d3f4a8c1e5b9f2a6d3c7e1f4a8b2c5",
    anchoredAt: "2026-04-11T14:22:00Z",
    blockNumber: 14892,
    status: "ANCHORED",
  },
  {
    id: "HASH-CRB-002",
    certId: "CRB-2026-04-002",
    entityName: "TechVision Solutions",
    hashValue: "0xb2e6d3f8c4a9b1d7e2f5c8a3b6e1f4c7d2a5e8f1",
    anchoredAt: "2026-04-11T13:55:00Z",
    blockNumber: 14890,
    status: "ANCHORED",
  },
  {
    id: "HASH-CRB-003",
    certId: "CRB-2026-04-003",
    entityName: "Fatima Noor Ahmed",
    hashValue: "0xc3f7e4a9d5b2c8f1e3a7d4b9c6f2e5a8d1c4f7b2",
    anchoredAt: "2026-04-11T12:30:00Z",
    blockNumber: 14888,
    status: "ANCHORED",
  },
  {
    id: "HASH-CRB-004",
    certId: "CRB-2026-04-004",
    entityName: "Usman Raza",
    hashValue: "0xd4a8f5b3c6e2a9f4d7c1e5b8f2a6d9c3e7f1a4b5",
    anchoredAt: "2026-04-11T11:12:00Z",
    blockNumber: 14886,
    status: "PENDING",
  },
  {
    id: "HASH-CRB-005",
    certId: "CRB-2026-03-045",
    entityName: "Saif Ul Islam",
    hashValue: "0xe5b9a6c4d7e3f1a8c2f5b9d4a7e2c6f1a5d8e3b7",
    anchoredAt: "2026-03-15T09:45:00Z",
    blockNumber: 14712,
    status: "REVOKED",
  },
  {
    id: "HASH-CRB-006",
    certId: "CRB-2026-04-005",
    entityName: "Elite Trading Company",
    hashValue: "0xf6c1a7d5e8f2b4c9a3f6d1e8c2b5a8f3d7e2c5f9",
    anchoredAt: "2026-04-11T10:08:00Z",
    blockNumber: 14884,
    status: "ANCHORED",
  },
  {
    id: "HASH-CRB-007",
    certId: "CRB-2026-04-006",
    entityName: "Sara Malik",
    hashValue: "0xa7d2b8e6f3c1a9d4f8c2e5b7a3d6c9f2e4a1b5d8",
    anchoredAt: "2026-04-11T09:35:00Z",
    blockNumber: 14882,
    status: "PENDING",
  },
  {
    id: "HASH-CRB-008",
    certId: "CRB-2026-04-007",
    entityName: "Hassan Rauf",
    hashValue: "0xb8e3c9f7a2d5c1f4e6a9b3d7c5f2a8e1d4b7c2f5",
    anchoredAt: "2026-04-11T08:20:00Z",
    blockNumber: 14880,
    status: "ANCHORED",
  },
];

const STATUS_TONE: Record<HashStatus, VerificationTone> = {
  ANCHORED: "green",
  PENDING: "amber",
  REVOKED: "red",
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

export default function BlockchainCrbHashesPage() {
  const [rows] = useState<CrbHashRow[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | HashStatus>("ALL");
  const [selected, setSelected] = useState<CrbHashRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      totalHashes: rows.length,
      active: rows.filter((r) => r.status === "ANCHORED").length,
      revoked: rows.filter((r) => r.status === "REVOKED").length,
      pending: rows.filter((r) => r.status === "PENDING").length,
    };
    return st;
  }, [rows]);

  const statusBreakdown = useMemo(() => {
    const by: Record<HashStatus, number> = { ANCHORED: 0, PENDING: 0, REVOKED: 0 };
    for (const r of rows) {
      by[r.status] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<CrbHashRow>[] = [
    {
      key: "certId",
      header: "Certificate ID",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.certId}
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
      key: "hash",
      header: "Hash Value",
      width: "minmax(0,1.2fr)",
      render: (r) => (
        <span className="font-mono text-[9px] text-white/55">
          {fmtHash(r.hashValue)}
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
          {r.blockNumber}
        </span>
      ),
    },
    {
      key: "anchored",
      header: "Anchored At",
      width: "minmax(0,1.0fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">
          {fmtTime(r.anchoredAt)}
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
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#7B6EF6]/14 via-[#2BBFA0]/10 to-transparent blur-3xl" />

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
            <span className="text-white/75">CRB Hashes</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            CRB Certificate Hashes
          </h1>
          <p className="text-sm text-white/55">
            Blockchain hash records for CRB certificates and credential verification
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
          label="Total Hashes"
          value={stats.totalHashes}
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4l-8.97 8.97" />
            </svg>
          }
          label="Active"
          value={stats.active}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          }
          label="Revoked"
          value={stats.revoked}
          tone="red"
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
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          }
          label="Pending Anchor"
          value={stats.pending}
          tone="amber"
        />
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Hash Status"
          title="Certificate Anchor Distribution"
          hint="Current status of all CRB certificate hashes"
        />
        <SeverityMeter
          segments={[
            {
              label: "Anchored",
              value: statusBreakdown.ANCHORED,
              tone: "green",
            },
            {
              label: "Pending",
              value: statusBreakdown.PENDING,
              tone: "amber",
            },
            {
              label: "Revoked",
              value: statusBreakdown.REVOKED,
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
        <FilterChipRow<"ALL" | HashStatus>
          value={statusFilter}
          options={[
            { value: "ALL", label: "All" },
            { value: "ANCHORED", label: "Anchored" },
            { value: "PENDING", label: "Pending" },
            { value: "REVOKED", label: "Revoked" },
          ]}
          onChange={setStatusFilter}
        />
      </div>

      {/* Hashes grid */}
      <VerificationRowGrid<CrbHashRow>
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
        emptyTitle="No hashes match filters"
        emptyHint="Try adjusting your status filter to see CRB hashes"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Hash detail"}
        subtitle={selected ? `${selected.certId} — ${selected.entityName}` : ""}
        severity={
          selected
            ? selected.status === "REVOKED"
              ? "critical"
              : selected.status === "PENDING"
              ? "warning"
              : "info"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Certificate info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="Cert ID"
                value={selected.certId}
                mono
              />
              <InfoCell
                label="Entity"
                value={selected.entityName}
              />
              <InfoCell
                label="Block #"
                value={selected.blockNumber}
                mono
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
                label="Anchored At"
                value={fmtTime(selected.anchoredAt)}
              />
            </div>

            {/* Hash detail */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Hash Value
              </p>
              <p className="mt-2 break-all font-mono text-[10px] text-white/70">
                {selected.hashValue}
              </p>
            </div>

            {/* Verification status */}
            {selected.status === "ANCHORED" && (
              <div className="rounded-xl border border-[#2BBFA0]/30 bg-[#2BBFA0]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                  Blockchain Verification
                </p>
                <div className="mt-2 space-y-1 text-sm text-white/80">
                  <p>Status: Verified and anchored</p>
                  <p>Block: #{selected.blockNumber}</p>
                  <p>Chain: Polkadot (verified)</p>
                </div>
              </div>
            )}

            {selected.status === "PENDING" && (
              <div className="rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F0A030]/70">
                  Anchoring in Progress
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Hash submitted to blockchain. Awaiting confirmation (typically 5-10 minutes).
                </p>
              </div>
            )}

            {selected.status === "REVOKED" && (
              <div className="rounded-xl border border-[#F05858]/30 bg-[#F05858]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F05858]/70">
                  Certificate Revoked
                </p>
                <p className="mt-2 text-sm text-white/80">
                  This certificate has been revoked. The hash remains on-chain for audit trail purposes.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
