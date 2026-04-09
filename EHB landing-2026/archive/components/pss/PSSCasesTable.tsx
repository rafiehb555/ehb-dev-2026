/** Archived - not used in production */

"use client";

type PssRisk = "low" | "medium" | "high";
type PssCaseStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";

export type PssCaseRow = {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; role: string };
  type: "KYC" | "KYB";
  status: PssCaseStatus;
  risk: PssRisk;
  riskScore: number;
  stage: string;
  phaseCompleted: number;
  updatedAt: string;
  lastVerifiedAt: string | null;
  refillAlert?: "NORMAL" | "WARNING" | "EXPIRED";
  refillDaysRemaining?: number | null;
};

function fmt(v: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

function riskTone(r: PssRisk) {
  if (r === "high") return "border-rose-400/40 bg-rose-500/10 text-rose-100";
  if (r === "medium") return "border-amber-400/40 bg-amber-500/10 text-amber-100";
  return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
}

function statusTone(s: PssCaseStatus) {
  if (s === "VERIFIED") return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
  if (s === "REJECTED") return "border-rose-400/40 bg-rose-500/10 text-rose-100";
  if (s === "UNDER_REVIEW") return "border-cyan-400/40 bg-cyan-500/10 text-cyan-100";
  return "border-amber-400/40 bg-amber-500/10 text-amber-100";
}

function LoadingSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <tr key={`sk-${idx}`} className="border-t border-white/10">
          <td className="px-3 py-2">
            <div className="h-3 w-28 rounded bg-white/10 animate-pulse" />
            <div className="mt-1 h-3 w-40 rounded bg-white/10 animate-pulse" />
          </td>
          <td className="px-3 py-2"><div className="h-3 w-12 rounded bg-white/10 animate-pulse" /></td>
          <td className="px-3 py-2"><div className="h-5 w-24 rounded-full bg-white/10 animate-pulse" /></td>
          <td className="px-3 py-2"><div className="h-5 w-16 rounded-full bg-white/10 animate-pulse" /></td>
          <td className="px-3 py-2"><div className="h-3 w-24 rounded bg-white/10 animate-pulse" /></td>
          <td className="px-3 py-2"><div className="h-3 w-28 rounded bg-white/10 animate-pulse" /></td>
        </tr>
      ))}
    </>
  );
}

export function PSSCasesTable(props: {
  loading: boolean;
  error?: string | null;
  rows: PssCaseRow[];
  status: "ALL" | PssCaseStatus;
  risk: "ALL" | PssRisk;
  query: string;
  onChangeStatus: (v: "ALL" | PssCaseStatus) => void;
  onChangeRisk: (v: "ALL" | PssRisk) => void;
  onChangeQuery: (v: string) => void;
  onSelectCase: (id: string) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="ehb-card-elevated space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={props.status}
          onChange={(e) => props.onChangeStatus(e.target.value as "ALL" | PssCaseStatus)}
          className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs"
        >
          <option value="ALL">All status</option>
          <option value="PENDING">PENDING</option>
          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <select
          value={props.risk}
          onChange={(e) => props.onChangeRisk(e.target.value as "ALL" | PssRisk)}
          className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs"
        >
          <option value="ALL">All risk</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input
          value={props.query}
          onChange={(e) => props.onChangeQuery(e.target.value)}
          placeholder="Search user/email/id"
          className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs min-w-[220px]"
        />
        <button type="button" onClick={props.onRefresh} className="ehb-btn-secondary ehb-press">
          Refresh
        </button>
      </div>

      {props.loading ? <div className="text-xs text-ehb-textMuted">Loading PSS cases...</div> : null}
      {props.error ? <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">{props.error}</div> : null}

      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="min-w-full text-xs">
          <thead className="bg-white/5 text-ehb-textBody">
            <tr>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Risk</th>
              <th className="px-3 py-2 text-left">Refill</th>
              <th className="px-3 py-2 text-left">Stage</th>
              <th className="px-3 py-2 text-left">Updated</th>
            </tr>
          </thead>
          <tbody>
            {props.loading ? <LoadingSkeletonRows /> : null}
            {!props.loading
              ? props.rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => props.onSelectCase(r.id)}>
                    <td className="px-3 py-2">
                      <div className="font-semibold">{r.user.name}</div>
                      <div className="text-[11px] text-ehb-textMuted">{r.user.email}</div>
                    </td>
                    <td className="px-3 py-2">{r.type}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 ${statusTone(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 ${riskTone(r.risk)}`}>{r.risk} ({r.riskScore})</span>
                    </td>
                    <td className="px-3 py-2">
                      {r.refillAlert === "EXPIRED" ? (
                        <span className="inline-flex rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-rose-100">
                          Expired
                        </span>
                      ) : r.refillAlert === "WARNING" ? (
                        <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-amber-100">
                          {typeof r.refillDaysRemaining === "number" ? `${r.refillDaysRemaining}d left` : "Warning"}
                        </span>
                      ) : (
                        <span className="text-ehb-textMuted">Normal</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{r.stage}</td>
                    <td className="px-3 py-2 text-ehb-textMuted">{fmt(r.updatedAt)}</td>
                  </tr>
                ))
              : null}
            {props.rows.length === 0 && !props.loading ? (
              <tr>
                <td className="px-3 py-8 text-center text-ehb-textMuted" colSpan={7}>
                  No PSS cases found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

