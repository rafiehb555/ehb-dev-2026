"use client";

import { useEffect, useMemo, useState } from "react";

type RefillItem = {
  id: string;
  user: { name: string };
  type: "PSS" | "INDUSTRY";
  dueDate: string;
  status: "ACTIVE" | "WARNING" | "EXPIRED" | "COMPLETED";
  stlImpact: string;
};

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: RefillItem["status"] }) {
  const colors: Record<RefillItem["status"], string> = {
    ACTIVE: "text-green-400",
    WARNING: "text-yellow-400",
    EXPIRED: "text-red-400",
    COMPLETED: "text-blue-400",
  };

  return <span className={colors[status]}>{status}</span>;
}

function dueCountdown(dueDate: string) {
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const diff = due - now;
  const days = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? `${days}d left` : `${days}d overdue`;
}

export default function RefillingPage() {
  const [data, setData] = useState<RefillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/refilling", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? `Failed: ${res.status}`);
        const rows = Array.isArray(json) ? json : (json?.data ?? []);
        setData(rows as RefillItem[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load refilling data");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const stats = useMemo(() => {
    const active = data.filter((x) => x.status === "ACTIVE").length;
    const warning = data.filter((x) => x.status === "WARNING").length;
    const expired = data.filter((x) => x.status === "EXPIRED").length;
    const completed = data.filter((x) => x.status === "COMPLETED").length;
    return { active, warning, expired, completed };
  }, [data]);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <h2 className="text-2xl font-semibold">Refilling System</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card title="Active" value={stats.active} />
          <Card title="Expiring Soon" value={stats.warning} />
          <Card title="Expired" value={stats.expired} />
          <Card title="Completed" value={stats.completed} />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="text-left">Type</th>
                <th className="text-left">Due Date</th>
                <th className="text-left">Status</th>
                <th className="text-left">STL Impact</th>
                <th className="text-left">Countdown</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-slate-300" colSpan={6}>
                    Loading refilling records...
                  </td>
                </tr>
              ) : null}

              {!loading && data.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-300" colSpan={6}>
                    No refilling records found.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                data.map((item) => (
                  <tr key={item.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3">{item.user.name}</td>
                    <td>{item.type}</td>
                    <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>{item.stlImpact}</td>
                    <td className="text-xs text-slate-300">{dueCountdown(item.dueDate)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

