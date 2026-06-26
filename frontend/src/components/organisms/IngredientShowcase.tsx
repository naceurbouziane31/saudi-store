import { Badge } from "@/components/atoms/Badge";
import type { Ingredient } from "@/types/product";

interface IngredientShowcaseProps {
  ingredients: readonly Ingredient[];
  certifications: readonly string[];
}

const flagFor = (code?: string): string => {
  switch (code) {
    case "US":
      return "🇺🇸";
    case "JP":
      return "🇯🇵";
    case "KR":
      return "🇰🇷";
    default:
      return "";
  }
};

export const IngredientShowcase = ({
  ingredients,
  certifications,
}: IngredientShowcaseProps) => (
  <section className="py-12 lg:py-16">
    <div className="container-wide">
      <h2 className="font-display font-bold text-h1 text-ink-900 mb-2">المكونات الفعّالة</h2>
      <p className="text-ink-500 mb-6">كل مكوّن مختار بعناية، بمصدر معروف ودور واضح.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {ingredients.map((ing) => (
          <li
            key={ing.name}
            className="bg-white border border-ink-300/40 rounded-lg p-5"
          >
            <p className="font-display font-bold text-ink-900 mb-2">{ing.name}</p>
            <p className="text-sm text-ink-700">{ing.role}</p>
            {ing.country && (
              <p className="mt-3 text-xs text-ink-500">{flagFor(ing.country)} {ing.country}</p>
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {certifications.map((c) => (
          <Badge key={c} variant="accent">
            ✓ {c}
          </Badge>
        ))}
      </div>
    </div>
  </section>
);
