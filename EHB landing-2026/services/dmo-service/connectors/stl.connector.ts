import { getStlFullSnapshotForUser } from "@/services/stl";

export async function getSTLFromService(userId: string) {
  // Current local boundary call. Future: HTTP connector to STL microservice.
  return getStlFullSnapshotForUser(userId);
}
