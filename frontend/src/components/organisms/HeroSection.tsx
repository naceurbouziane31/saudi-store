import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { StarRating } from "@/components/atoms/StarRating";

interface HeroSectionProps {
  imageSrc?: string;
}

export const HeroSection = ({
  imageSrc = "/images/placeholders/hero.svg",
}: HeroSectionProps) => (
  <section className="bg-cream relative overflow-hidden">
    <div className="container-wide grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 lg:py-20">
      <div className="order-2 lg:order-1 space-y-5">
        <p className="font-latinDisplay italic text-accent text-sm tracking-wide">
          AL NADARA · ALNADARA.SHOP
        </p>
        <h1 className="font-display font-bold text-display lg:text-[3.5rem] leading-tight text-ink-900">
          نضارتچ تبدا من هنا.
        </h1>
        <p className="text-lg text-ink-700 leading-relaxed max-w-xl">
          براند كويتي يجمع لچ أقوى منتجات الجمال من اليابان وأمريكا — يوصل لباب بيتچ، وتدفعين بس
          عند الاستلام.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <Link href="/shop">
            <Button size="lg" trailingIcon={<ChevronLeft size={20} />}>
              شوفي المنتجات
            </Button>
          </Link>
          <StarRating value={4.8} count={1250} size="md" />
        </div>
        <div className="flex flex-wrap gap-3 pt-4 text-xs text-ink-700">
          <span className="bg-white rounded-full px-3 py-1.5 border border-ink-300/40">
            🇰🇼 توصيل
          </span>
          <span className="bg-white rounded-full px-3 py-1.5 border border-ink-300/40">
            💰 COD
          </span>
          <span className="bg-white rounded-full px-3 py-1.5 border border-ink-300/40">
            🔬 مكونات معتمدة
          </span>
          <span className="bg-white rounded-full px-3 py-1.5 border border-ink-300/40">
            🔁 ضمان رضا
          </span>
        </div>
      </div>

      <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-[16/12] rounded-xl overflow-hidden shadow-pop bg-rose/40">
        <Image
          src={imageSrc}
          alt="امرأة كويتية تطبق روتين العناية بالبشرة في إضاءة الصباح"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cream via-transparent to-rose/20"
    />
  </section>
);
