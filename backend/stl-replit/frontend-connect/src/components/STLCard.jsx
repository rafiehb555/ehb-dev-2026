export default function STLCard({ score, level }) {
  return (
    <div className="card">
      <h2>STL Score: {score}</h2>
      <h3>Level: {level}</h3>
    </div>
  );
}

