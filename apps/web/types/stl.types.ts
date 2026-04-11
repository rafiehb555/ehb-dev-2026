import type { SessionUser } from "@/lib/auth";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

export type StlSnapshotDto = StlFullSnapshot;

export type StlApiPayload = {
  snapshot: StlSnapshotDto;
};

export type StlAccessUser = SessionUser;
