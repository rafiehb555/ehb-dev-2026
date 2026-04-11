"use client";

import { useEffect, useState } from "react";
import {
  stlLegacyComplaintWarning,
  stlLegacyCurrentLevelName,
  stlLegacyIsSupremeLevel,
  stlLegacyNextLevelName,
  stlLegacyProgressPercent,
} from "@/lib/stl/stlLegacyDashboardView";

type Snapshot = {
  name: string;
  stlLevel: number;
  trustScore: number;
  progressPercent?: number;
  progress?: { percent?: number };
  nextLevelLevel: number | null;
  blocked: boolean;
  pss?: { kyc?: boolean; complaints?: number };
  crb?: { verifications?: number; requiredVerifications?: number; examsPassed?: number; requiredExams?: number };
  dmo?: { refills?: number; requiredRefills?: number };
  franchise?: { verified?: string[]; pending?: string[] };
  missingRequirements?: string[];
  dataSource?: "live" | "demo";
};

export default function STLDashboard() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    const fetchSTL = async () => {
      try {
        const res = await fetch("/api/stl/full-snapshot", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Failed to fetch STL snapshot");
        setData((json?.data ?? null) as Snapshot | null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchSTL();
  }, []);

  useEffect(() => {
    if (!data) return;
    const progress = stlLegacyProgressPercent(data);
    if (progress === 100) {
      setLevelUp(true);
      const t = setTimeout(() => setLevelUp(false), 3000);
      return () => clearTimeout(t);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 text-white">
        <div className="mb-6 animate-pulse rounded-2xl border border-white/10 bg-gray-900/70 p-6">
          <div className="h-7 w-52 rounded bg-white/10" />
          <div className="mt-3 h-4 w-36 rounded bg-white/10" />
          <div className="mt-2 h-4 w-28 rounded bg-white/10" />
          <div className="mt-5 h-2 w-full rounded bg-white/10" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-white/10 bg-gray-900/70" />
          ))}
        </div>
      </div>
    );
  }
  if (!data) return <div className="p-6 text-red-500">Error loading STL</div>;

  const currentLevelName = stlLegacyCurrentLevelName(data.stlLevel);
  const nextLevelName = stlLegacyNextLevelName(data.nextLevelLevel);
  const progress = stlLegacyProgressPercent(data);
  const complaints = data.pss?.complaints ?? 0;
  const complaintWarning = stlLegacyComplaintWarning(complaints, data.blocked);
  const supremeLevel = stlLegacyIsSupremeLevel(data.stlLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 text-white">
      {levelUp && (
        <div className="fixed right-10 top-10 z-50 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black animate-bounce">
          Level Up!
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-white/10 bg-gray-900/80 p-6 shadow-lg shadow-blue-500/10 backdrop-blur-xl transition-all duration-300 hover:shadow-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
              {data.name || "User"}
            </h2>
            <p className="text-gray-400">
              STL Level:{" "}
              <span
                className={
                  supremeLevel
                    ? "font-bold text-yellow-400 animate-pulse drop-shadow-[0_0_10px_gold]"
                    : "font-semibold text-white"
                }
              >
                {currentLevelName}
              </span>
            </p>
            <p>Trust Score: {data.trustScore}%</p>
          </div>
          <span className={`text-xs ${data.dataSource === "demo" ? "text-amber-400" : "text-green-400"}`}>
            {data.dataSource === "demo" ? "DEMO DATA" : "LIVE DATA"}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-400">Next Level: {nextLevelName}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-700">
            <div
              className="h-2 rounded bg-blue-500 stl-progress-bar transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-sm">{progress}% Complete</p>
        </div>
      </div>

      {complaintWarning && (
        <div className="mb-4 rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-yellow-400 animate-pulse">
          Warning: complaint limit near ({complaints})
        </div>
      )}

      {data.blocked && (
        <div className="mb-6 rounded border border-red-500 bg-red-900 p-4 animate-shake">
          Upgrade Blocked (Complaint limit reached)
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30">
          <h3 className="mb-2 font-bold text-blue-400">PSS</h3>
          <p>KYC: {data.pss?.kyc ? "Verified" : "Pending"}</p>
          <p>Complaints: {data.pss?.complaints ?? 0}</p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30">
          <h3 className="mb-2 font-bold text-green-400">CRB</h3>
          <p>
            Verifications: {data.crb?.verifications ?? 0}/{data.crb?.requiredVerifications ?? 0}
          </p>
          <p>
            Exams: {data.crb?.examsPassed ?? 0}/{data.crb?.requiredExams ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30">
          <h3 className="mb-2 font-bold text-orange-400">DMO</h3>
          <p>
            Refills: {data.dmo?.refills ?? 0}/{data.dmo?.requiredRefills ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30">
          <h3 className="mb-2 font-bold text-purple-400">Franchise</h3>
          <p>Verified: {data.franchise?.verified?.length ?? 0}</p>
          <p>Pending: {data.franchise?.pending?.length ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-purple-500/40 bg-gray-900 p-6 animate-pulse">
        <h3 className="mb-2 text-lg font-bold">AI Suggestions</h3>
        {data.missingRequirements && data.missingRequirements.length > 0 ? (
          <ul className="ml-5 list-disc text-gray-300">
            {data.missingRequirements.map((item, i) => (
              <li key={`${item}-${i}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-green-400">All requirements completed</p>
        )}
      </div>
    </div>
  );
}

