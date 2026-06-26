export type Platform = "meta" | "tiktok" | "snap";

export type CanonicalEvent =
  | "page_view"
  | "view_content"
  | "add_to_cart"
  | "initiate_checkout"
  | "lead"
  | "purchase"
  | "upsell_impression"
  | "upsell_accept"
  | "upsell_decline";

export interface EventContent {
  id: string;
  name?: string;
  quantity: number;
  price: number;
}

export interface AnalyticsEvent {
  canonical: CanonicalEvent;
  value?: number;
  currency?: string;
  contents?: EventContent[];
  orderRef?: string;
  contentType?: "product";
  eventIds?: Partial<Record<Platform, string>>;
}
