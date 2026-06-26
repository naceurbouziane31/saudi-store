import { Star } from "lucide-react";

import { cn } from "@/lib/cn";

interface StarRatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const sizes = { sm: 14, md: 16, lg: 20 };

export const StarRating = ({
  value,
  count,
  size = "md",
  showCount = true,
  className,
}: StarRatingProps) => {
  const filled = Math.round(value);
  return (
    <span
      dir="ltr"
      className={cn("inline-flex items-center gap-2 font-latinUi", className)}
      aria-label={`تقييم ${value} من 5${count ? ` بناءً على ${count} تقييم` : ""}`}
    >
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={sizes[size]}
            strokeWidth={1.5}
            className={i < filled ? "fill-accent text-accent" : "text-ink-300"}
          />
        ))}
      </span>
      {showCount && (
        <span className="text-sm text-ink-500">
          {value.toFixed(1)}
          {count ? ` · ${count.toLocaleString("en-US")}` : ""}
        </span>
      )}
    </span>
  );
};
