/**
 * Typed env accessor. Reads from process.env and exposes only the variables we
 * actually use. NEXT_PUBLIC_* are inlined at build time; the others are
 * server-only.
 */
const required = (key: string, value: string | undefined, fallback?: string): string => {
  if (value && value.length > 0) return value;
  if (fallback !== undefined) return fallback;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required env var: ${key}`);
  }
  return "";
};

export const env = {
  NEXT_PUBLIC_SITE_URL: required(
    "NEXT_PUBLIC_SITE_URL",
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://alnadara.shop",
  ),
  NEXT_PUBLIC_API_BASE_URL: required(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "https://api.alnadara.shop",
  ),
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  NEXT_PUBLIC_TIKTOK_PIXEL_ID: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  NEXT_PUBLIC_SNAP_PIXEL_ID: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? "",
  NEXT_PUBLIC_WHATSAPP_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+96550001234",
  NEXT_PUBLIC_SUPPORT_EMAIL:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@alnadara.shop",
} as const;

export const serverEnv = {
  BACKEND_INTERNAL_URL: process.env.BACKEND_INTERNAL_URL ?? "http://backend:8000",
  META_CAPI_ACCESS_TOKEN: process.env.META_CAPI_ACCESS_TOKEN ?? "",
  META_TEST_EVENT_CODE: process.env.META_TEST_EVENT_CODE ?? "",
  TIKTOK_CAPI_ACCESS_TOKEN: process.env.TIKTOK_CAPI_ACCESS_TOKEN ?? "",
  SNAP_CAPI_ACCESS_TOKEN: process.env.SNAP_CAPI_ACCESS_TOKEN ?? "",
} as const;
