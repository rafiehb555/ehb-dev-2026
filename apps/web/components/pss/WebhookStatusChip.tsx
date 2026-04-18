export type WebhookStatus = "delivered" | "pending" | "retry" | "failed";

const meta: Record<WebhookStatus, { label: string; cls: string }> = {
  delivered: { label: "Delivered", cls: "text-[#38C878] bg-[#38C878]/15 border-[#38C878]/30" },
  pending: { label: "Pending", cls: "text-[#8A8FAE] bg-white/[0.04] border-white/[0.08]" },
  retry: { label: "Retrying", cls: "text-[#F0A030] bg-[#F0A030]/15 border-[#F0A030]/30" },
  failed: { label: "Failed", cls: "text-[#F05858] bg-[#F05858]/15 border-[#F05858]/30" },
};

export function WebhookStatusChip({
  status,
  latencyMs,
}: {
  status: WebhookStatus;
  latencyMs?: number;
}) {
  const m = meta[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${m.cls}`}>
      <span className="block h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
      {latencyMs != null && <span className="font-mono opacity-80">{latencyMs}ms</span>}
    </span>
  );
}
