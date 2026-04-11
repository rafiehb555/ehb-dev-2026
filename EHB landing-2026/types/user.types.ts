export type AppRole =
  | "USER"
  | "SELLER"
  | "FRANCHISE"
  | "ADMIN"
  | "DMO_ADMIN"
  | "SUPER_ADMIN"
  | "SERVICE_PROVIDER";

export type AppUser = {
  userId: string;
  role: AppRole;
  name?: string | null;
  email?: string | null;
};
