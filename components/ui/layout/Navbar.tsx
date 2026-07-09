import { navLinks } from "@/data/NavLinks";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <a href="#home" className="text-3xl font-black tracking-tight">
          Itoi Toi
        </a>

        <div className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button className="hidden md:inline-flex">
          Send Wishes
        </Button>
      </div>
    </nav>
  );
}