"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { Banknote, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { CrossSellCard } from "@/components/molecules/CrossSellCard";
import { formatKwd } from "@/lib/currency";
import { trackInitiateCheckout } from "@/lib/analytics/events";
import { getCrossSells } from "@/data/products";
import { useCartProductSlugs, useCartStore, useCartSubtotal } from "@/stores/cartStore";
import { useUiStore } from "@/stores/uiStore";
import type { BundleSize } from "@/types/product";

export const CartDrawer = () => {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const remove = useCartStore((s) => s.remove);
  const updateBundle = useCartStore((s) => s.updateBundle);
  const subtotal = useCartSubtotal();
  const slugs = useCartProductSlugs();
  const openCheckout = useUiStore((s) => s.openCheckout);
  const crossSells = getCrossSells(slugs).slice(0, 2);
  const itemCount = items.length;

  const startCheckout = () => {
    trackInitiateCheckout(
      items.map((i) => ({
        id: i.sku,
        name: i.titleAr,
        quantity: 1,
        price: i.lineTotalKwd,
      })),
    );
    closeDrawer();
    openCheckout();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => (o ? null : closeDrawer())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay bg-ink-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className="fixed inset-y-0 end-0 z-drawer w-full sm:w-[420px] bg-white shadow-pop focus:outline-none flex flex-col"
          aria-describedby={undefined}
        >
          <Dialog.Title asChild>
            <header className="flex items-center justify-between px-5 py-4 border-b border-ink-300/30">
              <span className="font-display font-bold text-h3 text-ink-900">
                سلتچ ({itemCount} منتج)
              </span>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="إغلاق السلة"
                  className="size-10 rounded-full hover:bg-cream flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </header>
          </Dialog.Title>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <span className="size-16 rounded-full bg-cream text-brand flex items-center justify-center mb-4">
                <ShoppingBag size={28} />
              </span>
              <p className="font-display font-bold text-h3 text-ink-900 mb-2">
                سلتچ فاضية الحين
              </p>
              <p className="text-sm text-ink-500 mb-5">
                اختاري منتجاتچ — توصيل لكل الكويت، الدفع عند الاستلام.
              </p>
              <Link href="/shop" onClick={closeDrawer}>
                <Button>شوفي المنتجات</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.sku}
                      className="flex items-start gap-3 bg-white border border-ink-300/30 rounded-lg p-3"
                    >
                      <div className="relative size-16 rounded-md overflow-hidden bg-cream shrink-0">
                        <Image src={item.thumbnailUrl} alt={item.titleAr} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink-900 line-clamp-2">{item.titleAr}</p>
                        <p className="text-xs text-ink-500 mt-0.5">
                          {item.bundleSize} {item.bundleSize === 1 ? "قطعة" : item.bundleSize === 2 ? "قطعة" : "قطع"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center gap-1 border border-ink-300/40 rounded-full overflow-hidden">
                            <button
                              type="button"
                              aria-label="قللي العدد"
                              disabled={item.bundleSize <= 1}
                              onClick={() =>
                                updateBundle(item.productSlug, Math.max(1, item.bundleSize - 1) as BundleSize)
                              }
                              className="size-8 flex items-center justify-center text-ink-700 disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[24px] text-center text-sm font-bold">{item.bundleSize}</span>
                            <button
                              type="button"
                              aria-label="زيدي العدد"
                              disabled={item.bundleSize >= 3}
                              onClick={() =>
                                updateBundle(item.productSlug, Math.min(3, item.bundleSize + 1) as BundleSize)
                              }
                              className="size-8 flex items-center justify-center text-ink-700 disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-bold text-ink-900 text-sm" dir="ltr">
                            {formatKwd(item.lineTotalKwd, { isolate: false })}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="احذفي من السلة"
                        onClick={() => remove(item.sku)}
                        className="text-ink-500 hover:text-danger p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                {crossSells.length > 0 && (
                  <section aria-label="مقترحات للسلة">
                    <h3 className="font-bold text-ink-700 text-sm mb-2">أضيفي لطلبچ</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                      {crossSells.map((p) => (
                        <CrossSellCard key={p.slug} product={p} />
                      ))}
                    </div>
                  </section>
                )}

                <div className="flex items-center gap-4 text-xs text-ink-700 bg-rose/40 rounded-md px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={14} className="text-brand" /> توصيل مجاني
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Banknote size={14} className="text-brand" /> ادفعي عند الاستلام
                  </span>
                </div>
              </div>

              <footer className="border-t border-ink-300/30 px-5 py-4 space-y-3 bg-white">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-ink-700">
                    <span>السعر الفرعي</span>
                    <span dir="ltr">{formatKwd(subtotal, { isolate: false })}</span>
                  </div>
                  <div className="flex justify-between text-ink-700">
                    <span>الشحن</span>
                    <span className="text-success font-bold">مجاني</span>
                  </div>
                  <div className="flex justify-between text-ink-900 font-bold text-base pt-1 border-t border-ink-300/30">
                    <span>الإجمالي</span>
                    <span dir="ltr">{formatKwd(subtotal, { isolate: false })}</span>
                  </div>
                </div>
                <Button fullWidth size="lg" onClick={startCheckout}>
                  أكملي طلبچ — ادفعي عند الاستلام
                </Button>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-full text-sm text-ink-500 hover:text-brand"
                >
                  أو أكملي التسوق
                </button>
              </footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
