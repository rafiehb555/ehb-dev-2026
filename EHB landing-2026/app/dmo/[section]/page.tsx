import { DmoSectionWorkspace } from "@/components/dmo/DmoSectionWorkspace";

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function DmoSectionLandingPage({ params }: PageProps) {
  const { section } = await params;
  return <DmoSectionWorkspace sectionKey={section} />;
}
