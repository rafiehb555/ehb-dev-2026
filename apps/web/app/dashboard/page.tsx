"use client";

import useUser from "@/hooks/useUser";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import FranchiseDashboard from "@/components/dashboard/FranchiseDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import ServiceProviderDashboard from "@/components/dashboard/ServiceProviderDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default function DashboardPage() {
  const { user, loading, error } = useUser();

  if (loading) return <div className="p-6 text-sm text-gray-300">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-sm text-red-300">{error}</div>;

  const role = user?.role ?? "USER";

  switch (role) {
    case "FRANCHISE":
      return <FranchiseDashboard />;
    case "ADMIN":
    case "DMO_ADMIN":
    case "SUPER_ADMIN":
      return <AdminDashboard />;
    case "SELLER":
      return <SellerDashboard />;
    case "SERVICE_PROVIDER":
      return <ServiceProviderDashboard />;
    default:
      return <UserDashboard />;
  }
}
