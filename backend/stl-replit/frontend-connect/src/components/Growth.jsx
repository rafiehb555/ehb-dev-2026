export default function Growth({ growth }) {
  return (
    <div className="card">
      <h3>Growth</h3>
      <p>Referrals: {growth?.referrals ?? 0}</p>
      <p>Earnings: ${growth?.earnings ?? 0}</p>
      <button>Invite Now</button>
    </div>
  );
}

