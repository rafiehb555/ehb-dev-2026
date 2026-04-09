import STLDashboard from "@/components/stl/STLDashboard";
import DynamicUI from "@/components/dashboard/DynamicUI";
import GrowthSection from "@/components/growth/GrowthSection";
import MonetizationSection from "@/components/monetization/MonetizationSection";
import RoleBasedSidebar from "@/components/dashboard/RoleBasedSidebar";

export default function UserDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <RoleBasedSidebar role="USER" />
      </div>
      <div className="space-y-4 lg:col-span-9">
        <DynamicUI />
        <MonetizationSection />
        <GrowthSection />
        <STLDashboard />
      </div>
    </div>
  );
}

