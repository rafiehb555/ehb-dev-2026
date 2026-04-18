import Link from "next/link";

export default function PssLandingPage() {
  return (
    <div className="min-h-screen bg-[#0C0E1A] px-6 pb-20 pt-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-4xl">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[#8A8FAE]">
          EHB · <span className="text-[#A098F8]">Proof & Security System</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Verify once. Trusted everywhere.</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#8A8FAE]">
          PSS verifies your identity and entity across all 7 EHB platforms. One submission → STL level assigned
          → on-chain proof → visible to every buyer, patient, student, or client.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Action title="Submit new" desc="Start a verification for a product, profile, or listing." href="/pss/submit" tone="#7B6EF6" />
          <Action title="Check status" desc="Live tracker for an in-flight PSS request." href="/pss/status/case_01ht_ali" tone="#29ABE2" />
          <Action title="Refill fields" desc="Upload missing items to upgrade STL level." href="/pss/refill/case_01ht_ali" tone="#2BBFA0" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Action title="My badges" desc="View your STL certificates + on-chain proofs." href="/pss/badges" tone="#F0A030" />
          <Action title="Franchise apply" desc="Apply to run a PSS franchise in your area." href="/pss/franchise" tone="#A098F8" />
        </div>

        <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#13162A] p-6">
          <h3 className="text-sm font-semibold">How PSS trust works</h3>
          <ol className="mt-3 space-y-2.5 text-sm text-[#8A8FAE]">
            <li><span className="mr-2 text-[#A098F8]">1.</span> Submit identity + entity data through platform or directly.</li>
            <li><span className="mr-2 text-[#A098F8]">2.</span> PSS runs criteria check + AML screening + document validation.</li>
            <li><span className="mr-2 text-[#A098F8]">3.</span> Score calculated → rule engine routes: auto-approve / franchise / CRB.</li>
            <li><span className="mr-2 text-[#A098F8]">4.</span> STL level assigned (L0–L8) — PSS cap L4, Franchise cap L7, CRB only L8.</li>
            <li><span className="mr-2 text-[#A098F8]">5.</span> Certificate hash pushed on-chain (Polkadot) + signed webhook to platform.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Action({ title, desc, href, tone }: { title: string; desc: string; href: string; tone: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/[0.08] bg-[#13162A] p-5 transition hover:border-white/20 hover:bg-[#161a33]"
    >
      <div className="mb-2 h-1 w-8 rounded-full" style={{ background: tone }} />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-[#8A8FAE]">{desc}</p>
      <span className="mt-3 inline-block text-[11px] text-[#8A8FAE] group-hover:text-[#E7E9F5]">Open →</span>
    </Link>
  );
}
