import Link from "next/link";

const BADGES = [
  {
    id: "bd_01",
    title: "GoSellr Verified Seller",
    level: 5,
    issuedAt: "12 Jan 2026",
    hash: "0x9a4f...e21c",
    chain: "Polkadot · block 8,214,551",
    color: "#2BBFA0",
  },
  {
    id: "bd_02",
    title: "OLS Certified Lawyer",
    level: 7,
    issuedAt: "03 Mar 2026",
    hash: "0x3e12...b7ff",
    chain: "Polkadot · block 9,127,803",
    color: "#A098F8",
  },
  {
    id: "bd_03",
    title: "JPS Freelancer",
    level: 3,
    issuedAt: "27 Feb 2026",
    hash: "0x77ab...1d90",
    chain: "Polkadot · block 8,948,112",
    color: "#29ABE2",
  },
];

export default function PssBadgesPage() {
  return (
    <div className="min-h-screen bg-[#0C0E1A] px-6 pb-20 pt-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-4xl">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[#8A8FAE]">
          EHB · PSS · <span className="text-[#A098F8]">my badges</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Your trust certificates</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#8A8FAE]">
          Har badge ek on-chain certificate hash ke sath Polkadot par record hai — publicly verifiable, tamper-proof.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-white/[0.08] bg-[#13162A] p-5 transition hover:border-white/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 h-1 w-10 rounded-full" style={{ background: b.color }} />
                  <h3 className="text-base font-semibold">{b.title}</h3>
                  <p className="mt-0.5 text-xs text-[#8A8FAE]">Issued {b.issuedAt}</p>
                </div>
                <span className="rounded px-2 py-1 text-[11px] font-semibold" style={{ color: b.color, background: b.color + "22" }}>
                  L{b.level}
                </span>
              </div>
              <div className="mt-4 rounded-lg border border-white/[0.08] bg-[#0C0E1A] p-3 font-mono text-[11px]">
                <div className="flex justify-between text-[#8A8FAE]">
                  <span>hash</span>
                  <span className="text-[#A098F8]">{b.hash}</span>
                </div>
                <div className="mt-1.5 flex justify-between text-[#8A8FAE]">
                  <span>chain</span>
                  <span className="text-[#E7E9F5]">{b.chain}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md border border-white/[0.08] bg-[#1A1D33] px-3 py-1.5 text-[11px] font-semibold text-[#8A8FAE] hover:text-[#E7E9F5]">
                  Copy hash
                </button>
                <button className="rounded-md border border-white/[0.08] bg-[#1A1D33] px-3 py-1.5 text-[11px] font-semibold text-[#8A8FAE] hover:text-[#E7E9F5]">
                  Share proof link
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/pss"
          className="mt-6 inline-block rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] hover:text-[#E7E9F5]"
        >
          ← Back to PSS
        </Link>
      </div>
    </div>
  );
}
