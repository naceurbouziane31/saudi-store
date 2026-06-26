import { cn } from "@/lib/cn";

interface TagProps {
  className?: string;
  children: React.ReactNode;
}

export const Tag = ({ className, children }: TagProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md bg-rose/40 px-2 py-1 text-xs text-ink-700",
      className,
    )}
  >
    {children}
  </span>
);
