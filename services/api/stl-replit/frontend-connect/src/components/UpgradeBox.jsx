export default function UpgradeBox({ score }) {
  let next = "L2";
  if (score >= 30) next = "L3";
  if (score >= 50) next = "L4";
  if (score >= 70) next = "L5";

  return (
    <div className="card">
      <h3>Next Level: {next}</h3>
      <button>Complete Tasks</button>
    </div>
  );
}

