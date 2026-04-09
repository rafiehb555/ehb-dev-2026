import { Activity, BriefcaseBusiness, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Modules() {
  return (
    <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-3">
      <Card size="medium" className="border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20">
        <div className="mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-green-400" />
        <h4 className="text-base font-semibold text-white">Verification</h4>
        </div>
        <p className="mt-2 text-xs text-gray-300">PSS + CRB</p>
        <Button variant="primary" className="mt-3">Verify Now</Button>
      </Card>

      <Card size="medium" className="border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20">
        <div className="mb-2 flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-blue-400" />
        <h4 className="text-base font-semibold text-white">Growth</h4>
        </div>
        <p className="mt-2 text-xs text-gray-300">Franchise + Refilling</p>
        <Button variant="secondary" className="mt-3">Manage</Button>
      </Card>

      <Card size="medium" className="border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20">
        <div className="mb-2 flex items-center gap-2"><Activity className="h-4 w-4 text-amber-400" />
        <h4 className="text-base font-semibold text-white">Behavior</h4>
        </div>
        <p className="mt-2 text-xs text-gray-300">DMO + Penalty</p>
        <Button variant="warning" className="mt-3">View</Button>
      </Card>
    </div>
  );
}

