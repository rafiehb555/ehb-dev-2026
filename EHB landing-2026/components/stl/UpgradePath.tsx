import Card from "@/components/ui/Card";

const levels = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"];
const current = "L6";

export default function UpgradePath() {
  return (
    <Card size="large" className="overflow-hidden">
      <h3 className="text-sm text-gray-400">Upgrade Timeline</h3>
      <div className="relative mt-4">
        <div className="absolute left-0 right-0 top-4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {levels.map((level) => (
            <div key={level} className="inline-flex items-center gap-2">
              <span
                className={`relative rounded-md border px-2 py-1 ${
                  level === current
                    ? "border-green-400 bg-green-500/15 text-green-300 shadow-[0_0_18px_rgba(34,197,94,0.35)]"
                    : "border-gray-700 text-gray-300"
                }`}
              >
                {level}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Current level: <span className="font-semibold text-green-300">{current}</span>
      </p>
    </Card>
  );
}

