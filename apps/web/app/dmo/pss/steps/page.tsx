"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  VerificationRowGrid,
  type VerificationTone,
  type RowColumn,
} from "@/components/dmo/verification/VerificationUI";

/* ================================================================== */
/* Demo data: 6-step PSS verification pipeline                        */
/* ================================================================== */

type PSSStep = {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  avgTimeMinutes: number;
  successRate: number;
  status: "completed" | "current" | "pending";
};

type RecentCompletion = {
  id: string;
  entityName: string;
  stepCompleted: string;
  timeTaken: string;
  result: "pass" | "fail";
};

const PSS_STEPS: PSSStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    title: "Identity Upload",
    description: "Document scan & metadata extraction (Passport, ID, License)",
    avgTimeMinutes: 3,
    successRate: 97,
    status: "completed",
  },
  {
    id: "step-2",
    stepNumber: 2,
    title: "Liveness Check",
    description: "Real-time face match against uploaded document",
    avgTimeMinutes: 2,
    successRate: 94,
    status: "completed",
  },
  {
    id: "step-3",
    stepNumber: 3,
    title: "AML Screening",
    description: "Sanctions list, PEP check, adverse media scan",
    avgTimeMinutes: 5,
    successRate: 98,
    status: "current",
  },
  {
    id: "step-4",
    stepNumber: 4,
    title: "Document Verification",
    description: "OCR parsing + manual review by CRB agents",
    avgTimeMinutes: 8,
    successRate: 91,
    status: "pending",
  },
  {
    id: "step-5",
    stepNumber: 5,
    title: "Risk Assessment",
    description: "AI scoring based on behavioral patterns & historical data",
    avgTimeMinutes: 4,
    successRate: 96,
    status: "pending",
  },
  {
    id: "step-6",
    stepNumber: 6,
    title: "Final Decision",
    description: "DMO L8 approval gate; approval or rejection with reasoning",
    avgTimeMinutes: 12,
    successRate: 93,
    status: "pending",
  },
];

const RECENT_COMPLETIONS: RecentCompletion[] = [
  {
    id: "comp-1",
    entityName: "Acme Corp LLC",
    stepCompleted: "Document Verification",
    timeTaken: "7m 42s",
    result: "pass",
  },
  {
    id: "comp-2",
    entityName: "Khan Industries",
    stepCompleted: "AML Screening",
    timeTaken: "4m 18s",
    result: "pass",
  },
  {
    id: "comp-3",
    entityName: "Global Trading Ltd",
    stepCompleted: "Liveness Check",
    timeTaken: "1m 56s",
    result: "fail",
  },
  {
    id: "comp-4",
    entityName: "TechStart Ventures",
    stepCompleted: "Risk Assessment",
    timeTaken: "3m 29s",
    result: "pass",
  },
  {
    id: "comp-5",
    entityName: "Summit Holdings",
    stepCompleted: "Identity Upload",
    timeTaken: "2m 14s",
    result: "pass",
  },
];

/* ================================================================== */
/* Page Component                                                     */
/* ================================================================== */

