import Link from "next/link";
import { MOCK_AUDIT_TIMELINE, MOCK_CRITERIA } from "@/lib/pss/pssMockData";
import { AuditTimeline } from "@/components/pss/AuditTimeline";
import { CriteriaChecklist } from "@/components/pss/CriteriaChecklist";
import { RiskMeter } from "@/components/pss/RiskMeter";

export default function PssStatusPage({ params }: { params: { id: string } }) {
  const stage = "FRANCHISE_REVIEW"; // demo
  const stlLevel = 3; // L3 NORMAL
  const score = 78;

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-6 pb-20 pt-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[#8A8FAE]">
            EHB · PSS · <span className="text-[#A098F8]">status tracker</span>
          </div>
          <Link href="/pss/submit" className="text-xs text-[#8A8FAE] hover:text-[#E7E9F5]">
            + New submission
          </Link>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Request <span className="font-mono text-[#A098F8]">{params.id}</span>
        </h1>
        <p className="mt-1 text-sm text-[#8A8FAE]">Aap ki verification request ka live status — auto-refresh har 10 sec.</p>

        {/* Stage bar */}
        <div className="my-6 rounded-xl border border-white/[0.08] bg-[#13162A] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider text-[#8A8FAE]">Stage</div>
            <span className="rounded bg-[#F0A030]/15 px-2 py-1 text-[11px] font-semibold text-[#F0A030]">
              {stage.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {["INTAKE", "DOCUMENTS", "AML_RISK", "AUTO_SCORE", "FRANCHISE_REVIEW", "CRB_REVIEW", "COMPLETE"].map((s, i) => {
              const active = i <= 4;
              return (
                <div key={s} className="flex-1">
                  <div className={`h-1 rounded-full ${active ? "bg-[#7B6EF6]" : "bg-white/10"}`} />
                  <div className={`mt-1 truncate text-[9px] uppercase ${active ? "text-[#A098F8]" : "text-[#8A8FAE]"}`}>{s}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Trust score</h3>
                <span className="rounded bg-[#7B6EF6]/15 px-2 py-1 text-[11px] font-semibold text-[#A098F8]">
                  L{stlLevel} · NORMAL
                </span>
              </div>
              <RiskMeter score={score} />
              <p className="mt-3 text-[11px] text-[#8A8FAE]">
                Score 8/15 criteria met · auto-eligible up to L{stlLevel}. Franchise review pending for upgrade beyond L4.
              </p>
            </div>

            <CriteriaChecklist items={MOCK_CRITERIA} />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
              <h3 className="mb-3 text-sm font-semibold">What happens next</h3>
              <ul className="space-y-2 text-xs text-[#8A8FAE]">
                <li>• Franchise operator will review your case within 24h.</li>
                <li>• Missing criteria highlighted above — upload to unlock higher STL.</li>
                <li>• Email + in-app notification when decision is made.</li>
                <li>• If CRB review required, SLA extends to 72h.</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/pss/refill/case_new_demo"
                  className="rounded-lg bg-gradient-to-r from-[#7B6EF6] to-[#6557e6] px-3 py-2 text-[11px] font-semibold text-white hover:shadow-[0_6px_18px_rgba(123,110,246,0.35)]"
                >
                  Refill missing fields
                </Link>
                <button className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-3 py-2 text-[11px] font-semibold text-[#8A8FAE] hover:text-[#E7E9F5]">
                  Request priority
                </button>
              </div>
            </div>

            <AuditTimeline events={MOCK_AUDIT_TIMELINE} />
          </div>
        </div>
      </div>
    </div>
  );
}
