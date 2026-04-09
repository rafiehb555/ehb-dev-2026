export default function UpgradeCard() {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-[#111827] p-4">
      <h3 className="text-base font-semibold text-white">Upgrade Ready</h3>
      <p className="mt-1 text-sm text-gray-300">You are close to the next STL tier. Complete final tasks.</p>
      <button className="mt-3 rounded bg-green-500 px-3 py-1 text-sm font-semibold text-black">Upgrade</button>
    </div>
  );
}

