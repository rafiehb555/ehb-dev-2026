import RoleBasedSidebar from "@/components/dashboard/RoleBasedSidebar";
import DynamicUI from "@/components/dashboard/DynamicUI";

export default function ServiceProviderDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <RoleBasedSidebar role="SERVICE_PROVIDER" />
      </div>
      <div className="space-y-4 lg:col-span-9">
        <DynamicUI />
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-4">
          <h2 className="text-lg font-semibold text-white">Service Provider Overview</h2>
          <p className="mt-1 text-sm text-gray-300">Active Jobs: 18</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-4">
          <h3 className="text-base font-semibold text-white">Client Health</h3>
          <p className="mt-1 text-sm text-gray-300">Average Rating: 4.7 / 5</p>
        </div>
      </div>
    </div>
  );
}

