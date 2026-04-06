type DemoAuditTargetType =
  | "APPLICATION"
  | "APPROVAL"
  | "REGISTRY_RECORD"
  | "PSS_VERIFICATION"
  | "AUTOMATION_EVENT"
  | "USER"
  | "OTHER";
type DemoRole = "USER" | "FRANCHISE" | "ADMIN" | "SUPER_ADMIN";
type DemoApplicationStatus = "NEW" | "IN_REVIEW" | "UNDER_INSPECTION" | "APPROVED" | "REJECTED";
type DemoApplicationType =
  | "PSS_VERIFICATION"
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

type DemoUser = { id: string; name: string; email: string; role: DemoRole };
type DemoApproval = {
  id: string;
  decision: "APPROVED" | "REJECTED";
  notes: string | null;
  createdAt: string;
  approvedBy: DemoUser;
};
type DemoApplication = {
  id: string;
  type: DemoApplicationType;
  status: DemoApplicationStatus;
  applicantId: string;
  applicant: DemoUser;
  assignedToId: string | null;
  assignedTo: DemoUser | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  approvals: DemoApproval[];
};
type DemoAuditLog = {
  id: string;
  action: string;
  targetType: DemoAuditTargetType;
  targetId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: DemoUser | null;
};
type DemoDecision = {
  approval: {
    id: string;
    applicationId: string;
    approvedById: string;
    decision: "APPROVED" | "REJECTED";
    notes: string | null;
    createdAt: string;
  };
  application: {
    id: string;
    status: "APPROVED" | "REJECTED";
    applicantId: string;
  };
};

const DEMO_ADMIN: DemoUser = {
  id: "ehb-demo-admin",
  name: "Demo Admin",
  email: "demo-admin@ehb.local",
  role: "SUPER_ADMIN",
};
const DEMO_FRANCHISE: DemoUser = {
  id: "ehb-demo-franchise",
  name: "Franchise Operator",
  email: "franchise@ehb.local",
  role: "FRANCHISE",
};
const DEMO_USERS: DemoUser[] = [
  { id: "ehb-demo-user-1", name: "Ali Khan", email: "ali@test.com", role: "USER" },
  { id: "ehb-demo-user-2", name: "Sara Noor", email: "sara@test.com", role: "USER" },
  { id: "ehb-demo-user-3", name: "Usman Raza", email: "usman@test.com", role: "USER" },
];

export function getDemoMeUser() {
  return {
    id: DEMO_ADMIN.id,
    email: DEMO_ADMIN.email,
    name: DEMO_ADMIN.name,
    role: DEMO_ADMIN.role,
    createdAt: new Date().toISOString(),
  };
}

export function listDemoAssignableUsers() {
  return [DEMO_ADMIN, DEMO_FRANCHISE, ...DEMO_USERS].map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
}

const g = globalThis as unknown as {
  __ehbDemoAudit?: DemoAuditLog[];
  __ehbDemoApps?: DemoApplication[];
};

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function makeCuidLike(prefix = "cmehbapp") {
  const random = Math.random().toString(36).slice(2, 14);
  const ts = Date.now().toString(36);
  const raw = `${prefix}${ts}${random}`.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return (`c${raw}`.slice(0, 25)).padEnd(25, "0");
}

function auditStore() {
  if (!g.__ehbDemoAudit) g.__ehbDemoAudit = [];
  return g.__ehbDemoAudit;
}

function appStore() {
  if (!g.__ehbDemoApps) {
    const now = Date.now();
    g.__ehbDemoApps = [
      {
        id: "cmehbappdemo0000000000001",
        type: "PSS",
        status: "NEW",
        applicantId: DEMO_USERS[0].id,
        applicant: DEMO_USERS[0],
        assignedToId: null,
        assignedTo: null,
        payload: { source: "demo", module: "PSS" },
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 60 * 60 * 1000).toISOString(),
        approvals: [],
      },
      {
        id: "cmehbappdemo0000000000002",
        type: "CRB_CERTIFICATION",
        status: "UNDER_INSPECTION",
        applicantId: DEMO_USERS[1].id,
        applicant: DEMO_USERS[1],
        assignedToId: DEMO_FRANCHISE.id,
        assignedTo: DEMO_FRANCHISE,
        payload: { source: "demo", module: "CRB" },
        createdAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 9 * 60 * 60 * 1000).toISOString(),
        approvals: [],
      },
      {
        id: "cmehbappdemo0000000000003",
        type: "INDUSTRY_VERIFICATION",
        status: "IN_REVIEW",
        applicantId: DEMO_USERS[2].id,
        applicant: DEMO_USERS[2],
        assignedToId: DEMO_ADMIN.id,
        assignedTo: DEMO_ADMIN,
        payload: { source: "demo", module: "Industry" },
        createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
        approvals: [],
      },
    ];
  }
  return g.__ehbDemoApps;
}

export function isDmoDemoMode() {
  if (process.env.EHB_DMO_DEMO_MODE === "0") return false;
  if (process.env.EHB_DMO_DEMO_MODE === "1") return true;
  // In development prefer demo mode unless explicitly disabled.
  return process.env.NODE_ENV !== "production";
}

function writeDemoAudit(entry: Omit<DemoAuditLog, "id" | "createdAt">) {
  auditStore().unshift({
    id: makeId("demo_audit"),
    createdAt: new Date().toISOString(),
    ...entry,
  });
}

