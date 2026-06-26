"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Price } from "@/components/atoms/Price";
import { StarRating } from "@/components/atoms/StarRating";
import { trackAddToCart, trackViewContent } from "@/lib/analytics/events";
import { BenefitItem } from "@/components/molecules/BenefitItem";
import { FAQItem } from "@/components/molecules/FAQItem";
import { OfferCard } from "@/components/molecules/OfferCard";
import { StickyCTA } from "@/components/molecules/StickyCTA";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import { TrustBar } from "@/components/molecules/TrustBar";
import { IngredientShowcase } from "@/components/organisms/IngredientShowcase";
import { ReviewGrid } from "@/components/organisms/ReviewGrid";
import { TESTIMONIALS } from "@/data/testimonials";
import { buildCartLineForVariant, useCartStore } from "@/stores/cartStore";
import type { BundleSize, Product, ProductVariant } from "@/types/product";

interface ProductPageTemplateProps {
  product: Product;
}

const bundleBadge = (size: BundleSize): string | undefined => {
  if (size === 2) return "الأكثر مبيعاً";
  if (size === 3) return "أفضل قيمة";
  return undefined;
};

const HOW_TO_USE_STEPS = [
  "نظفي بشرتچ / شعرچ",
  "استخدمي الكمية المناسبة",
  "اتبعي الروتين بانتظام",
];

