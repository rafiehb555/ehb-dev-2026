"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_CRITERIA } from "@/lib/pss/pssMockData";

export default function PssRefillPage({ params }: { params: { id: string } }) {
  const missing = MOCK_CRITERIA.filter((c) => !c.met);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const filledCount = Object.values(filled).filter(Boolean).length;
  const progress = (filledCount / missing.length) * 100;

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-6 pb-20 pt-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-[11px] uppercase tracking-[0.1em] text-[#8A8FAE]">
          EHB · PSS · <span className="text-[#A098F8]">refill missing fields</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Upgrade your trust score</h1>
        <p className="mt-1 text-sm text-[#8A8FAE]">
          Missing criteria complete karein — STL level automatic upgrade ho jaye ga. Request ID:{" "}
          <span className="font-mono text-[#A098F8]">{params.id}</span>
        </p>

        <div className="mb-5 mt-6 rounded-xl border border-white/[0.08] bg-[#13162A] p-4">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8A8FAE]">
            <span>Progress</span>
            <span className="text-[#A098F8]">
              {filledCount} / {missing.length}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#7B6EF6] to-[#A098F8] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {missing.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-white/[0.08] bg-[#13162A] p-4 transition hover:border-[#7B6EF6]/30"
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.title}</span>
                    {c.required && (
                      <span className="rounded bg-[#F05858]/20 px-1.5 py-[1px] text-[10px] font-semibold text-[#F05858]">
                        required
                      </span>
                    )}
                  </div>
                  {c.detail && <p className="mt-1 text-[11px] text-[#8A8FAE]">{c.detail}</p>}
                </div>
                <label className="flex items-center gap-2 text-[11px] text-[#8A8FAE]">
                  <input
                    type="checkbox"
                    checked={!!filled[c.id]}
                    onChange={(e) => setFilled({ ...filled, [c.id]: e.target.checked })}
                    className="h-4 w-4 accent-[#7B6EF6]"
                  />
                  Mark uploaded
                </label>
              </div>
              <button className="mt-1 rounded-md border border-white/[0.08] bg-[#1A1D33] px-3 py-1.5 text-[11px] font-semibold text-[#8A8FAE] hover:text-[#E7E9F5]">
                Upload file / enter data
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href={`/pss/status/${params.id}`} className="text-xs text-[#8A8FAE] hover:text-[#E7E9F5]">
            ← Back to status
          </Link>
          <button
            disabled={filledCount === 0}
            className="rounded-lg bg-gradient-to-r from-[#2BBFA0] to-[#1fa48a] px-5 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:shadow-[0_6px_20px_rgba(43,191,160,0.35)]"
          >
            Submit updates · re-score
          </button>
        </div>
      </div>
    </div>
  );
}
