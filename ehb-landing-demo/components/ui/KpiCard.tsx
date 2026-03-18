type Props = {
  label: string;
  value: string | number;
  detail?: string;
};

export function KpiCard({ label, value, detail }: Props) {
  return (
    <div className="glass-panel card-hover p-3 sm:p-3.5">
      <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
        {label}
      </div>
      <div className="text-base sm:text-lg font-semibold text-white">{value}</div>
      {detail ? (
        <div className="mt-0.5 text-[10px] xs:text-[11px] text-slate-400">{detail}</div>
      ) : null}
    </div>
  );
}
