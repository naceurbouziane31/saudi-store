import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default:
      "النضارة — منتجات جمال وعناية ذاتية من اليابان وأمريكا، توصيل لكل الكويت",
    template: "%s | النضارة",
  },
  description:
    "اكتشفي مجموعة النضارة من منتجات العناية المختارة بعناية — كولاجين أمريكي، شامبو ياباني، ماسك ليلي. ادفعي عند الاستلام.",
  alternates: {
    canonical: "/",
    languages: { "ar-KW": "/" },
  },
  openGraph: {
    type: "website",
    locale: "ar_KW",
    siteName: "النضارة",
    url: env.NEXT_PUBLIC_SITE_URL,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7A3E2E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-bg text-ink-900 font-body antialiased">{children}</body>
    </html>
  );
}
