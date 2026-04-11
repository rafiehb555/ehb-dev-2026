import { NextResponse } from "next/server";
import { gzipSync } from "node:zlib";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: { message: string; code: string; details?: unknown };
};

function shouldGzip(req: Request, body: string): boolean {
  if (body.length < 1024) return false;
  const enc = req.headers.get("accept-encoding") ?? "";
  return enc.includes("gzip");
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, init);
}

export function okCompressed<T>(req: Request, data: T, init?: ResponseInit) {
  const payload = { success: true, data } satisfies ApiSuccess<T>;
  const json = JSON.stringify(payload);
  if (!shouldGzip(req, json)) {
    return NextResponse.json(payload, init);
  }

  try {
    const gz = gzipSync(Buffer.from(json));
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json; charset=utf-8");
    headers.set("Content-Encoding", "gzip");
    headers.set("Vary", "Accept-Encoding");
    return new NextResponse(gz, { ...init, headers });
  } catch {
    return NextResponse.json(payload, init);
  }
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown,
  init?: Omit<ResponseInit, "status">,
) {
  return NextResponse.json(
    {
      success: false,
      error: { message, code, ...(details !== undefined ? { details } : {}) },
    } satisfies ApiError,
    { status, ...init },
  );
}
