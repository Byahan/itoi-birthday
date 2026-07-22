"use client";

import LanguageSwitcher from "@/components/ui/language/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageProvider";

export default function HeroText() {
  const { t } = useLanguage();

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#48a9f8]">
        {t.hero.subtitle}
      </p>

      <h1 className="mt-5 text-5xl font-black tracking-tight text-[#202b50] sm:text-6xl md:text-8xl">
        {t.hero.title}
      </h1>

      <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-[#6f7893] md:text-lg md:leading-8 lg:mx-0">
        <strong className="font-normal text-[#202b50]">
            {t.hero.description.line1}
        </strong>
        <br />
        <strong className="font-semibold text-[#202b50]">
            {t.hero.description.line2}
        </strong>
      </p>
      
      <div className="mt-6 flex justify-center lg:justify-start">
        <LanguageSwitcher compact />
      </div>
    </>
  );
}