"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/context/LanguageProvider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export default function LanguageSwitcher({
  compact = false,
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#dceaf5] bg-white/90 p-1 shadow-sm",
        className,
      )}
      role="group"
      aria-label="Choose language"
    >
      {!compact && (
        <Languages
          size={16}
          className="ml-2 shrink-0 text-[#6f7893]"
          aria-hidden="true"
        />
      )}

      <div className="relative grid grid-cols-2 rounded-full bg-[#f3f9ff] p-1">
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-[#48a9f8] shadow-sm transition-transform duration-300 ease-out",
            language === "ja"
              ? "translate-x-[calc(100%+4px)]"
              : "translate-x-0",
          )}
        />

        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "relative z-10 min-w-11 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300",
            language === "en"
              ? "text-white"
              : "text-[#687084] hover:text-[#202b50]",
          )}
          aria-pressed={language === "en"}
        >
          EN
        </button>

        <button
          type="button"
          onClick={() => setLanguage("ja")}
          className={cn(
            "relative z-10 min-w-16 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300",
            language === "ja"
              ? "text-white"
              : "text-[#687084] hover:text-[#202b50]",
          )}
          aria-pressed={language === "ja"}
        >
          日本語
        </button>
      </div>
    </div>
  );
}