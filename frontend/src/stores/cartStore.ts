"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CartLineItem } from "@/types/order";
import type { BundleSize, ProductVariant } from "@/types/product";
import { PRODUCT_BY_SLUG } from "@/data/products";

interface CartState {
  items: CartLineItem[];
  isDrawerOpen: boolean;
  hasHydrated: boolean;
  add: (item: CartLineItem) => void;
  remove: (sku: string) => void;
  updateBundle: (productSlug: string, newSize: BundleSize) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setHydrated: () => void;
}

const buildLineForVariant = (
  productSlug: string,
  variant: ProductVariant,
): CartLineItem => {
  const product = PRODUCT_BY_SLUG.get(productSlug);
  return {
    sku: variant.sku,
    productSlug,
    titleAr: product?.titleAr ?? productSlug,
    bundleSize: variant.bundleSize,
    unitPriceKwd:
      variant.bundleSize > 0 ? variant.priceKwd / variant.bundleSize : variant.priceKwd,
    lineTotalKwd: variant.priceKwd,
    thumbnailUrl: product?.imageSlots[0] ?? "/images/placeholders/product.svg",
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,
      add: (item) => {
        const existingIndex = get().items.findIndex((i) => i.productSlug === item.productSlug);
        if (existingIndex >= 0) {
          const items = [...get().items];
          items[existingIndex] = item;
          set({ items, isDrawerOpen: true });
          return;
        }
        set({ items: [...get().items, item], isDrawerOpen: true });
      },
      remove: (sku) => set({ items: get().items.filter((i) => i.sku !== sku) }),
      updateBundle: (productSlug, newSize) => {
        const product = PRODUCT_BY_SLUG.get(productSlug);
        if (!product) return;
        const variant = product.variants.find((v) => v.bundleSize === newSize);
        if (!variant) return;
        const items = get().items.map((i) =>
          i.productSlug === productSlug ? buildLineForVariant(productSlug, variant) : i,
        );
        set({ items });
      },
      clear: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "alnadara-cart",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => window.localStorage),
      partialize: (s) => ({ items: s.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const useCartSubtotal = (): number =>
  useCartStore((s) => s.items.reduce((acc, i) => acc + i.lineTotalKwd, 0));

export const useCartItemCount = (): number => useCartStore((s) => s.items.length);

export const useCartProductSlugs = (): string[] =>
  useCartStore((s) => s.items.map((i) => i.productSlug));

export const buildCartLineForVariant = buildLineForVariant;
