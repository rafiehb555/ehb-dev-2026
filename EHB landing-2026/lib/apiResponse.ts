import { NextResponse } from "next/server";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: { message: string; code: string; details?: unknown };
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, init);
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown,
  init?: Omit<ResponseInit, "status">
) {
  return NextResponse.json(
    {
      success: false,
      error: { message, code, ...(details !== undefined ? { details } : {}) },
    } satisfies ApiError,
    { status, ...init }
  );
}

