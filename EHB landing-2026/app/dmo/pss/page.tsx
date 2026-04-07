"use client";

import { useEffect, useState } from "react";
import PSSDrawer from "@/components/dmo/PSSDrawer";
import { RiskBadge } from "@/components/dmo/RiskBadge";

type PssCase = {
  id: string;
  user: { name: string; email?: string | null };
  status: string;
  risk: string;
  stage: string;
  updatedAt: string;
};

export default function PSSPage() {
  const [cases, setCases] = useState<PssCase[]>([]);
  const [selected, setSelected] = useState<PssCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/pss/cases", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? `Failed: ${res.status}`);

        const rows: PssCase[] = Array.isArray(json)
          ? json
          : (json?.data?.cases ?? json?.cases ?? []);
        setCases(rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load PSS cases");
      } finally {
        setLoading(false);
      }
    }

    void loadCases();
  }, []);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <h2 className="text-2xl font-semibold">PSS Verification</h2>

        {error ? (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-ehb-textMuted">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="text-left">Status</th>
                <th className="text-left">Risk</th>
                <th className="text-left">Stage</th>
                <th className="text-left">Updated</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-ehb-textBody" colSpan={5}>
                    Loading cases...
                  </td>
                </tr>
              ) : null}

              {!loading && cases.length === 0 ? (
                <tr>
                  <td className="p-4 text-ehb-textBody" colSpan={5}>
                    No cases found.
                  </td>
                </tr>
              ) : null}

              {!loading &&
                cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="cursor-pointer border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="p-3">{c.user.name}</td>
                    <td>{c.status}</td>
                    <td>
                      <RiskBadge risk={c.risk} />
                    </td>
                    <td>{c.stage}</td>
                    <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {selected ? <PSSDrawer data={selected} onClose={() => setSelected(null)} /> : null}
      </div>
    </main>
  );
}

