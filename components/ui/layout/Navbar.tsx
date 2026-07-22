"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { navLinks } from "@/data/NavLinks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageProvider";
import LanguageSwitcher from "@/components/ui/language/LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t, language } = useLanguage();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function getTranslatedLabel(href: string) {
    const labels: Record<string, string> = {
      "/": t.nav.home,
      "/profile": t.nav.profile,
      "/archives": t.nav.archives,
      "/timeline": t.nav.timeline,
      "/news": t.nav.news,
    };

    return labels[href] ?? href;
  }

  return (
    <>
      {/* Clickable overlay below the navbar */}
      {open && (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-20 z-40 cursor-default bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#dceaf5] bg-white/95 md:bg-white/90 md:backdrop-blur-xl">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center px-6 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="order-2 whitespace-nowrap text-2xl font-black tracking-tight text-[#202b50] transition-colors hover:text-[#48a9f8] md:order-none md:text-3xl"
            onClick={() => setOpen(false)}
          >
            Itoi Toi
          </Link>

          {/* Centered desktop navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-4",
                    active
                      ? "bg-[#dff1ff] text-[#318ee8]"
                      : "text-[#6f7893] hover:bg-[#f3f9ff] hover:text-[#202b50]",
                  )}
                >
                  {getTranslatedLabel(link.href)}

                  {active && (
                    <span className="absolute -bottom-[9px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#48a9f8]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop right controls */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
            <LanguageSwitcher />

            <Link href="/wishes" className="shrink-0">
              <Button className="whitespace-nowrap bg-gradient-to-r from-[#f493c2] to-[#48a9f8] text-white shadow-md hover:opacity-90">
                {t.nav.wishes}
              </Button>
            </Link>
          </div>

          {/* Mobile and tablet hamburger */}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="order-1 rounded-xl p-2 text-[#202b50] transition hover:bg-[#f3f9ff] md:order-none lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile and tablet menu */}
        {open && (
          <div className="relative z-50 border-t border-[#dceaf5] bg-white px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "bg-[#dff1ff] text-[#318ee8]"
                        : "text-[#6f7893] hover:bg-[#f3f9ff]",
                    )}
                  >
                    {getTranslatedLabel(link.href)}
                  </Link>
                );
              })}

              <Link href="/wishes" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#f493c2] to-[#48a9f8] text-white shadow-md hover:opacity-90">
                  {t.nav.wishes}
                </Button>
              </Link>

              <div className="mt-2 border-t border-[#dceaf5] pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa3b8]">
                  {language === "en" ? "Language" : "言語"}
                </p>

                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}