export default function STLCard({ score, level }) {
  const numericLevel = String(level || "L1").replace("L", "");
  return (
    <div className="card">
      <h2>STL Level: {level} (Tier {numericLevel})</h2>
      <h3>Score: {score}</h3>
    </div>
  );
}

