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
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#dceaf5] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[#202b50] transition-colors hover:text-[#48a9f8] md:text-3xl"
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
                    ? "bg-[#dff1ff] text-[#318ee8]"
                    : "text-[#6f7893] hover:bg-[#f3f9ff] hover:text-[#202b50]",
                )}
              >
                {link.label}

                {active && (
                  <span className="absolute -bottom-[9px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#48a9f8]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Temporary Button */}
        <Link href="/wishes">
          <Button className="hidden bg-gradient-to-r from-[#f493c2] to-[#48a9f8] text-white shadow-md hover:opacity-90 md:inline-flex">
            Send Wishes
          </Button>
        </Link> 
      </div>
    </nav>
  );
}