"use client";

import { useLanguage } from "@/context/LanguageProvider";

type TranslateProps = {
  t: string;
  fallback?: string;
};

export default function Translate({
  t: key,
  fallback,
}: TranslateProps) {
  const { t } = useLanguage();

  const value = key
    .split(".")
    .reduce<any>((obj, segment) => obj?.[segment], t);

  return <>{value ?? fallback ?? key}</>;
}