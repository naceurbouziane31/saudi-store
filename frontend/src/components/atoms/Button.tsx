import { forwardRef } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-display font-bold rounded-full transition-all duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-hover shadow-md",
  secondary: "bg-cream text-brand border border-brand/20 hover:bg-rose/40",
  ghost: "bg-transparent text-brand hover:bg-cream",
  danger: "bg-danger text-white hover:opacity-90",
  accent: "bg-accent text-ink-900 hover:opacity-90 shadow-md",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading,
    leadingIcon,
    trailingIcon,
    fullWidth,
    className,
    children,
    type = "button",
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? isLoading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
      <span>{isLoading ? "لحظة وحدة..." : children}</span>
      {trailingIcon && !isLoading && <span className="shrink-0 icon-flip">{trailingIcon}</span>}
    </button>
  );
});
