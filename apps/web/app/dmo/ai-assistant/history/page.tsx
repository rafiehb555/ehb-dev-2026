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

type ResponseType = "SUGGESTION" | "RECOMMENDATION" | "ANALYSIS" | "CHAT";

type AiInteraction = {
  id: string;
  query: string;
  responseType: ResponseType;
  module: string;
  respondedAt: string;
  helpful: boolean;
};

const DEMO_INTERACTIONS: AiInteraction[] = [
  {
    id: "INT001",
    query: "Why did STL drop for user_ali_001 by 15 points?",
    responseType: "ANALYSIS",
    module: "STL",
    respondedAt: "2026-04-12T16:30:00Z",
    helpful: true,
  },
  {
    id: "INT002",
    query: "Recommend optimization for KYC approval rate",
    responseType: "RECOMMENDATION",
    module: "PSS",
    respondedAt: "2026-04-12T16:15:00Z",
    helpful: true,
  },
  {
    id: "INT003",
    query: "Flag high-value wallet transactions >50k",
    responseType: "SUGGESTION",
    module: "WALLET",
    respondedAt: "2026-04-12T15:50:00Z",
    helpful: true,
  },
  {
    id: "INT004",
    query: "What's CRB certification processing time?",
    responseType: "CHAT",
    module: "CRB",
    respondedAt: "2026-04-12T15:20:00Z",
    helpful: true,
  },
  {
    id: "INT005",
    query: "Analyze fraud patterns in last 30 days",
    responseType: "ANALYSIS",
    module: "STL",
    respondedAt: "2026-04-12T14:45:00Z",
    helpful: true,
  },
  {
    id: "INT006",
    query: "Compare STL distribution across franchises",
    responseType: "ANALYSIS",
    module: "STL",
    respondedAt: "2026-04-12T14:10:00Z",
    helpful: false,
  },
  {
    id: "INT007",
    query: "Suggest PSS improvements for rural users",
    responseType: "RECOMMENDATION",
    module: "PSS",
    respondedAt: "2026-04-12T13:35:00Z",
    helpful: true,
  },
  {
    id: "INT008",
    query: "Alert on wallet settlement delays >4hrs",
    responseType: "SUGGESTION",
    module: "WALLET",
    respondedAt: "2026-04-12T13:00:00Z",
    helpful: true,
  },
  {
    id: "INT009",
    query: "What's the CRB appeal process?",
    responseType: "CHAT",
    module: "CRB",
    respondedAt: "2026-04-12T12:15:00Z",
    helpful: true,
  },
  {
    id: "INT010",
    query: "Predict Q2 fraud volume based on trends",
    responseType: "ANALYSIS",
    module: "STL",
    respondedAt: "2026-04-12T11:30:00Z",
    helpful: true,
  },
];

function responseTypeTone(type: ResponseType): VerificationTone {
  const tones: Record<ResponseType, VerificationTone> = {
    SUGGESTION: "amber",
    RECOMMENDATION: "purple",
    ANALYSIS: "teal",
    CHAT: "green",
  };
  return tones[type];
}

export default function HistoryPage() {
  const [selectedInteraction, setSelectedInteraction] =
    useState<AiInteraction | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredInteractions = useMemo(() => {
    if (filterType === "ALL") return DEMO_INTERACTIONS;
    return DEMO_INTERACTIONS.filter((i) => i.responseType === filterType);
  }, [filterType]);

  const stats = useMemo(() => {
    const helpful = DEMO_INTERACTIONS.filter((i) => i.helpful).length;
    return {
      total: 890,
      thisMonth: 124,
      avgTime: 1.2,
      satisfaction: 92,
      helpful,
    };
  }, []);

  const responseTypeOptions = [
    { value: "ALL", label: "All Types" },
    { value: "SUGGESTION", label: "Suggestions" },
    { value: "RECOMMENDATION", label: "Recommendations" },
    { value: "ANALYSIS", label: "Analysis" },
    { value: "CHAT", label: "Chat" },
  ];

  const columns: RowColumn<AiInteraction>[] = [
    {
      key: "respondedAt",
      header: "Timestamp",
      width: "minmax(0, 1.2fr)",
      render: (rec) => {
        const dt = new Date(rec.respondedAt);
        return (
          <div className="text-xs">
            <div>{dt.toLocaleDateString()}</div>
            <div className="text-white/50">
              {dt.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: "query",
      header: "Query",
      width: "minmax(0, 2fr)",
      render: (rec) => (
        <span className="text-white/85 text-xs">{rec.query}</span>
      ),
    },
    {
      key: "responseType",
      header: "Type",
      width: "minmax(0, 1.2fr)",
      render: (rec) => (
        <VerificationChip tone={responseTypeTone(rec.responseType)}>
          {rec.responseType}
        </VerificationChip>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0, 0.9fr)",
      render: (rec) => (
        <VerificationChip tone="purple">{rec.module}</VerificationChip>
      ),
    },
    {
      key: "helpful",
      header: "Helpful",
      width: "minmax(0, 0.8fr)",
      render: (rec) => (
        <VerificationChip tone={rec.helpful ? "green" : "red"}>
          {rec.helpful ? "YES" : "NO"}
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Interaction History</h1>
          <p className="text-sm text-white/60">
            Complete audit log of AI interactions, response times, and satisfaction metrics
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total Interactions"
          value="890"
          sub="All-time"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="This Month"
          value="124"
          sub="Last 30 days"
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
          tone="amber"
          label="Avg Response Time"
          value="1.2s"
          sub="Seconds"
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
          label="Satisfaction"
          value="92%"
          sub="Helpful responses"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.788 1.106H2a2 2 0 01-2-2V8a2 2 0 012-2h1.657a2 2 0 011.414.586l2.828-2.829a2 2 0 012.828 0l2.828 2.829a2 2 0 001.414.586H20a2 2 0 012 2v12a2 2 0 01-2 2h-2.5" />
            </svg>
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="mb-4">
          <SectionHeader
            title="Filter by Response Type"
            hint="Select response type to refine interactions"
          />
        </div>
        <FilterChipRow<string>
          value={filterType}
          options={responseTypeOptions}
          onChange={setFilterType}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          title={`Interaction Records (${filteredInteractions.length} of 10)`}
          hint="Click a row to view full interaction detail"
        />
        <VerificationRowGrid<AiInteraction>
          rows={filteredInteractions}
          columns={columns}
          onRowClick={setSelectedInteraction}
          emptyTitle="No interactions found"
          emptyHint="Try adjusting your filter"
        />
      </section>

      {selectedInteraction && (
        <VerificationDrawer
          open={!!selectedInteraction}
          onClose={() => setSelectedInteraction(null)}
          title={selectedInteraction.query}
          subtitle={`${selectedInteraction.responseType} • ${selectedInteraction.module} module`}
          severity={selectedInteraction.helpful ? "info" : "warning"}
        >
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Response Type
              </p>
              <VerificationChip tone={responseTypeTone(selectedInteraction.responseType)}>
                {selectedInteraction.responseType}
              </VerificationChip>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Module
              </p>
              <p className="text-sm text-white/85">{selectedInteraction.module}</p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Helpful
              </p>
              <VerificationChip
                tone={selectedInteraction.helpful ? "green" : "red"}
              >
                {selectedInteraction.helpful ? "YES" : "NO"}
              </VerificationChip>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
                Timestamp
              </p>
              <p className="font-mono text-xs text-[#A098F8]">
                {new Date(selectedInteraction.respondedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </VerificationDrawer>
      )}
    </div>
  );
}
