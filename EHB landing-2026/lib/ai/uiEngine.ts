import type { AppRole } from "@/types/user.types";

export type UiWidgetType =
  | "PSS_REQUIRED"
  | "CRB_PENDING"
  | "UPGRADE_READY"
  | "REFILL"
  | "VIP_UPGRADE"
  | "FRANCHISE"
  | "FRAUD_ALERTS"
  | "PENDING_APPROVALS"
  | "SYSTEM_STATS";

export type UiWidgetConfig = {
  type: UiWidgetType;
  priority: number;
};

type UiInput = {
  role: AppRole;
  stl: number;
};

function roleWidgetBase(role: AppRole): UiWidgetConfig[] {
  if (role === "ADMIN" || role === "DMO_ADMIN" || role === "SUPER_ADMIN") {
    return [
      { type: "FRAUD_ALERTS", priority: 1 },
      { type: "PENDING_APPROVALS", priority: 2 },
      { type: "SYSTEM_STATS", priority: 3 },
    ];
  }

  if (role === "FRANCHISE" || role === "SELLER") {
    return [{ type: "FRANCHISE", priority: 4 }];
  }

  return [];
}

export function getUIConfig(input: UiInput): UiWidgetConfig[] {
  const widgets: UiWidgetConfig[] = [...roleWidgetBase(input.role)];

  if (input.stl < 50) {
    widgets.push({ type: "PSS_REQUIRED", priority: 1 }, { type: "CRB_PENDING", priority: 2 });
  } else if (input.stl < 80) {
    widgets.push({ type: "UPGRADE_READY", priority: 2 }, { type: "REFILL", priority: 3 });
  } else {
    widgets.push({ type: "VIP_UPGRADE", priority: 1 }, { type: "FRANCHISE", priority: 2 });
  }

  const dedup = new Map<UiWidgetType, UiWidgetConfig>();
  for (const w of widgets) {
    const prev = dedup.get(w.type);
    if (!prev || w.priority < prev.priority) dedup.set(w.type, w);
  }

  return [...dedup.values()].sort((a, b) => a.priority - b.priority);
}

