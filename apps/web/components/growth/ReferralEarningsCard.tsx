import { DollarSign, Users } from "lucide-react";
import Card from "@/components/ui/Card";

export default function ReferralEarningsCard() {
  return (
    <Card size="medium">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-300" />
        <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Referral Earnings</p>
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <p className="text-gray-300">Total Referrals: <span className="text-white">25</span></p>
        <p className="text-gray-300">Active Users: <span className="text-white">18</span></p>
      </div>
      <p className="mt-3 inline-flex items-center gap-1 text-lg font-semibold text-emerald-300">
        <DollarSign className="h-4 w-4" />
        320 from referrals
      </p>
    </Card>
  );
}

