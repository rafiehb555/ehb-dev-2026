import Link from "next/link";

export default function PssFranchiseApplyPage() {
  return (
    <div className="min-h-screen bg-[#0C0E1A] px-6 pb-20 pt-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[#8A8FAE]">
          EHB · PSS · <span className="text-[#A098F8]">franchise application</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Run a PSS franchise</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#8A8FAE]">
          Franchise operators review PSS cases in their area (sub → corporate → country). Revenue share 40/25/20/15.
          STL cap L7 for franchise decisions (L8 SUPREME is CRB-only).
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Tier name="Sub franchise" price="$500" area="Tehsil / neighbourhood" share="40%" />
          <Tier name="Corporate" price="$2,500" area="City district" share="25%" />
          <Tier name="Country" price="$25,000" area="National level" share="20%" />
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#13162A] p-6">
          <h3 className="text-sm font-semibold">Requirements</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#8A8FAE]">
            <li>• PSS verified identity (L4+)</li>
            <li>• Coin lock tier ≥ 3 (50k EHBGC · 12 months)</li>
            <li>• Clean criminal + AML record</li>
            <li>• Physical office for sub franchise, verifiable address</li>
            <li>• Pass CRB interview (video call + on-chain attestation)</li>
          </ul>
          <div className="mt-5 flex gap-2">
            <button className="rounded-lg bg-gradient-to-r from-[#7B6EF6] to-[#6557e6] px-5 py-2 text-xs font-semibold text-white hover:shadow-[0_6px_20px_rgba(123,110,246,0.35)]">
              Start application
            </button>
            <Link href="/pss" className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] hover:text-[#E7E9F5]">
              ← Back to PSS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tier({ name, price, area, share }: { name: string; price: string; area: string; share: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-4">
      <h4 className="text-sm font-semibold">{name}</h4>
      <div className="mt-2 text-2xl font-bold tracking-tight text-[#A098F8]">{price}</div>
      <p className="mt-1 text-[11px] text-[#8A8FAE]">{area}</p>
      <div className="mt-3 inline-block rounded bg-[#2BBFA0]/15 px-2 py-1 text-[11px] font-semibold text-[#2BBFA0]">
        {share} revenue share
      </div>
    </div>
  );
}
