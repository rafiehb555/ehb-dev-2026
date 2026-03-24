"use client";

import { motion } from "framer-motion";
import type { ApplicationRow, ApplicationStatus, ApplicationType } from "./types";
import { fmtDateTime, statusTone } from "./ui";

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "cyan" | "amber" | "emerald" | "rose" | "slate" | "violet";
}) {
  const styles =
    tone === "cyan"
      ? "border-[#00eaff]/40 text-[#00eaff]"
      : tone === "emerald"
        ? "border-emerald-400/40 text-emerald-300"
        : tone === "rose"
          ? "border-rose-400/40 text-rose-200"
          : tone === "amber"
            ? "border-amber-400/40 text-amber-200"
            : tone === "violet"
              ? "border-violet-400/40 text-violet-200"
            : "border-white/15 text-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full glass-panel border px-2.5 py-1 text-[10px] font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-white/5 px-3 py-2 text-slate-300 font-semibold">Loading queue…</div>
      <div className="p-3 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="h-3 w-2/3 bg-white/10 rounded" />
            <div className="mt-2 h-2 w-1/2 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationsTable(props: {
  loading: boolean;
  error?: string | null;
  rows: ApplicationRow[];
  selectedIds: string[];
  canApprove: boolean;
  filterStatus: ApplicationStatus | "ALL";
  filterType: ApplicationType | "ALL";
  filterRisk: "ALL" | "LOW" | "MEDIUM" | "HIGH";
  search: string;
  onChangeFilterStatus: (v: ApplicationStatus | "ALL") => void;
  onChangeFilterType: (v: ApplicationType | "ALL") => void;
  onChangeFilterRisk: (v: "ALL" | "LOW" | "MEDIUM" | "HIGH") => void;
  onChangeSearch: (v: string) => void;
  page: { take: number; skip: number };
  totalShown: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSelect: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAllOnPage: () => void;
  onBulkDecision: (decision: "APPROVED" | "REJECTED") => void;
  selectedId?: string | null;
  getRiskLevel: (row: ApplicationRow) => "LOW" | "MEDIUM" | "HIGH";
  getSla: (row: ApplicationRow) => { label: string; tone: "emerald" | "amber" | "rose" };
  onRefresh: () => void;
  onResetFilters: () => void;
}) {
  if (props.loading) return <TableSkeleton />;

  return (
    <div className="glass-panel ehb-hover-lift p-4 border border-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xs font-semibold text-slate-100">Applications Queue</h2>
            <Badge tone="slate">{props.totalShown} shown</Badge>
          </div>
          <div className="text-[11px] ehb-text-muted">
            Smart queue with risk-first review. Row click opens full decision drawer.
          </div>
        </div>

        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <div className="rounded-full glass-panel border border-white/10 px-3 py-1.5 text-[11px] text-slate-200 min-h-touch">
            <span className="text-slate-400 mr-1">Status</span>
            <select
              className="ehb-select"
              value={props.filterStatus}
              onChange={(e) => props.onChangeFilterStatus(e.target.value as any)}
            >
              <option value="ALL">All</option>
              <option value="NEW">NEW</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="UNDER_INSPECTION">UNDER_INSPECTION</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="rounded-full glass-panel border border-white/10 px-3 py-1.5 text-[11px] text-slate-200 min-h-touch">
            <span className="text-slate-400 mr-1">Type</span>
            <select
              className="ehb-select"
              value={props.filterType}
              onChange={(e) => props.onChangeFilterType(e.target.value as any)}
            >
              <option value="ALL">All</option>
              <option value="PSS">PSS</option>
              <option value="PSS_REFILL">PSS_REFILL</option>
              <option value="CRB_CERTIFICATION">CRB_CERTIFICATION</option>
              <option value="INDUSTRY_VERIFICATION">INDUSTRY_VERIFICATION</option>
              <option value="CRB">CRB</option>
              <option value="SERVICE">SERVICE</option>
              <option value="PRODUCT">PRODUCT</option>
              <option value="FRANCHISE">FRANCHISE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div className="rounded-full glass-panel border border-white/10 px-3 py-1.5 text-[11px] text-slate-200 min-h-touch">
            <span className="text-slate-400 mr-1">Risk</span>
            <select
              className="ehb-select"
              value={props.filterRisk}
              onChange={(e) => props.onChangeFilterRisk(e.target.value as "ALL" | "LOW" | "MEDIUM" | "HIGH")}
            >
              <option value="ALL">All</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="rounded-full glass-panel border border-white/10 px-3 py-1.5 text-[11px] text-slate-200 min-h-touch">
            <span className="text-slate-400 mr-1">Search</span>
            <input
              value={props.search}
              onChange={(e) => props.onChangeSearch(e.target.value)}
              placeholder="ID / applicant / assignee"
              className="bg-transparent outline-none placeholder:text-slate-500 w-full sm:w-[160px]"
            />
          </div>
          <button
            type="button"
            onClick={() => props.onBulkDecision("APPROVED")}
            disabled={!props.canApprove || props.selectedIds.length === 0}
            className="ehb-btn-primary ehb-press disabled:opacity-40"
          >
            Bulk Approve ({props.selectedIds.length})
          </button>
          <button
            type="button"
            onClick={() => props.onBulkDecision("REJECTED")}
            disabled={!props.canApprove || props.selectedIds.length === 0}
            className="ehb-btn-danger ehb-press disabled:opacity-40"
          >
            Bulk Reject ({props.selectedIds.length})
          </button>
        </div>
      </div>

      {props.error ? (
        <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-rose-100">
          <div className="font-semibold mb-1">Unable to load applications</div>
          <div className="text-slate-200 text-xs">{props.error}</div>
          <button
            type="button"
            onClick={props.onRefresh}
            className="mt-3 inline-flex items-center rounded-full bg-rose-400 text-slate-950 px-3 py-1.5 text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="mt-3 overflow-auto rounded-xl border border-white/10">
        <table className="min-w-[860px] sm:min-w-full text-[10px] xs:text-[11px]">
          <thead className="bg-white/5">
            <tr className="text-left text-slate-300">
              <th className="px-3 py-2 font-semibold">
                <input
                  type="checkbox"
                  checked={props.rows.length > 0 && props.rows.every((r) => props.selectedIds.includes(r.id))}
                  onChange={() => props.onToggleSelectAllOnPage()}
                  aria-label="Select all rows"
                />
              </th>
              <th className="px-3 py-2 font-semibold">ID</th>
              <th className="px-3 py-2 font-semibold">Applicant</th>
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Risk</th>
              <th className="px-3 py-2 font-semibold">SLA</th>
              <th className="px-3 py-2 font-semibold">Assigned</th>
              <th className="px-3 py-2 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((a) => (
              <motion.tr
                key={a.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className={[
                  "border-t border-white/5 hover:bg-white/5 cursor-pointer ehb-press transition-colors duration-200",
                  props.selectedId === a.id ? "bg-cyan-500/10 ring-1 ring-cyan-400/40" : "",
                ].join(" ")}
                onClick={() => props.onSelect(a.id)}
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={props.selectedIds.includes(a.id)}
                    onChange={() => props.onToggleSelect(a.id)}
                    aria-label={`Select ${a.id}`}
                  />
                </td>
                <td className="px-3 py-2 font-mono text-slate-200 whitespace-nowrap">{a.id.slice(0, 10)}…</td>
                <td className="px-3 py-2 text-slate-200">
                  <div className="font-semibold text-white leading-tight">{a.applicant.name}</div>
                  <div className="text-[10px] text-slate-500">{a.applicant.email}</div>
                </td>
                <td className="px-3 py-2 text-slate-200">{a.type}</td>
                <td className="px-3 py-2">
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </td>
                <td className="px-3 py-2">
                  {props.getRiskLevel(a) === "HIGH" ? (
                    <Badge tone="rose">HIGH</Badge>
                  ) : props.getRiskLevel(a) === "MEDIUM" ? (
                    <Badge tone="amber">MEDIUM</Badge>
                  ) : (
                    <Badge tone="emerald">LOW</Badge>
                  )}
                </td>
                <td className="px-3 py-2">
                  {props.getSla(a).tone === "emerald" ? (
                    <Badge tone="emerald">{props.getSla(a).label}</Badge>
                  ) : props.getSla(a).tone === "amber" ? (
                    <Badge tone="amber">{props.getSla(a).label}</Badge>
                  ) : (
                    <Badge tone="rose">{props.getSla(a).label}</Badge>
                  )}
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {a.assignedTo ? a.assignedTo.name : <span className="text-slate-500">Unassigned</span>}
                </td>
                <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{fmtDateTime(a.updatedAt)}</td>
              </motion.tr>
            ))}
            {props.rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-slate-300">
                  <div className="font-semibold text-slate-100">No applications found</div>
                  <div className="text-xs text-slate-400 mt-1">Try refresh or clear filters to load queue data.</div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={props.onRefresh}
                      className="ehb-btn-primary ehb-press"
                    >
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={props.onResetFilters}
                      className="ehb-btn-secondary ehb-press"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[10px] text-slate-500">
          Page: {props.page.skip / props.page.take + 1} · Showing {props.rows.length} items
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={props.onPrevPage}
            disabled={props.page.skip === 0}
            className="ehb-btn-secondary ehb-press min-h-touch inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={props.onNextPage}
            disabled={props.rows.length < props.page.take}
            className="ehb-btn-primary ehb-press min-h-touch inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

