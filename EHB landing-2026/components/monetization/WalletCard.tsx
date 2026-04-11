import { Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function WalletCard() {
  return (
    <Card size="large">
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-blue-400" />
        <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Wallet</p>
      </div>
      <p className="mt-2 text-sm text-gray-400">Wallet Balance</p>
      <p className="text-2xl font-bold text-white">$120</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary">Deposit</Button>
        <Button>Withdraw</Button>
        <Button variant="warning">Transfer</Button>
      </div>
    </Card>
  );
}

