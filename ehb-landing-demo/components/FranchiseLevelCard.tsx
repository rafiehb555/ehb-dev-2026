"use client";

interface FranchiseLevelCardProps {
  title: string;
  description: string;
  color: string;
  highlighted?: boolean;
}

export function FranchiseLevelCard({ title, description, color, highlighted }: FranchiseLevelCardProps) {
  return (
    <div
      className="rounded-2xl glass-card card-hover p-6 border transition-all duration-300 flex flex-col gap-2"
      style={{
        borderColor: highlighted ? `${color}80` : `${color}40`,
        boxShadow: highlighted ? `0 0 28px ${color}55` : undefined,
      }}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {highlighted ? "Recommended" : "Franchise Level"}
      </p>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

