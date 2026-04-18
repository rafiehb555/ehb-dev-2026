export type CriterionResult = {
  id: string;
  title: string;
  detail?: string;
  met: boolean;
  required?: boolean;
};

export function CriteriaChecklist({
  items,
  showSummary = true,
}: {
  items: CriterionResult[];
  showSummary?: boolean;
}) {
  const met = items.filter((i) => i.met).length;
  const total = items.length;
  const pct = total ? Math.round((met / total) * 100) : 0;

  return (
    <div>
      {showSummary && (
        <div className="mb-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0C0E1A]">
            <div
              className="h-full bg-gradient-to-r from-[#38C878] via-[#2BBFA0] to-[#F0A030]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-sm font-bold tabular-nums text-[#A098F8]">
            {met}/{total} <span className="opacity-60">· {pct}%</span>
          </span>
        </div>
      )}

      <div className="space-y-2">
        {items.map((i) => (
          <div
            key={i.id}
            className={`flex items-start gap-3 rounded-xl border bg-[#1A1D33] p-3 transition ${
              i.met ? "border-[#38C878]/25" : "border-white/[0.08]"
            }`}
          >
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${
                i.met
                  ? "border-[#38C878] bg-[#38C878] text-white"
                  : "border-white/[0.12] bg-transparent"
              }`}
            >
              {i.met && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h6 className="text-xs font-semibold text-[#E7E9F5]">{i.title}</h6>
                {i.required && !i.met && (
                  <span className="rounded border border-[#F05858]/30 bg-[#F05858]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#F05858]">
                    Required
                  </span>
                )}
              </div>
              {i.detail && <p className="mt-0.5 text-[11px] text-[#8A8FAE]">{i.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
