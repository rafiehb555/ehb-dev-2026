"use client";

import { useEffect, useState } from "react";

type FraudAnalytics = {
  unresolvedCount: number;
  falsePositiveCount: number;
  penaltiesIssued: number;
  signalsPerDay: { day: string; count: number }[];
};

export default function DmoAnalyticsPage() {
  const [fraud, setFraud] = useState<FraudAnalytics | null>(null);
  const [complaints, setComplaints] = useState(0);
  const [pendingOrderReviews, setPendingOrderReviews] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/fraud/analytics").then((res) => res.json()),
      fetch("/api/gosellr/complaint?status=PENDING").then((res) => res.json()),
      fetch("/api/dmo/applications?type=ORDER_REVIEW&take=100").then((res) => res.json()),
    ])
      .then(([fraudJson, complaintJson, orderJson]) => {
        if (fraudJson.success) setFraud(fraudJson.data);
        if (complaintJson.success) setComplaints(complaintJson.data.total ?? 0);
        if (orderJson.success) setPendingOrderReviews((orderJson.data.applications ?? []).length);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#05050f] text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">DMO Marketplace Analytics</h1>
        <p className="text-white/40 text-sm">Orders, complaints, fraud alerts, and pending reviews in one view</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Fraud alerts</p>
          <p className="text-3xl font-black text-white">{fraud?.unresolvedCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Complaints</p>
          <p className="text-3xl font-black text-white">{complaints}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Order reviews</p>
          <p className="text-3xl font-black text-white">{pendingOrderReviews}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">False positives</p>
          <p className="text-3xl font-black text-white">{fraud?.falsePositiveCount ?? 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">7-day fraud signals</p>
        <div className="space-y-2">
          {(fraud?.signalsPerDay ?? []).map((point) => (
            <div key={point.day} className="flex items-center gap-3">
              <div className="w-28 text-xs text-white/50">{point.day}</div>
              <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, point.count * 12)}%` }} />
              </div>
              <div className="w-8 text-xs text-white/70">{point.count}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
