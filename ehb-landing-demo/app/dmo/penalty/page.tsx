"use client";

import { useEffect, useMemo, useState } from "react";

type PenaltyStatus = "ACTIVE" | "RESOLVED" | "APPEAL";

type PenaltyRow = {
  id: string;
  user: { name: string };
  type: "SLA_DELAY" | "REFILL_MISS" | "FRAUD" | "QUALITY";
  amount: number;
  reason: string;
  status: PenaltyStatus;
  createdAt?: string;
  stlImpact?: number;
};

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: PenaltyStatus }) {
  const colors: Record<PenaltyStatus, string> = {
    ACTIVE: "text-red-400",
    RESOLVED: "text-green-400",
    APPEAL: "text-yellow-400",
  };

  return <span className={`text-xs font-semibold ${colors[status]}`}>{status}</span>;
}

export default function PenaltyPage() {
  const [data, setData] = useState<PenaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/penalty", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? `Failed: ${res.status}`);
        const rows = Array.isArray(json) ? json : (json?.data ?? []);
        setData(rows as PenaltyRow[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load penalty data");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const stats = useMemo(() => {
    const total = data.length;
    const today = data.filter((p) =>
      p.createdAt ? p.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10) : false
    ).length;
    const highRisk = data.filter((p) => p.type === "FRAUD" || (p.stlImpact ?? 0) <= -15).length;
    const resolved = data.filter((p) => p.status === "RESOLVED").length;
    return { total, today, highRisk, resolved };
  }, [data]);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <h2 className="text-2xl font-semibold">Penalty System</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card title="Total Penalties" value={stats.total} />
          <Card title="Today" value={stats.today} />
          <Card title="High Risk" value={stats.highRisk} />
          <Card title="Resolved" value={stats.resolved} />
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
                <th className="text-left">Amount</th>
                <th className="text-left">Reason</th>
                <th className="text-left">Status</th>
                <th className="text-left">STL Impact</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-slate-300" colSpan={6}>
                    Loading penalties...
                  </td>
                </tr>
              ) : null}

              {!loading && data.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-300" colSpan={6}>
                    No penalties found.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                data.map((p) => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3">{p.user.name}</td>
                    <td>{p.type}</td>
                    <td className="text-red-400">${p.amount}</td>
                    <td>{p.reason}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className={(p.stlImpact ?? 0) <= -15 ? "text-rose-300" : "text-amber-300"}>
                      {(p.stlImpact ?? -5).toString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

