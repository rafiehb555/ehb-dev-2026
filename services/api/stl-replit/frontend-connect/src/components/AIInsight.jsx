export default function AIInsight({ ai, warning }) {
  return (
    <div className="card">
      <h3>AI Insight</h3>
      <p>Risk: {ai?.risk || "medium"}</p>
      <p>Reason: {ai?.reason || "No AI insight available yet."}</p>
      {warning ? <p style={{ color: "#f59e0b" }}>⚠ Warning: {warning}</p> : null}
    </div>
  );
}

