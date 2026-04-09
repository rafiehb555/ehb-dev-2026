import { BadgeDollarSign, BriefcaseBusiness, Network, WalletCards } from "lucide-react";
import Card from "@/components/ui/Card";

const sources = [
  { title: "STL Income", value: "Daily: $5", icon: BadgeDollarSign, tone: "text-emerald-300" },
  { title: "Affiliate Income", value: "Network: 12 users", icon: Network, tone: "text-blue-300" },
  { title: "Franchise Income", value: "Monthly: $200", icon: BriefcaseBusiness, tone: "text-violet-300" },
  { title: "Service Earnings", value: "Orders: 25", icon: WalletCards, tone: "text-amber-300" },
];

export default function IncomeSources() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {sources.map((source) => (
        <Card key={source.title} size="small" className="transition hover:shadow-lg hover:shadow-emerald-500/10">
          <source.icon className={`mb-2 h-4 w-4 ${source.tone}`} />
          <p className="text-xs text-gray-400">{source.title}</p>
          <p className="text-sm font-semibold text-white">{source.value}</p>
        </Card>
      ))}
    </div>
  );
}

