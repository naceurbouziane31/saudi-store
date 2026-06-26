"use client";

import Script from "next/script";

import { env } from "@/lib/env";

export const TikTokPixel = () => {
  const pixelId = env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (!pixelId) return null;
  return (
    <Script id="tt-pixel" strategy="lazyOnload">{`
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
        ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for (var i=0;i<ttq.methods.length;i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance=function(t){for (var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++) ttq.setAndDefer(e,ttq.methods[n]); return e};
        ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
          ttq._i=ttq._i||{}; ttq._i[e]=[]; ttq._i[e]._u=r; ttq._t=ttq._t||{}; ttq._t[e]=+new Date; ttq._o=ttq._o||{}; ttq._o[e]=n||{};
          var i=document.createElement("script"); i.type="text/javascript"; i.async=!0; i.src=r+"?sdkid="+e+"&lib="+t;
          var a=document.getElementsByTagName("script")[0]; a.parentNode.insertBefore(i,a)
        };
        ttq.load('${pixelId}');
      }(window, document, 'ttq');
    `}</Script>
  );
};
