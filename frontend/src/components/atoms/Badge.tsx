import { cn } from "@/lib/cn";

type Variant = "default" | "success" | "danger" | "warning" | "accent" | "brand";

const classes: Record<Variant, string> = {
  default: "bg-ink-300/30 text-ink-700",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
  accent: "bg-accent/20 text-ink-900",
  brand: "bg-brand text-white",
};

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ variant = "default", className, children }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
      classes[variant],
      className,
    )}
  >
    {children}
  </span>
);
