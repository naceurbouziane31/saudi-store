import { StarRating } from "@/components/atoms/StarRating";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import type { Testimonial } from "@/data/testimonials";

interface ReviewGridProps {
  testimonials: readonly Testimonial[];
  aggregateRating: number;
  aggregateCount: number;
  heading?: string;
}

export const ReviewGrid = ({
  testimonials,
  aggregateRating,
  aggregateCount,
  heading = "شو يقولن عنه؟",
}: ReviewGridProps) => (
  <section className="py-12 lg:py-16 bg-surface">
    <div className="container-wide">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-bold text-h1 text-ink-900 mb-2">{heading}</h2>
          <p className="text-ink-500">نساء كويتيات من حولچ يثقن فينا.</p>
        </div>
        <StarRating value={aggregateRating} count={aggregateCount} size="lg" />
      </div>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <li key={t.id}>
            <TestimonialCard testimonial={t} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
