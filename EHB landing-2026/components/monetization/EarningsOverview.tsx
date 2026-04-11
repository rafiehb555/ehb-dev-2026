import { DollarSign } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function EarningsOverview() {
  return (
    <Card size="large" className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-emerald-400" />
        <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Earnings Overview</p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-gray-400">Total Earnings</p>
          <p className="text-2xl font-bold text-emerald-300">$2,450</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">This Month</p>
          <p className="text-xl font-semibold text-white">$320</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Today</p>
          <p className="text-xl font-semibold text-white">$25</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button>Withdraw</Button>
        <Button variant="secondary">Add Funds</Button>
      </div>
    </Card>
  );
}

