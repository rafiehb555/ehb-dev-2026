export default function AIExplanation({ reasons = [] }) {
  return (
    <div className="card">
      <h3>Why your STL is low:</h3>
      <ul>
        {reasons.length > 0 ? reasons.map((r, i) => <li key={`${r}-${i}`}>{r}</li>) : <li>No critical issues.</li>}
      </ul>
      <button>Fix Now</button>
    </div>
  );
}

