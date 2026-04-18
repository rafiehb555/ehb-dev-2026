import Link from "next/link";
import { WebhookStatusChip } from "@/components/pss/WebhookStatusChip";
import { MOCK_WEBHOOK_LOGS } from "@/lib/pss/pssMockData";

export default function WebhookMonitorPage() {
  const delivered = MOCK_WEBHOOK_LOGS.filter((w) => w.status === "delivered").length;
  const failed = MOCK_WEBHOOK_LOGS.filter((w) => w.status === "failed").length;
  const retrying = MOCK_WEBHOOK_LOGS.filter((w) => w.status === "retry").length;

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-7 pb-20 pt-8 text-[#E7E9F5]">
      <div className="mb-5 text-[11px] uppercase tracking-[0.08em] text-[#8A8FAE]">
        EHB · DMO · PSS · <span className="text-[#A098F8]">Webhook monitor</span>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webhook Delivery Monitor</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#8A8FAE]">
            PSS ko jab koi decision final hota hai, ye signed webhook (HMAC SHA-256) platform ko push
            karta hai. Failure pe 3x exponential retry. Yahan live delivery status dikhai de rahi hai.
          </p>
        </div>
        <Link
          href="/dmo/pss/queue"
          className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] transition hover:text-[#E7E9F5]"
        >
          ← Operator queue
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat k="Delivered (24h)" v={String(delivered * 48)} c="#2BBFA0" />
        <Stat k="Retrying" v={String(retrying)} c="#F0A030" />
        <Stat k="Failed" v={String(failed)} c="#F05858" />
        <Stat k="Avg latency" v="143ms" c="#A098F8" />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wider text-[#8A8FAE]">
              <th className="px-4 py-3 text-left font-medium">Event ID</th>
              <th className="px-4 py-3 text-left font-medium">Platform</th>
              <th className="px-4 py-3 text-left font-medium">Target</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Attempt</th>
              <th className="px-4 py-3 text-left font-medium">Sent at</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_WEBHOOK_LOGS.map((w) => (
              <tr key={w.id} className="border-b border-white/[0.04] transition hover:bg-[#7B6EF6]/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-[#A098F8]">{w.eventId}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wider">{w.platform}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-[#8A8FAE]">{w.target}</td>
                <td className="px-4 py-3">
                  <WebhookStatusChip status={w.status} latencyMs={w.latencyMs} />
                </td>
                <td className="px-4 py-3 text-xs">{w.attempt} / 3</td>
                <td className="px-4 py-3 text-xs text-[#8A8FAE]">{w.sentAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
        <h3 className="mb-3 text-[11px] uppercase tracking-wider text-[#8A8FAE]">Signature verification</h3>
        <pre className="overflow-x-auto rounded-lg border border-white/[0.08] bg-[#06070f] p-4 font-mono text-[11px] leading-relaxed text-[#b3bccc]">
{`// Platform side — verify inbound PSS webhook
import crypto from "node:crypto";

export function verifyPssSignature(rawBody: Buffer, header: string, secret: string) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}`}
        </pre>
      </div>
    </div>
  );
}

function Stat({ k, v, c }: { k: string; v: string; c: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-4">
      <div className="text-[11px] uppercase tracking-wider text-[#8A8FAE]">{k}</div>
      <div className="mt-1 text-3xl font-bold tracking-tight" style={{ color: c }}>
        {v}
      </div>
    </div>
  );
}
