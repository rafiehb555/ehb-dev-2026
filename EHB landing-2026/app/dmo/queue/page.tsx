"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type QueueItemType =
  | "APPLICATION" | "FRAUD_ALERT" | "COMPLAINT"
  | "ORDER_REVIEW" | "SELLER_ONBOARDING" | "COMPLIANCE" | "APPROVAL";

interface QueueItem {
  id:          string;
  type:        QueueItemType;
  priority:    Priority;
  title:       string;
  description: string;
  entityId:    string;
  createdAt:   string;
  actionUrl:   string;
}

const PRIORITY_STYLES: Record<Priority, { badge: string; icon: string; order: number }> = {
  CRITICAL: { badge: "bg-red-600/20 text-red-300 border-red-500/40",    icon: "🚨", order: 0 },
  HIGH:     { badge: "bg-orange-600/20 text-orange-300 border-orange-500/40", icon: "⚠️", order: 1 },
  MEDIUM:   { badge: "bg-yellow-600/20 text-yellow-300 border-yellow-500/40", icon: "🔔", order: 2 },
  LOW:      { badge: "bg-blue-600/20 text-blue-300 border-blue-500/40",   icon: "ℹ️", order: 3 },
};

const TYPE_STYLES: Record<QueueItemType, { icon: string; color: string }> = {
  FRAUD_ALERT:        { icon: "🛡️", color: "border-red-500/30 bg-red-950/10" },
  COMPLAINT:          { icon: "⚖️", color: "border-orange-500/30 bg-orange-950/10" },
  ORDER_REVIEW:       { icon: "📦", color: "border-yellow-500/30 bg-yellow-950/10" },
  SELLER_ONBOARDING:  { icon: "🏪", color: "border-cyan-500/30 bg-cyan-950/10" },
  APPLICATION:        { icon: "📝", color: "border-blue-500/30 bg-blue-950/10" },
  COMPLIANCE:         { icon: "📋", color: "border-purple-500/30 bg-purple-950/10" },
  APPROVAL:           { icon: "✅", color: "border-green-500/30 bg-green-950/10" },
};

const OPEN_SELLER_STATUSES = new Set(["NEW", "IN_REVIEW", "UNDER_INSPECTION"]);

