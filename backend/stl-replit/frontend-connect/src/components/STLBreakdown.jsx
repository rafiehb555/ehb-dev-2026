function bar(value) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  return {
    width: `${v}%`,
    background: v >= 70 ? "#22c55e" : v >= 50 ? "#f59e0b" : "#ef4444",
  };
}

function Row({ label, value }) {
  const icon = value >= 70 ? "✔" : value >= 50 ? "⚠" : "❌";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span>
          {label}: {value} {icon}
        </span>
      </div>
      <div style={{ height: 8, background: "#1f2937", borderRadius: 999 }}>
        <div style={{ ...bar(value), height: 8, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export default function STLBreakdown({ breakdown }) {
  const pss = breakdown?.modules?.pss?.score ?? 0;
  const crb = breakdown?.modules?.crb?.score ?? 0;
  const dmo = breakdown?.modules?.dmo?.score ?? 0;
  const lockAmount = breakdown?.modules?.lock?.amount ?? 0;
  const lockLevel = breakdown?.modules?.lock?.level ?? "L1";
  return (
    <div className="card">
      <h3>Score Breakdown</h3>
      <Row label="PSS" value={pss} />
      <Row label="CRB" value={crb} />
      <Row label="DMO" value={dmo} />
      <p style={{ marginTop: 8 }}>
        LOCK: ${lockAmount} ({lockLevel}) ✔
      </p>
    </div>
  );
}

