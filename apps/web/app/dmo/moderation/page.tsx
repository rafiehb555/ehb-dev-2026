"use client";

import { useState, useEffect, useCallback } from "react";

interface Complaint {
  id:            string;
  complainantId: string;
  targetId:      string;
  targetType:    string;
  type:          string;
  description:   string;
  status:        string;
  aiReviewNote:  string | null;
  createdAt:     string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:      "bg-yellow-600/20 text-yellow-300 border-yellow-500/40",
  AI_REVIEW:    "bg-blue-600/20 text-blue-300 border-blue-500/40",
  HUMAN_REVIEW: "bg-orange-600/20 text-orange-300 border-orange-500/40",
  RESOLVED:     "bg-green-600/20 text-green-300 border-green-500/40",
  DISMISSED:    "bg-white/10 text-white/40 border-white/20",
};

const TYPE_ICONS: Record<string, string> = {
  FAKE_PRODUCT:   "📦",
  NOT_DELIVERED:  "🚚",
  FRAUD:          "🚨",
  QUALITY_ISSUE:  "⚠️",
  FAKE_REVIEW:    "⭐",
  HARASSMENT:     "🛑",
  OTHER:          "📋",
};

export default function DmoModerationPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("PENDING");
  const [selected, setSelected]     = useState<string | null>(null);
  const [resolving, setResolving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/gosellr/complaint?status=${filter}`);
      const json = await res.json();
      if (json.success) setComplaints(json.data.complaints);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function resolveComplaint(id: string, action: "RESOLVED" | "DISMISSED") {
    setResolving(true);
    await fetch(`/api/gosellr/complaint/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    }).catch(() => {});
    await load();
    setResolving(false);
    setSelected(null);
  }

  const selectedComplaint = complaints.find((c) => c.id === selected);

  return (
    <main className="min-h-screen bg-[#05050f] text-white p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">⚖️</span>
          <h1 className="text-2xl font-black">Complaint Moderation</h1>
        </div>
        <p className="text-white/40 text-sm">3-step resolution: AI Review → Human Review → Final Decision (72hr SLA)</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["PENDING", "AI_REVIEW", "HUMAN_REVIEW", "RESOLVED", "DISMISSED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              filter === s
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Complaint list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-white/30">
              <div className="text-3xl animate-pulse mb-2">⏳</div>
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <div className="text-3xl mb-2">✅</div>
              <p>No {filter.toLowerCase().replace("_", " ")} complaints</p>
            </div>
          ) : (
            complaints.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id === selected ? null : c.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                  selected === c.id
                    ? "border-blue-500/50 bg-blue-950/20 ring-1 ring-blue-500/30"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{TYPE_ICONS[c.type] ?? "📋"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-white">{c.type.replace("_", " ")}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[c.status] ?? ""}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 truncate">{c.description}</p>
                    <p className="text-xs text-white/30 mt-1">Target: {c.targetId.slice(0, 16)}...</p>
                    {c.aiReviewNote && (
                      <p className="text-xs text-blue-400 mt-1">🤖 {c.aiReviewNote}</p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedComplaint && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 h-fit sticky top-6">
            <h3 className="font-black text-white mb-4">
              {TYPE_ICONS[selectedComplaint.type]} Complaint Detail
            </h3>

            <div className="space-y-3 mb-5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Type</p>
                <p className="text-white font-semibold">{selectedComplaint.type.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Status</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_STYLES[selectedComplaint.status]}`}>
                  {selectedComplaint.status.replace("_", " ")}
                </span>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Description</p>
                <p className="text-white/70 text-sm leading-relaxed">{selectedComplaint.description}</p>
              </div>
              {selectedComplaint.aiReviewNote && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">AI Review</p>
                  <p className="text-blue-300 text-sm">🤖 {selectedComplaint.aiReviewNote}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Target ID</p>
                <p className="font-mono text-white/60 text-xs">{selectedComplaint.targetId}</p>
              </div>
            </div>

            {/* Resolution actions */}
            <div className="flex gap-2">
              <button
                onClick={() => resolveComplaint(selectedComplaint.id, "RESOLVED")}
                disabled={resolving}
                className="flex-1 py-2.5 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-300 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                ✅ Resolve
              </button>
              <button
                onClick={() => resolveComplaint(selectedComplaint.id, "DISMISSED")}
                disabled={resolving}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                ❌ Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
