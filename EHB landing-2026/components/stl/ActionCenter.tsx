import { Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ActionCenter() {
  return (
    <Card size="large" className="h-full border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-white/[0.03] to-transparent backdrop-blur-xl transition hover:shadow-lg hover:shadow-violet-500/20">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/40 bg-violet-500/15">
          <Zap className="h-4 w-4 text-violet-300" />
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-300">Next Action</h3>
      </div>

      <ul className="mt-3 space-y-2 text-sm">
        <li className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">✔ Complete 2 CRB verifications</li>
        <li className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">✔ Pass 1 exam</li>
        <li className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">✔ Add 2 refills</li>
      </ul>

      <Button variant="secondary" className="mt-4">Start Now</Button>
    </Card>
  );
}

