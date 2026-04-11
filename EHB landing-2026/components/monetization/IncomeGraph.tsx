"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Card from "@/components/ui/Card";

const points = [
  { day: "Mon", earnings: 12 },
  { day: "Tue", earnings: 18 },
  { day: "Wed", earnings: 21 },
  { day: "Thu", earnings: 15 },
  { day: "Fri", earnings: 25 },
  { day: "Sat", earnings: 30 },
  { day: "Sun", earnings: 27 },
];

export default function IncomeGraph() {
  return (
    <Card size="large">
      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Income Graph</p>
      <p className="mt-1 text-sm text-gray-300">Daily earnings trend</p>
      <div className="mt-3 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#22C55E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

