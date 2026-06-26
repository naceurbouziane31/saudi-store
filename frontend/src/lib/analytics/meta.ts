"use client";

import { env } from "@/lib/env";
import type { AnalyticsEvent } from "@/types/analytics";

const CANONICAL_TO_META: Record<AnalyticsEvent["canonical"], string> = {
  page_view: "PageView",
  view_content: "ViewContent",
  add_to_cart: "AddToCart",
  initiate_checkout: "InitiateCheckout",
  lead: "Lead",
  purchase: "Purchase",
  upsell_impression: "ViewContent",
  upsell_accept: "AddToCart",
  upsell_decline: "ViewContent",
};

export const hasMetaPixel = (): boolean =>
  typeof window !== "undefined" &&
  !!env.NEXT_PUBLIC_META_PIXEL_ID &&
  typeof window.fbq === "function";

export const fireMeta = (event: AnalyticsEvent): void => {
  if (!hasMetaPixel()) return;
  const name = CANONICAL_TO_META[event.canonical] ?? event.canonical;
  const params: Record<string, unknown> = {
    currency: event.currency ?? "KWD",
    value: event.value ?? 0,
    content_type: event.contentType ?? "product",
  };
  if (event.contents) {
    params.contents = event.contents.map((c) => ({
      id: c.id,
      quantity: c.quantity,
      item_price: c.price,
    }));
  }
  if (event.orderRef) params.order_id = event.orderRef;

  const eventID = event.eventIds?.meta;
  window.fbq?.("track", name, params, eventID ? { eventID } : undefined);
};
