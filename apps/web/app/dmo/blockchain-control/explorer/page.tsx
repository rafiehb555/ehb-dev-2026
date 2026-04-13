"use client";

/**
 * DMO — Blockchain Control — Explorer
 *   - Browse recent blockchain transactions and blocks
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

type TransactionType = "STL_PROOF" | "CRB_HASH" | "ESCROW_RELEASE" | "REWARD_DIST";

type ExplorerRow = {
  id: string;
  blockNumber: number;
  txHash: string;
  txType: TransactionType;
  from: string;
  to: string;
  timestamp: string;
  gasUsed: number;
};

/* ── Demo data — 10 realistic blockchain transactions ── */
const DEMO: ExplorerRow[] = [
  {
    id: "TX-001",
    blockNumber: 14892,
    txHash: "0x7f3a4b2e8c9d1f5a6b8e9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    txType: "STL_PROOF",
    from: "0x1234567890abcdef1234567890abcdef12345678",
    to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    timestamp: "2026-04-12T14:32:15Z",
    gasUsed: 145230,
  },
  {
    id: "TX-002",
    blockNumber: 14892,
    txHash: "0x8e4c5d3f7a9b2e6c1d4f8a5b9e2c3f7a6d9c1e4f5a6b7c8d9e0f1a2b3c4d",
    txType: "CRB_HASH",
    from: "0x2345678901bcdef02345678901bcdef023456789",
    to: "0xbcdefabcdefabcdefabcdefabcdefabcdefabcd",
    timestamp: "2026-04-12T14:31:42Z",
    gasUsed: 142180,
  },
  {
    id: "TX-003",
    blockNumber: 14891,
    txHash: "0x9c5e6a4f8b2d1e7c3f5a9b4e2d8c1f7a5b9e2c3f5a6b7c8d9e0f1a2b3c4d",
    txType: "ESCROW_RELEASE",
    from: "0x3456789012cdef13456789012cdef123456789a",
    to: "0xcdefabcdefabcdefabcdefabcdefabcdefabcde",
    timestamp: "2026-04-12T14:28:03Z",
    gasUsed: 189450,
  },
  {
    id: "TX-004",
    blockNumber: 14891,
    txHash: "0xa1d3f5b8c4e7a2c9f6d1e3b8a5c7f2d9e4a1c6b3f8a1d4e7a0b3c6d9e2f5",
    txType: "REWARD_DIST",
    from: "0x456789abcdef456789abcdef456789abcdef4567",
    to: "0xdefabcdefabcdefabcdefabcdefabcdefabcdef",
    timestamp: "2026-04-12T14:25:18Z",
    gasUsed: 127820,
  },
  {
    id: "TX-005",
    blockNumber: 14890,
    txHash: "0xb2e4f6c9d5a8b1e3f7c2d4a9b6e1f8c3d5a7e2f9a2b5c8d1e4f7a0b3c6d9",
    txType: "STL_PROOF",
    from: "0x5678abcdef5678abcdef5678abcdef5678abcde",
    to: "0xefabcdefabcdefabcdefabcdefabcdefabcdef0",
    timestamp: "2026-04-12T14:22:45Z",
    gasUsed: 144820,
  },
  {
    id: "TX-006",
    blockNumber: 14890,
    txHash: "0xc3f5a7d1e8c2f4b9d6a3e1c7f2b9d4a6e3f1c8b5f2a5d8e1a4c7f0b3d6e9",
    txType: "CRB_HASH",
    from: "0x6789cdef6789cdef6789cdef6789cdef6789cde",
    to: "0xf0abcdefabcdefabcdefabcdefabcdefabcdef1",
    timestamp: "2026-04-12T14:20:12Z",
    gasUsed: 139280,
  },
  {
    id: "TX-007",
    blockNumber: 14889,
    txHash: "0xd4a6b8e2f9c3d5a1f8d4b7e2c9f3a5d7e1f4c8b2f5a8c1d4e7a0b3c6d9e2",
    txType: "ESCROW_RELEASE",
    from: "0x789adef0789adef0789adef0789adef0789adef",
    to: "0xf1bcdefabcdefabcdefabcdefabcdefabcdef2",
    timestamp: "2026-04-12T14:18:36Z",
    gasUsed: 186950,
  },
  {
    id: "TX-008",
    blockNumber: 14889,
    txHash: "0xe5b7c9f3a1d8e2c6f4b9d7a2e5f3c8d1f6a9c3e7f0a3b6c9d2e5f8a1b4c",
    txType: "REWARD_DIST",
    from: "0x89abef1089abef1089abef1089abef1089abef1",
    to: "0xf2cdefabcdefabcdefabcdefabcdefabcdef3",
    timestamp: "2026-04-12T14:16:08Z",
    gasUsed: 128340,
  },
  {
    id: "TX-009",
    blockNumber: 14888,
    txHash: "0xf6c8a0e4b2d7f1c5a9e3b8d2f7a1c6e0b5d9f3c7a1b4e7d0a3c6f9b2e5a8",
    txType: "STL_PROOF",
    from: "0x9abf021a9abf021a9abf021a9abf021a9abf021",
    to: "0xf3defabcdefabcdefabcdefabcdefabcdef4",
    timestamp: "2026-04-12T14:13:22Z",
    gasUsed: 145680,
  },
  {
    id: "TX-010",
    blockNumber: 14888,
    txHash: "0xa7d9b1f5c3e8a2d6f0c4e9b3d7f2a6c0e5b9d3f7a1b5c9d3e7f1a5b9d3e7",
    txType: "CRB_HASH",
    from: "0xabcf1320bcf1320bcf1320bcf1320bcf1320bcf",
    to: "0xf4efabcdefabcdefabcdefabcdefabcdef5",
    timestamp: "2026-04-12T14:10:45Z",
    gasUsed: 140120,
  },
];

