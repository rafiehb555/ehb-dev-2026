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

type RecCategory = "GROWTH" | "COMPLIANCE" | "EFFICIENCY" | "RISK";
type RecEffort = "LOW" | "MEDIUM" | "HIGH";
type RecStatus = "NEW" | "IN_PROGRESS" | "IMPLEMENTED" | "REJECTED";

type Recommendation = {
  id: string;
  title: string;
  category: RecCategory;
  impactScore: number;
  effort: RecEffort;
  status: RecStatus;
};

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "REC001",
    title: "Implement Advanced STL Prediction Model",
    category: "EFFICIENCY",
    impactScore: 89,
    effort: "HIGH",
    status: "IN_PROGRESS",
  },
  {
    id: "REC002",
    title: "Establish PSS Multi-Modal Liveness",
    category: "COMPLIANCE",
    impactScore: 76,
    effort: "HIGH",
    status: "NEW",
  },
  {
    id: "REC003",
    title: "Decentralize CRB Certification Authority",
    category: "GROWTH",
    impactScore: 94,
    effort: "HIGH",
    status: "IMPLEMENTED",
  },
  {
    id: "REC004",
    title: "Automate Wallet Dispute Resolution",
    category: "EFFICIENCY",
    impactScore: 72,
    effort: "MEDIUM",
    status: "NEW",
  },
  {
    id: "REC005",
    title: "Create Dynamic STL Tier Pricing Model",
    category: "GROWTH",
    impactScore: 87,
    effort: "MEDIUM",
    status: "NEW",
  },
  {
    id: "REC006",
    title: "Implement Blockchain STL Proof-of-History",
    category: "COMPLIANCE",
    impactScore: 81,
    effort: "HIGH",
    status: "NEW",
  },
  {
    id: "REC007",
    title: "Build PSS Biometric Risk Score Engine",
    category: "RISK",
    impactScore: 79,
    effort: "MEDIUM",
    status: "IN_PROGRESS",
  },
  {
    id: "REC008",
    title: "Launch CRB Blockchain Certificate Issuance",
    category: "GROWTH",
    impactScore: 92,
    effort: "HIGH",
    status: "NEW",
  },
];

function categoryTone(category: RecCategory): VerificationTone {
  const tones: Record<RecCategory, VerificationTone> = {
    GROWTH: "teal",
    COMPLIANCE: "purple",
    EFFICIENCY: "green",
    RISK: "red",
  };
  return tones[category];
}

function effortTone(effort: RecEffort): VerificationTone {
  if (effort === "HIGH") return "red";
  if (effort === "MEDIUM") return "amber";
  return "green";
}

function statusTone(status: RecStatus): VerificationTone {
  if (status === "IMPLEMENTED") return "green";
  if (status === "IN_PROGRESS") return "teal";
  if (status === "NEW") return "amber";
  return "red";
}

