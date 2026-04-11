import { Copy, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function InviteCard() {
  return (
    <Card size="large" className="border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
      <h2 className="text-lg font-semibold text-white">Invite &amp; Earn 🚀</h2>
      <p className="mt-3 text-sm text-gray-300">
        Code: <span className="font-semibold text-emerald-300">EHB123</span>
      </p>
      <p className="mt-1 text-sm text-gray-300">
        Link: <span className="text-blue-300">ehb.com/ref/ehb123</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" className="inline-flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>
        <Button className="inline-flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </Card>
  );
}

