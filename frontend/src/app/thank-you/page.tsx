"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { CheckCircle2, MessagesSquare, Phone, Truck } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { trackPurchase } from "@/lib/analytics/events";
import { formatKwd } from "@/lib/currency";
import { env } from "@/lib/env";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";

const waLink = (number: string, orderRef: string | null) => {
  const text = orderRef
    ? `هلا، أريد أسأل عن طلبي رقم ${orderRef}.`
    : "هلا، أريد أسأل عن طلبي.";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="container-wide py-16 text-center text-ink-500">لحظة وحدة...</div>}>
      <ThankYouInner />
    </Suspense>
  );
}

function ThankYouInner() {
  const searchParams = useSearchParams();
  const orderRefFromUrl = searchParams.get("order");
  const order = useCheckoutStore((s) => s.order);
  const customerName = useCheckoutStore((s) => s.customerName);
  const clearCart = useCartStore((s) => s.clear);

  const orderRef = order?.order_ref ?? orderRefFromUrl;
  const firedRef = useRef<string | null>(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!orderRef || firedRef.current === orderRef) return;
    if (!order) {
      // We were navigated to the thank-you page in a fresh session without
      // the store hydrated — we can't reconstruct the line items, so skip
      // the Purchase event (the server-side CAPI from the order creation
      // pipeline still fires it deterministically).
      firedRef.current = orderRef;
      return;
    }
    trackPurchase({
      orderRef,
      totalKwd: order.grand_total_kwd,
      contents: order.items.map((i) => ({
        id: i.sku,
        name: i.title_ar,
        quantity: 1,
        price: i.line_total_kwd,
      })),
    });
    firedRef.current = orderRef;
  }, [order, orderRef]);

  return (
    <article className="container-wide max-w-3xl mx-auto py-12 lg:py-16">
      <header className="text-center mb-8">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-success/15 text-success mb-4">
          <CheckCircle2 size={36} />
        </span>
        <h1 className="font-display font-bold text-h1 text-ink-900 mb-2">
          يعطيچ العافية {customerName ? `يا ${customerName}` : ""} 💚
        </h1>
        <p className="text-ink-700">
          وصلنا طلبچ — راح نتواصل بيا قريب جداً للتأكيد.
        </p>
      </header>

      {orderRef && (
        <section className="bg-cream rounded-xl p-5 mb-6 text-center">
          <p className="text-sm text-ink-500 mb-1">رقم طلبچ</p>
          <p
            className="font-latinUi font-bold text-h2 text-brand select-all break-all"
            dir="ltr"
          >
            {orderRef}
          </p>
          <p className="text-xs text-ink-500 mt-2">الدفع عند الاستلام (COD)</p>
        </section>
      )}

      {order && (
        <section className="bg-white border border-ink-300/30 rounded-xl p-5 mb-6">
          <h2 className="font-display font-bold text-h3 text-ink-900 mb-3">ملخص طلبچ</h2>
          <ul className="divide-y divide-ink-300/30 text-sm">
            {order.items.map((i) => (
              <li key={i.sku} className="py-2.5 flex justify-between gap-3">
                <span className="text-ink-700">
                  {i.title_ar} — {i.bundle_size} {i.bundle_size === 1 ? "قطعة" : "قطع"}
                </span>
                <span dir="ltr" className="font-bold">
                  {formatKwd(i.line_total_kwd, { isolate: false })}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink-300/30 mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-ink-700">
              <span>السعر الفرعي</span>
              <span dir="ltr">{formatKwd(order.subtotal_kwd, { isolate: false })}</span>
            </div>
            {order.upsell_total_kwd > 0 && (
              <div className="flex justify-between text-ink-700">
                <span>عرض إضافي</span>
                <span dir="ltr">{formatKwd(order.upsell_total_kwd, { isolate: false })}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-700">
              <span>الشحن</span>
              <span className="text-success font-bold">مجاني</span>
            </div>
            <div className="flex justify-between font-bold text-ink-900 pt-2 border-t border-ink-300/30">
              <span>الإجمالي</span>
              <span dir="ltr">{formatKwd(order.grand_total_kwd, { isolate: false })}</span>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 md:grid-cols-3 mb-8">
        {[
          { icon: CheckCircle2, title: "استلمنا طلبچ", body: "وصلنا الطلب وقاعدين نراجعه." },
          { icon: Phone, title: "نتواصل بيا", body: "خلال ساعة في وقت الدوام للتأكيد." },
          {
            icon: Truck,
            title: "يوصل لچ خلال 24-48 ساعة",
            body: "ادفعي عند الاستلام كاش لمندوب التوصيل.",
          },
        ].map((s, i) => (
          <div key={s.title} className="bg-white border border-ink-300/30 rounded-xl p-5">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-cream text-brand mb-3">
              <s.icon size={20} />
            </span>
            <p className="font-bold text-ink-900 mb-1">
              {i + 1}. {s.title}
            </p>
            <p className="text-sm text-ink-700">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="text-center bg-brand text-white rounded-xl p-6 mb-8">
        <MessagesSquare size={24} className="mx-auto mb-2 text-accent" />
        <p className="mb-4">حابة تأكدين عنوان البيت أو تسألين عن شي؟ كلمينا الحين.</p>
        <a
          href={waLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER, orderRef)}
          target="_blank"
          rel="noopener"
        >
          <Button variant="accent" size="lg" leadingIcon={<WhatsAppIcon size={20} />}>
            كلميني الحين على واتساب
          </Button>
        </a>
      </section>

      <p className="text-center text-sm text-ink-500 mb-6">
        شكراً لثقتچ فينا. نحبچ كثير، ونتمنى يعجبچ كل شي.
        <br />— فريق النضارة
      </p>

      <p className="text-center">
        <Link href="/" className="text-brand font-bold">
          رجعيني للرئيسية
        </Link>
      </p>
    </article>
  );
}
