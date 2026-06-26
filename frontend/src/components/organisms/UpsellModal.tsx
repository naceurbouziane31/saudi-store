"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { CountdownTimer } from "@/components/atoms/CountdownTimer";
import { getUpsellFor } from "@/data/products";
import { formatKwd } from "@/lib/currency";
import { useCartProductSlugs, useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useUiStore } from "@/stores/uiStore";

const COUNTDOWN_SECONDS = 15;

export const UpsellModal = () => {
  const isOpen = useUiStore((s) => s.isUpsellOpen);
  const closeUpsell = useUiStore((s) => s.closeUpsell);
  const router = useRouter();
  const slugs = useCartProductSlugs();
  const orderRef = useCheckoutStore((s) => s.orderRef);
  const markUpsell = useCheckoutStore((s) => s.markUpsell);
  const clearCart = useCartStore((s) => s.clear);
  const [busy, setBusy] = useState(false);
  const finishedRef = useRef(false);

  const upsell = useMemo(() => getUpsellFor(slugs), [slugs]);

  const finishToThankYou = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    closeUpsell();
    if (orderRef) {
      router.push(`/thank-you?order=${encodeURIComponent(orderRef)}`);
      // Cart cleared on thank-you mount instead so user sees their order;
      // leaving here for safety after redirect happens.
      setTimeout(() => clearCart(), 1000);
    } else {
      router.push("/thank-you");
    }
  }, [closeUpsell, orderRef, router, clearCart]);

  useEffect(() => {
    if (isOpen) {
      finishedRef.current = false;
    }
  }, [isOpen]);

  const accept = async () => {
    if (!orderRef || !upsell) {
      finishToThankYou();
      return;
    }
    setBusy(true);
    try {
      const resp = await fetch(`/api/orders/${encodeURIComponent(orderRef)}/upsell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: upsell.sku }),
      });
      if (resp.ok) {
        markUpsell();
      }
    } catch {
      // Non-blocking: still proceed to thank-you.
    } finally {
      setBusy(false);
      finishToThankYou();
    }
  };

  if (!upsell) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => (o ? null : null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay bg-ink-900/60 backdrop-blur" />
        <Dialog.Content
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:start-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rtl:translate-x-1/2 z-modal bg-white sm:rounded-xl sm:w-[min(480px,calc(100vw-2rem))] max-h-dvh sm:max-h-[90dvh] overflow-y-auto flex flex-col"
        >
          <header className="bg-brand text-white px-5 py-3 flex items-center justify-between text-sm">
            <span className="font-bold">فرصة وحدة — لا تروح عليچ</span>
            <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 font-bold">
              ⏱{" "}
              <CountdownTimer
                seconds={COUNTDOWN_SECONDS}
                onComplete={() => finishToThankYou()}
              />
            </span>
          </header>

          <Dialog.Title className="sr-only">
            عرض حصري لمرة وحدة — {upsell.product.titleAr} بـ 9 KWD
          </Dialog.Title>

          <div className="px-5 py-6 space-y-5">
            <div className="relative aspect-square w-44 mx-auto rounded-xl overflow-hidden bg-cream">
              <Image
                src={upsell.product.imageSlots[0] ?? "/images/placeholders/product.svg"}
                alt={upsell.product.titleAr}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-display font-bold text-h2 text-ink-900">
                أضيفي {upsell.product.titleAr} لطلبچ بسعر حصري لمرة وحدة
              </h2>
              <p className="text-sm text-ink-500">
                بسعر يمي بنحبچ — متوفر بس بهالصفحة وبس هالمرة.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-h2 font-bold">
              <span className="text-ink-500 line-through font-normal text-lg" dir="ltr">
                {formatKwd(upsell.compareAtKwd, { isolate: false })}
              </span>
              <span className="text-brand" dir="ltr">{formatKwd(upsell.priceKwd, { isolate: false })}</span>
            </div>

            <Button
              fullWidth
              size="lg"
              isLoading={busy}
              onClick={accept}
              leadingIcon={<Check size={20} />}
            >
              أضيفيه لطلبچ بـ 9 KWD
            </Button>
            <button
              type="button"
              onClick={finishToThankYou}
              className="w-full text-sm text-ink-500 hover:text-brand"
            >
              لا، شكراً — أكملي طلبي
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
