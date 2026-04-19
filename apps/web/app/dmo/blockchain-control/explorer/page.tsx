"use client";

/**
 * DMO — Blockchain Control: Mini Explorer
 *   - Search by hash/address
 *   - View transaction details
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type SearchResult = {
  type: "hash" | "address" | "block" | "none";
  data?: any;
};

const SAMPLE_RESULTS: Record<string, SearchResult> = {
  "0xa1f2c7e8": {
    type: "hash",
    data: {
      hash: "0xa1f2c7e8",
      block: 19482301,
      timestamp: "2026-04-11T10:40:00Z",
      method: "anchorSTLSnapshot",
      from: "0x...5f2a",
      value: "0.0 DOT",
      gas: "12.4 gwei",
      status: "confirmed",
    },
  },
  "19482301": {
    type: "block",
    data: {
      number: 19482301,
      timestamp: "2026-04-11T10:40:00Z",
      transactions: 847,
      miner: "Polkadot validator node 23",
      gasUsed: "28.4 DOT",
      gasLimit: "30.0 DOT",
    },
  },
};

export default function ExplorerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<SearchResult>({ type: "none" });

  function handleSearch() {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResult({ type: "none" });
      return;
    }
    const found = SAMPLE_RESULTS[trimmed];
    setResult(found ?? { type: "none" });
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Blockchain Control</span>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Explorer</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Mini Blockchain Explorer</h1>
            <p className="max-w-2xl text-sm text-white/65">Search by hash, address, or block number. View transaction details on EHB Polkadot chain.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Chain" value="Polkadot" sub="EHB parachain" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-7-7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="teal" label="Network" value="Mainnet" sub="production" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="green" label="Block height" value="19482301" sub="latest" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Status" value="Healthy" sub="synced" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Search explorer" hint="Try: 0xa1f2c7e8 or 19482301" />
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by tx hash, address, or block number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#2BBFA0]/55"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-4 py-2 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white"
          >
            Search
          </button>
        </div>
      </section>

      {result.type !== "none" && result.data && (
        <section className="rounded-2xl border border-[#2BBFA0]/30 bg-[#13162A]/70 p-5">
          {result.type === "hash" && (
            <div className="space-y-4">
              <SectionHeader title="Transaction Details" subtitle={result.data.hash} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Block</p>
                  <p className="mt-1 text-sm font-mono text-white">#{result.data.block.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Timestamp</p>
                  <p className="mt-1 text-sm text-white/85">{new Date(result.data.timestamp).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Method</p>
                  <p className="mt-1 text-sm text-white/85">{result.data.method}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Gas Used</p>
                  <p className="mt-1 text-sm font-mono text-white">{result.data.gas}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:col-span-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">From</p>
                  <p className="mt-1 text-sm font-mono text-white/70">{result.data.from}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <VerificationChip tone="green">{result.data.status.toUpperCase()}</VerificationChip>
              </div>
            </div>
          )}
          {result.type === "block" && (
            <div className="space-y-4">
              <SectionHeader title="Block Details" subtitle={`Block #${result.data.number.toLocaleString()}`} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Transactions</p>
                  <p className="mt-1 text-sm font-semibold text-white">{result.data.transactions}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Gas Used</p>
                  <p className="mt-1 text-sm font-mono text-white">{result.data.gasUsed}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Timestamp</p>
                  <p className="mt-1 text-sm text-white/85">{new Date(result.data.timestamp).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Miner</p>
                  <p className="mt-1 text-sm text-white/70">{result.data.miner}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {result.type === "none" && searchTerm && (
        <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-12 text-center">
          <p className="text-white/65">No results found for "{searchTerm}". Try a transaction hash or block number.</p>
          <p className="mt-2 text-[12px] text-white/45">Sample: 0xa1f2c7e8 or 19482301</p>
        </section>
      )}
    </div>
  );
}
