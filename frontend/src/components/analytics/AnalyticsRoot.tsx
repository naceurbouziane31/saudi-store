"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackPageView } from "@/lib/analytics/events";
import { hasConsent, onConsentChange } from "@/lib/analytics/consent";

import { MetaPixel } from "./MetaPixel";
import { SnapPixel } from "./SnapPixel";
import { TikTokPixel } from "./TikTokPixel";

const PageViewSpy = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // requestIdleCallback shields LCP/INP from any tracking work.
    const useRic = "requestIdleCallback" in window;
    const handle = useRic
      ? window.requestIdleCallback(() => trackPageView())
      : window.setTimeout(() => trackPageView(), 0);
    return () => {
      if (useRic) {
        window.cancelIdleCallback?.(handle as number);
      } else {
        window.clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
      }
    };
  }, [pathname, searchParams]);

  return null;
};

export const AnalyticsRoot = () => {
  const [granted, setGranted] = useState<boolean>(false);

  useEffect(() => {
    setGranted(hasConsent());
    const off = onConsentChange((v) => setGranted(v === "accepted"));
    return () => {
      off();
    };
  }, []);

  return (
    <>
      {granted ? (
        <>
          <MetaPixel />
          <TikTokPixel />
          <SnapPixel />
        </>
      ) : null}
      <Suspense fallback={null}>
        <PageViewSpy />
      </Suspense>
    </>
  );
};
