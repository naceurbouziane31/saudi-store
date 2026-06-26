import type { MetadataRoute } from "next";

import { PRODUCTS } from "@/data/products";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const lastModified = new Date();
  const staticUrls = [
    "/",
    "/shop",
    "/about",
    "/contact",
    "/policies/shipping",
    "/policies/returns",
    "/policies/privacy",
    "/policies/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const productUrls = PRODUCTS.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticUrls, ...productUrls];
}