const TX_TYPE_TONE: Record<TransactionType, VerificationTone> = {
  STL_PROOF: "teal",
  CRB_HASH: "purple",
  ESCROW_RELEASE: "green",
  REWARD_DIST: "cyan",
};

const TX_TYPE_NAMES: Record<TransactionType, string> = {
  STL_PROOF: "STL Proof",
  CRB_HASH: "CRB Hash",
  ESCROW_RELEASE: "Escrow Release",
  REWARD_DIST: "Reward Distribution",
};

function fmtHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function fmtAddress(addr: string): string {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
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

export default function BlockchainExplorerPage() {
  const [rows] = useState<ExplorerRow[]>(DEMO);
  const [typeFilter, setTypeFilter] = useState<"ALL" | TransactionType>("ALL");
  const [selected, setSelected] = useState<ExplorerRow | null>(null);

  const stats = useMemo(() => {
    const blocks = new Set(rows.map((r) => r.blockNumber));
    const maxBlock = Math.max(...rows.map((r) => r.blockNumber));
    const txTypes = { STL_PROOF: 0, CRB_HASH: 0, ESCROW_RELEASE: 0, REWARD_DIST: 0 };

    for (const row of rows) {
      txTypes[row.txType] += 1;
    }

    const totalGas = rows.reduce((sum, r) => sum + r.gasUsed, 0);
    const avgBlockTime = 6; // demo constant

    return {
      totalBlocks: maxBlock,
      transactions: rows.length,
      avgBlockTime,
      networkHealth: "99.8%",
      gasUsed: totalGas,
    };
  }, [rows]);

  const txBreakdown = useMemo(() => {
    const by: Record<TransactionType, number> = {
      STL_PROOF: 0,
      CRB_HASH: 0,
      ESCROW_RELEASE: 0,
      REWARD_DIST: 0,
    };
    for (const r of rows) {
      by[r.txType] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (typeFilter !== "ALL" && r.txType !== typeFilter) return false;
    return true;
  });

  const columns: RowColumn<ExplorerRow>[] = [
    {
      key: "block",
      header: "Block",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-white">
          {r.blockNumber}
        </span>
      ),
    },
    {
      key: "txHash",
      header: "Transaction Hash",
      width: "minmax(0,1.3fr)",
      render: (r) => (
        <span className="font-mono text-[9px] text-white/55">
          {fmtHash(r.txHash)}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "minmax(0,1.0fr)",
      render: (r) => (
        <VerificationChip tone={TX_TYPE_TONE[r.txType]} size="xs">
          {TX_TYPE_NAMES[r.txType]}
        </VerificationChip>
      ),
    },
    {
      key: "from",
      header: "From",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="font-mono text-[9px] text-white/55">
          {fmtAddress(r.from)}
        </span>
      ),
    },
    {
      key: "to",
      header: "To",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="font-mono text-[9px] text-white/55">
          {fmtAddress(r.to)}
        </span>
      ),
    },
    {
      key: "time",
      header: "Time",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">
          {fmtTime(r.timestamp)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#67E8F9]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #67E8F9 25%, #2BBFA0 50%, #7B6EF6 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#67E8F9]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#67E8F9]/14 via-[#2BBFA0]/10 to-transparent blur-3xl" />

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
            <span className="text-white/75">Explorer</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Block Explorer
          </h1>
          <p className="text-sm text-white/55">
            Browse recent blocks and transactions on the EHB Polkadot chain
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
          label="Total Blocks"
          value={stats.totalBlocks}
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
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          }
          label="Transactions"
          value={stats.transactions}
          tone="purple"
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
          label="Avg Block Time"
          value={`${stats.avgBlockTime}s`}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          label="Network Health"
          value={stats.networkHealth}
          tone="green"
        />
      </div>

      {/* Transaction type breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Transaction Distribution"
          title="By Type"
          hint="Breakdown of recent transactions"
        />
        <SeverityMeter
          segments={[
            {
              label: "STL Proofs",
              value: txBreakdown.STL_PROOF,
              tone: "teal",
            },
            {
              label: "CRB Hashes",
              value: txBreakdown.CRB_HASH,
              tone: "purple",
            },
            {
              label: "Escrow",
              value: txBreakdown.ESCROW_RELEASE,
              tone: "green",
            },
            {
              label: "Rewards",
              value: txBreakdown.REWARD_DIST,
              tone: "cyan",
            },
          ]}
        />
      </div>

      {/* Filter */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Type
        </p>
        <FilterChipRow<"ALL" | TransactionType>
          value={typeFilter}
          options={[
            { value: "ALL", label: "All Types" },
            { value: "STL_PROOF", label: "STL Proofs" },
            { value: "CRB_HASH", label: "CRB Hashes" },
            { value: "ESCROW_RELEASE", label: "Escrow Release" },
            { value: "REWARD_DIST", label: "Reward Distribution" },
          ]}
          onChange={setTypeFilter}
        />
      </div>

      {/* Transactions grid */}
      <VerificationRowGrid<ExplorerRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => TX_TYPE_TONE[r.txType]}
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
        emptyTitle="No transactions match filters"
        emptyHint="Try adjusting your type filter to see transactions"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Transaction detail"}
        subtitle={selected ? `${TX_TYPE_NAMES[selected.txType]} on Block ${selected.blockNumber}` : ""}
        severity="info"
      >
        {selected ? (
          <div className="space-y-4">
            {/* Transaction overview */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="Block"
                value={selected.blockNumber}
                mono
              />
              <InfoCell
                label="Type"
                value={
                  <VerificationChip tone={TX_TYPE_TONE[selected.txType]} size="xs">
                    {TX_TYPE_NAMES[selected.txType]}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Timestamp"
                value={fmtTime(selected.timestamp)}
              />
              <InfoCell
                label="Gas Used"
                value={selected.gasUsed.toLocaleString()}
                mono
              />
            </div>

            {/* Transaction hash */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Transaction Hash
              </p>
              <p className="mt-2 break-all font-mono text-[10px] text-white/70">
                {selected.txHash}
              </p>
            </div>

            {/* From/To addresses */}
            <div className="space-y-2">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  From Address
                </p>
                <p className="mt-2 break-all font-mono text-[10px] text-white/70">
                  {selected.from}
                </p>
              </div>

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  To Address
                </p>
                <p className="mt-2 break-all font-mono text-[10px] text-white/70">
                  {selected.to}
                </p>
              </div>
            </div>

            {/* Transaction detail */}
            <div className="rounded-xl border border-[#2BBFA0]/30 bg-[#2BBFA0]/8 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-white/90">
                Confirmed on Polkadot
              </p>
              <p className="mt-1 text-[10px] text-white/60">
                Block #{selected.blockNumber} · Gas: {selected.gasUsed.toLocaleString()} · Success
              </p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
