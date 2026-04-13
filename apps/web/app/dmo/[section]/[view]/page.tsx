import { DmoSectionWorkspace } from "@/components/dmo/DmoSectionWorkspace";
import {
  DmoPrototypeWorkspace,
  isPrototypeSection,
} from "@/components/dmo/DmoPrototypeWorkspace";

interface PageProps {
  params: Promise<{ section: string; view: string }>;
}

/**
 * DMO sub-route dispatcher.
 *
 * Phase 9 silver-chrome prototype (`DmoPrototypeWorkspace`) owns the 10
 * modules that the legacy `DmoSectionWorkspace` never covered:
 *   up-guard, wallet-control, earnings-engine, refill-management,
 *   complaints, activity-engine, task-system, ai-assistant, analytics,
 *   blockchain-control.
 *
 * Legacy sections (applications, approvals, jps, pss, crb, franchise,
 * stl, industry, automation, refilling, affiliate, notifications,
 * penalty, settings) still render from the old workspace until they are
 * migrated to the silver-chrome theme in a later sprint.
 */
export default async function DmoSectionViewPage({ params }: PageProps) {
  const { section, view } = await params;
  if (isPrototypeSection(section)) {
    return <DmoPrototypeWorkspace sectionKey={section} viewKey={view} />;
  }
  return <DmoSectionWorkspace sectionKey={section} viewKey={view} />;
}
