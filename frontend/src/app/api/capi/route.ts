import { NextResponse } from "next/server";

import { backendIsConfigured, callBackend } from "@/lib/api/backend";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!backendIsConfigured()) {
    // Fail open: tracking failures must never block the user experience.
    return NextResponse.json({ results: {}, note: "backend not configured" });
  }

  const xff = req.headers.get("x-forwarded-for");

  const resp = await callBackend("/v1/tracking/event", {
    method: "POST",
    body,
    headers: xff ? { "X-Forwarded-For": xff } : {},
    timeoutMs: 6000,
  }).catch(() => null);

  if (!resp) {
    return NextResponse.json({ results: {}, note: "backend unreachable" }, { status: 200 });
  }
  const text = await resp.text();
  return new NextResponse(text, {
    status: resp.status,
    headers: { "Content-Type": resp.headers.get("content-type") ?? "application/json" },
  });
}
