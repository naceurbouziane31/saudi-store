import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPageTemplate } from "@/components/templates/ProductPageTemplate";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { env } from "@/lib/env";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = () =>
  PRODUCTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "ما لقينا الصفحة", robots: { index: false, follow: false } };
  }
  return {
    title: `${product.titleAr} — ${product.subtitleAr}`,
    description: product.shortDescriptionAr,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.titleAr} | النضارة`,
      description: product.shortDescriptionAr,
      url: `${env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      images: [{ url: product.imageSlots[0] ?? "/images/og/cover.png" }],
    },
  };
}

const buildJsonLd = (product: ReturnType<typeof getProductBySlug>) => {
  if (!product) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.titleAr,
    description: product.shortDescriptionAr,
    image: product.imageSlots.map((s) => `${env.NEXT_PUBLIC_SITE_URL}${s}`),
    brand: { "@type": "Brand", name: "النضارة" },
    sku: product.variants[0]?.sku,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      price: v.priceKwd.toFixed(3),
      priceCurrency: "KWD",
      availability: "https://schema.org/InStock",
      url: `${env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue.toFixed(1),
      reviewCount: product.reviewCount,
    },
  };
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(product)) }}
      />
      <ProductPageTemplate product={product} />
    </>
  );
}
