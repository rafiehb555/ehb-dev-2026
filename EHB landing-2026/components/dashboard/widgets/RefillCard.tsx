export default function RefillCard() {
  return (
    <div className="rounded-xl border border-blue-500/30 bg-[#111827] p-4">
      <h3 className="text-base font-semibold text-white">Refill Reminder</h3>
      <p className="mt-1 text-sm text-gray-300">Complete refill cycle to avoid trust drop and stay upgrade-eligible.</p>
      <button className="mt-3 rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white">Open refilling</button>
    </div>
  );
}