export default function PSSStepsPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Calculate pipeline health stats
  const totalSteps = PSS_STEPS.length;
  const completedSteps = PSS_STEPS.filter((s) => s.status === "completed").length;
  const currentSteps = PSS_STEPS.filter((s) => s.status === "current").length;
  const pendingSteps = PSS_STEPS.filter((s) => s.status === "pending").length;

  const avgSuccessRate = Math.round(
    PSS_STEPS.reduce((sum, s) => sum + s.successRate, 0) / PSS_STEPS.length
  );

  const pipelineHealthPassFailPending = PSS_STEPS.filter(
    (s) => s.status === "completed"
  ).reduce((sum) => sum + 1, 0);

  // Status tone mapping
  const getStepTone = (status: PSSStep["status"]): VerificationTone => {
    if (status === "completed") return "green";
    if (status === "current") return "amber";
    return "purple";
  };

  // Recent completions columns
  const recentCompletionColumns: RowColumn<RecentCompletion>[] = [
    {
      key: "entityName",
      header: "Entity Name",
      width: "2fr",
      render: (row) => (
        <div className="font-medium text-white">{row.entityName}</div>
      ),
    },
    {
      key: "stepCompleted",
      header: "Step Completed",
      width: "2fr",
      render: (row) => (
        <div className="text-white/75">{row.stepCompleted}</div>
      ),
    },
    {
      key: "timeTaken",
      header: "Time Taken",
      width: "1.2fr",
      render: (row) => <div className="text-white/60">{row.timeTaken}</div>,
    },
    {
      key: "result",
      header: "Result",
      width: "1fr",
      align: "center",
      render: (row) => (
        <VerificationChip
          tone={row.result === "pass" ? "green" : "red"}
          size="xs"
        >
          {row.result.toUpperCase()}
        </VerificationChip>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero section with breadcrumb & accent bar */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-[#13162A]/70 p-8 backdrop-blur-xl">
        {/* accent gradient bar (top edge) */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#2BBFA0] to-transparent"
          style={{ boxShadow: "0 0 24px rgba(43,191,160,0.4)" }}
        />

        {/* corner brackets (L-shapes) */}
        <div
          className="pointer-events-none absolute left-5 top-5 h-3 w-3 border-l-2 border-t-2 border-[#2BBFA0]/60"
          style={{ opacity: 0.8 }}
        />
        <div
          className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 border-b-2 border-r-2 border-[#2BBFA0]/60"
          style={{ opacity: 0.8 }}
        />

        {/* blur orb */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(43,191,160,0.15) 0%, transparent 70%)",
          }}
        />

        {/* breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
          <Link
            href="/dmo"
            className="transition-colors hover:text-[#A098F8]"
          >
            DMO
          </Link>
          <span className="text-white/30">/</span>
          <Link
            href="/dmo/pss"
            className="transition-colors hover:text-[#A098F8]"
          >
            PSS
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-[#2BBFA0]">Verification Steps</span>
        </nav>

        {/* hero headline */}
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold text-white">
            PSS Verification Pipeline
          </h1>
          <p className="max-w-2xl text-sm text-white/60">
            6-step KYC/KYB verification journey. Real-time pipeline health, step
            processing times, success rates, and recent completions at a glance.
          </p>
        </div>
      </div>

      {/* 4 stat cards: Total Steps, Completed, In Progress, Avg SR% */}
      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <VerificationStatCard
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 9h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
          label="Total Steps"
          value={totalSteps}
          sub="In pipeline"
          tone="cyan"
        />
        <VerificationStatCard
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
          label="Completed"
          value={completedSteps}
          sub="Passed gates"
          tone="green"
        />
        <VerificationStatCard
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          }
          label="In Progress"
          value={currentSteps}
          sub="Active now"
          tone="amber"
        />
        <VerificationStatCard
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          label="Avg Success Rate"
          value={`${avgSuccessRate}%`}
          sub="Across pipeline"
          tone="purple"
        />
      </div>

      {/* Vertical timeline: 6-step PSS pipeline */}
      <SectionHeader
        eyebrow="Pipeline Architecture"
        title="6-Step Verification Journey"
        hint="Visual timeline with step details, processing time, and success rates"
      />

      <div className="mb-12 space-y-3">
        {PSS_STEPS.map((step, idx) => {
          const tone = getStepTone(step.status);
          const isExpanded = expandedStep === step.id;

          return (
            <div key={step.id}>
              {/* timeline connector (top) */}
              {idx > 0 && (
                <div className="mb-2 ml-8 h-6 w-px bg-gradient-to-b from-white/20 to-transparent" />
              )}

              {/* step card */}
              <button
                type="button"
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="group relative w-full rounded-2xl border bg-[#13162A]/60 p-5 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B6EF6]/60 backdrop-blur-xl sm:p-6"
                style={{
                  borderColor:
                    tone === "green"
                      ? "rgba(56,200,120,0.35)"
                      : tone === "amber"
                        ? "rgba(240,160,48,0.35)"
                        : "rgba(160,152,248,0.25)",
                }}
              >
                {/* accent bar (left edge for completed/current) */}
                {step.status !== "pending" && (
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl"
                    style={{
                      background:
                        tone === "green"
                          ? "#38C878"
                          : tone === "amber"
                            ? "#F0A030"
                            : "#A098F8",
                      boxShadow:
                        tone === "green"
                          ? "0 0 12px rgba(56,200,120,0.5)"
                          : tone === "amber"
                            ? "0 0 12px rgba(240,160,48,0.5)"
                            : "0 0 12px rgba(160,152,248,0.5)",
                    }}
                  />
                )}

                {/* amber pulse border for current step */}
                {step.status === "current" && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-[#F0A030]"
                    style={{
                      animation: "ehb-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      boxShadow: "inset 0 0 12px rgba(240,160,48,0.2)",
                    }}
                  />
                )}

                {/* step header: number + title + status chip */}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* step circle number */}
                    <div
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border"
                      style={{
                        background:
                          tone === "green"
                            ? "rgba(56,200,120,0.2)"
                            : tone === "amber"
                              ? "rgba(240,160,48,0.2)"
                              : "rgba(160,152,248,0.15)",
                        border:
                          tone === "green"
                            ? "1px solid rgba(56,200,120,0.5)"
                            : tone === "amber"
                              ? "1px solid rgba(240,160,48,0.5)"
                              : "1px solid rgba(160,152,248,0.4)",
                        color:
                          tone === "green"
                            ? "#38C878"
                            : tone === "amber"
                              ? "#F0A030"
                              : "#A098F8",
                      }}
                    >
                      {step.stepNumber}
                    </div>

                    {/* title + description */}
                    <div className="min-w-0">
                      <h3 className="font-bold text-white">{step.title}</h3>
                      <p className="text-xs text-white/55">{step.description}</p>
                    </div>
                  </div>

                  {/* status chip */}
                  <VerificationChip tone={tone} size="xs">
                    {step.status === "completed"
                      ? "Passed"
                      : step.status === "current"
                        ? "Active"
                        : "Pending"}
                  </VerificationChip>
                </div>

                {/* step metrics (time + success rate) */}
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold uppercase tracking-wider text-white/50">
                      Avg Time
                    </p>
                    <p
                      className="font-bold"
                      style={{
                        color:
                          tone === "green"
                            ? "#38C878"
                            : tone === "amber"
                              ? "#F0A030"
                              : "#A098F8",
                      }}
                    >
                      {step.avgTimeMinutes}m
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold uppercase tracking-wider text-white/50">
                      Success Rate
                    </p>
                    <p
                      className="font-bold"
                      style={{
                        color:
                          tone === "green"
                            ? "#38C878"
                            : tone === "amber"
                              ? "#F0A030"
                              : "#A098F8",
                      }}
                    >
                      {step.successRate}%
                    </p>
                  </div>
                </div>

                {/* expand indicator */}
                {isExpanded && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="text-xs text-white/60">
                      Detailed metrics and drill-in information shown here on expansion.
                    </p>
                  </div>
                )}
              </button>

              {/* timeline connector (bottom) */}
              {idx < PSS_STEPS.length - 1 && (
                <div className="mb-0 ml-8 h-6 w-px bg-gradient-to-b from-white/20 to-transparent" />
              )}
            </div>
          );
        })}
      </div>

      {/* Pipeline Health section with SeverityMeter */}
      <SectionHeader
        eyebrow="Health Indicator"
        title="Pipeline Health Status"
        hint="Distribution of steps across verification stages"
      />

      <div className="mb-12 rounded-2xl border border-white/10 bg-[#13162A]/60 p-6 backdrop-blur-xl">
        <SeverityMeter
          segments={[
            {
              label: "Completed",
              value: completedSteps,
              tone: "green",
            },
            {
              label: "Current",
              value: currentSteps,
              tone: "amber",
            },
            {
              label: "Pending",
              value: pendingSteps,
              tone: "purple",
            },
          ]}
        />
      </div>

      {/* Recent Completions: last 5 entries via VerificationRowGrid */}
      <SectionHeader
        eyebrow="Activity Log"
        title="Recent Completions"
        hint="Last 5 entities through verification pipeline"
      />

      <VerificationRowGrid<RecentCompletion>
        columns={recentCompletionColumns}
        rows={RECENT_COMPLETIONS}
        emptyIcon={
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        }
        emptyTitle="No completions yet"
        emptyHint="Recent verification completions will appear here as entities progress through the pipeline."
        getRowTone={(row) => (row.result === "pass" ? "green" : "red")}
      />

      {/* Global styles: pulse animation for current step */}
      <style jsx>{`
        @keyframes ehb-pulse {
          0%, 100% {
            box-shadow: inset 0 0 12px rgba(240, 160, 48, 0.2),
              0 0 20px rgba(240, 160, 48, 0.3);
          }
          50% {
            box-shadow: inset 0 0 20px rgba(240, 160, 48, 0.35),
              0 0 32px rgba(240, 160, 48, 0.5);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
