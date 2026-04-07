"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type PssRisk = "low" | "medium" | "high";
type PssStep = "IDENTITY" | "DOCUMENTS" | "LIVENESS" | "AML_RISK" | "FINAL_DECISION";
type PssDecision = "APPROVED" | "REJECTED";
type PssStepStatus = "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED";

type ReviewMeta = {
  decision: PssDecision;
  notes: string | null;
  reviewer: { id: string; name: string; email: string };
  createdAt: string;
};

export type PssCaseDetail = {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; country: string | null; role: string };
  profile: { verificationStatus: "PENDING" | "VERIFIED" | "REJECTED"; stlStatus: string; stlScore: number } | null;
  phaseCompleted: number;
  riskLevel: PssRisk;
  riskScore: number | null;
  fraudStatus: "SAFE" | "SUSPICIOUS" | "BLOCKED";
  fraudReasons: string[];
  lastVerifiedAt: string | null;
  updatedAt: string;
  steps: Array<{ step: PssStep; status: PssStepStatus }>;
  stepContent: {
    identity: {
      name: string;
      dob: string | null;
      idNumber: string | null;
      latestReview: ReviewMeta | null;
    };
    documents: Array<{
      id: string;
      type: string;
      fileUrl: string;
      mimeType: string | null;
      reviewStatus: "PENDING" | "APPROVED" | "REJECTED";
      notes: string | null;
      createdAt: string;
    }>;
    liveness: {
      faceMatchScore: number | null;
      selfieUrl: string | null;
      videoUrl: string | null;
      latestReview: ReviewMeta | null;
    };
    aml: {
      result: string;
      flags: string[];
      latestReview: ReviewMeta | null;
    };
  };
  nextRefill: { dueDate: string; graceEndDate: string; status: string } | null;
  refillAlert: "NORMAL" | "WARNING" | "EXPIRED";
  refillDaysRemaining: number | null;
};

const STEP_ORDER: PssStep[] = ["IDENTITY", "DOCUMENTS", "LIVENESS", "AML_RISK", "FINAL_DECISION"];

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

function stepBadge(status: PssStepStatus) {
  if (status === "APPROVED") return "✔";
  if (status === "REJECTED") return "✖";
  if (status === "IN_PROGRESS") return "⏳";
  return "•";
}

function reviewBlock(review: ReviewMeta | null) {
  if (!review) return <div className="text-[11px] text-ehb-textMuted">No review yet.</div>;
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-2 text-[11px] text-ehb-textBody space-y-1">
      <div>
        <span className="text-ehb-textMuted">Decision:</span> {review.decision}
      </div>
      <div>
        <span className="text-ehb-textMuted">Reviewer:</span> {review.reviewer.name}
      </div>
      <div>
        <span className="text-ehb-textMuted">At:</span> {fmt(review.createdAt)}
      </div>
      {review.notes ? (
        <div>
          <span className="text-ehb-textMuted">Notes:</span> {review.notes}
        </div>
      ) : null}
    </div>
  );
}