export const ProductPageTemplate = ({ product }: ProductPageTemplateProps) => {
  const [selectedSize, setSelectedSize] = useState<BundleSize>(2);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const offerSectionRef = useRef<HTMLDivElement | null>(null);
  const add = useCartStore((s) => s.add);

  const selectedVariant = useMemo<ProductVariant>(
    () =>
      product.variants.find((v) => v.bundleSize === selectedSize) ?? product.variants[1]!,
    [product, selectedSize],
  );

  useEffect(() => {
    // Fire ViewContent ~1s after mount so it doesn't fight LCP.
    const t = window.setTimeout(() => {
      trackViewContent({
        sku: selectedVariant.sku,
        name: product.titleAr,
        priceKwd: selectedVariant.priceKwd,
      });
    }, 1000);
    return () => window.clearTimeout(t);
  }, [product.titleAr, selectedVariant.priceKwd, selectedVariant.sku]);

  useEffect(() => {
    if (!offerSectionRef.current || typeof IntersectionObserver === "undefined") {
      return;
    }
    const node = offerSectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setStickyVisible(!entry.isIntersecting);
      },
      { rootMargin: "-100% 0px 0px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    add(buildCartLineForVariant(product.slug, selectedVariant));
    trackAddToCart([
      {
        id: selectedVariant.sku,
        name: product.titleAr,
        quantity: 1,
        price: selectedVariant.priceKwd,
      },
    ]);
  };

  const productTestimonials = TESTIMONIALS.filter(
    (t) => t.productSlug === product.slug,
  ).slice(0, 6);
  const fallbackTestimonials = TESTIMONIALS.slice(0, 6);

  return (
    <>
      {/* 1. Image gallery */}
      <section className="container-wide pt-8 pb-6 lg:pt-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-cream shadow-md">
              <Image
                src={product.imageSlots[activeImageIdx] ?? product.imageSlots[0] ?? ""}
                alt={`${product.titleAr} — صورة ${activeImageIdx + 1}`}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 lg:hidden">
                {product.imageSlots.map((_, i) => (
                  <span
                    key={i}
                    className={
                      "h-1.5 rounded-full transition-all " +
                      (i === activeImageIdx ? "w-6 bg-brand" : "w-1.5 bg-white/70")
                    }
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.imageSlots.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`عرض الصورة ${i + 1}`}
                  className={
                    "relative aspect-square rounded-md overflow-hidden border-2 transition-colors " +
                    (i === activeImageIdx ? "border-brand" : "border-transparent")
                  }
                >
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Title + 3. Offer selector + 5. CTA */}
          <div className="space-y-5" ref={offerSectionRef}>
            <Badge variant="accent">{product.originFlag} {product.category}</Badge>
            <h1 className="font-display font-bold text-display text-ink-900">{product.titleAr}</h1>
            <p className="text-lg text-ink-700">{product.subtitleAr}</p>
            <StarRating value={product.ratingValue} count={product.reviewCount} size="md" />

            <div className="space-y-3 pt-2">
              {[3, 2, 1].map((size) => {
                const v = product.variants.find((x) => x.bundleSize === size);
                if (!v) return null;
                return (
                  <OfferCard
                    key={size}
                    variant={v}
                    selected={selectedSize === size}
                    onSelect={() => setSelectedSize(size as BundleSize)}
                    badge={bundleBadge(size as BundleSize)}
                  />
                );
              })}
            </div>

            <div className="hidden lg:block">
              <Button
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                trailingIcon={<ChevronLeft size={20} />}
              >
                أضيفي للسلة — <Price value={selectedVariant.priceKwd} size="lg" className="text-white" />
              </Button>
              <p className="text-xs text-ink-500 mt-2 inline-flex items-center gap-1.5">
                <Banknote size={14} /> الدفع عند الاستلام · توصيل مجاني
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* 7. Benefits */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-6 text-center">
            ليش {product.titleAr}؟
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.benefitsAr.map((b) => (
              <BenefitItem key={b} text={b} icon={<Sparkles size={18} />} />
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Mechanism */}
      <section className="py-12 lg:py-16 bg-cream">
        <div className="container-wide grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="font-display font-bold text-h1 text-ink-900 mb-3">كيف يشتغل؟</h2>
            <p className="text-base text-ink-700 leading-relaxed">{product.mechanismAr}</p>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-square rounded-xl overflow-hidden bg-rose/40">
            <Image src={product.imageSlots[1] ?? product.imageSlots[0] ?? ""} alt="آلية العمل" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* 9. Ingredients */}
      <IngredientShowcase
        ingredients={product.ingredientsAr}
        certifications={product.certifications}
      />

      {/* 10. Before / After */}
      <section className="py-12 lg:py-16 bg-surface">
        <div className="container-wide">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-2 text-center">
            قبل و بعد — نتايج حقيقية
          </h2>
          <p className="text-ink-500 text-center mb-8">صور توضيحية — صور حقيقية تنشر بعد الحصول على إذن العميلات.</p>
          <ul className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((idx) => (
              <li key={idx} className="grid grid-cols-2 gap-2">
                <figure>
                  <div className="relative aspect-square rounded-md overflow-hidden bg-cream">
                    <Image src={`/images/placeholders/ba-${idx}-before.svg`} alt={`قبل ${idx}`} fill sizes="240px" className="object-cover" />
                  </div>
                  <figcaption className="text-xs text-ink-500 text-center mt-1">قبل</figcaption>
                </figure>
                <figure>
                  <div className="relative aspect-square rounded-md overflow-hidden bg-cream">
                    <Image src={`/images/placeholders/ba-${idx}-after.svg`} alt={`بعد ${idx}`} fill sizes="240px" className="object-cover" />
                  </div>
                  <figcaption className="text-xs text-success text-center mt-1">بعد 30 يوم</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 11. Reviews */}
      <ReviewGrid
        testimonials={productTestimonials.length >= 3 ? productTestimonials : fallbackTestimonials}
        aggregateRating={product.ratingValue}
        aggregateCount={product.reviewCount}
        heading="شو يقولن عنه؟"
      />

      {/* 12. How to use */}
      <section className="py-12 lg:py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-2 text-center">طريقة الاستخدام</h2>
          <p className="text-ink-500 text-center mb-8">{product.usageAr}</p>
          <ol className="grid gap-4 sm:grid-cols-3">
            {HOW_TO_USE_STEPS.map((step, i) => (
              <li key={step} className="bg-white border border-ink-300/30 rounded-lg p-4 text-center">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-white font-bold mb-3">
                  {i + 1}
                </span>
                <p className="text-sm text-ink-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 13. Who it's for / not for */}
      <section className="py-10 lg:py-14 bg-cream">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          <article className="bg-white rounded-xl border border-success/30 p-5">
            <h3 className="font-display font-bold text-h3 text-success mb-3 flex items-center gap-2">
              <CheckCircle2 size={20} /> مناسب لچ لو
            </h3>
            <ul className="space-y-2 text-sm text-ink-700">
              {product.whoIsForAr.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="bg-white rounded-xl border border-danger/30 p-5">
            <h3 className="font-display font-bold text-h3 text-danger mb-3 flex items-center gap-2">
              <XCircle size={20} /> غير مناسب لچ لو
            </h3>
            <ul className="space-y-2 text-sm text-ink-700">
              {product.whoIsNotForAr.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span className="text-danger mt-0.5">✗</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* 14. Authority */}
      <section className="py-10 lg:py-14">
        <div className="container-wide">
          <h3 className="font-display font-bold text-h3 text-ink-700 mb-4 text-center">شهادات وضمانات</h3>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {product.proofPoints.map((p) => (
              <li key={p}>
                <Badge variant="accent">✓ {p}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 15. FAQ */}
      <section className="py-12 lg:py-16 bg-surface">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-6 text-center">
            أسئلة قبل ما تطلبين
          </h2>
          <Accordion.Root type="single" collapsible className="space-y-2.5">
            {product.faqs.map((f, i) => (
              <FAQItem key={f.q} value={`q-${i}`} question={f.q} answer={f.a} />
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* 16. Final offer reminder */}
      <section className="py-14 lg:py-20 bg-brand text-white text-center">
        <div className="container-wide max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-white mb-3">
            جاهزة تجربينه؟
          </h2>
          <p className="text-white/90 mb-6">
            اطلبي الحين — ندفع عند الاستلام، يوصل لچ خلال 24-48 ساعة.
          </p>
          <Button
            variant="accent"
            size="lg"
            onClick={handleAddToCart}
            trailingIcon={<ChevronRight size={20} className="icon-flip" />}
          >
            أضيفي للسلة — {selectedVariant.priceKwd} KWD
          </Button>
        </div>
      </section>

      <StickyCTA
        visible={stickyVisible}
        priceKwd={selectedVariant.priceKwd}
        bundleLabel={selectedVariant.labelAr}
        onClick={handleAddToCart}
      />
    </>
  );
};
