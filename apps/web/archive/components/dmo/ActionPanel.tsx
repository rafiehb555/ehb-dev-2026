/** Archived - not used in production */

"use client";

import { useState } from "react";
import type { ApplicationDetail, ApprovalDecision } from "./types";
import { fmtDateTime } from "./ui";

export function ActionPanel(props: {
  selected: ApplicationDetail | null;
  loading: boolean;
  meId?: string | null;
  canApprove: boolean;
  assignees?: Array<{ id: string; name: string; email: string; role: string }>;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  stlImpact?: { approve: number; reject: number };
  onQuickDecision: (decision: ApprovalDecision) => void;
  onAssign: (assigneeId: string) => void;
}) {
  const [assigneeId, setAssigneeId] = useState("");

  function assign() {
    if (!assigneeId.trim()) return;
    props.onAssign(assigneeId.trim());
  }

  return (
    <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-b from-[#06172d]/90 to-[#03101f]/90 p-4 space-y-4 shadow-[0_16px_40px_rgba(2,8,23,0.55)]">
      <div>
        <h2 className="text-sm font-semibold text-white">Action Panel</h2>
        <p className="text-xs text-ehb-textMuted">Fast decision workspace for selected application.</p>
      </div>

      {!props.selected ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-ehb-textBody">
          Select an application from queue to review and take action.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-ehb-textMuted">Selected</div>
            <div className="mt-1 text-sm font-semibold text-white">{props.selected.applicant.name}</div>
            <div className="text-xs text-ehb-textBody">{props.selected.type} · {props.selected.status}</div>
            <div className="text-[11px] text-ehb-textMuted mt-1">Updated: {fmtDateTime(props.selected.updatedAt)}</div>
          </div>

          <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 p-3">
            <div className="text-xs font-semibold text-violet-100">AI Decision Support</div>
            <div className="text-xs text-violet-100/90 mt-1">
              {props.riskLevel === "HIGH"
                ? "High risk detected. Manual review recommended before approval."
                : props.riskLevel === "MEDIUM"
                  ? "Medium risk. Check payload and assignment notes before decision."
                  : "Low risk signal. Safe to approve if documentation is complete."}
            </div>
            <div className="text-xs text-violet-100/90 mt-2">
              STL preview: Approve {props.stlImpact?.approve ?? 0 >= 0 ? "+" : ""}
              {props.stlImpact?.approve ?? 0} · Reject {props.stlImpact?.reject ?? 0}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              disabled={!props.canApprove || props.loading}
              onClick={() => props.onQuickDecision("APPROVED")}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 disabled:opacity-40 ehb-press"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={!props.canApprove || props.loading}
              onClick={() => props.onQuickDecision("REJECTED")}
              className="rounded-full bg-gradient-to-r from-rose-400 to-rose-500 px-4 py-2 text-xs font-semibold text-slate-950 disabled:opacity-40 ehb-press"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={assign}
              disabled={!props.selected || props.loading || assigneeId.trim().length === 0}
              className="ehb-btn-secondary ehb-press disabled:opacity-40"
            >
              Assign
            </button>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <label className="block text-[10px] text-ehb-textMuted mb-1">Assign To</label>
              {props.assignees && props.assignees.length > 0 ? (
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-transparent px-2.5 py-2 text-xs text-ehb-textBody outline-none"
                >
                  <option value="">Select assignee</option>
                  {props.assignees.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              ) : null}
              <input
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                placeholder="Paste user id (optional)"
                className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-2.5 py-2 text-xs text-ehb-textBody outline-none"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={assign}
                  disabled={!props.selected || props.loading || assigneeId.trim().length === 0}
                  className="ehb-btn-primary ehb-press disabled:opacity-40"
                >
                  Save Assignment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!props.meId) return;
                    setAssigneeId(props.meId);
                  }}
                  disabled={!props.meId}
                  className="ehb-btn-secondary ehb-press disabled:opacity-40"
                >
                  Assign to me
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

