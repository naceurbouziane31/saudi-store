"use client";

import { env } from "@/lib/env";
import type { AnalyticsEvent } from "@/types/analytics";

const CANONICAL_TO_SNAP: Record<AnalyticsEvent["canonical"], string> = {
  page_view: "PAGE_VIEW",
  view_content: "VIEW_CONTENT",
  add_to_cart: "ADD_CART",
  initiate_checkout: "START_CHECKOUT",
  lead: "SIGN_UP",
  purchase: "PURCHASE",
  upsell_impression: "VIEW_CONTENT",
  upsell_accept: "ADD_CART",
  upsell_decline: "VIEW_CONTENT",
};

export const hasSnapPixel = (): boolean =>
  typeof window !== "undefined" &&
  !!env.NEXT_PUBLIC_SNAP_PIXEL_ID &&
  typeof window.snaptr === "function";

export const fireSnap = (event: AnalyticsEvent): void => {
  if (!hasSnapPixel()) return;
  const name = CANONICAL_TO_SNAP[event.canonical] ?? event.canonical.toUpperCase();
  const props: Record<string, unknown> = {
    price: event.value ?? 0,
    currency: event.currency ?? "KWD",
    item_category: "Beauty",
  };
  if (event.contents) {
    props.item_ids = event.contents.map((c) => c.id);
    props.number_items = event.contents.length;
  }
  if (event.orderRef && event.canonical === "purchase") {
    props.transaction_id = event.orderRef;
  }
  if (event.eventIds?.snap) {
    props.client_dedup_id = event.eventIds.snap;
  }
  window.snaptr?.("track", name, props);
};
