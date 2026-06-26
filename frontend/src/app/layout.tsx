import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Tajawal } from "next/font/google";

import { CartDrawer } from "@/components/organisms/CartDrawer";
import { CheckoutModal } from "@/components/organisms/CheckoutModal";
import { ConsentBanner } from "@/components/organisms/ConsentBanner";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { UpsellModal } from "@/components/organisms/UpsellModal";
import { WhatsAppFAB } from "@/components/organisms/WhatsAppFAB";
import { env } from "@/lib/env";
import "@/styles/globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-latin-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-latin-ui",
  display: "swap",
});

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
    title: "النضارة — جمال موثوق، يوصل لباب بيتچ",
    description:
      "منتجات النضارة — كولاجين أمريكي، شامبو ياباني، ماسك ليلي. ادفعي عند الاستلام.",
    images: [{ url: "/images/og/cover.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "النضارة — جمال موثوق، يوصل لباب بيتچ",
    description: "ادفعي عند الاستلام. توصيل لكل الكويت.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7A3E2E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-bg text-ink-900 font-body antialiased min-h-dvh flex flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFAB />
        <CartDrawer />
        <CheckoutModal />
        <UpsellModal />
        <ConsentBanner />
      </body>
    </html>
  );
}
