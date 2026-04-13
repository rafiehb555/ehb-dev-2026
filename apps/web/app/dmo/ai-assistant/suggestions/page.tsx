"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type SuggestionStatus = "PENDING" | "ACCEPTED" | "DISMISSED" | "EXPIRED";
type ImpactLevel = "HIGH" | "MEDIUM" | "LOW";

type Suggestion = {
  id: string;
  suggestion: string;
  module: string;
  confidence: number;
  impact: ImpactLevel;
  status: SuggestionStatus;
};

const DEMO_SUGGESTIONS: Suggestion[] = [
  {
    id: "SG001",
    suggestion: "Increase STL recalculation frequency for high-value transactions",
    module: "STL",
    confidence: 92,
    impact: "HIGH",
    status: "PENDING",
  },
  {
    id: "SG002",
    suggestion: "Flag PSS KYC rejections with liveness mismatches for manual review",
    module: "PSS",
    confidence: 88,
    impact: "HIGH",
    status: "ACCEPTED",
  },
  {
    id: "SG003",
    suggestion: "Batch CRB certification reviews by document type",
    module: "CRB",
    confidence: 85,
    impact: "MEDIUM",
    status: "PENDING",
  },
  {
    id: "SG004",
    suggestion: "Implement graduated wallet settlement thresholds by user tier",
    module: "WALLET",
    confidence: 79,
    impact: "HIGH",
    status: "DISMISSED",
  },
  {
    id: "SG005",
    suggestion: "Add confidence threshold alert for STL predictions below 75%",
    module: "STL",
    confidence: 91,
    impact: "MEDIUM",
    status: "PENDING",
  },
  {
    id: "SG006",
    suggestion: "Optimize PSS liveness check retry strategy",
    module: "PSS",
    confidence: 82,
    impact: "MEDIUM",
    status: "ACCEPTED",
  },
  {
    id: "SG007",
    suggestion: "Create CRB fast-track for renewal certifications",
    module: "CRB",
    confidence: 86,
    impact: "HIGH",
    status: "PENDING",
  },
  {
    id: "SG008",
    suggestion: "Alert on wallet transaction patterns indicating potential fraud",
    module: "WALLET",
    confidence: 94,
    impact: "HIGH",
    status: "PENDING",
  },
];

function impactTone(impact: ImpactLevel): VerificationTone {
  if (impact === "HIGH") return "red";
  if (impact === "MEDIUM") return "amber";
  return "green";
}

function statusTone(status: SuggestionStatus): VerificationTone {
  if (status === "PENDING") return "amber";
  if (status === "ACCEPTED") return "green";
  if (status === "DISMISSED") return "red";
  return "cyan";
}

export default function SuggestionsPage() {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredSuggestions = useMemo(() => {
    if (filterStatus === "ALL") return DEMO_SUGGESTIONS;
    return DEMO_SUGGESTIONS.filter((s) => s.status === filterStatus);
  }, [filterStatus]);

  const stats = useMemo(() => {
    return {
      active: 15,
      accepted: 42,
      dismissed: 8,
      accuracy: 87,
    };
  }, []);

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "DISMISSED", label: "Dismissed" },
    { value: "EXPIRED", label: "Expired" },
  ];

  const columns: RowColumn<Suggestion>[] = [
    {
      key: "suggestion",
      header: "Suggestion",
      width: "minmax(0, 3fr)",
      render: (rec) => (
        <span className="text-white/85 text-xs">{rec.suggestion}</span>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0, 1fr)",
      render: (rec) => (
        <VerificationChip tone="purple">{rec.module}</VerificationChip>
      ),
    },
    {
      key: "confidence",
      header: "Confidence",
      width: "minmax(0, 1.2fr)",
      align: "right",
      render: (rec) => (
        <div className="flex items-center gap-2 justify-end">
          <div className="w-10 h-1 rounded bg-[#1A1D33] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A098F8] to-[#7B6EF6]"
              style={{ width: `${rec.confidence}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-white/85">
            {rec.confidence}%
          </span>
        </div>
      ),
    },
    {
      key: "impact",
      header: "Impact",
      width: "minmax(0, 1fr)",
      render: (rec) => (
        <VerificationChip tone={impactTone(rec.impact)}>
          {rec.impact}
        </VerificationChip>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <VerificationChip tone={statusTone(rec.status)}>
          {rec.status}
        </VerificationChip>
      ),
    },
  ];

  return (
    <div className="space-y-6 bg-[#0C0E1A] min-h-screen p-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="absolute top-0 left-0 h-px bg-gradient-to-r from-[#7B6EF6] to-transparent w-1/3" />
        <div className="absolute top-3 left-4 text-[#7B6EF6] text-lg">⌈</div>
        <div className="absolute bottom-3 right-4 text-[#7B6EF6] text-lg">⌋</div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#A098F8]/5 via-transparent to-transparent blur-2xl pointer-events-none" />

        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-white/50 mb-2">
            DMO / AI ASSISTANT
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">AI Action Suggestions</h1>
          <p className="text-sm text-white/60">
            Real-time operational recommendations with confidence scoring and impact analysis
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Active"
          value="15"
          sub="Pending action"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="green"
          label="Accepted"
          value="42"
          sub="Implemented"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="red"
          label="Dismissed"
          value="8"
          sub="Not actionable"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="Accuracy"
          value="87%"
          sub="Prediction success"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader
            title="Filter by Status"
            hint="Select status to refine suggestions"
          />
        </div>
        <FilterChipRow<string>
          value={filterStatus}
          options={statusOptions}
          onChange={setFilterStatus}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title={`Suggestions (${filteredSuggestions.length} of 8)`}
          hint="Click a suggestion to view reasoning and expected outcomes"
        />
        <VerificationRowGrid<Suggestion>
          rows={filteredSuggestions}
          columns={columns}
          onRowClick={setSelectedSuggestion}
          emptyTitle="No suggestions found"
          emptyHint="Try adjusting your filter"
        />
      </section>

      {selectedSuggestion && (
        <VerificationDrawer
          open={!!selectedSuggestion}
          onClose={() => setSelectedSuggestion(null)}
          title={selectedSuggestion.suggestion}
          subtitle={`${selectedSuggestion.module} • Confidence: ${selectedSuggestion.confidence}%`}
          severity={
            selectedSuggestion.impact === "HIGH"
              ? "critical"
              : selectedSuggestion.impact === "MEDIUM"
              ? "warning"
              : "info"
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                  Module
                </p>
                <VerificationChip tone="purple">
                  {selectedSuggestion.module}
                </VerificationChip>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                  Impact
                </p>
                <VerificationChip tone={impactTone(selectedSuggestion.impact)}>
                  {selectedSuggestion.impact}
                </VerificationChip>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                  Status
                </p>
                <VerificationChip tone={statusTone(selectedSuggestion.status)}>
                  {selectedSuggestion.status}
                </VerificationChip>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Confidence Score
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded bg-[#1A1D33] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A098F8] to-[#7B6EF6]"
                    style={{ width: `${selectedSuggestion.confidence}%` }}
                  />
                </div>
                <span className="text-base font-bold text-white/85">
                  {selectedSuggestion.confidence}%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#1A1D33]/50 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Suggestion Details
              </p>
              <p className="text-xs text-white/85 leading-relaxed">
                This {selectedSuggestion.impact.toLowerCase()}-impact AI suggestion
                has a {selectedSuggestion.confidence}% confidence score and is
                currently in {selectedSuggestion.status.toLowerCase()} status. The
                system recommends this action to optimize your {selectedSuggestion.module}{" "}
                module operations.
              </p>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
