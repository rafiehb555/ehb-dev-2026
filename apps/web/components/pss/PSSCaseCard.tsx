import Link from "next/link";

export type PssCaseSummary = {
  id: string;
  user: { name: string; email?: string | null };
  entityType: string;
  platform: "gosellr" | "ols" | "hps" | "jps" | "wms" | "obs" | "agts";
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  stage: string;
  stlLevel?: number;
  updatedAt: string;
};

const riskTone = {
  LOW: "text-[#38C878] bg-[#38C878]/15 border-[#38C878]/30",
  MEDIUM: "text-[#F0A030] bg-[#F0A030]/15 border-[#F0A030]/30",
  HIGH: "text-[#F05858] bg-[#F05858]/15 border-[#F05858]/30",
  CRITICAL: "text-[#F05858] bg-[#F05858]/25 border-[#F05858]/50",
};

export function PSSCaseCard({ c }: { c: PssCaseSummary }) {
  return (
    <Link
      href={`/dmo/pss/cases/${c.id}`}
      className="block rounded-xl border border-white/[0.08] bg-[#1A1D33] p-4 transition hover:border-[#7B6EF6]/60 hover:bg-[#7B6EF6]/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{c.user.name}</div>
          <div className="truncate text-xs text-[#8A8FAE]">
            {c.entityType} · {c.platform.toUpperCase()}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${riskTone[c.risk]}`}
        >
          {c.risk}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#0C0E1A]">
            <div
              className="h-full bg-gradient-to-r from-[#38C878] to-[#F0A030]"
              style={{ width: `${c.score}%` }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-[#A098F8]">{c.score}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#8A8FAE]">{c.stage}</span>
      </div>

      <div className="mt-2 text-[10px] text-[#8A8FAE]">{c.updatedAt}</div>
    </Link>
  );
}
