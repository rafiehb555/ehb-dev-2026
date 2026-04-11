import { NextResponse } from "next/server";

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  const body: ApiEnvelope<T> = { success: true, data, error: null };
  return NextResponse.json(body, init);
}

export function apiError(message: string, status = 400, init?: Omit<ResponseInit, "status">) {
  const body: ApiEnvelope = { success: false, data: null, error: message };
  return NextResponse.json(body, { status, ...init });
}
