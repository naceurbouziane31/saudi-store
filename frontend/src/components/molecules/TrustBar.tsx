import { Banknote, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { cn } from "@/lib/cn";

interface TrustBarProps {
  className?: string;
  compact?: boolean;
}

const USPS = [
  {
    icon: Truck,
    title: "توصيل لكل الكويت",
    sub: "خلال 24-48 ساعة",
  },
  {
    icon: Banknote,
    title: "الدفع عند الاستلام",
    sub: "ادفعي لما يوصل بيدچ",
  },
  {
    icon: ShieldCheck,
    title: "مكونات معتمدة",
    sub: "من اليابان وأمريكا",
  },
  {
    icon: RotateCcw,
    title: "ضمان الرضا",
    sub: "رجعيه لو ما عجبچ",
  },
] as const;

export const TrustBar = ({ className, compact }: TrustBarProps) => (
  <section
    aria-label="نقاط الثقة"
    className={cn("bg-rose/50", compact ? "py-4" : "py-6", className)}
  >
    <div className="container-wide">
      <ul
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:grid-cols-4",
        )}
      >
        {USPS.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-start gap-3 text-ink-900">
            <Icon size={22} strokeWidth={1.75} className="text-brand shrink-0 mt-1" />
            <div>
              <p className="font-bold text-sm">{title}</p>
              <p className="text-xs text-ink-700">{sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
