"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AuditLog } from "./types";
import { fmtDateTime } from "./ui";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full glass-panel border border-white/10 px-2 py-0.5 text-[10px] text-ehb-textBody">
      {children}
    </span>
  );
}

function PanelSkeleton() {
  return (
    <div className="glass-panel card-hover p-3 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="h-2 w-1/2 bg-white/10 rounded" />
            <div className="mt-2 h-2 w-2/3 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityFeed(props: {
  loading: boolean;
  logs: AuditLog[];
  onOpenTargetApplication?: (id: string) => void;
}) {
  if (props.loading) return <PanelSkeleton />;

  const approvals = props.logs.filter((l) => l.action === "DMO_APPROVAL_RECORDED").slice(0, 6);
  const alerts = props.logs
    .filter((l) => l.action.includes("FAILED") || l.action.includes("RISK") || l.action.includes("ALERT"))
    .slice(0, 4);

  return (
    <div className="glass-panel card-hover p-3 border border-white/10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold text-[#00eaff]">Live Activity</h2>
        <Pill>{props.logs.length} events</Pill>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-3 py-2 text-ehb-textBody font-semibold text-[11px]">
          Recent approvals
        </div>
        <div className="p-2 space-y-2">
          {approvals.length === 0 ? (
            <div className="text-ehb-textMuted px-1 text-[11px]">No approvals yet.</div>
          ) : (
            approvals.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => props.onOpenTargetApplication?.(l.targetId)}
                className="w-full text-left rounded-xl glass-panel border border-white/10 p-2 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white text-[11px]">{l.action}</span>
                  <span className="text-[10px] text-ehb-textMuted">{new Date(l.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-0.5">
                  App <span className="font-mono text-ehb-textBody">{l.targetId.slice(0, 10)}…</span> ·{" "}
                  {l.actor ? `${l.actor.name} (${l.actor.role})` : "System"}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-3 py-2 text-ehb-textBody font-semibold text-[11px]">
          Alerts
        </div>
        <div className="p-2">
          {alerts.length === 0 ? (
            <div className="text-ehb-textMuted text-[11px]">No alerts detected.</div>
          ) : (
            <div className="space-y-2">
              {alerts.map((l) => (
                <div key={l.id} className="rounded-xl bg-rose-500/10 border border-rose-400/30 p-2">
                  <div className="font-semibold text-rose-100 text-[11px]">{l.action}</div>
                  <div className="text-[10px] text-rose-100/80">{fmtDateTime(l.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-3 py-2 text-ehb-textBody font-semibold text-[11px]">
          Audit stream
        </div>
        <div className="p-2 max-h-[380px] overflow-auto space-y-2">
          <AnimatePresence initial={false}>
            {props.logs.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="rounded-xl glass-panel border border-white/10 p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white text-[11px]">{l.action}</span>
                  <span className="text-[10px] text-ehb-textMuted">{new Date(l.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-0.5">
                  {l.targetType} · <span className="font-mono text-ehb-textBody">{l.targetId.slice(0, 10)}…</span>
                </div>
                <div className="text-[10px] text-ehb-textMuted mt-0.5">
                  Actor: <span className="text-ehb-textBody">{l.actor ? l.actor.name : "System"}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