export default function RecommendationsPage() {
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const filteredRecs = useMemo(() => {
    if (filterCategory === "ALL") return DEMO_RECOMMENDATIONS;
    return DEMO_RECOMMENDATIONS.filter((r) => r.category === filterCategory);
  }, [filterCategory]);

  const stats = useMemo(() => {
    return {
      active: 8,
      implemented: 2,
      avgImpact: 78,
      categories: 4,
    };
  }, []);

  const categoryOptions = [
    { value: "ALL", label: "All Categories" },
    { value: "GROWTH", label: "Growth" },
    { value: "COMPLIANCE", label: "Compliance" },
    { value: "EFFICIENCY", label: "Efficiency" },
    { value: "RISK", label: "Risk" },
  ];

  const columns: RowColumn<Recommendation>[] = [
    {
      key: "title",
      header: "Recommendation",
      width: "minmax(0, 2.5fr)",
      render: (rec) => (
        <span className="text-white/85 text-xs">{rec.title}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <VerificationChip tone={categoryTone(rec.category)}>
          {rec.category}
        </VerificationChip>
      ),
    },
    {
      key: "impactScore",
      header: "Impact",
      width: "minmax(0, 1fr)",
      align: "right",
      render: (rec) => (
        <div className="flex items-center gap-2 justify-end">
          <div className="w-10 h-1 rounded bg-[#1A1D33] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A098F8] to-[#7B6EF6]"
              style={{ width: `${rec.impactScore}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-white/85">
            {rec.impactScore}
          </span>
        </div>
      ),
    },
    {
      key: "effort",
      header: "Effort",
      width: "minmax(0, 1fr)",
      render: (rec) => (
        <VerificationChip tone={effortTone(rec.effort)}>
          {rec.effort}
        </VerificationChip>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <VerificationChip tone={statusTone(rec.status)}>
          {rec.status.replace(/_/g, " ")}
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Recommendations</h1>
          <p className="text-sm text-white/60">
            Strategic recommendations for long-term platform improvements
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Active"
          value="8"
          sub="Strategic initiatives"
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

        <VerificationStatCard
          tone="green"
          label="Implemented"
          value="23"
          sub="Successfully launched"
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
          tone="amber"
          label="Avg Impact"
          value="78"
          sub="Score per initiative"
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
          tone="teal"
          label="Categories"
          value="4"
          sub="Growth, Compliance, Efficiency, Risk"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader
            title="Filter by Category"
            hint="Select category to refine recommendations"
          />
        </div>
        <FilterChipRow<string>
          value={filterCategory}
          options={categoryOptions}
          onChange={setFilterCategory}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title={`Recommendations (${filteredRecs.length} of 8)`}
          hint="Click a recommendation to view implementation details"
        />
        <VerificationRowGrid<Recommendation>
          rows={filteredRecs}
          columns={columns}
          onRowClick={setSelectedRec}
          emptyTitle="No recommendations found"
          emptyHint="Try adjusting your filter"
        />
      </section>

      {selectedRec && (
        <VerificationDrawer
          open={!!selectedRec}
          onClose={() => setSelectedRec(null)}
          title={selectedRec.title}
          subtitle={`${selectedRec.category} • Impact: ${selectedRec.impactScore}`}
          severity={
            selectedRec.status === "IMPLEMENTED"
              ? "info"
              : selectedRec.status === "NEW"
              ? "warning"
              : "high"
          }
        >
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Category
              </p>
              <VerificationChip tone={categoryTone(selectedRec.category)}>
                {selectedRec.category}
              </VerificationChip>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Impact Score
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded bg-[#1A1D33] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A098F8] to-[#7B6EF6]"
                    style={{ width: `${selectedRec.impactScore}%` }}
                  />
                </div>
                <span className="text-base font-bold text-white/85">
                  {selectedRec.impactScore}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                  Effort Required
                </p>
                <VerificationChip tone={effortTone(selectedRec.effort)}>
                  {selectedRec.effort}
                </VerificationChip>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                  Status
                </p>
                <VerificationChip tone={statusTone(selectedRec.status)}>
                  {selectedRec.status.replace(/_/g, " ")}
                </VerificationChip>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#1A1D33]/50 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Recommendation Details
              </p>
              <p className="text-xs text-white/85 leading-relaxed">
                This strategic initiative focuses on enhancing the platform's
                {selectedRec.category === "GROWTH" && " growth potential"}
                {selectedRec.category === "COMPLIANCE" && " compliance posture"}
                {selectedRec.category === "EFFICIENCY" && " operational efficiency"}
                {selectedRec.category === "RISK" && " risk management capabilities"} with
                an estimated impact score of {selectedRec.impactScore}/100. Implementation
                requires {selectedRec.effort.toLowerCase()} effort and is currently in{" "}
                {selectedRec.status === "NEW" && "planning"}
                {selectedRec.status === "IN_PROGRESS" && "active development"}
                {selectedRec.status === "IMPLEMENTED" && "production"}
                {selectedRec.status === "REJECTED" && "review"} status.
              </p>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
