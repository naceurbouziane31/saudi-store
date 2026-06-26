"use client";

import { create } from "zustand";

import type { OrderResponse } from "@/types/order";

interface CheckoutState {
  orderRef: string | null;
  customerName: string | null;
  order: OrderResponse | null;
  upsellApplied: boolean;
  setOrder: (order: OrderResponse, customerName: string) => void;
  markUpsell: () => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  orderRef: null,
  customerName: null,
  order: null,
  upsellApplied: false,
  setOrder: (order, customerName) =>
    set({ order, orderRef: order.order_ref, customerName, upsellApplied: false }),
  markUpsell: () => set({ upsellApplied: true }),
  reset: () =>
    set({ orderRef: null, customerName: null, order: null, upsellApplied: false }),
}));
