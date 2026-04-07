"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ApplicationDetail, ApprovalDecision, SessionUser } from "./types";
import { fmtDateTime, isAdminRole, prettyJson, statusTone } from "./ui";
import { EHB_MOTION } from "./motion";

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
            : "border-white/15 text-ehb-textBody";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full glass-panel border px-2.5 py-1 text-[10px] font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}

export function ApplicationDrawer(props: {
  open: boolean;
  me: SessionUser | null;
  application: ApplicationDetail | null;
  approvals: Array<{
    id: string;
    applicationId: string;
    decision: ApprovalDecision;
    notes: string | null;
    createdAt: string;
    approvedBy: { id: string; name: string; email: string; role: string };
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    targetType: string;
    targetId: string;
    createdAt: string;
    actor: { id: string; name: string; email: string; role: string } | null;
  }>;
  loading: boolean;
  onClose: () => void;
  onDecide: (decision: ApprovalDecision, notes: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<ApprovalDecision | null>(null);

  const canApprove = isAdminRole(props.me?.role);

  async function decide(decision: ApprovalDecision) {
    setBusy(decision);
    try {
      await props.onDecide(decision, notes);
      setNotes("");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AnimatePresence>
      {props.open ? (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={props.onClose}
          />
          <motion.div
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={EHB_MOTION}
            className="absolute right-0 top-0 h-full w-full sm:w-[86vw] md:w-[560px] bg-[#020c1b]/95 border-l border-white/10 backdrop-blur-xl p-4 sm:p-5 overflow-auto"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Application</div>
                <div className="font-semibold text-white">{props.application?.id ?? "—"}</div>
              </div>
              <button
                type="button"
                onClick={props.onClose}
                className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel border border-white/10 px-3 py-1.5 text-[11px] text-ehb-textBody hover:bg-white/5"
              >
                Close
              </button>
            </div>

            {props.loading || !props.application ? (
              <div className="rounded-2xl glass-panel border border-white/10 p-4 text-ehb-textBody">
                Loading details…
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="slate">{props.application.type}</Badge>
                    <Badge tone={statusTone(props.application.status)}>{props.application.status}</Badge>
                    {props.application.assignedTo ? (
                      <Badge tone="slate">Assigned: {props.application.assignedTo.name}</Badge>
                    ) : (
                      <Badge tone="amber">Unassigned</Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-ehb-textBody">
                    Applicant: <span className="font-semibold text-white">{props.application.applicant.name}</span>{" "}
                    <span className="text-ehb-textMuted">({props.application.applicant.email})</span>
                  </div>
                  <div className="text-[10px] text-ehb-textMuted">Created: {fmtDateTime(props.application.createdAt)}</div>
                  <div className="text-[10px] text-ehb-textMuted">Updated: {fmtDateTime(props.application.updatedAt)}</div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-white">Fast decision</h3>
                    <Badge tone={canApprove ? "emerald" : "slate"}>{canApprove ? "Admin" : "Read-only"}</Badge>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes (optional)…"
                    className="w-full h-20 rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-ehb-textBody outline-none placeholder:text-ehb-textMuted"
                    disabled={!canApprove}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void decide("APPROVED")}
                      disabled={!canApprove || busy !== null}
                      className={`min-h-touch inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold ${
                        canApprove
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-300 text-slate-950"
                          : "glass-panel border border-white/15 text-ehb-textMuted cursor-not-allowed"
                      }`}
                    >
                      {busy === "APPROVED" ? "Approving…" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void decide("REJECTED")}
                      disabled={!canApprove || busy !== null}
                      className={`min-h-touch inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold ${
                        canApprove
                          ? "bg-gradient-to-r from-rose-400 to-rose-300 text-slate-950"
                          : "glass-panel border border-white/15 text-ehb-textMuted cursor-not-allowed"
                      }`}
                    >
                      {busy === "REJECTED" ? "Rejecting…" : "Reject"}
                    </button>
                  </div>
                  <div className="text-[10px] text-ehb-textMuted">
                    Approve/Reject writes Approval + updates Application + logs Audit events.
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">Approval History</h3>
                  <div className="space-y-2">
                    {props.approvals.map((approval) => (
                      <div key={approval.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white text-[11px]">{approval.approvedBy.name}</span>
                          <Badge tone={approval.decision === "APPROVED" ? "emerald" : "rose"}>{approval.decision}</Badge>
                        </div>
                        <div className="text-[10px] text-ehb-textMuted mt-1">{fmtDateTime(approval.createdAt)}</div>
                        {approval.notes ? <div className="text-[11px] text-ehb-textBody mt-1">{approval.notes}</div> : null}
                      </div>
                    ))}
                    {props.approvals.length === 0 ? <div className="text-[11px] text-ehb-textMuted">No approvals yet.</div> : null}
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">Audit Timeline</h3>
                  <div className="space-y-2">
                    {props.auditLogs.map((log) => (
                      <div key={log.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white text-[11px]">{log.action}</span>
                          <Badge tone="slate">{fmtDateTime(log.createdAt)}</Badge>
                        </div>
                        <div className="text-[10px] text-ehb-textMuted mt-1">
                          {log.actor ? `By ${log.actor.name}` : "System"} · {log.targetType}
                        </div>
                      </div>
                    ))}
                    {props.auditLogs.length === 0 ? <div className="text-[11px] text-ehb-textMuted">No audit logs found.</div> : null}
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">Overview</h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                      <div className="text-ehb-textMuted">Applicant</div>
                      <div className="text-white font-semibold">{props.application.applicant.name}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                      <div className="text-ehb-textMuted">Type</div>
                      <div className="text-white font-semibold">{props.application.type}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                      <div className="text-ehb-textMuted">Status</div>
                      <div className="text-white font-semibold">{props.application.status}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                      <div className="text-ehb-textMuted">Assigned</div>
                      <div className="text-white font-semibold">{props.application.assignedTo?.name ?? "Unassigned"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">PSS Data</h3>
                  <div className="text-[11px] text-ehb-textBody">
                    {(props.application.payload as any)?.pss
                      ? `Verification phase: ${(props.application.payload as any).pss.phaseCompleted ?? "n/a"}`
                      : "No PSS payload attached for this application yet."}
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">CRB Data</h3>
                  <div className="text-[11px] text-ehb-textBody">
                    {(props.application.payload as any)?.crbApplicationId
                      ? `CRB Application: ${(props.application.payload as any).crbApplicationId}`
                      : "No CRB data attached for this application yet."}
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">Industry Verification</h3>
                  <div className="text-[11px] text-ehb-textBody">
                    {(props.application.payload as any)?.industryVerificationId
                      ? `Industry Verification: ${(props.application.payload as any).industryVerificationId}`
                      : "No industry verification data attached for this application yet."}
                  </div>
                </div>

                <div className="rounded-2xl glass-panel border border-white/10 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-white">Raw Payload</h3>
                  <pre className="text-[10px] text-ehb-textBody whitespace-pre-wrap break-words rounded-2xl bg-black/30 border border-white/10 p-3 overflow-auto max-h-[240px]">
                    {prettyJson(props.application.payload ?? {})}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

