import { Gift } from "lucide-react";
import Card from "@/components/ui/card";

const rewards = ["Invite 5 -> $10 bonus", "Invite 10 -> STL boost", "Invite 20 -> VIP unlock"];

export default function RewardsCard() {
  return (
    <Card size="medium" className="border-amber-500/30 bg-amber-500/5">
      <div className="flex items-center gap-2">
        <Gift className="h-4 w-4 text-amber-300" />
        <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Rewards</p>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-200">
        {rewards.map((reward) => (
          <li key={reward}>✔ {reward}</li>
        ))}
      </ul>
    </Card>
  );
}

