"use client";

import { useEffect, useMemo, useState } from "react";

type NotificationType = "CRITICAL" | "WARNING" | "INFO";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  nextAction?: string;
};

function PriorityBadge({ type }: { type: NotificationType }) {
  const styles: Record<NotificationType, string> = {
    CRITICAL: "text-red-400",
    WARNING: "text-yellow-400",
    INFO: "text-green-400",
  };

  return <span className={`text-xs font-semibold ${styles[type]}`}>{type}</span>;
}

export default function NotificationsPage() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | NotificationType>("ALL");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? `Failed: ${res.status}`);
        const rows = Array.isArray(json) ? json : (json?.data ?? []);
        setData(rows as NotificationItem[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filtered = useMemo(
    () => (filter === "ALL" ? data : data.filter((n) => n.type === filter)),
    [data, filter]
  );

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <h2 className="text-2xl font-semibold">Notifications</h2>

        <div className="flex gap-3">
          <button onClick={() => setFilter("ALL")} className={`rounded-lg px-3 py-1 ${filter === "ALL" ? "bg-white/20" : "bg-white/10"}`}>All</button>
          <button onClick={() => setFilter("CRITICAL")} className={`rounded-lg px-3 py-1 ${filter === "CRITICAL" ? "bg-red-500/30 text-red-300" : "bg-red-500/20 text-red-400"}`}>Critical</button>
          <button onClick={() => setFilter("WARNING")} className={`rounded-lg px-3 py-1 ${filter === "WARNING" ? "bg-yellow-500/30 text-yellow-300" : "bg-yellow-500/20 text-yellow-400"}`}>Warning</button>
          <button onClick={() => setFilter("INFO")} className={`rounded-lg px-3 py-1 ${filter === "INFO" ? "bg-green-500/30 text-green-300" : "bg-green-500/20 text-green-400"}`}>Info</button>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
        ) : null}

        <div className="space-y-3">
          {loading ? <div className="text-sm text-ehb-textBody">Loading notifications...</div> : null}
          {!loading && filtered.length === 0 ? <div className="text-sm text-ehb-textBody">No notifications found.</div> : null}

          {!loading &&
            filtered.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-400">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(n.time).toLocaleString()}</p>
                  {n.nextAction ? (
                    <p className="mt-1 text-xs text-cyan-300">Next action: {n.nextAction}</p>
                  ) : null}
                </div>
                <PriorityBadge type={n.type} />
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

