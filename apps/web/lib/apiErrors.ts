import { ZodError } from "zod";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/library";
import { fail } from "./apiResponse";

function isDbConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("can't reach database") ||
    msg.includes("connection refused") ||
    msg.includes("econnrefused") ||
    msg.includes("does not exist") ||
    msg.includes("password authentication failed") ||
    msg.includes("p1001") ||
    (err as any).code === "P1001" ||
    (err as any).code === "P1002" ||
    (err as any).code === "P1003"
  );
}

export function handleRouteError(err: unknown) {
  if (err instanceof ZodError) {
    return fail(400, "VALIDATION_ERROR", "Validation error", err.flatten());
  }
  if (err instanceof PrismaClientInitializationError || isDbConnectionError(err)) {
    return fail(503, "DB_UNAVAILABLE", "Database unavailable. Run: npx prisma migrate dev, then restart.", { hint: "No PostgreSQL at localhost:5432. Start DB or configure DATABASE_URL." });
  }
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") return fail(409, "CONFLICT", "Unique constraint failed", err.meta);
    if (err.code === "P2025") return fail(404, "NOT_FOUND", "Record not found", err.meta);
    if (err.code === "P1001") return fail(503, "DB_UNAVAILABLE", "Database unreachable");
    return fail(400, "DB_KNOWN_ERROR", "Database error", { code: err.code, meta: err.meta });
  }
  if (err instanceof PrismaClientValidationError) {
    return fail(400, "DB_VALIDATION_ERROR", "Database validation error");
  }
  if (err instanceof Error) {
    if (isDbConnectionError(err)) {
      return fail(503, "DB_UNAVAILABLE", "Database unavailable", { message: err.message });
    }
    return fail(500, "INTERNAL_ERROR", err.message);
  }
  return fail(500, "UNKNOWN_ERROR", "Unknown error");
}

