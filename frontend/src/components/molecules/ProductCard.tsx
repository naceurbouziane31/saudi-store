import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Price } from "@/components/atoms/Price";
import { StarRating } from "@/components/atoms/StarRating";
import { Tag } from "@/components/atoms/Tag";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const startingPrice = product.variants[0]?.priceKwd ?? 0;
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block bg-white rounded-xl border border-ink-300/40 overflow-hidden shadow-sm hover:shadow-pop transition-all duration-base",
        className,
      )}
    >
      <div className="relative aspect-square bg-cream">
        <Image
          src={product.imageSlots[0] ?? "/images/placeholders/product.svg"}
          alt={product.titleAr}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-slow group-hover:scale-105"
        />
        <Tag className="absolute top-3 start-3 bg-white/90 shadow-sm">
          {product.originFlag} <span>{product.category}</span>
        </Tag>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-display text-h3 text-ink-700 line-clamp-2">{product.titleAr}</h3>
        <p className="text-sm text-ink-500 line-clamp-2">{product.subtitleAr}</p>
        <StarRating value={product.ratingValue} count={product.reviewCount} size="sm" />
        <div className="flex items-center justify-between pt-2">
          <Price value={startingPrice} size="lg" />
          <span className="inline-flex items-center gap-1 text-brand text-sm font-bold">
            اعرفي أكثر
            <ChevronLeft size={16} className="icon-flip" />
          </span>
        </div>
      </div>
    </Link>
  );
};
