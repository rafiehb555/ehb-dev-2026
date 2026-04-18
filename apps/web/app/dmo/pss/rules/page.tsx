"use client";

import { useState } from "react";
import Link from "next/link";
import { RuleBuilder } from "@/components/pss/RuleBuilder";
import { MOCK_GOSELLR_RULES } from "@/lib/pss/pssMockData";

const PLATFORMS = ["gosellr", "ols", "hps", "jps", "wms", "obs"] as const;
type Platform = (typeof PLATFORMS)[number];

export default function PSSRulesPage() {
  const [platform, setPlatform] = useState<Platform>("gosellr");

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-7 pb-20 pt-8 text-[#E7E9F5]">
      <div className="mb-5 text-[11px] uppercase tracking-[0.08em] text-[#8A8FAE]">
        EHB · DMO · PSS · <span className="text-[#A098F8]">Rule engine</span>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Rule Engine</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#8A8FAE]">
            Priority-ordered routing rules — first match wins. Har platform ke apni rules hain. DMO admin
            inko live edit kar sakta hai; koi hardcoded wall nahi. Action: auto-approve · route to franchise ·
            route to CRB · reject.
          </p>
        </div>
        <Link
          href="/dmo/pss/queue"
          className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] transition hover:text-[#E7E9F5]"
        >
          ← Operator queue
        </Link>
      </div>

      {/* Platform selector */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              platform === p
                ? "border-[#7B6EF6] bg-[#7B6EF6]/15 text-[#A098F8]"
                : "border-white/[0.08] bg-[#1A1D33] text-[#8A8FAE] hover:text-[#E7E9F5]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat k="Active rules" v="5" c="#A098F8" />
        <Stat k="Decisions/day" v="2,148" c="#E7E9F5" />
        <Stat k="Auto-approve rate" v="86%" c="#2BBFA0" />
        <Stat k="Avg decision time" v="312ms" c="#F0A030" />
      </div>

      {/* Rules */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            <span className="uppercase tracking-wider text-[#8A8FAE]">Rules for</span>{" "}
            <span className="text-[#A098F8]">{platform}</span>
          </h3>
          <span className="text-[11px] text-[#8A8FAE]">Priority-ordered · drag to reorder (coming soon)</span>
        </div>
        <RuleBuilder initial={MOCK_GOSELLR_RULES} />
      </div>

      <div className="mt-6 rounded-xl border border-[#7B6EF6]/25 bg-[#7B6EF6]/5 p-4 text-xs text-[#A098F8]">
        <b>Tip:</b> Rules priority order mein evaluate hoti hain. First match wins, aur us ka action apply
        hota hai. Baaki rules skip ho jati hain. Changes audit log mein go_policy_update event ke through
        save hoti hain.
      </div>
    </div>
  );
}

function Stat({ k, v, c }: { k: string; v: string; c: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-4">
      <div className="text-[11px] uppercase tracking-wider text-[#8A8FAE]">{k}</div>
      <div className="mt-1 text-3xl font-bold tracking-tight" style={{ color: c }}>
        {v}
      </div>
    </div>
  );
}
