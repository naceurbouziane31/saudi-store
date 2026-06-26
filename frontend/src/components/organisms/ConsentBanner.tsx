"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "alnadara-consent-v1";

export const ConsentBanner = () => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setShown(true);
  }, []);

  const setConsent = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new CustomEvent("alnadara:consent", { detail: value }));
    } catch {
      // ignore
    }
    setShown(false);
  };

  if (!shown) return null;

  return (
    <div
      role="dialog"
      aria-label="إشعار الكوكيز"
      className="fixed inset-x-3 bottom-3 z-floating bg-ink-900 text-white rounded-lg shadow-pop p-4 sm:p-5 max-w-2xl mx-auto"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          نستخدم كوكيز ضرورية لتشغيل الموقع، وكوكيز تحليلية لقياس فعالية الإعلانات.{" "}
          <a className="underline" href="/policies/privacy">تفاصيل</a>.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-sm"
          >
            رفض
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="px-4 py-2 rounded-full bg-accent text-ink-900 font-bold text-sm hover:opacity-90"
          >
            أوافق
          </button>
        </div>
      </div>
    </div>
  );
};
