"use client";

import { useEffect, useState } from "react";

type AffiliateData = {
  total: number;
  today: number;
  referrals: number;
  active: number;
  link: string;
  users: Array<{
    id: string;
    name: string;
    level: number;
    earnings: number;
    status: string;
  }>;
  suggestions?: string[];
};

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}

export default function AffiliatePage() {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch("/api/affiliate", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? `Failed: ${res.status}`);
        const payload = (json?.data ?? json) as AffiliateData;
        setData(payload);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load affiliate data");
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

  async function copyLink() {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <h2 className="text-2xl font-semibold">Affiliate Dashboard</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card title="Total Earnings" value={`$${data.total}`} />
          <Card title="Today Earnings" value={`$${data.today}`} />
          <Card title="Referrals" value={data.referrals} />
          <Card title="Active Users" value={data.active} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-sm text-gray-400">Your Referral Link</p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm break-all">{data.link}</span>
            <button onClick={copyLink} className="rounded-lg bg-blue-500 px-3 py-1 text-sm">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {data.suggestions && data.suggestions.length > 0 ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="mb-2 text-sm font-semibold text-emerald-200">AI Suggestions</p>
            <ul className="space-y-1 text-sm text-emerald-100">
              {data.suggestions.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="text-left">Level</th>
                <th className="text-left">Earnings</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-3">{u.name}</td>
                  <td>{u.level}</td>
                  <td>${u.earnings}</td>
                  <td className={u.status.toLowerCase() === "active" ? "text-green-400" : "text-amber-400"}>{u.status}</td>
                </tr>
              ))}
              {data.users.length === 0 ? (
                <tr>
                  <td className="p-4 text-ehb-textBody" colSpan={4}>
                    No referral users yet.
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

