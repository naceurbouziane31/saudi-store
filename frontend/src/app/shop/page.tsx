import type { Metadata } from "next";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { FAQItem } from "@/components/molecules/FAQItem";
import { ProductCard } from "@/components/molecules/ProductCard";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import { TrustBar } from "@/components/molecules/TrustBar";
import { PRODUCTS } from "@/data/products";
import { TESTIMONIALS } from "@/data/testimonials";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "منتجات النضارة — كولاجين، شامبو ساكورا، ماسك ليلي",
  description:
    "تسوّقي أحدث منتجات النضارة — مكونات معتمدة، توصيل سريع لكل الكويت، الدفع عند الاستلام.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "منتجاتنا — النضارة",
    description: "كولاجين، شامبو ساكورا، ماسك ليلي. ادفعي عند الاستلام.",
    url: `${env.NEXT_PUBLIC_SITE_URL}/shop`,
  },
};

const SHOP_FAQS = [
  {
    q: "أقدر أخذ بضائع مختلفة بالباقة؟",
    a: "نعم. كل منتج له باقة 1/2/3. اضيفي اللي يعجبچ للسلة وأكملي طلبچ — ندفع كله عند الاستلام.",
  },
  {
    q: "متى يوصل طلبي؟",
    a: "24-48 ساعة من تأكيد الطلب لكل الكويت.",
  },
  {
    q: "أقدر أرجع منتج فتحته؟",
    a: "للمنتجات اللي توصلچ مفتوحة بدون استخدام، نقبل الإرجاع خلال 7 أيام. تواصلي على واتساب.",
  },
  {
    q: "تخصم على الباقة الكاملة؟",
    a: "العرض الافتتاحي: ادفعي 39 KWD للباقة الثلاثية بدلاً من 57 KWD — توفير 18 KWD.",
  },
];

export default function ShopPage() {
  return (
    <>
      <section className="bg-cream py-10 lg:py-14">
        <div className="container-wide text-center">
          <h1 className="font-display font-bold text-display text-ink-900 mb-3">منتجاتنا</h1>
          <p className="text-lg text-ink-700 max-w-2xl mx-auto">
            كل منتج اخترناه بعناية، يحل مشكلة محددة، ويعطيچ نتيجة تشوفينها.
          </p>
        </div>
      </section>

      <TrustBar />

      <section className="py-12 lg:py-20">
        <div className="container-wide">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-rose/40">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-3">
            خذي الباقة الكاملة — وفّري 18 KWD
          </h2>
          <p className="text-ink-700 mb-5">
            علكات الكولاجين + شامبو ساكورا + ماسك الكولاجين الليلي — روتين كامل لجمال يبدا من
            الداخل ويبان من الخارج.
          </p>
          <Link href="/products/nature-bounty-collagen-gummies">
            <Button size="lg" trailingIcon={<ChevronLeft size={20} />}>
              ابدأي بالكولاجين
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display font-bold text-h2 text-ink-900 mb-6 text-center">
            عملاء أحبوا منتجاتنا
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <li key={t.id}>
                <TestimonialCard testimonial={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-surface">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-h2 text-ink-900 mb-6 text-center">
            أسئلة قبل ما تطلبين
          </h2>
          <Accordion.Root type="single" collapsible className="space-y-2.5">
            {SHOP_FAQS.map((f, i) => (
              <FAQItem key={f.q} value={`q-${i}`} question={f.q} answer={f.a} />
            ))}
          </Accordion.Root>
        </div>
      </section>
    </>
  );
}
