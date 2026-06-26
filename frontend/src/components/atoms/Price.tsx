import { cn } from "@/lib/cn";
import { formatKwd } from "@/lib/currency";

interface PriceProps {
  value: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withSymbol?: boolean;
}

const sizeClass: Record<NonNullable<PriceProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base font-bold",
  lg: "text-lg font-bold",
  xl: "text-h2 font-bold",
};

export const Price = ({
  value,
  compareAt,
  size = "md",
  className,
  withSymbol = true,
}: PriceProps) => (
  <span
    dir="ltr"
    className={cn("inline-flex items-baseline gap-2 font-latinUi", sizeClass[size], className)}
  >
    <span>{formatKwd(value, { withSymbol, isolate: false })}</span>
    {compareAt && compareAt > value ? (
      <span className="text-ink-500 line-through text-sm font-normal">
        {formatKwd(compareAt, { withSymbol, isolate: false })}
      </span>
    ) : null}
  </span>
);
