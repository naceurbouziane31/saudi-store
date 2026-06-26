import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "تواصلي معنا — النضارة",
  description: "تواصلي مع فريق النضارة عبر واتساب أو البريد. نخدمچ بدقايق.",
  alternates: { canonical: "/contact" },
};

const waLink = (number: string) => `https://wa.me/${number.replace(/\D/g, "")}`;

export default function ContactPage() {
  const phone = env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const email = env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <>
      <section className="bg-cream py-12 lg:py-16 text-center">
        <div className="container-wide max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-display text-ink-900 mb-3">تواصلي معنا</h1>
          <p className="text-lg text-ink-700">
            أي سؤال؟ نجاوبچ بدقايق. ما نخليچ تنتظرين.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-wide max-w-4xl mx-auto grid gap-5 md:grid-cols-3">
          <a
            href={waLink(phone)}
            target="_blank"
            rel="noopener"
            className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-6 flex flex-col items-start gap-3 hover:shadow-md transition"
          >
            <span className="size-12 rounded-full bg-[#25D366] text-white flex items-center justify-center">
              <WhatsAppIcon size={24} />
            </span>
            <div>
              <h2 className="font-display font-bold text-h3 text-ink-900">واتساب</h2>
              <p className="text-sm text-ink-700">أسرع طريقة — نرد عليچ بدقايق.</p>
            </div>
            <span className="mt-auto text-brand font-bold">كلميني الحين →</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="bg-cream border border-ink-300/30 rounded-xl p-6 flex flex-col items-start gap-3 hover:shadow-md transition"
          >
            <span className="size-12 rounded-full bg-brand text-white flex items-center justify-center">
              <Mail size={22} />
            </span>
            <div>
              <h2 className="font-display font-bold text-h3 text-ink-900">البريد الإلكتروني</h2>
              <p className="text-sm text-ink-700">للاستفسارات التفصيلية.</p>
            </div>
            <span dir="ltr" className="mt-auto text-brand font-bold">{email}</span>
          </a>

          <a
            href={`tel:${phone}`}
            className="bg-cream border border-ink-300/30 rounded-xl p-6 flex flex-col items-start gap-3 hover:shadow-md transition"
          >
            <span className="size-12 rounded-full bg-ink-900 text-white flex items-center justify-center">
              <Phone size={22} />
            </span>
            <div>
              <h2 className="font-display font-bold text-h3 text-ink-900">التلفون</h2>
              <p className="text-sm text-ink-700">السبت — الخميس · 9 ص — 9 م</p>
            </div>
            <span dir="ltr" className="mt-auto text-brand font-bold">{phone}</span>
          </a>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-surface text-center">
        <div className="container-wide max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-h2 text-ink-900 mb-3">
            معلومات سريعة
          </h2>
          <ul className="grid gap-3 text-ink-700">
            <li><span className="font-bold">الموقع:</span> ندير العمليات من الكويت — توصيل لكل المحافظات.</li>
            <li><span className="font-bold">العملة:</span> الدينار الكويتي (KWD)</li>
            <li><span className="font-bold">الدفع:</span> عند الاستلام (COD) — كاش لمندوب التوصيل.</li>
            <li><span className="font-bold">الإرجاع:</span> 7 أيام من تاريخ الاستلام، تواصلي ويانا على واتساب.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
