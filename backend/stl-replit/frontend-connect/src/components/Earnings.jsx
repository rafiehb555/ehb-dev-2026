export default function Earnings({ earnings }) {
  return (
    <div className="card">
      <h3>Earnings</h3>
      <p>Today: ${earnings?.today ?? 0}</p>
      <p>Monthly: ${earnings?.monthly ?? 0}</p>
      <p>Total: ${earnings?.total ?? 0}</p>
    </div>
  );
}

