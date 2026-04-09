import { Trophy } from "lucide-react";
import Card from "@/components/ui/Card";

const leaders = [
  { name: "Ali", invites: 120 },
  { name: "Ahmed", invites: 95 },
  { name: "Rafi", invites: 80 },
];

export default function LeaderboardCard() {
  return (
    <Card size="medium">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-300" />
        <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Top Referrers</p>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {leaders.map((leader, idx) => (
          <li key={leader.name} className="flex items-center justify-between text-gray-200">
            <span>{idx + 1}. {leader.name}</span>
            <span className="text-emerald-300">{leader.invites} invites</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

