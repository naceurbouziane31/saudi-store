/**
 * Local order simulator used until the FastAPI backend lands. PR5 replaces
 * usage of this with a real backend proxy. Server-side pricing is enforced
 * by computing line totals from the SKU catalog — the client never decides
 * the price.
 */
import { PRODUCTS } from "@/data/products";
import type { OrderResponse } from "@/types/order";
import { generateOrderRef } from "./orderRef";

const VARIANT_INDEX = new Map<
  string,
  { sku: string; bundle_size: number; title_ar: string; unit_price_kwd: number; line_total_kwd: number }
>();

for (const product of PRODUCTS) {
  for (const variant of product.variants) {
    VARIANT_INDEX.set(variant.sku, {
      sku: variant.sku,
      bundle_size: variant.bundleSize,
      title_ar: product.titleAr,
      unit_price_kwd: variant.priceKwd / variant.bundleSize,
      line_total_kwd: variant.priceKwd,
    });
  }
  const upsellSku = `UPS-9-${product.skuPrefix}`;
  VARIANT_INDEX.set(upsellSku, {
    sku: upsellSku,
    bundle_size: 1,
    title_ar: `${product.titleAr} (عرض حصري)`,
    unit_price_kwd: 9,
    line_total_kwd: 9,
  });
}

const ORDERS = new Map<
  string,
  OrderResponse & { customer_name: string; customer_phone: string; upsell_applied: boolean }
>();

export interface SimulatedOrderInput {
  customerName: string;
  customerPhone: string;
  itemSkus: readonly string[];
}

export const simulateCreateOrder = (input: SimulatedOrderInput): OrderResponse => {
  const items = input.itemSkus
    .map((sku) => VARIANT_INDEX.get(sku))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  if (items.length === 0) {
    throw new Error("EMPTY_CART");
  }
  const subtotal = items.reduce((acc, i) => acc + i.line_total_kwd, 0);
  const orderRef = generateOrderRef();
  const order: OrderResponse = {
    order_ref: orderRef,
    status: "pending",
    items: items.map((i) => ({
      sku: i.sku,
      title_ar: i.title_ar,
      bundle_size: i.bundle_size,
      unit_price_kwd: i.unit_price_kwd,
      line_total_kwd: i.line_total_kwd,
    })),
    subtotal_kwd: subtotal,
    upsell_total_kwd: 0,
    shipping_kwd: 0,
    grand_total_kwd: subtotal,
    currency: "KWD",
    payment_method: "cod",
  };
  ORDERS.set(orderRef, {
    ...order,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    upsell_applied: false,
  });
  return order;
};

export const simulateAddUpsell = (
  orderRef: string,
  upsellSku: string,
): OrderResponse | { error: "NOT_FOUND" } | { error: "UPSELL_ALREADY_APPLIED" } => {
  const order = ORDERS.get(orderRef);
  if (!order) return { error: "NOT_FOUND" };
  if (order.upsell_applied) return { error: "UPSELL_ALREADY_APPLIED" };
  const variant = VARIANT_INDEX.get(upsellSku);
  if (!variant || variant.unit_price_kwd !== 9) {
    return { error: "NOT_FOUND" };
  }
  const newItems = [
    ...order.items,
    {
      sku: variant.sku,
      title_ar: variant.title_ar,
      bundle_size: variant.bundle_size,
      unit_price_kwd: variant.unit_price_kwd,
      line_total_kwd: variant.line_total_kwd,
    },
  ];
  const updated: OrderResponse = {
    ...order,
    items: newItems,
    upsell_total_kwd: 9,
    grand_total_kwd: order.subtotal_kwd + 9,
  };
  ORDERS.set(orderRef, { ...order, ...updated, upsell_applied: true });
  return updated;
};

export const simulateGetOrder = (orderRef: string): OrderResponse | null => {
  const o = ORDERS.get(orderRef);
  if (!o) return null;
  const { customer_name: _name, customer_phone: _phone, upsell_applied: _u, ...rest } = o;
  return rest;
};
