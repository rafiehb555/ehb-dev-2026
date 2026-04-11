function ModuleCard({ title, moduleData, details }) {
  return (
    <div className="mini-card">
      <h4>{title}</h4>
      <p>
        {moduleData?.level || "L1"} - {moduleData?.name || "N/A"}
      </p>
      <p>Score: {moduleData?.score ?? 0}%</p>
      <ul>
        {details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

export default function EcosystemPanels({ data }) {
  const breakdown = data?.breakdown?.modules || {};
  const reasons = data?.reasons || [];
  const weakArea = data?.breakdown?.weakArea || "N/A";
  const profile = data?.userProfile || {};
  const rules = data?.policy || [];

  return (
    <>
      <div className="card">
        <h3>STL Breakdown</h3>
        <p>PSS: {breakdown?.pss?.score ?? 0}%</p>
        <p>CRB: {breakdown?.crb?.score ?? 0}%</p>
        <p>DMO: {breakdown?.dmo?.score ?? 0}%</p>
        <p>
          Weak Area: <strong>{weakArea}</strong>
        </p>
        <button>Improve Now</button>
      </div>

      <div className="module-grid">
        <ModuleCard
          title="PSS Trust Level"
          moduleData={breakdown?.pss}
          details={["CNIC verified status", "Complaints health", "Identity trust"]}
        />
        <ModuleCard
          title="CRB Capability Level"
          moduleData={breakdown?.crb}
          details={["Exam outcomes", "Visit readiness", "Skill confidence"]}
        />
        <ModuleCard
          title="DMO Activity Level"
          moduleData={breakdown?.dmo}
          details={["Daily activity", "Order behavior", "Consistency"]}
        />
      </div>

      <div className="card">
        <h3>Why STL (Deep)</h3>
        <ul>
          {reasons.length > 0 ? reasons.map((r, i) => <li key={`${r}-${i}`}>{r}</li>) : <li>No active blockers</li>}
        </ul>
      </div>

      <div className="card">
        <h3>Action System</h3>
        <div className="action-row">
          <button>Verify KYC</button>
          <button>Retake Exam</button>
          <button>Increase Activity</button>
        </div>
      </div>

      <div className="card">
        <h3>User Type</h3>
        <p>Type: {profile.type || "SELLER"} (GoSellr)</p>
        <p>Source: {profile.source || "signup"}</p>
        <p>Franchise: {profile.franchiseConnected ? "Connected" : "Not connected"}</p>
      </div>

      <div className="card">
        <h3>Rules & Policy</h3>
        <ul>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>

      <details className="card">
        <summary>Advanced Data</summary>
        <ul>
          <li>Logs</li>
          <li>History</li>
          <li>AI Decisions</li>
        </ul>
      </details>
    </>
  );
}

