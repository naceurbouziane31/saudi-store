"use client";

import { ChevronLeft } from "lucide-react";

import { Price } from "@/components/atoms/Price";
import { cn } from "@/lib/cn";

interface StickyCTAProps {
  visible: boolean;
  priceKwd: number;
  bundleLabel: string;
  onClick: () => void;
  ctaLabel?: string;
}

export const StickyCTA = ({
  visible,
  priceKwd,
  bundleLabel,
  onClick,
  ctaLabel = "أضيفي للسلة",
}: StickyCTAProps) => (
  <div
    aria-hidden={!visible}
    className={cn(
      "fixed inset-x-0 bottom-0 z-sticky border-t border-ink-300/50 bg-white/95 backdrop-blur",
      "transition-transform duration-base ease-out lg:hidden",
      visible ? "translate-y-0" : "translate-y-full",
    )}
  >
    <div className="container-wide flex items-center gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-500">{bundleLabel}</p>
        <Price value={priceKwd} size="lg" />
      </div>
      <button
        type="button"
        onClick={onClick}
        className="bg-brand hover:bg-brand-hover text-white rounded-full px-5 h-12 inline-flex items-center gap-2 font-bold shadow-md transition-colors"
      >
        {ctaLabel}
        <ChevronLeft size={18} className="icon-flip" />
      </button>
    </div>
  </div>
);
