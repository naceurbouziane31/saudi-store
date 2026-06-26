import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

import { Button } from "@/components/atoms/Button";
import { FAQItem } from "@/components/molecules/FAQItem";
import { ProductCard } from "@/components/molecules/ProductCard";
import { TrustBar } from "@/components/molecules/TrustBar";
import { HeroSection } from "@/components/organisms/HeroSection";
import { ImageTextSection } from "@/components/organisms/ImageTextSection";
import { ReviewGrid } from "@/components/organisms/ReviewGrid";
import { PRODUCTS } from "@/data/products";
import { TESTIMONIALS } from "@/data/testimonials";

const HOME_FAQS = [
  {
    q: "متى يوصل طلبي؟",
    a: "نوصل لكل الكويت خلال 24-48 ساعة من تأكيد الطلب. نتواصل بيا بالتلفون أول للتأكيد.",
  },
  {
    q: "كيف أدفع؟",
    a: "الدفع عند الاستلام (COD). تدفعين كاش لمندوب التوصيل لما يوصلچ الطلب. بدون فيزا، بدون تحويل.",
  },
  {
    q: "شلون أتأكد إن المنتج أصلي؟",
    a: "كل منتجاتنا مستوردة مباشرة من المصانع الرسمية — Nature's Bounty (USA) وموردين معتمدين في اليابان. الباركود والفواتير موثقة.",
  },
  {
    q: "شلون أرجع المنتج لو ما عجبني؟",
    a: "عندچ ضمان رضا. تواصلي ويانا على واتساب خلال 7 أيام من الاستلام ونرتب الإرجاع بدون جدال.",
  },
  {
    q: "المنتجات آمنة للحوامل والمرضعات؟",
    a: "لكل منتج تعليمات استخدام تفصيلية. للحوامل والمرضعات يفضل استشارة الطبيبة قبل البدء بأي مكمل غذائي.",
  },
  {
    q: "تخدمون مناطق محددة من الكويت؟",
    a: "نوصل لكل محافظات الكويت — العاصمة، حولي، الفروانية، الأحمدي، مبارك الكبير، الجهراء.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />

      <section className="py-12 lg:py-20">
        <div className="container-wide">
          <header className="text-center mb-10">
            <h2 className="font-display font-bold text-h1 text-ink-900 mb-2">
              منتجاتنا — مختارة بعناية
            </h2>
            <p className="text-ink-500 max-w-xl mx-auto">
              3 منتجات حقيقية، كل وحد منهم يحل مشكلة بنتايج تشوفينها.
            </p>
          </header>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ImageTextSection
        heading="من اليابان لباب بيتچ"
        body="ما نبيع لچ أي شي. نختار بعناية من مصانع موثوقة في اليابان، أمريكا، وكوريا — ونوصلها لباب بيتچ بسعر تستاهلينه، بدون وسطاء، بدون مبالغة."
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="مكونات منتجات النضارة"
        imagePosition="end"
        tags={["🇯🇵 من اليابان", "🇺🇸 من أمريكا", "✓ مختبر طبياً"]}
        background="cream"
      />

      <ImageTextSection
        heading="لأنچ تستحقين أحسن"
        body="نضارتچ مو رفاهية — هي حقچ. روتين بسيط، نتايج تلاحظينها بأول 14 يوم، وثقة تشوفينها كل ما تطلين بالمراية."
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="امرأة كويتية واثقة"
        imagePosition="start"
      />

      <section className="py-12 lg:py-20 bg-cream">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-3">
            خذي الباقة الكاملة — وفّري 18 KWD
          </h2>
          <p className="text-ink-700 mb-6">
            3 منتجات لروتين متكامل من الصبح للمساء — جمالچ من الداخل والخارج.
          </p>
          <Link href="/shop">
            <Button size="lg" trailingIcon={<ChevronLeft size={20} />}>اطلبي الباقة الحين</Button>
          </Link>
        </div>
      </section>

      <ReviewGrid
        testimonials={TESTIMONIALS.slice(0, 6)}
        aggregateRating={4.8}
        aggregateCount={1250}
      />

      <section className="py-12 lg:py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <header className="text-center mb-8">
            <h2 className="font-display font-bold text-h1 text-ink-900 mb-2">
              رسالة من المؤسسة
            </h2>
          </header>
          <article className="bg-white border border-ink-300/30 rounded-xl p-6 lg:p-8 shadow-sm">
            <p className="text-base lg:text-lg text-ink-700 leading-relaxed mb-4">
              بدأت النضارة لأني تعبت من المنتجات اللي تعد ولا تنفّذ. كنت أبغي براند كويتي يجمع
              أحسن المكونات من العالم، يتكلم لغتي، ويوصل لباب بيتي. ما لقيت — فسويته. كل منتج
              تشوفينه هنا، اختبرته بنفسي قبل أن يصل لچ. أتمنى يفرق ويا چ مثل ما فرق ويا ي.
            </p>
            <p className="font-latinDisplay italic text-brand">بحب،</p>
            <p className="font-display font-bold text-ink-900">فريق النضارة</p>
          </article>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-surface">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-6 text-center">
            أسئلة قبل ما تطلبين
          </h2>
          <Accordion.Root type="single" collapsible className="space-y-2.5">
            {HOME_FAQS.map((f, i) => (
              <FAQItem key={f.q} value={`q-${i}`} question={f.q} answer={f.a} />
            ))}
          </Accordion.Root>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-brand text-white text-center">
        <div className="container-wide max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-white mb-3">
            جاهزة تبدين نضارتچ؟
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            اختاري منتجاتچ، ندفع عند الاستلام، يوصل لچ خلال 24-48 ساعة.
          </p>
          <Link href="/shop">
            <Button variant="accent" size="lg" trailingIcon={<ChevronLeft size={20} />}>
              اطلبي الحين
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