export function listDemoApplications(args: {
  take: number;
  skip: number;
  status?: DemoApplicationStatus;
  type?: DemoApplicationType;
  role: string;
  userId: string;
}) {
  const filtered = appStore().filter((a) => {
    const statusOk = args.status ? a.status === args.status : true;
    const typeOk = args.type ? a.type === args.type : true;
    const roleOk =
      args.role === "ADMIN" || args.role === "SUPER_ADMIN"
        ? true
        : args.role === "FRANCHISE"
          ? a.assignedToId === args.userId
          : a.applicantId === args.userId;
    return statusOk && typeOk && roleOk;
  });
  return filtered.slice(args.skip, args.skip + args.take);
}

export function getDemoApplicationById(id: string) {
  return appStore().find((a) => a.id === id) ?? null;
}

export function patchDemoApplication(args: {
  id: string;
  status?: DemoApplicationStatus;
  assignedToId?: string | null;
  actorId: string;
}) {
  const app = getDemoApplicationById(args.id);
  if (!app) return null;

  if (args.status) app.status = args.status;
  if (args.assignedToId !== undefined) {
    app.assignedToId = args.assignedToId;
    const known = [DEMO_ADMIN, DEMO_FRANCHISE, ...DEMO_USERS].find((u) => u.id === args.assignedToId);
    app.assignedTo = known ?? (args.assignedToId ? { id: args.assignedToId, name: "Assigned User", email: "assigned@ehb.local", role: "FRANCHISE" } : null);
  }
  app.updatedAt = new Date().toISOString();

  writeDemoAudit({
    actor: DEMO_ADMIN,
    action: "DMO_APPLICATION_UPDATED",
    targetType: "APPLICATION",
    targetId: app.id,
    metadata: { status: app.status, assignedToId: app.assignedToId },
  });

  return app;
}

export function createDemoApplication(args: {
  type: DemoApplicationType;
  applicantId: string;
  assignedToId?: string;
  payload?: Record<string, unknown>;
}) {
  const applicant = [DEMO_ADMIN, DEMO_FRANCHISE, ...DEMO_USERS].find((u) => u.id === args.applicantId) ?? DEMO_USERS[0];
  const assigned = args.assignedToId ? [DEMO_ADMIN, DEMO_FRANCHISE, ...DEMO_USERS].find((u) => u.id === args.assignedToId) ?? null : null;
  const now = new Date().toISOString();
  const app: DemoApplication = {
    id: makeCuidLike(),
    type: args.type,
    status: "NEW",
    applicantId: applicant.id,
    applicant,
    assignedToId: assigned?.id ?? null,
    assignedTo: assigned,
    payload: args.payload ?? null,
    createdAt: now,
    updatedAt: now,
    approvals: [],
  };
  appStore().unshift(app);

  writeDemoAudit({
    actor: DEMO_ADMIN,
    action: "DMO_APPLICATION_CREATED",
    targetType: "APPLICATION",
    targetId: app.id,
    metadata: { type: app.type, status: app.status },
  });

  return app;
}

export function listDemoAudit(args?: {
  take?: number;
  skip?: number;
  targetType?: DemoAuditTargetType;
  targetId?: string;
}) {
  const base = auditStore().filter((l) => {
    const typeOk = args?.targetType ? l.targetType === args.targetType : true;
    const idOk = args?.targetId ? l.targetId === args.targetId : true;
    return typeOk && idOk;
  });
  const skip = args?.skip ?? 0;
  const take = args?.take ?? 50;
  return base.slice(skip, skip + take);
}

export function createDemoDecision(args: {
  applicationId: string;
  decision: "APPROVED" | "REJECTED";
  notes?: string;
}): DemoDecision | null {
  const app = getDemoApplicationById(args.applicationId);
  if (!app) return null;

  const now = new Date().toISOString();
  const approvalId = makeId("demo_approval");
  const approval: DemoApproval = {
    id: approvalId,
    decision: args.decision,
    notes: args.notes ?? null,
    createdAt: now,
    approvedBy: DEMO_ADMIN,
  };

  app.approvals.unshift(approval);
  app.status = args.decision === "APPROVED" ? "APPROVED" : "REJECTED";
  app.updatedAt = now;

  writeDemoAudit({
    actor: DEMO_ADMIN,
    action: "DMO_APPROVAL_RECORDED",
    targetType: "APPROVAL",
    targetId: approvalId,
    metadata: { applicationId: args.applicationId, decision: args.decision, notes: args.notes ?? null },
  });
  writeDemoAudit({
    actor: DEMO_ADMIN,
    action: "DMO_APPLICATION_STATUS_SET",
    targetType: "APPLICATION",
    targetId: args.applicationId,
    metadata: { status: app.status },
  });

  return {
    approval: {
      id: approvalId,
      applicationId: args.applicationId,
      approvedById: DEMO_ADMIN.id,
      decision: args.decision,
      notes: args.notes ?? null,
      createdAt: now,
    },
    application: {
      id: args.applicationId,
      status: app.status,
      applicantId: app.applicantId,
    },
  };
}

export function listDemoApprovals(args: { applicationId?: string; take?: number; skip?: number }) {
  const approvals = appStore().flatMap((app) =>
    app.approvals.map((approval) => ({
      id: approval.id,
      applicationId: app.id,
      decision: approval.decision,
      notes: approval.notes,
      createdAt: approval.createdAt,
      approvedBy: approval.approvedBy,
    }))
  );
  const filtered = args.applicationId ? approvals.filter((a) => a.applicationId === args.applicationId) : approvals;
  const sorted = filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const skip = args.skip ?? 0;
  const take = args.take ?? 100;
  return sorted.slice(skip, skip + take);
}

