"use client";

import Script from "next/script";

import { env } from "@/lib/env";

export const SnapPixel = () => {
  const pixelId = env.NEXT_PUBLIC_SNAP_PIXEL_ID;
  if (!pixelId) return null;
  return (
    <Script id="snap-pixel" strategy="lazyOnload">{`
      (function (e, t, n) {
        if (e.snaptr) return;
        var a = e.snaptr = function () { a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments) };
        a.queue = []; var s = 'script', r = t.createElement(s);
        r.async = !0; r.src = n;
        var u = t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r, u);
      })(window, document, 'https://sc-static.net/scevent.min.js');
      snaptr('init', '${pixelId}');
    `}</Script>
  );
};
