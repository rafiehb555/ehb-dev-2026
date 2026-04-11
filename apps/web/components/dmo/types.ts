export type ApplicationStatus = "NEW" | "IN_REVIEW" | "UNDER_INSPECTION" | "APPROVED" | "REJECTED";
export type ApplicationType =
  | "PSS"
  | "PSS_REFILL"
  | "CRB_CERTIFICATION"
  | "INDUSTRY_VERIFICATION"
  | "CRB"
  | "SERVICE"
  | "PRODUCT"
  | "SELLER_ONBOARDING"
  | "ORDER_REVIEW"
  | "COMPLIANCE"
  | "FRANCHISE"
  | "OTHER";
export type ApprovalDecision = "APPROVED" | "REJECTED";

export type BasicUser = { id: string; name: string; email: string; role: string };

export type ApplicationRow = {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  assignedToId: string | null;
  assignedTo: BasicUser | null;
  applicant: BasicUser;
  createdAt: string;
  updatedAt: string;
};

export type Approval = {
  id: string;
  decision: ApprovalDecision;
  notes: string | null;
  createdAt: string;
  approvedBy: BasicUser;
};

export type ApplicationDetail = ApplicationRow & {
  payload: unknown | null;
  approvals: Approval[];
};

export type AuditLog = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: unknown | null;
  createdAt: string;
  actor: BasicUser | null;
};

export type SessionUser = { id: string; email: string; name: string; role: string; createdAt: string };