export default function DmoQueuePage() {
  const [items, setItems]       = useState<QueueItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<QueueItemType | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");

  // Build unified queue from multiple APIs
  const loadQueue = useCallback(async () => {
    setLoading(true);
    const all: QueueItem[] = [];

    // 1. Pending applications
    try {
      const res  = await fetch("/api/dmo/applications?status=PENDING&limit=20");
      const json = await res.json();
      if (json.success) {
        for (const app of json.data.applications ?? []) {
          all.push({
            id:          app.id,
            type:        "APPLICATION",
            priority:    "MEDIUM",
            title:       `Application: ${app.type ?? "Unknown"}`,
            description: app.applicantId,
            entityId:    app.applicantId,
            createdAt:   app.createdAt,
            actionUrl:   `/dmo/applications`,
          });
        }
      }
    } catch {}

    // 2. Fraud queue (CRITICAL + HIGH only)
    try {
      const res  = await fetch("/api/fraud/queue?limit=20");
      const json = await res.json();
      if (json.success) {
        for (const entry of json.data.queue ?? []) {
          if (entry.tier === "LOW") continue;
          all.push({
            id:          `fraud-${entry.entityId}`,
            type:        "FRAUD_ALERT",
            priority:    entry.tier === "CRITICAL" ? "CRITICAL" : entry.tier === "HIGH" ? "HIGH" : "MEDIUM",
            title:       `Fraud Alert: ${entry.entityType}`,
            description: `Risk score ${entry.score}/100 — ${entry.signals.length} signal(s)`,
            entityId:    entry.entityId,
            createdAt:   new Date().toISOString(),
            actionUrl:   `/dmo/fraud`,
          });
        }
      }
    } catch {}

    // 3. Pending complaints
    try {
      const res  = await fetch("/api/gosellr/complaint?status=PENDING");
      const json = await res.json();
      if (json.success) {
        for (const c of json.data.complaints ?? []) {
          all.push({
            id:          `complaint-${c.id}`,
            type:        "COMPLAINT",
            priority:    c.type === "FRAUD" ? "CRITICAL" : c.type === "FAKE_PRODUCT" ? "HIGH" : "MEDIUM",
            title:       `Complaint: ${c.type.replace("_", " ")}`,
            description: c.description.slice(0, 80) + "...",
            entityId:    c.targetId,
            createdAt:   c.createdAt,
            actionUrl:   `/dmo/moderation`,
          });
        }
      }
    } catch {}

    // 4. Pending approvals
    try {
      const res  = await fetch("/api/dmo/approvals?status=PENDING&limit=10");
      const json = await res.json();
      if (json.success) {
        for (const a of json.data.approvals ?? []) {
          all.push({
            id:          `approval-${a.id}`,
            type:        "APPROVAL",
            priority:    "LOW",
            title:       `Approval Required`,
            description: a.notes ?? "Pending decision",
            entityId:    a.applicationId,
            createdAt:   a.createdAt,
            actionUrl:   `/dmo/approvals`,
          });
        }
      }
    } catch {}

    // 5. Seller onboarding (open applications only)
    try {
      const res = await fetch("/api/dmo/applications?type=SELLER_ONBOARDING&take=30");
      const json = await res.json();
      if (json.success) {
        for (const app of json.data.applications ?? []) {
          if (!OPEN_SELLER_STATUSES.has(String(app.status))) continue;
          const payload = app.payload as { storeName?: string } | null;
          const storeLabel = payload?.storeName ? String(payload.storeName) : "Seller";
          all.push({
            id:          `seller-onboarding-${app.id}`,
            type:        "SELLER_ONBOARDING",
            priority:    app.priority === "CRITICAL" ? "CRITICAL" : app.priority === "HIGH" ? "HIGH" : "MEDIUM",
            title:       `Seller onboarding: ${storeLabel}`,
            description: `${app.status} · risk ${app.riskScore ?? "—"}`,
            entityId:    app.id,
            createdAt:   app.createdAt,
            actionUrl:   `/dmo/applications`,
          });
        }
      }
    } catch {}

    // 6. Order reviews
    try {
      const res  = await fetch("/api/dmo/applications?type=ORDER_REVIEW&take=20");
      const json = await res.json();
      if (json.success) {
        for (const app of json.data.applications ?? []) {
          all.push({
            id:          `order-review-${app.id}`,
            type:        "ORDER_REVIEW",
            priority:    app.priority === "CRITICAL" ? "CRITICAL" : app.priority === "HIGH" ? "HIGH" : "MEDIUM",
            title:       "Order review required",
            description: `Order review workflow for ${app.type}`,
            entityId:    app.id,
            createdAt:   app.createdAt,
            actionUrl:   `/dmo/applications`,
          });
        }
      }
    } catch {}

    // 7. Compliance / refill warnings
    try {
      const res = await fetch("/api/refilling");
      const json = await res.json();
      if (json.success) {
        for (const refill of json.data ?? []) {
          if (refill.status === "COMPLETED") continue;
          all.push({
            id:          `compliance-${refill.id}`,
            type:        "COMPLIANCE",
            priority:    refill.status === "EXPIRED" ? "CRITICAL" : "MEDIUM",
            title:       `${refill.type} compliance`,
            description: `${refill.user.name} due ${new Date(refill.dueDate).toLocaleDateString()}`,
            entityId:    refill.id,
            createdAt:   refill.dueDate,
            actionUrl:   `/dmo/refilling`,
          });
        }
      }
    } catch {}

    // Sort by priority order then date
    all.sort((a, b) => {
      const pDiff = PRIORITY_STYLES[a.priority].order - PRIORITY_STYLES[b.priority].order;
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setItems(all);
    setLoading(false);
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  const filtered = items.filter((i) => {
    if (filter !== "ALL" && i.type !== filter) return false;
    if (priority !== "ALL" && i.priority !== priority) return false;
    return true;
  });

  const counts = {
    CRITICAL: items.filter((i) => i.priority === "CRITICAL").length,
    HIGH:     items.filter((i) => i.priority === "HIGH").length,
    MEDIUM:   items.filter((i) => i.priority === "MEDIUM").length,
    LOW:      items.filter((i) => i.priority === "LOW").length,
  };

  return (
    <main className="min-h-screen bg-[#05050f] text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">📋</span>
          <h1 className="text-2xl font-black">DMO Unified Operations Queue</h1>
          <span className="text-sm px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full font-semibold">
            {items.length} items
          </span>
        </div>
        <p className="text-white/40 text-sm">Applications · Fraud · Complaints · Seller onboarding · Order reviews · Approvals · Compliance</p>
      </div>

      {/* Priority summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {(["CRITICAL","HIGH","MEDIUM","LOW"] as Priority[]).map((p) => {
          const s = PRIORITY_STYLES[p];
          return (
            <button
              key={p}
              onClick={() => setPriority(priority === p ? "ALL" : p)}
              className={`rounded-xl border p-3 text-left transition-all hover:scale-[1.02] ${s.badge} ${priority === p ? "ring-2 ring-white/20" : ""}`}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-white">{counts[p]}</div>
              <div className="text-xs font-bold opacity-80">{p}</div>
            </button>
          );
        })}
      </div>

      {/* Type filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter("ALL")} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === "ALL" ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-white/50"}`}>
          All Types
        </button>
        {(Object.keys(TYPE_STYLES) as QueueItemType[]).map((t) => (
          <button key={t} onClick={() => setFilter(filter === t ? "ALL" : t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === t ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-white/50"}`}
          >
            {TYPE_STYLES[t].icon} {t.replace("_", " ")}
          </button>
        ))}
        <button onClick={loadQueue} className="ml-auto px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
          🔄 Refresh
        </button>
      </div>

      {/* Queue list */}
      {loading ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-4xl animate-pulse mb-3">⏳</div>
          <p>Loading queue...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-4xl mb-3">✅</div>
          <p>Queue is clear for this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const pStyle = PRIORITY_STYLES[item.priority];
            const tStyle = TYPE_STYLES[item.type];
            return (
              <div key={item.id} className={`rounded-2xl border ${tStyle.color} p-4 flex items-center gap-4 hover:scale-[1.005] transition-all`}>
                <div className="text-2xl flex-shrink-0">{tStyle.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pStyle.badge}`}>
                      {pStyle.icon} {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 truncate">{item.description}</p>
                </div>
                <Link
                  href={item.actionUrl}
                  className="flex-shrink-0 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Review →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
