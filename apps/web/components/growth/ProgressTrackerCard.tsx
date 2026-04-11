import Card from "@/components/ui/Card";

export default function ProgressTrackerCard() {
  const percent = 70;
  return (
    <Card size="medium">
      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Progress to next reward</p>
      <div className="mt-3 h-2 w-full rounded bg-gray-700">
        <div className="h-2 rounded bg-gradient-to-r from-emerald-400 to-blue-400" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-gray-300">7 / 10 referrals</p>
    </Card>
  );
}

