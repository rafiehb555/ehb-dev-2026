export function DmoCard() {
  return (
    <div className="glass-panel card-interactive p-3 sm:p-4 relative overflow-hidden">
      <div className="card-shine-inner rounded-xl" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00eaff]/50 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00eaff] via-[#3b82f6] to-transparent opacity-80" />
      <div className="relative space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-semibold text-white">DMO · Decentralized Management Office</h3>
          <span className="inline-flex items-center rounded-full border border-[#00eaff]/50 bg-[#00eaff]/10 px-2 py-0.5 text-[9px] xs:text-[10px] text-[#00eaff]">
            Core Operating Layer
          </span>
        </div>
        <p className="text-[10px] xs:text-[11px] text-ehb-textBody">
          Single source of truth for users, companies, certificates, STL scores, wallet accounts and
          applications across all EHB industries.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] xs:text-[11px] text-slate-200">
          <span>• Identity &amp; JPS profiles</span>
          <span>• PSS &amp; CRB verification</span>
          <span>• STL trust engine</span>
          <span>• Wallet &amp; penalties</span>
          <span>• Applications &amp; approvals</span>
          <span>• Blockchain anchoring</span>
        </div>
        <div className="pt-1 flex flex-wrap gap-1.5">
          <a
            href="/dmo"
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-3 py-1.5 text-[10px] xs:text-[11px] font-semibold text-slate-950 btn-glow"
          >
            Open DMO Dashboard
          </a>
          <span className="inline-flex items-center rounded-full glass-panel px-2 py-0.5 text-[9px] xs:text-[10px] text-slate-200">
            Includes Applications &amp; Approvals service
          </span>
        </div>
      </div>
    </div>
  );
}
