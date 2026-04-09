import RoleBasedSidebar from "@/components/dashboard/RoleBasedSidebar";
import DynamicUI from "@/components/dashboard/DynamicUI";

export default function FranchiseDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <RoleBasedSidebar role="FRANCHISE" />
      </div>
      <div className="space-y-4 lg:col-span-9">
        <DynamicUI />
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-4">
          <h2 className="text-lg font-semibold text-white">Franchise Overview</h2>
          <p className="mt-1 text-sm text-gray-300">Total Earnings: $12,400</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-4">
          <h3 className="text-base font-semibold text-white">Network</h3>
          <p className="mt-1 text-sm text-gray-300">Sub-Franchises: 12</p>
        </div>
      </div>
    </div>
  );
}

