import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { TrustBar } from "@/components/molecules/TrustBar";
import { ImageTextSection } from "@/components/organisms/ImageTextSection";

export const metadata: Metadata = {
  title: "قصة النضارة — البراند الكويتي للجمال",
  description:
    "تعرّفي على النضارة — براند كويتي يجمع لچ أفضل منتجات الجمال من اليابان وأمريكا.",
  alternates: { canonical: "/about" },
};

const MANIFESTO = [
  "نؤمن إن الجمال يبدا من الداخل قبل الخارج.",
  "نختار أحسن المكونات — مو الأرخص.",
  "نخدمچ كأنچ صديقتنا الشخصية.",
  "نضمن لچ تجربة بدون مخاطر — ادفعي بس لما يوصل.",
];

const STEPS = [
  { title: "نبحث", body: "نسأل خبراء ونقرى الدراسات قبل ما نختار أي مكون." },
  { title: "نختبر", body: "نجرب المنتج بأنفسنا لمدة شهر كامل قبل ما نشاركه." },
  { title: "نسأل", body: "نوزع عينات على عميلات حقيقيات ونسمع رأيهم بصراحة." },
  { title: "نطلق", body: "لو اجتاز كل المعايير، يوصل لچ — وإلا يرجع." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream py-12 lg:py-16 text-center">
        <div className="container-wide max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-display text-ink-900 mb-3">قصة النضارة</h1>
          <p className="text-lg text-ink-700">
            براند كويتي بدا بفكرة بسيطة — جمال حقيقي بدون مبالغة وبدون مخاطر.
          </p>
        </div>
      </section>

      <ImageTextSection
        heading="ليش بدينا؟"
        body="كل وحدة فينا تعرف الشعور — تشوفين منتج ع الانستا، يكلمچ، تطلبينه، يجيچ، تستخدمينه أسبوع، وتكتشفين إنه ما يفرق. مع النضارة، قررنا نسوي العكس: نختار بس المنتجات اللي اشتغلت ويانا، اللي مكوناتها مدروسة، اللي ورا چل وحدة منهم شركة كبيرة بتاريخ نظيف. ونوصلها لچ كويتية، بصوت كويتي، بسعر تستاهلينه."
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="مؤسسة النضارة"
        imagePosition="end"
      />

      <section className="py-12 lg:py-16 bg-surface">
        <div className="container-wide">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-6 text-center">
            شو نؤمن فيه
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {MANIFESTO.map((m) => (
              <li
                key={m}
                className="bg-white border border-ink-300/30 rounded-xl p-5 flex gap-3 items-start"
              >
                <Sparkles size={20} className="text-brand shrink-0 mt-1" />
                <span className="text-ink-700">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-wide max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-2 text-center">
            شلون نختار منتجاتنا؟
          </h2>
          <p className="text-ink-500 text-center mb-8">
            ما نقدم لچ شي ما اختبرناه. خطوة بخطوة.
          </p>
          <ol className="grid gap-4 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-cream rounded-xl p-5">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand text-white font-bold mb-3">
                  {i + 1}
                </span>
                <p className="font-display font-bold text-ink-900 mb-1">{s.title}</p>
                <p className="text-sm text-ink-700">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TrustBar />

      <section className="py-12 lg:py-16 bg-brand text-white text-center">
        <div className="container-wide max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-h1 text-white mb-3">شوفي منتجاتنا</h2>
          <p className="text-white/90 mb-5">3 منتجات اخترناها بعناية — لروتين متكامل.</p>
          <Link href="/shop">
            <Button variant="accent" size="lg" trailingIcon={<ChevronLeft size={20} />}>
              تصفحي المجموعة
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
