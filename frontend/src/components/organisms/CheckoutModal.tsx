"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { formatKwd } from "@/lib/currency";
import { isValidKuwaitPhone, normalizeKuwaitLocal } from "@/lib/phone";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";
import { useCartStore, useCartSubtotal } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useUiStore } from "@/stores/uiStore";
import type { OrderCreatePayload, OrderResponse } from "@/types/order";

const MIN_INTERACTION_MS = 2500;

export const CheckoutModal = () => {
  const isOpen = useUiStore((s) => s.isCheckoutOpen);
  const closeCheckout = useUiStore((s) => s.closeCheckout);
  const openUpsell = useUiStore((s) => s.openUpsell);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartSubtotal();
  const setOrder = useCheckoutStore((s) => s.setOrder);

  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const firstInteractionAt = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<CheckoutInput>({
    mode: "onChange",
    defaultValues: { name: "", phone: "", honeypot: "" },
  });

  const phoneValue = watch("phone");
  const phoneValid = useMemo(() => isValidKuwaitPhone(phoneValue ?? ""), [phoneValue]);

  useEffect(() => {
    if (isOpen) {
      firstInteractionAt.current = Date.now();
      setSubmitState("idle");
      setServerError(null);
    } else {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) return;
    if (data.honeypot && data.honeypot.length > 0) {
      // bot — silently accept without doing anything
      closeCheckout();
      return;
    }
    const sinceFirst = Date.now() - (firstInteractionAt.current ?? 0);
    if (sinceFirst < MIN_INTERACTION_MS) {
      setServerError("لحظة وحدة قبل الإرسال — جربي مرة ثانية.");
      return;
    }
    const phoneLocal = normalizeKuwaitLocal(data.phone);
    if (!phoneLocal) return;

    setSubmitState("submitting");
    setServerError(null);
    try {
      const payload: OrderCreatePayload = {
        customer: { name: data.name.trim(), phone: phoneLocal },
        items: items.map((i) => ({ sku: i.sku, qty: 1 })),
        meta: {
          landing_url: typeof window !== "undefined" ? window.location.href : undefined,
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        },
      };
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        throw new Error(`status ${resp.status}`);
      }
      const order = (await resp.json()) as OrderResponse;
      setOrder(order, data.name.trim());
      closeCheckout();
      openUpsell();
    } catch (e) {
      setSubmitState("error");
      setServerError(
        "ما قدرنا نرسل طلبچ الحين — حاولي بعد ثواني، أو تواصلي ويانا على واتساب.",
      );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => (o ? null : closeCheckout())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay bg-ink-900/50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:start-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rtl:translate-x-1/2 z-modal bg-white sm:rounded-xl sm:w-[min(480px,calc(100vw-2rem))] max-h-dvh overflow-y-auto sm:max-h-[90dvh] flex flex-col"
        >
          <header className="flex items-center justify-between px-5 py-4 border-b border-ink-300/30 sticky top-0 bg-white z-10">
            <Dialog.Title className="font-display font-bold text-h3 text-ink-900">
              أكملي طلبچ — ادفعي عند الاستلام
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="إغلاق"
                className="size-10 rounded-full hover:bg-cream flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </header>

          <div className="px-5 py-4 space-y-5">
            <button
              type="button"
              onClick={() => setOrderSummaryOpen((v) => !v)}
              className="w-full flex items-center justify-between text-sm text-ink-700 bg-cream rounded-md px-3 py-2.5"
              aria-expanded={orderSummaryOpen}
            >
              <span className="font-bold">
                شوفي تفاصيل الطلب ({items.length} منتج)
              </span>
              <span className="inline-flex items-center gap-2">
                <span dir="ltr" className="font-bold">{formatKwd(subtotal, { isolate: false })}</span>
                {orderSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {orderSummaryOpen && (
              <ul className="text-sm space-y-1.5 border-y border-ink-300/30 py-3">
                {items.map((i) => (
                  <li key={i.sku} className="flex justify-between gap-3 text-ink-700">
                    <span className="truncate">
                      {i.titleAr} — {i.bundleSize} {i.bundleSize === 1 ? "قطعة" : "قطع"}
                    </span>
                    <span dir="ltr" className="shrink-0">{formatKwd(i.lineTotalKwd, { isolate: false })}</span>
                  </li>
                ))}
                <li className="flex justify-between gap-3 font-bold text-ink-900 pt-2 border-t border-ink-300/30">
                  <span>الإجمالي (الدفع عند الاستلام)</span>
                  <span dir="ltr">{formatKwd(subtotal, { isolate: false })}</span>
                </li>
              </ul>
            )}

            <p className="text-xs text-ink-500 inline-flex items-center gap-2 bg-rose/40 rounded-md px-3 py-2.5">
              ★ 4.8 — أكثر من 3,000 طلب وصلت بأمان
            </p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField
                label="اسمچ الكريم"
                placeholder="مثال: نورة العجمي"
                autoComplete="name"
                required
                {...register("name")}
                error={errors.name?.message}
              />
              <FormField
                label="رقم جوالچ (نتواصل ويا للتأكيد)"
                placeholder="50001234"
                autoComplete="tel"
                inputMode="tel"
                type="tel"
                dir="ltr"
                required
                prefix={<span className="font-latinUi text-sm text-ink-500">+965</span>}
                suffix={
                  phoneValid ? <Check size={16} className="text-success" /> : null
                }
                helper="الرقم لازم يكون كويتي يبدي بـ 5 / 6 / 9."
                successMessage={phoneValid ? "✓ رقم صحيح" : undefined}
                {...register("phone")}
                error={errors.phone?.message}
              />

              {/* honeypot — hidden from real users */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                {...register("honeypot")}
                className="absolute -left-[10000px] w-px h-px overflow-hidden"
              />

              {serverError && (
                <p role="alert" className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={submitState === "submitting"}
                disabled={!isValid || items.length === 0}
              >
                أرسلي طلبچ — ندفع عند الاستلام
              </Button>

              <p className="text-xs text-ink-500 leading-relaxed">
                بالضغط على إرسال، نتواصل بيا للتأكيد. ما تدفعين الا لما يوصل بيدچ.{" "}
                <a href="/policies/terms" className="underline">شروط</a> ·{" "}
                <a href="/policies/privacy" className="underline">خصوصية</a>
              </p>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
