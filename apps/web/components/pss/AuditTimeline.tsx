export type AuditEvent = {
  id: string;
  at: string;
  title: string;
  detail?: string;
  tone?: "ok" | "warn" | "err" | "info";
};

const dot = {
  ok: "bg-[#38C878] shadow-[0_0_0_1px_#38C878]",
  warn: "bg-[#F0A030] shadow-[0_0_0_1px_#F0A030]",
  err: "bg-[#F05858] shadow-[0_0_0_1px_#F05858]",
  info: "bg-[#7B6EF6] shadow-[0_0_0_1px_#7B6EF6]",
};

export function AuditTimeline({ events }: { events: AuditEvent[] }) {
  return (
    <ol className="ml-2 space-y-4 border-l-2 border-white/[0.07] pl-6">
      {events.map((e) => (
        <li key={e.id} className="relative">
          <span
            className={`absolute -left-[30px] top-1 block h-3 w-3 rounded-full border-[3px] border-[#13162A] ${
              dot[e.tone ?? "info"]
            }`}
          />
          <div className="text-[10px] uppercase tracking-wider text-[#8A8FAE]">{e.at}</div>
          <div className="mt-0.5 text-sm font-semibold">{e.title}</div>
          {e.detail && <div className="mt-0.5 text-xs text-[#8A8FAE]">{e.detail}</div>}
        </li>
      ))}
    </ol>
  );
}
