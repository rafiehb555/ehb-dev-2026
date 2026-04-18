/**
 * RiskMeter — displays a 0-100 STL score with the canonical 10-level (L1-L10)
 * ladder per `ehb-info/departments/STL.md` v1.0.
 */

const BANDS = [
  { max: 21, level: 1, key: "FREE", color: "#8A8FAE" },
  { max: 41, level: 2, key: "BASIC", color: "#A6B0CC" },
  { max: 61, level: 3, key: "NORMAL", color: "#29ABE2" },
  { max: 76, level: 4, key: "STANDARD", color: "#2BBFA0" },
  { max: 86, level: 5, key: "ADVANCED", color: "#38C878" },
  { max: 93, level: 6, key: "HIGH", color: "#7B6EF6" },
  { max: 97, level: 7, key: "PRO", color: "#A098F8" },
  { max: 99, level: 8, key: "VIP", color: "#F0A030" },
  { max: 100, level: 9, key: "ELITE", color: "#F0577A" },
  { max: 101, level: 10, key: "SUPREME", color: "#F05858" },
];

export function RiskMeter({ score }: { score: number }) {
  const s = Math.max(0, Math.min(100, score));
  const band = BANDS.find((b) => s < b.max) ?? BANDS[BANDS.length - 1];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#1A1D33] p-4">
      <div className="mb-2 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">{s}</span>
          <span className="text-xs text-[#8A8FAE]">/ 100</span>
        </div>
        <span
          className="rounded px-2 py-1 text-[11px] font-semibold"
          style={{ color: band.color, background: band.color + "22" }}
        >
          L{band.level} · {band.key}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#0C0E1A]">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${s}%`,
            background: `linear-gradient(90deg, ${band.color}99, ${band.color})`,
            boxShadow: `0 0 10px ${band.color}66`,
          }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[9px] uppercase tracking-wider text-[#8A8FAE]">
        {BANDS.filter((_, i) => i % 2 === 0).map((b) => (
          <span key={b.level}>L{b.level}</span>
        ))}
      </div>
    </div>
  );
}
