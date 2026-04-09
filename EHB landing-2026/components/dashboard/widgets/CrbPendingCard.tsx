export default function CrbPendingCard() {
  return (
    <div className="rounded-xl border border-orange-500/30 bg-[#111827] p-4">
      <h3 className="text-base font-semibold text-white">CRB Pending</h3>
      <p className="mt-1 text-sm text-gray-300">CRB verifications/exams are pending. Complete to improve STL.</p>
      <button className="mt-3 rounded bg-orange-500 px-3 py-1 text-sm font-semibold text-black">Continue CRB</button>
    </div>
  );
}

