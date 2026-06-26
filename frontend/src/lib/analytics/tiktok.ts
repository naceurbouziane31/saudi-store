"use client";

import { env } from "@/lib/env";
import type { AnalyticsEvent } from "@/types/analytics";

const CANONICAL_TO_TIKTOK: Record<AnalyticsEvent["canonical"], string> = {
  page_view: "Pageview",
  view_content: "ViewContent",
  add_to_cart: "AddToCart",
  initiate_checkout: "InitiateCheckout",
  lead: "SubmitForm",
  purchase: "CompletePayment",
  upsell_impression: "ViewContent",
  upsell_accept: "AddToCart",
  upsell_decline: "ViewContent",
};

export const hasTikTokPixel = (): boolean =>
  typeof window !== "undefined" && !!env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && !!window.ttq;

export const fireTikTok = (event: AnalyticsEvent): void => {
  if (!hasTikTokPixel()) return;
  const name = CANONICAL_TO_TIKTOK[event.canonical] ?? event.canonical;
  const props: Record<string, unknown> = {
    value: event.value ?? 0,
    currency: event.currency ?? "KWD",
    content_type: event.contentType ?? "product",
  };
  if (event.contents) {
    props.contents = event.contents.map((c) => ({
      content_id: c.id,
      content_name: c.name ?? c.id,
      quantity: c.quantity,
      price: c.price,
    }));
  }
  if (event.orderRef) props.order_id = event.orderRef;
  const eventId = event.eventIds?.tiktok;
  if (name === "Pageview") {
    window.ttq?.page?.();
    return;
  }
  window.ttq?.track(name, props, eventId ? { event_id: eventId } : undefined);
};
