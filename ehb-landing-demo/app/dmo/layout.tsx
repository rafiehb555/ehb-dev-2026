import Sidebar from "@/components/dmo/Sidebar";

export default function DmoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-white">
      <div className="sticky top-0 h-screen w-[320px] p-3 hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

