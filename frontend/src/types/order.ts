import type { BundleSize } from "./product";

export interface CartLineItem {
  sku: string;
  productSlug: string;
  titleAr: string;
  bundleSize: BundleSize;
  unitPriceKwd: number;
  lineTotalKwd: number;
  thumbnailUrl: string;
  isUpsell?: boolean;
}

export interface OrderCreatePayload {
  customer: {
    name: string;
    phone: string;
  };
  items: ReadonlyArray<{ sku: string; qty: number }>;
  meta?: Partial<{
    fbp: string;
    fbc: string;
    ttp: string;
    ttclid: string;
    scid: string;
    sccid: string;
    user_agent: string;
    ip: string | null;
    landing_url: string;
    referrer: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
  }>;
  event_ids?: {
    meta?: string;
    tiktok?: string;
    snap?: string;
  };
  honeypot?: string;
}

export interface OrderResponseItem {
  sku: string;
  title_ar: string;
  bundle_size: number;
  unit_price_kwd: number;
  line_total_kwd: number;
}

export interface OrderResponse {
  order_ref: string;
  status: string;
  items: OrderResponseItem[];
  subtotal_kwd: number;
  upsell_total_kwd: number;
  shipping_kwd: number;
  grand_total_kwd: number;
  currency: string;
  payment_method: string;
}
