"use client";

import { DmoSidebar } from "./DmoSidebar";

type SidebarProps = {
  selectedSectionKey?: string | null;
};

export default function Sidebar({ selectedSectionKey }: SidebarProps) {
  return <DmoSidebar className="h-[calc(100vh-3rem)]" selectedSectionKey={selectedSectionKey} />;
}

