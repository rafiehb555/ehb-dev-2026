"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PSSCaseCard } from "@/components/pss/PSSCaseCard";
import { MOCK_PSS_CASES } from "@/lib/pss/pssMockData";

type Risk = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Platform = "ALL" | "gosellr" | "ols" | "hps" | "jps" | "wms" | "obs";

export default function PSSQueuePage() {
  const [risk, setRisk] = useState<Risk>("ALL");
  const [platform, setPlatform] = useState<Platform>("ALL");

  const filtered = useMemo(() => {
    return MOCK_PSS_CASES.filter((c) => {
      if (risk !== "ALL" && c.risk !== risk) return false;
      if (platform !== "ALL" && c.platform !== platform) return false;
      return true;
    });
  }, [risk, platform]);

  const counts = useMemo(() => {
    const by: Record<Risk, number> = { ALL: MOCK_PSS_CASES.length, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    for (const c of MOCK_PSS_CASES) by[c.risk] += 1;
    return by;
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-7 pb-20 pt-8 text-[#E7E9F5]">
      <div className="mb-5 text-[11px] uppercase tracking-[0.08em] text-[#8A8FAE]">
        EHB · DMO · PSS · <span className="text-[#A098F8]">Operator queue</span>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PSS Operator Queue</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#8A8FAE]">
            Har woh case jo auto-approve nahi hua — manual review, high-risk flag, ya CRB escalation — yahan land karta hai.
            Filter by risk aur platform; row click karein full case drill-in ke liye.
          </p>
        </div>
        <Link
          href="/dmo/pss/rules"
          className="rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/10 px-4 py-2 text-xs font-semibold text-[#A098F8] transition hover:bg-[#7B6EF6]/20"
        >
          Open rule engine →
        </Link>
      </div>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { k: "Pending today", v: "47", c: "#E7E9F5" },
          { k: "Auto-approved", v: "312", c: "#2BBFA0" },
          { k: "Franchise review", v: "28", c: "#F0A030" },
          { k: "CRB escalated", v: "4", c: "#29ABE2" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-white/[0.08] bg-[#13162A] p-4">
            <div className="text-[11px] uppercase tracking-wider text-[#8A8FAE]">{s.k}</div>
            <div className="mt-1 text-3xl font-bold tracking-tight" style={{ color: s.c }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as Risk[]).map((r) => (
          <button
            key={r}
            onClick={() => setRisk(r)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              risk === r
                ? "border-[#7B6EF6] bg-[#7B6EF6]/15 text-[#A098F8]"
                : "border-white/[0.08] bg-[#1A1D33] text-[#8A8FAE] hover:text-[#E7E9F5]"
            }`}
          >
            {r} · {counts[r]}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {(["ALL", "gosellr", "ols", "hps", "jps"] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
                platform === p
                  ? "border-[#2BBFA0] bg-[#2BBFA0]/15 text-[#2BBFA0]"
                  : "border-white/[0.08] bg-[#1A1D33] text-[#8A8FAE] hover:text-[#E7E9F5]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <PSSCaseCard key={c.id} c={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#13162A] p-12 text-center text-sm text-[#8A8FAE]">
          Koi case match nahi kiya. Filter adjust karein.
        </div>
      )}
    </div>
  );
}
