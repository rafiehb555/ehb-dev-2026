import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditTimeline } from "@/components/pss/AuditTimeline";
import { CriteriaChecklist } from "@/components/pss/CriteriaChecklist";
import { RiskMeter } from "@/components/pss/RiskMeter";
import {
  MOCK_PSS_CASES,
  MOCK_AUDIT_TIMELINE,
  MOCK_CRITERIA,
} from "@/lib/pss/pssMockData";

export default function CaseDrillPage({ params }: { params: { id: string } }) {
  const c = MOCK_PSS_CASES.find((x) => x.id === params.id);
  if (!c) return notFound();

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-7 pb-20 pt-8 text-[#E7E9F5]">
      <div className="mb-5 text-[11px] uppercase tracking-[0.08em] text-[#8A8FAE]">
        EHB · DMO · PSS · <Link href="/dmo/pss/queue" className="hover:text-[#A098F8]">Queue</Link> ·{" "}
        <span className="text-[#A098F8]">{c.id}</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)",
            }}
          >
            {c.user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{c.user.name}</h1>
            <p className="text-sm text-[#8A8FAE]">
              {c.entityType} · {c.platform.toUpperCase()} · stage:{" "}
              <span className="text-[#A098F8]">{c.stage}</span>
            </p>
          </div>
        </div>
        <Link
          href="/dmo/pss/queue"
          className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] transition hover:text-[#E7E9F5]"
        >
          ← Back to queue
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* LEFT — subject + risk */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
            <h3 className="mb-4 text-[11px] uppercase tracking-wider text-[#8A8FAE]">Subject</h3>
            <Row k="Case ID" v={c.id} mono />
            <Row k="Entity" v={c.entityType} />
            <Row k="Platform" v={c.platform.toUpperCase()} />
            <Row k="Projected STL" v={`L${c.stlLevel ?? 0}`} />
            <Row k="Area franchise" v={`${c.platform.toUpperCase()} — Lahore`} />
            <Row k="Updated" v={c.updatedAt} />
          </div>
          <RiskMeter score={c.score} />
        </div>

        {/* MIDDLE — criteria */}
        <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
          <h3 className="mb-4 text-[11px] uppercase tracking-wider text-[#8A8FAE]">
            Criteria breakdown ({MOCK_CRITERIA.length})
          </h3>
          <CriteriaChecklist items={MOCK_CRITERIA} />
        </div>

        {/* RIGHT — timeline + actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
            <h3 className="mb-4 text-[11px] uppercase tracking-wider text-[#8A8FAE]">Audit timeline</h3>
            <AuditTimeline events={MOCK_AUDIT_TIMELINE} />
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
            <h3 className="mb-3 text-[11px] uppercase tracking-wider text-[#8A8FAE]">Operator actions</h3>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-4 py-2 text-xs font-semibold text-[#38C878] transition hover:bg-[#38C878]/25">
                ✓ Approve · L{c.stlLevel ?? 3}
              </button>
              <button className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold transition hover:border-[#F0A030]/40 hover:text-[#F0A030]">
                Conditional · lower STL
              </button>
              <button className="rounded-lg border border-[#F05858]/40 bg-[#F05858]/15 px-4 py-2 text-xs font-semibold text-[#F05858] transition hover:bg-[#F05858]/25">
                Reject with reason
              </button>
              <Link
                href="/dmo/pss/crb"
                className="rounded-lg border border-[#29ABE2]/40 bg-[#29ABE2]/15 px-4 py-2 text-xs font-semibold text-[#29ABE2] transition hover:bg-[#29ABE2]/25"
              >
                Escalate to CRB →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] py-2 text-sm last:border-0">
      <span className="text-[#8A8FAE]">{k}</span>
      <span className={mono ? "font-mono text-xs text-[#A098F8]" : ""}>{v}</span>
    </div>
  );
}
