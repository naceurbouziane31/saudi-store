"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { cn } from "@/lib/cn";
import { formatKwd } from "@/lib/currency";
import type { ProductVariant } from "@/types/product";

interface OfferCardProps {
  variant: ProductVariant;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
}

const bundleNameAr: Record<number, string> = {
  1: "تجربيها بنفسچ",
  2: "بكمية كافية لمدة شهرين",
  3: "الباقة الكاملة — وفّري 18 KWD",
};

export const OfferCard = ({ variant, selected, onSelect, badge }: OfferCardProps) => {
  const perPiece = variant.priceKwd / variant.bundleSize;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full text-start rounded-xl border-2 p-4 transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected
          ? "border-brand bg-cream shadow-pop"
          : "border-ink-300/60 bg-white hover:border-brand/60",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center shrink-0",
              selected ? "border-brand bg-brand" : "border-ink-300",
            )}
          >
            {selected && <Check size={12} className="text-white" />}
          </span>
          <div>
            <p className="font-display font-bold text-ink-900 text-base">
              {variant.bundleSize === 1
                ? "1 قطعة"
                : variant.bundleSize === 2
                  ? "2 قطعة"
                  : "3 قطع"}
            </p>
            <p className="text-xs text-ink-500">{bundleNameAr[variant.bundleSize]}</p>
          </div>
        </div>
        {badge && <Badge variant="accent">{badge}</Badge>}
      </div>

      <div className="flex items-end justify-between gap-3 pt-2 border-t border-ink-300/30">
        <Price value={variant.priceKwd} compareAt={variant.compareAtPriceKwd} size="lg" />
        {variant.bundleSize > 1 && (
          <span className="text-xs text-accent font-bold">
            {formatKwd(perPiece, { isolate: false })} للقطعة
          </span>
        )}
      </div>
    </button>
  );
};
