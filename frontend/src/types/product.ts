export type BundleSize = 1 | 2 | 3;

export interface Ingredient {
  name: string;
  role: string;
  country?: string;
}

export interface ProductVariant {
  sku: string;
  bundleSize: BundleSize;
  labelAr: string;
  priceKwd: number;
  compareAtPriceKwd?: number | null;
  isUpsellOffer?: boolean;
  stockQty?: number | null;
}

export interface ProductReviewBreakdown {
  rating: number;
  count: number;
}

export interface Product {
  slug: string;
  skuPrefix: "GUM" | "SHA" | "MAS";
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  shortDescriptionAr: string;
  originCountry: "US" | "JP" | "KR";
  originFlag: string;
  benefitsAr: readonly string[];
  ingredientsAr: readonly Ingredient[];
  mechanismAr: string;
  usageAr: string;
  whoIsForAr: readonly string[];
  whoIsNotForAr: readonly string[];
  faqs: ReadonlyArray<{ q: string; a: string }>;
  proofPoints: readonly string[];
  certifications: readonly string[];
  crossSellSlugs: readonly string[];
  upsellPartnerSlug: string;
  variants: readonly ProductVariant[];
  ratingValue: number;
  reviewCount: number;
  imageSlots: readonly string[];
  category: string;
}
