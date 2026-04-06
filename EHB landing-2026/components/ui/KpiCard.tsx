import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  detail?: string;
  icon?: ReactNode;
};

export function KpiCard({ label, value, detail, icon }: Props) {
  return (
    <div className="glass-panel card-hover p-3 sm:p-3.5 flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
        {icon ? <div className="text-slate-400 opacity-90 [&_svg]:h-4 [&_svg]:w-4">{icon}</div> : null}
      </div>
      <div className="text-base sm:text-lg font-semibold text-white">{value}</div>
      {detail ? <div className="text-[10px] xs:text-[11px] text-slate-400 leading-snug">{detail}</div> : null}
    </div>
  );
}
