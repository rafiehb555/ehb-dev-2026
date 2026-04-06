import { DmoSectionWorkspace } from "@/components/dmo/DmoSectionWorkspace";

interface PageProps {
  params: Promise<{ section: string; view: string }>;
}

export default async function DmoSectionViewPage({ params }: PageProps) {
  const { section, view } = await params;
  return <DmoSectionWorkspace sectionKey={section} viewKey={view} />;
}
