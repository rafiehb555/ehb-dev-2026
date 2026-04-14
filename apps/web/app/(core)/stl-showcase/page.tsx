/**
 * STL User Card — Design Showcase
 * URL: /stl-showcase
 * Renders all variants × all levels for visual QA.
 */
import { STLUserCard } from "@/components/stl/STLUserCard";
import type { TrustLevel } from "@ehb/trust-engine";

const LEVELS: TrustLevel[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function STLShowcasePage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">STL User Card — Design Showcase</h1>
          <p className="mt-2 text-sm text-white/50">
            Premium trust card for EHB platform. Variants: <code>compact</code> · <code>standard</code> · <code>hero</code>.
          </p>
        </header>

        {/* HERO */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white/80">Hero Variant</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <STLUserCard
              variant="hero"
              name="Ali Raza"
              role="Seller"
              stl={8}
              pss={8}
              crb={7}
              dmo={8}
              score={96}
              verified
              industry="E-Commerce"
              industryAccent="#29ABE2"
            />
            <STLUserCard
              variant="hero"
              name="Dr. Ayesha Khan"
              role="Provider"
              stl={7}
              pss={8}
              crb={7}
              dmo={6}
              score={88}
              verified
              industry="Medical"
              industryAccent="#22B14C"
            />
          </div>
        </section>

        {/* STANDARD — all levels */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white/80">Standard Variant — All 9 Levels</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((lvl) => (
              <STLUserCard
                key={lvl}
                name={`User L${lvl}`}
                role="Seller"
                stl={lvl}
                pss={lvl}
                crb={lvl > 0 ? ((lvl - 1) as TrustLevel) : null}
                dmo={lvl}
                score={Math.min(100, lvl * 12 + 4)}
                verified={lvl >= 3}
                industry="GoSellr"
                industryAccent="#29ABE2"
              />
            ))}
          </div>
        </section>

        {/* COMPACT */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white/80">Compact Variant (inline chip)</h2>
          <div className="flex flex-wrap gap-3 rounded-xl border border-white/5 bg-[#0C0E1A] p-4">
            {LEVELS.map((lvl) => (
              <STLUserCard key={lvl} variant="compact" name={`User L${lvl}`} stl={lvl} verified={lvl >= 4} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
