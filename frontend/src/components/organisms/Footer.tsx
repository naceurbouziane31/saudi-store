import Link from "next/link";
import { Banknote, Instagram, Mail, MessageCircle, Phone, ShieldCheck, Truck } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { env } from "@/lib/env";

const QUICK_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصلي معنا" },
  { href: "/policies/shipping", label: "سياسة التوصيل" },
  { href: "/policies/returns", label: "سياسة الإرجاع" },
  { href: "/policies/privacy", label: "سياسة الخصوصية" },
  { href: "/policies/terms", label: "الشروط والأحكام" },
];

const waLink = (number: string): string => {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
};

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-900 text-white mt-16 lg:mt-24">
      <div className="container-wide py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="size-11 rounded-full bg-brand text-white font-display font-bold text-2xl flex items-center justify-center">
              ن
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display font-bold text-h3">النضارة</span>
              <span className="font-latinDisplay italic text-sm text-white/70">Al Nadara</span>
            </span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed mb-5">
            براند كويتي يجمع لچ أقوى منتجات الجمال من اليابان وأمريكا — يوصل لباب بيتچ، وتدفعين بس
            عند الاستلام.
          </p>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Banknote size={16} className="text-accent" /> COD
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck size={16} className="text-accent" /> توصيل مجاني
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-accent" /> آمن
            </span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              aria-label="انستغرام"
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.tiktok.com/"
              aria-label="تيك توك"
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href={waLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
              aria-label="واتساب"
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <WhatsAppIcon size={14} />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-4 text-white">روابط سريعة</h2>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-4">تواصلي معنا</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={waLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white"
              >
                <WhatsAppIcon size={16} className="text-accent" />
                واتساب: {env.NEXT_PUBLIC_WHATSAPP_NUMBER}
              </a>
            </li>
            <li>
              <a
                href={`tel:${env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white"
              >
                <Phone size={16} className="text-accent" />
                {env.NEXT_PUBLIC_WHATSAPP_NUMBER}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white"
              >
                <Mail size={16} className="text-accent" />
                {env.NEXT_PUBLIC_SUPPORT_EMAIL}
              </a>
            </li>
            <li className="text-white/70">
              ساعات العمل: السبت — الخميس · 9 ص — 9 م
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-5 text-center text-xs text-white/70">
          © {year} النضارة — صنع لچ بحب من الكويت 🇰🇼 · جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
};
