import { nanoid } from "nanoid";

import type { Platform } from "@/types/analytics";

/**
 * Per-platform event_id namespaces. Sharing one ID across all platforms is the
 * single biggest dedup foot-gun — each platform must get its own ID so pixel
 * and CAPI for that platform line up but Meta isn't fed a TikTok event ID.
 */
export const eventIdFor = (platform: Platform, kind: string, key: string): string =>
  `${platform}-${kind}-${key}`;

export const sessionEventIds = (kind: string): Record<Platform, string> => {
  const key = `${kind}-${nanoid(10)}`;
  return {
    meta: eventIdFor("meta", "ev", key),
    tiktok: eventIdFor("tiktok", "ev", key),
    snap: eventIdFor("snap", "ev", key),
  };
};

/** Deterministic Purchase event IDs derived from order_ref. */
export const purchaseEventIds = (orderRef: string): Record<Platform, string> => ({
  meta: eventIdFor("meta", "pur", orderRef),
  tiktok: eventIdFor("tiktok", "pur", orderRef),
  snap: eventIdFor("snap", "pur", orderRef),
});
