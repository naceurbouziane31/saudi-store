import Image from "next/image";

import { cn } from "@/lib/cn";

interface ImageTextSectionProps {
  heading: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "start" | "end";
  tags?: readonly string[];
  cta?: React.ReactNode;
  background?: "white" | "cream" | "rose";
}

const bgMap = {
  white: "bg-white",
  cream: "bg-cream",
  rose: "bg-rose/40",
};

export const ImageTextSection = ({
  heading,
  body,
  imageSrc,
  imageAlt,
  imagePosition = "end",
  tags,
  cta,
  background = "white",
}: ImageTextSectionProps) => (
  <section className={cn("py-12 lg:py-20", bgMap[background])}>
    <div className="container-wide grid gap-8 lg:gap-16 lg:grid-cols-2 items-center">
      <div className={cn(imagePosition === "start" ? "lg:order-2" : "lg:order-1")}>
        <h2 className="font-display font-bold text-h1 text-ink-900 mb-4">{heading}</h2>
        <p className="text-base text-ink-700 leading-relaxed mb-5">{body}</p>
        {tags && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((t) => (
              <span
                key={t}
                className="bg-white rounded-full px-3 py-1.5 text-xs border border-ink-300/40 text-ink-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {cta}
      </div>
      <div
        className={cn(
          "relative aspect-[4/5] lg:aspect-[4/3] rounded-xl overflow-hidden bg-cream shadow-md",
          imagePosition === "start" ? "lg:order-1" : "lg:order-2",
        )}
      >
        <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
      </div>
    </div>
  </section>
);
