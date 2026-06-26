"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

import { Price } from "@/components/atoms/Price";
import { buildCartLineForVariant, useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/product";

interface CrossSellCardProps {
  product: Product;
}

export const CrossSellCard = ({ product }: CrossSellCardProps) => {
  const add = useCartStore((s) => s.add);
  const singleVariant = product.variants.find((v) => v.bundleSize === 1);
  if (!singleVariant) return null;

  return (
    <div className="bg-white rounded-lg border border-ink-300/40 p-3 flex items-center gap-3 min-w-[260px]">
      <div className="relative size-14 rounded-md overflow-hidden bg-cream shrink-0">
        <Image
          src={product.imageSlots[0] ?? "/images/placeholders/product.svg"}
          alt={product.titleAr}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink-900 line-clamp-1">{product.titleAr}</p>
        <Price value={singleVariant.priceKwd} size="sm" />
      </div>
      <button
        type="button"
        onClick={() =>
          add(buildCartLineForVariant(product.slug, singleVariant))
        }
        className="size-9 rounded-full bg-brand text-white flex items-center justify-center shrink-0 hover:bg-brand-hover transition-colors"
        aria-label={`أضيفي ${product.titleAr} للسلة`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
