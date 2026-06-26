"use client";

const STORAGE_KEY = "alnadara-consent-v1";

export type ConsentValue = "accepted" | "declined" | null;

export const getConsent = (): ConsentValue => {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "accepted" || v === "declined") return v;
  return null;
};

type Listener = (v: ConsentValue) => void;
const listeners: Set<Listener> = new Set();

if (typeof window !== "undefined") {
  window.addEventListener("alnadara:consent", (e) => {
    const detail = (e as CustomEvent<ConsentValue>).detail;
    listeners.forEach((l) => l(detail));
  });
}

export const onConsentChange = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const hasConsent = (): boolean => getConsent() === "accepted";