export function PSSVerificationDrawer(props: {
  open: boolean;
  detail: PssCaseDetail | null;
  loading: boolean;
  onClose: () => void;
  onVerifyStep: (step: Exclude<PssStep, "FINAL_DECISION">, decision: "APPROVED" | "REJECTED", notes: string) => void;
  onFinalDecision: (decision: "APPROVED" | "REJECTED", notes: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [activeStep, setActiveStep] = useState<PssStep>("IDENTITY");
  const activeStatus = useMemo(
    () => props.detail?.steps.find((s) => s.step === activeStep)?.status ?? "PENDING",
    [props.detail, activeStep]
  );
  const progress = useMemo(() => {
    if (!props.detail) return 0;
    const approved = props.detail.steps.filter((s) => s.status === "APPROVED").length;
    return Math.round((approved / STEP_ORDER.length) * 100);
  }, [props.detail]);
  const activeStepContent = useMemo(() => {
    if (!props.detail) return null;
    if (activeStep === "IDENTITY") {
      return (
        <div className="space-y-2 text-xs">
          <div><span className="text-ehb-textMuted">Name:</span> {props.detail.stepContent.identity.name}</div>
          <div><span className="text-ehb-textMuted">DOB:</span> {props.detail.stepContent.identity.dob ?? "Not provided"}</div>
          <div><span className="text-ehb-textMuted">ID Number:</span> {props.detail.stepContent.identity.idNumber ?? "Not provided"}</div>
          {reviewBlock(props.detail.stepContent.identity.latestReview)}
        </div>
      );
    }
    if (activeStep === "DOCUMENTS") {
      return (
        <div className="space-y-2">
          {props.detail.stepContent.documents.length === 0 ? (
            <div className="text-[11px] text-ehb-textMuted">No documents uploaded for this step.</div>
          ) : (
            props.detail.stepContent.documents.map((doc) => (
              <div key={doc.id} className="rounded-lg border border-white/10 bg-black/20 p-2 text-[11px]">
                <div className="font-semibold text-slate-200">{doc.type}</div>
                <div className="text-ehb-textMuted">Status: {doc.reviewStatus}</div>
                <div className="text-ehb-textMuted">Uploaded: {fmt(doc.createdAt)}</div>
                <a className="text-cyan-300 underline" href={doc.fileUrl} target="_blank" rel="noreferrer">
                  Open file (zoom/view)
                </a>
                {doc.notes ? <div className="text-ehb-textBody mt-1">Notes: {doc.notes}</div> : null}
              </div>
            ))
          )}
        </div>
      );
    }
    if (activeStep === "LIVENESS") {
      return (
        <div className="space-y-2 text-xs">
          <div><span className="text-ehb-textMuted">Face Match Score:</span> {props.detail.stepContent.liveness.faceMatchScore ?? "N/A"}</div>
          <div className="flex flex-wrap gap-2">
            {props.detail.stepContent.liveness.selfieUrl ? (
              <a className="text-cyan-300 underline" href={props.detail.stepContent.liveness.selfieUrl} target="_blank" rel="noreferrer">
                Open Selfie
              </a>
            ) : (
              <span className="text-ehb-textMuted">Selfie not available</span>
            )}
            {props.detail.stepContent.liveness.videoUrl ? (
              <a className="text-cyan-300 underline" href={props.detail.stepContent.liveness.videoUrl} target="_blank" rel="noreferrer">
                Open Liveness Video
              </a>
            ) : (
              <span className="text-ehb-textMuted">Video not available</span>
            )}
          </div>
          {reviewBlock(props.detail.stepContent.liveness.latestReview)}
        </div>
      );
    }
    if (activeStep === "AML_RISK") {
      return (
        <div className="space-y-2 text-xs">
          <div><span className="text-ehb-textMuted">AML Result:</span> {props.detail.stepContent.aml.result}</div>
          <div>
            <span className="text-ehb-textMuted">Flags:</span>{" "}
            {props.detail.stepContent.aml.flags.length > 0 ? props.detail.stepContent.aml.flags.join(", ") : "No flags"}
          </div>
          {reviewBlock(props.detail.stepContent.aml.latestReview)}
        </div>
      );
    }
    return (
      <div className="space-y-2 text-xs">
        <div><span className="text-ehb-textMuted">Summary:</span> Review all step outcomes before final approval/rejection.</div>
        <div><span className="text-ehb-textMuted">Risk:</span> {props.detail.riskLevel} {props.detail.riskScore !== null ? `(score: ${props.detail.riskScore})` : ""}</div>
        <div><span className="text-ehb-textMuted">Current Verification Status:</span> {props.detail.profile?.verificationStatus ?? "PENDING"}</div>
      </div>
    );
  }, [activeStep, props.detail]);

  return (
    <AnimatePresence>
      {props.open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/60" onClick={props.onClose} />
          <motion.section
            initial={{ x: 28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-[#020c1b]/95 border-l border-white/10 backdrop-blur-xl p-4 overflow-auto space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Verification Case</h2>
              <button className="ehb-btn-secondary ehb-press" onClick={props.onClose}>
                Close
              </button>
            </div>

            {props.loading || !props.detail ? (
              <div className="text-xs text-ehb-textMuted">Loading case detail...</div>
            ) : (
              <>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs space-y-1">
                  <div>
                    <span className="text-ehb-textMuted">User:</span> {props.detail.user.name} ({props.detail.user.email})
                  </div>
                  <div>
                    <span className="text-ehb-textMuted">Country:</span> {props.detail.user.country ?? "Not set"}
                  </div>
                  <div>
                    <span className="text-ehb-textMuted">Risk:</span>{" "}
                    <span className={`rounded-full border px-2 py-0.5 ${riskTone(props.detail.riskLevel)}`}>{props.detail.riskLevel}</span>
                    {props.detail.riskScore !== null ? <span className="ml-2 text-ehb-textBody">Score: {props.detail.riskScore}</span> : null}
                  </div>
                  <div>
                    <div className="text-ehb-textMuted">Risk meter:</div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={[
                          "h-full",
                          props.detail.riskLevel === "high"
                            ? "bg-rose-500"
                            : props.detail.riskLevel === "medium"
                              ? "bg-amber-500"
                              : "bg-emerald-500",
                        ].join(" ")}
                        style={{ width: `${Math.max(5, Math.min(100, props.detail.riskScore ?? 0))}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-ehb-textMuted">Fraud status:</span>{" "}
                    <span
                      className={[
                        "rounded-full border px-2 py-0.5",
                        props.detail.fraudStatus === "BLOCKED"
                          ? "border-rose-400/40 bg-rose-500/10 text-rose-100"
                          : props.detail.fraudStatus === "SUSPICIOUS"
                            ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
                            : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
                      ].join(" ")}
                    >
                      {props.detail.fraudStatus}
                    </span>
                    {props.detail.fraudReasons.length > 0 ? (
                      <div className="mt-1 text-[11px] text-ehb-textBody">{props.detail.fraudReasons.join(", ")}</div>
                    ) : null}
                  </div>
                  <div>
                    <span className="text-ehb-textMuted">Profile status:</span> {props.detail.profile?.verificationStatus ?? "PENDING"}
                  </div>
                  <div>
                    <span className="text-ehb-textMuted">Next refill:</span> {props.detail.nextRefill ? fmt(props.detail.nextRefill.dueDate) : "Not scheduled"}
                    {props.detail.nextRefill ? (
                      <span
                        className={[
                          "ml-2 rounded-full border px-2 py-0.5 text-[11px]",
                          props.detail.refillAlert === "EXPIRED"
                            ? "border-rose-400/40 bg-rose-500/10 text-rose-100"
                            : props.detail.refillAlert === "WARNING"
                              ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
                              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
                        ].join(" ")}
                      >
                        {props.detail.refillAlert === "EXPIRED"
                          ? "Expired"
                          : props.detail.refillAlert === "WARNING"
                            ? `${props.detail.refillDaysRemaining ?? "?"}d left`
                            : "On track"}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Stepper</div>
                    <div className="text-[11px] text-ehb-textBody">{progress}% completed</div>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {STEP_ORDER.map((step) => {
                      const s = props.detail!.steps.find((x) => x.step === step)?.status ?? "PENDING";
                      return (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setActiveStep(step)}
                          className={[
                            "rounded-lg border px-2 py-2 text-left text-xs",
                            activeStep === step ? "border-cyan-400/50 bg-cyan-500/10" : "border-white/10 bg-black/20",
                          ].join(" ")}
                        >
                                          <div className="font-semibold">{stepBadge(s)} {step}</div>
                          <div className="text-[11px] text-ehb-textBody">{s}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-xs font-semibold">Active Step: {activeStep}</div>
                  <div className="text-[11px] text-ehb-textBody">Status: {activeStatus}</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-white/10 bg-black/20 p-2"
                    >
                      {activeStepContent}
                    </motion.div>
                  </AnimatePresence>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reason / comments..."
                    className="w-full h-24 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs"
                  />

                  {activeStep !== "FINAL_DECISION" ? (
                    <div className="flex gap-2">
                      <button
                        className="ehb-btn-primary ehb-press"
                        onClick={() => {
                          props.onVerifyStep(activeStep as Exclude<PssStep, "FINAL_DECISION">, "APPROVED", notes);
                          setNotes("");
                        }}
                      >
                        Approve Step
                      </button>
                      <button
                        className="ehb-btn-danger ehb-press"
                        onClick={() => {
                          props.onVerifyStep(activeStep as Exclude<PssStep, "FINAL_DECISION">, "REJECTED", notes);
                          setNotes("");
                        }}
                      >
                        Reject Step
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="ehb-btn-primary ehb-press"
                        onClick={() => {
                          props.onFinalDecision("APPROVED", notes);
                          setNotes("");
                        }}
                      >
                        Final Approve
                      </button>
                      <button
                        className="ehb-btn-danger ehb-press"
                        onClick={() => {
                          props.onFinalDecision("REJECTED", notes);
                          setNotes("");
                        }}
                      >
                        Final Reject
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

