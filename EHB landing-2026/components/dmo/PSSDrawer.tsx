"use client";

import { useMemo, useState } from "react";

const STEPS = ["IDENTITY", "DOCUMENTS", "LIVENESS", "AML", "FINAL"] as const;

type PssDrawerData = {
  id: string;
  user: { name: string; email?: string | null };
  status?: string;
  risk?: string;
  stage?: string;
  updatedAt?: string;
  riskScore?: number;
};

export default function PSSDrawer({
  data,
  onClose,
  onApprove,
  onReject,
}: {
  data: PssDrawerData;
  onClose: () => void;
  onApprove?: (payload: { step: string; notes?: string }) => void | Promise<void>;
  onReject?: (payload: { step: string; notes?: string }) => void | Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState("");
  const activeStep = useMemo(() => STEPS[step] ?? "IDENTITY", [step]);

  return (
    <div className="fixed inset-y-0 right-0 z-[90] w-full max-w-[520px] border-l border-white/10 bg-[#0F141B]/95 p-6 backdrop-blur">
      <button onClick={onClose} className="mb-4 rounded-lg border border-white/10 px-3 py-1 text-xs text-ehb-textBody hover:bg-white/5">
        Close
      </button>

      <h3 className="text-xl font-semibold">{data.user.name}</h3>
      <p className="text-xs text-ehb-textMuted">{data.user.email ?? "No email available"}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        {data.status ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
            <dt className="text-ehb-textMuted">Status</dt>
            <dd className="font-medium text-white">{data.status}</dd>
          </div>
        ) : null}
        {data.stage ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
            <dt className="text-ehb-textMuted">Stage</dt>
            <dd className="font-medium text-white">{data.stage}</dd>
          </div>
        ) : null}
        {data.riskScore !== undefined ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
            <dt className="text-ehb-textMuted">Risk score</dt>
            <dd className="font-mono text-cyan-200">{data.riskScore}</dd>
          </div>
        ) : null}
        {data.risk ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
            <dt className="text-ehb-textMuted">Risk band</dt>
            <dd className="font-medium uppercase text-white">{data.risk}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            className={[
              "rounded-full px-3 py-1 text-[11px] transition-colors",
              i === step ? "bg-blue-500 text-white" : "bg-white/10 text-ehb-textBody hover:bg-white/15",
            ].join(" ")}
            onClick={() => setStep(i)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <p className="text-sm text-ehb-textBody">Step: {activeStep}</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="h-28 w-full rounded-lg border border-white/10 bg-black/30 p-2 text-sm outline-none focus:border-cyan-400/40"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onApprove?.({ step: activeStep, notes: notes.trim() || undefined })}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject?.({ step: activeStep, notes: notes.trim() || undefined })}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

