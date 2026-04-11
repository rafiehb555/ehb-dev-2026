"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import AnimatedCard from "@/components/ui/AnimatedCard";

const data = [
  { day: "Mon", value: 60 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 70 },
  { day: "Thu", value: 75 },
  { day: "Fri", value: 82 },
];

export default function STLChart() {
  return (
    <AnimatedCard className="border-cyan-500/15 bg-white/[0.04] backdrop-blur-xl hover:shadow-cyan-500/20">
      <h3 className="mb-2 text-sm font-semibold text-gray-300">STL Trend</h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#22C55E" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </AnimatedCard>
  );
}

