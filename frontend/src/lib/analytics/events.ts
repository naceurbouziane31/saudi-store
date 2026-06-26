"use client";

import { nanoid } from "nanoid";

import { env } from "@/lib/env";
import type { AnalyticsEvent, CanonicalEvent, EventContent, Platform } from "@/types/analytics";

import { hasConsent, onConsentChange } from "./consent";
import { eventIdFor, purchaseEventIds, sessionEventIds } from "./eventId";
import { fireMeta, hasMetaPixel } from "./meta";
import { fireSnap, hasSnapPixel } from "./snap";
import { fireTikTok, hasTikTokPixel } from "./tiktok";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, props: unknown, opts?: unknown) => void; page?: () => void };
    snaptr?: (...args: unknown[]) => void;
  }
}

const SESSION_KEY = "alnadara-session-v1";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = nanoid(12);
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

// Buffer events fired before consent is granted; flush on consent.
const queue: AnalyticsEvent[] = [];
let consentReady = hasConsent();

if (typeof window !== "undefined") {
  onConsentChange((v) => {
    if (v === "accepted") {
      consentReady = true;
      while (queue.length) {
        const e = queue.shift();
        if (e) flushEvent(e);
      }
    }
  });
}

const flushEvent = (event: AnalyticsEvent) => {
  if (hasMetaPixel()) fireMeta(event);
  if (hasTikTokPixel()) fireTikTok(event);
  if (hasSnapPixel()) fireSnap(event);

  // Server-side CAPI mirror, regardless of which platforms have web pixels.
  void postCapi(event).catch(() => undefined);
};

export const track = (event: AnalyticsEvent): void => {
  if (!consentReady) {
    queue.push(event);
    return;
  }
  flushEvent(event);
};

const purchaseEventIdsFor = (orderRef: string) => purchaseEventIds(orderRef);

export const trackPageView = (sessionId = getSessionId()) => {
  const eventIds = sessionEventIds(`pv-${sessionId}`);
  track({ canonical: "page_view", eventIds });
};

export const trackViewContent = (params: {
  sku: string;
  name: string;
  priceKwd: number;
}) => {
  const sessionId = getSessionId();
  const eventIds = sessionEventIds(`vc-${sessionId}-${params.sku}`);
  track({
    canonical: "view_content",
    eventIds,
    contents: [{ id: params.sku, name: params.name, quantity: 1, price: params.priceKwd }],
    value: params.priceKwd,
    currency: "KWD",
    contentType: "product",
  });
};

export const trackAddToCart = (contents: EventContent[]) => {
  const sessionId = getSessionId();
  const eventIds = sessionEventIds(`atc-${sessionId}`);
  const value = contents.reduce((acc, c) => acc + c.price * c.quantity, 0);
  track({
    canonical: "add_to_cart",
    eventIds,
    contents,
    value,
    currency: "KWD",
    contentType: "product",
  });
};

export const trackInitiateCheckout = (contents: EventContent[]) => {
  const sessionId = getSessionId();
  const eventIds = sessionEventIds(`ic-${sessionId}`);
  const value = contents.reduce((acc, c) => acc + c.price * c.quantity, 0);
  track({
    canonical: "initiate_checkout",
    eventIds,
    contents,
    value,
    currency: "KWD",
    contentType: "product",
  });
};

export const trackLead = (contents: EventContent[]) => {
  const sessionId = getSessionId();
  const eventIds = sessionEventIds(`lead-${sessionId}`);
  const value = contents.reduce((acc, c) => acc + c.price * c.quantity, 0);
  track({
    canonical: "lead",
    eventIds,
    contents,
    value,
    currency: "KWD",
    contentType: "product",
  });
};

export const trackPurchase = (params: {
  orderRef: string;
  totalKwd: number;
  contents: EventContent[];
}) => {
  const eventIds = purchaseEventIdsFor(params.orderRef);
  track({
    canonical: "purchase",
    eventIds,
    orderRef: params.orderRef,
    value: params.totalKwd,
    currency: "KWD",
    contents: params.contents,
    contentType: "product",
  });
};

export const trackUpsellImpression = (params: { sku: string; name: string; priceKwd: number; orderRef: string }) => {
  const eventIds = sessionEventIds(`upi-${params.orderRef}`);
  track({
    canonical: "upsell_impression",
    eventIds,
    orderRef: params.orderRef,
    contents: [{ id: params.sku, name: params.name, quantity: 1, price: params.priceKwd }],
    value: params.priceKwd,
    currency: "KWD",
    contentType: "product",
  });
};

export const trackUpsellAccept = (params: { sku: string; name: string; priceKwd: number; orderRef: string }) => {
  const eventIds = sessionEventIds(`upa-${params.orderRef}`);
  track({
    canonical: "upsell_accept",
    eventIds,
    orderRef: params.orderRef,
    contents: [{ id: params.sku, name: params.name, quantity: 1, price: params.priceKwd }],
    value: params.priceKwd,
    currency: "KWD",
    contentType: "product",
  });
};

const platformIdLookup = (
  ids: Partial<Record<Platform, string>> | undefined,
  platform: Platform,
  canonical: CanonicalEvent,
): string => {
  if (ids?.[platform]) return ids[platform]!;
  return eventIdFor(platform, "ev", `${canonical}-${nanoid(8)}`);
};

const postCapi = async (event: AnalyticsEvent): Promise<void> => {
  if (typeof window === "undefined") return;
  if (!env.NEXT_PUBLIC_META_PIXEL_ID && !env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && !env.NEXT_PUBLIC_SNAP_PIXEL_ID) {
    // No platform configured; skip silently.
    return;
  }
  const cookies = readPixelCookies();
  const meta = platformIdLookup(event.eventIds, "meta", event.canonical);
  const tiktok = platformIdLookup(event.eventIds, "tiktok", event.canonical);
  const snap = platformIdLookup(event.eventIds, "snap", event.canonical);
  await fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: event.canonical,
      event_time_unix: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      event_ids: { meta, tiktok, snap },
      user: {
        user_agent: navigator.userAgent,
        ...cookies,
      },
      custom: {
        currency: event.currency ?? "KWD",
        value: event.value ?? 0,
        contents: (event.contents ?? []).map((c) => ({
          id: c.id,
          quantity: c.quantity,
          item_price: c.price,
        })),
        content_type: event.contentType ?? "product",
        order_id: event.orderRef ?? null,
      },
    }),
    keepalive: true,
  });
};

const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1] ?? "") : undefined;
};

const readPixelCookies = () => ({
  fbp: readCookie("_fbp"),
  fbc: readCookie("_fbc"),
  ttp: readCookie("_ttp"),
  ttclid: readCookie("ttclid"),
  scid: readCookie("_scid"),
  sccid: readCookie("_sccid"),
});
