"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/data/NavLinks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#79cef2]/10 bg-[#0b1117]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[#e8f8ff] transition-colors hover:text-[#79cef2] md:text-3xl"
        >
          Itoi Toi
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#42aee2]/15 text-[#79cef2]"
                    : "text-[#9eb0ba] hover:bg-white/5 hover:text-[#e8f8ff]",
                )}
              >
                {link.label}

                {active && (
                  <span className="absolute -bottom-[9px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#42aee2]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Temporary Button */}
        <Button className="hidden bg-[#42aee2] text-[#081017] hover:bg-[#79cef2] md:inline-flex">
          Send Wishes
        </Button>
      </div>
    </nav>
  );
}