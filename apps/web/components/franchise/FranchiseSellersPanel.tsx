"use client";

/**
 * Franchise Manager — Assigned Sellers panel.
 * Consumes GET /api/franchise/my-sellers.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

interface Seller {
  id: string;
  userId: string;
  email: string;
  assignedAt: string;
  franchise: { id: string; name: string; city: string; level: string };
  storeName: string | null;
  category: string | null;
  country: string | null;
  onboardingState: string | null;
  applicationStatus: string | null;
  riskLevel: string | null;
}

export function FranchiseSellersPanel() {
  const [rows, setRows] = useState<Seller[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/franchise/my-sellers?take=50", { cache: "no-store" });
        const json = await res.json();
        if (json.success) {
          setRows(json.data.rows);
          setTotal(json.data.total);
        } else setError(json?.error?.message ?? "Failed to load sellers.");
      } catch (e: any) {
        setError(e?.message ?? "Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,177,76,0.12) 0%, rgba(19,22,42,0.95) 50%, rgba(41,171,226,0.10) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
          style={{ background: "#22B14C" }}
        />
        <div className="relative flex flex-col gap-1">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
            Franchise Manager
          </div>
          <h1 className="text-2xl font-bold">My Assigned Sellers</h1>
          <p className="text-sm text-white/55">
            Sellers assigned to your franchise after DMO approval. You are their territory inspector.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs w-fit">
            <span className="text-white/50">Total assigned</span>
            <span className="font-bold text-[#22B14C]">{total}</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ background: "rgba(19,22,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {loading ? (
          <div className="p-10 text-center text-white/50">Loading assigned sellers…</div>
        ) : error ? (
          <div className="p-6 text-red-300">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-white/50">
            No sellers assigned yet. They will appear here once DMO approves onboarding.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-white/45">
                <th className="px-5 py-3">Store</th>
                <th className="px-5 py-3">Seller</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Franchise</th>
                <th className="px-5 py-3">State</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-white/5 transition-colors hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-3">
                    <div className="font-semibold text-white">{s.storeName ?? "—"}</div>
                    <div className="text-[11px] text-white/40">{s.onboardingState ?? ""}</div>
                  </td>
                  <td className="px-5 py-3 text-white/70">{s.email}</td>
                  <td className="px-5 py-3 text-white/60">{s.category ?? "—"}</td>
                  <td className="px-5 py-3 text-white/60">{s.country ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="text-white/80">{s.franchise.name}</div>
                    <div className="text-[11px] text-white/40">
                      {s.franchise.city} · {s.franchise.level}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusChip status={s.applicationStatus} />
                  </td>
                  <td className="px-5 py-3">
                    <RiskChip level={s.riskLevel} />
                  </td>
                  <td className="px-5 py-3 text-[12px] text-white/50">
                    {new Date(s.assignedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          href="/dmo/gosellr"
          className="text-xs text-white/50 transition-colors hover:text-white/80"
        >
          → DMO Seller Queue
        </Link>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string | null }) {
  if (!status) return <span className="text-white/30">—</span>;
  const map: Record<string, { fg: string; bg: string }> = {
    APPROVED: { fg: "#22B14C", bg: "rgba(34,177,76,0.15)" },
    IN_REVIEW: { fg: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    NEW: { fg: "#29ABE2", bg: "rgba(41,171,226,0.15)" },
    REJECTED: { fg: "#E53935", bg: "rgba(229,57,53,0.15)" },
    UNDER_INSPECTION: { fg: "#A855F7", bg: "rgba(168,85,247,0.15)" },
  };
  const m = map[status] ?? { fg: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.05)" };
  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: m.fg, background: m.bg, border: `1px solid ${m.fg}44` }}
    >
      {status}
    </span>
  );
}

function RiskChip({ level }: { level: string | null }) {
  if (!level) return <span className="text-white/30">—</span>;
  const map: Record<string, string> = {
    LOW: "#22B14C",
    MEDIUM: "#F59E0B",
    HIGH: "#E53935",
  };
  const c = map[level] ?? "rgba(255,255,255,0.6)";
  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase"
      style={{ color: c, background: `${c}22`, border: `1px solid ${c}44` }}
    >
      {level}
    </span>
  );
}

export default FranchiseSellersPanel;
