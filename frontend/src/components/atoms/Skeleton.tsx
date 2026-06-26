import { cn } from "@/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-ink-300/40", className)} aria-hidden />
);
