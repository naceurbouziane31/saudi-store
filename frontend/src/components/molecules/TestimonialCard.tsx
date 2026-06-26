import { StarRating } from "@/components/atoms/StarRating";
import { cn } from "@/lib/cn";
import type { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

const initials = (name: string): string => name.charAt(0);

export const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => (
  <article
    className={cn(
      "bg-white rounded-xl border border-ink-300/30 p-5 shadow-sm flex flex-col gap-3",
      className,
    )}
  >
    <header className="flex items-center gap-3">
      <span
        aria-hidden
        className="size-11 rounded-full bg-cream text-brand font-display font-bold text-lg flex items-center justify-center"
      >
        {initials(testimonial.name)}
      </span>
      <div>
        <p className="font-bold text-ink-900 text-sm">
          {testimonial.name}، {testimonial.age}، {testimonial.city}
        </p>
        <StarRating value={testimonial.rating} size="sm" showCount={false} />
      </div>
    </header>
    <p className="text-sm text-ink-700 leading-relaxed">{testimonial.quote}</p>
  </article>
);
