"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { navLinks } from "@/data/NavLinks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Dark background below navbar */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-20 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#dceaf5] bg-white/90 backdrop-blur-xl">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center px-6 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="order-2 text-2xl font-black tracking-tight text-[#202b50] transition-colors hover:text-[#48a9f8] md:order-none md:text-3xl"
            onClick={() => setOpen(false)}
          >
            Itoi Toi
          </Link>

          {/* Desktop navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
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

            <Link href="/wishes">
              <Button className="ml-3 bg-gradient-to-r from-[#f493c2] to-[#48a9f8] text-white shadow-md hover:opacity-90">
                Send Wishes
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="order-1 rounded-xl p-2 text-[#202b50] transition hover:bg-[#f3f9ff] md:order-none md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="relative z-50 border-t border-[#dceaf5] bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "bg-[#dff1ff] text-[#318ee8]"
                        : "text-[#6f7893] hover:bg-[#f3f9ff]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/wishes"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-[#f493c2] to-[#48a9f8] text-white shadow-md hover:opacity-90">
                  Send Wishes
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}