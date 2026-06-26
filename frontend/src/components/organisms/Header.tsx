"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { useCartItemCount, useCartStore } from "@/stores/cartStore";
import { useUiStore } from "@/stores/uiStore";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصلي معنا" },
];

interface HeaderProps {
  showCart?: boolean;
}

const BrandMark = () => (
  <Link href="/" className="flex items-center gap-3 group" aria-label="النضارة — الرئيسية">
    <span className="size-11 lg:size-12 rounded-full bg-brand text-white font-display font-bold text-2xl flex items-center justify-center shadow-md group-hover:bg-brand-hover transition-colors">
      ن
    </span>
    <span className="flex flex-col leading-none">
      <span className="font-display font-bold text-h3 text-ink-900">النضارة</span>
      <span className="hidden sm:inline font-latinDisplay text-sm text-ink-500 mt-0.5 italic">
        Al Nadara
      </span>
    </span>
  </Link>
);

export const Header = ({ showCart = true }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { isMenuOpen, openMenu, closeMenu } = useUiStore();
  const itemCount = useCartItemCount();
  const openCartDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-sticky w-full backdrop-blur-md bg-white/95 transition-shadow duration-base",
        scrolled && "shadow-sm",
      )}
    >
      <div className="container-wide h-16 lg:h-20 flex items-center justify-between gap-4">
        <BrandMark />

        <nav aria-label="الرئيسية" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-ink-900 hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showCart && (
            <button
              type="button"
              onClick={openCartDrawer}
              aria-label={`السلة — ${itemCount} منتج`}
              className="relative size-11 rounded-full hover:bg-cream transition-colors flex items-center justify-center"
            >
              <ShoppingBag size={22} className="text-ink-900" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[20px] h-5 px-1 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={isMenuOpen ? closeMenu : openMenu}
            className="lg:hidden size-11 rounded-full hover:bg-cream transition-colors flex items-center justify-center"
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-ink-300/30 bg-white">
          <nav aria-label="القائمة المتنقلة" className="container-wide py-3 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-3 text-base text-ink-900 border-b border-ink-300/20 last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
