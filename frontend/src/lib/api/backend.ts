import "server-only";

import { serverEnv } from "@/lib/env";

/**
 * Server-side helper for talking to the FastAPI backend from Next.js route
 * handlers. The browser never sees the backend URL — all requests go through
 * /api/* handlers.
 */
export const backendUrl = (path: string): string => {
  const base = serverEnv.BACKEND_INTERNAL_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const backendIsConfigured = (): boolean =>
  !!serverEnv.BACKEND_INTERNAL_URL && serverEnv.BACKEND_INTERNAL_URL.length > 0;

export interface BackendCallOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export const callBackend = async (
  path: string,
  opts: BackendCallOptions = {},
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);
  try {
    return await fetch(backendUrl(path), {
      method: opts.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(opts.headers ?? {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
};
