"use client";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { env } from "@/lib/env";

const waLink = (number: string): string => {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent("هلا، حابة أسأل عن منتجاتچ.")}`;
};

export const WhatsAppFAB = () => (
  <a
    href={waLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
    aria-label="تواصلي معنا على واتساب"
    target="_blank"
    rel="noopener"
    className="fixed bottom-5 start-5 z-floating size-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
  >
    <WhatsAppIcon size={28} />
  </a>
);
