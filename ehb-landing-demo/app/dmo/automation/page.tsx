"use client";

import { useEffect, useState } from "react";

type AutomationRuleRow = {
  id: string;
  event: string;
  action: string;
  active: boolean;
};

type AutomationPayload = {
  stats: {
    activeRules: number;
    triggersToday: number;
    autoDecisions: number;
    fraudAlerts: number;
  };
  rules: AutomationRuleRow[];
  suggestions?: string[];
};

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={active ? "text-green-400" : "text-red-400"}>{active ? "Active" : "Disabled"}</span>;
}

export default function AutomationPage() {
  const [data, setData] = useState<AutomationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch("/api/automation", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? `Failed: ${res.status}`);
        setData((json?.data ?? json) as AutomationPayload);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load automation data");
      }
    }
    void load();
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen text-white">
        <div className="container-ehb py-6">{error ? <p className="text-rose-300">{error}</p> : <p>Loading...</p>}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <h2 className="text-2xl font-semibold">AI Automation Panel</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card title="Active Rules" value={data.stats.activeRules} />
          <Card title="Triggers Today" value={data.stats.triggersToday} />
          <Card title="Auto Decisions" value={data.stats.autoDecisions} />
          <Card title="Fraud Alerts" value={data.stats.fraudAlerts} />
        </div>

        {data.suggestions && data.suggestions.length > 0 ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <p className="mb-2 text-sm font-semibold text-cyan-200">AI Suggestions</p>
            <div className="space-y-1 text-sm text-cyan-100">
              {data.suggestions.map((s) => (
                <p key={s}>• {s}</p>
              ))}
            </div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-3 text-left">Event</th>
                <th className="text-left">Action</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.rules.map((r) => (
                <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-3">{r.event}</td>
                  <td>{r.action}</td>
                  <td>
                    <StatusBadge active={r.active} />
                  </td>
                </tr>
              ))}
              {data.rules.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-300" colSpan={3}>
                    No automation rules found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

