import Link from "next/link";
import { INDUSTRIES, type Industry, type IndustryGroup } from "@ehb/industry-registry";

const GROUP_TITLES: Record<IndustryGroup, string> = {
  A: "Core Services",
  B: "Business & Finance",
  C: "Lifestyle",
  D: "Operations",
  E: "Infrastructure",
  F: "Culture",
  G: "Specialty",
};

const STATUS_BADGE: Record<Industry["status"], { label: string; color: string }> = {
  active: { label: "Live", color: "#22B14C" },
  beta: { label: "Beta", color: "#F0A030" },
  "coming-soon": { label: "Soon", color: "#64748B" },
};

/**
 * Server-side rendered industry grid powered entirely by @ehb/industry-registry.
 *
 * Adding a new industry via scripts/add-industry.mjs makes it appear here
 * with zero code changes.
 */
export function IndustryGrid({ filter }: { filter?: "active" | "all" }) {
  const list = filter === "active"
    ? INDUSTRIES.filter((i) => i.status === "active")
    : INDUSTRIES;

  const groups = (Object.keys(GROUP_TITLES) as IndustryGroup[]).map((g) => ({
    group: g,
    title: GROUP_TITLES[g],
    industries: list.filter((i) => i.group === g),
  })).filter((g) => g.industries.length > 0);

  return (
    <section className="space-y-6">
      {groups.map((g) => (
        <div key={g.group} className="space-y-3">
          <header className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Group {g.group} · {g.title}
            </h2>
            <span className="text-[11px] text-white/40 tabular-nums">
              {g.industries.length} industr{g.industries.length === 1 ? "y" : "ies"}
            </span>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.industries.map((ind) => (
              <IndustryCard key={ind.code} industry={ind} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function IndustryCard({ industry }: { industry: Industry }) {
  const badge = STATUS_BADGE[industry.status];
  return (
    <Link
      href={`/${industry.code}`}
      className="group block rounded-2xl border border-white/10 bg-[#13162A] p-4 transition-all hover:-translate-y-0.5 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{
        boxShadow: `0 4px 24px ${industry.accent}22`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[14px] font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${industry.accent}, ${industry.accent}aa)`,
            boxShadow: `0 0 18px ${industry.accent}55`,
          }}
        >
          {industry.name.slice(0, 2).toUpperCase()}
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
          style={{
            background: `${badge.color}1f`,
            color: badge.color,
            border: `1px solid ${badge.color}55`,
          }}
        >
          {badge.label}
        </span>
      </div>

      <div className="mt-3 space-y-0.5">
        <p className="text-[15px] font-semibold text-white">{industry.name}</p>
        <p className="text-[11px] text-white/50">{industry.category}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
        <span>Min STL L{industry.trustMinStl}</span>
        <span className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
          → Open
        </span>
      </div>
    </Link>
  );
}
