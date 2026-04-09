import { Rocket } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const opportunities = [
  "Upgrade to STL-7 (VIP) -> Earn 2x more",
  "Join Franchise -> Earn passive income",
  "Activate Affiliate -> Build network income",
];

export default function UpgradeOpportunities() {
  return (
    <Card size="large" className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
      <div className="flex items-center gap-2">
        <Rocket className="h-4 w-4 text-emerald-300" />
        <p className="text-xs uppercase tracking-[0.16em] text-gray-300">Unlock More Earnings</p>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-200">
        {opportunities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button className="mt-4">Upgrade Now</Button>
    </Card>
  );
}

