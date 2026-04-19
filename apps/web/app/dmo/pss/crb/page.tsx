import Link from "next/link";

export default function CrbOverridePage() {
  return (
    <div className="min-h-screen bg-[#0C0E1A] px-7 pb-20 pt-8 text-[#E7E9F5]">
      <div className="mb-5 text-[11px] uppercase tracking-[0.08em] text-[#8A8FAE]">
        EHB · DMO · <span className="text-[#A098F8]">CRB override</span>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRB Override Review</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#8A8FAE]">
            Central Record Blockchain — scope: all platforms, all areas. Franchise decisions override,
            L8 SUPREME assign, aur on-chain certificate hash push (Polkadot). Override event immutable.
          </p>
        </div>
        <Link
          href="/dmo/pss/queue"
          className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] transition hover:text-[#E7E9F5]"
        >
          ← Operator queue
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat k="Pending CRB reviews" v="4" c="#29ABE2" />
        <Stat k="Override rate (30d)" v="6.2%" c="#E7E9F5" />
        <Stat k="On-chain hashes pushed" v="1,247" c="#A098F8" />
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5">
        <h3 className="mb-4 text-sm font-semibold">
          Active case — <span className="text-[#A098F8]">Lex Partners LLC</span>{" "}
          <span className="text-[#8A8FAE]">· Corporate law · OLS</span>
        </h3>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <Row k="PSS score" v="93 / 100" tone="#2BBFA0" />
            <Row k="Franchise decision" v="L6 HIGH" tone="#F0A030" />
            <Row k="CRB proposal" v="L10 SUPREME" tone="#29ABE2" />
            <Row k="Governance bonus" v="+4 (DMO policy §3.2)" />
            <Row k="Coin lock tier" v="Tier 5 · 100k EHBGC · 18mo" />
            <Row k="On-chain push" v="Ready · Polkadot parachain" tone="#A098F8" />
          </div>

          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wider text-[#8A8FAE]">
              Override justification (required)
            </label>
            <textarea
              defaultValue="Firm has 3 decades clean regulatory history, SBP advisory mandate, coin-lock tier 5 sustained 18+ months. Eligible for SUPREME. Overriding franchise L6 → L8 per DMO policy §3.2."
              className="min-h-[140px] w-full rounded-lg border border-white/[0.08] bg-[#0C0E1A] p-3 font-sans text-xs text-[#E7E9F5] outline-none transition focus:border-[#7B6EF6]/60"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-lg bg-gradient-to-r from-[#7B6EF6] to-[#6557e6] px-4 py-2 text-xs font-semibold text-white transition hover:shadow-[0_6px_20px_rgba(123,110,246,0.4)]">
                Confirm override · push on-chain
              </button>
              <button className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold transition hover:border-[#F0A030]/40 hover:text-[#F0A030]">
                Uphold franchise decision
              </button>
            </div>
            <p className="mt-3 text-[11px] text-[#8A8FAE]">
              On-chain push generates a certificate hash recorded to Polkadot (block + tx). Hash is
              verifiable via the public EHB proof explorer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] py-2.5 text-sm last:border-0">
      <span className="text-[#8A8FAE]">{k}</span>
      <span className="font-semibold" style={tone ? { color: tone } : undefined}>
        {v}
      </span>
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
