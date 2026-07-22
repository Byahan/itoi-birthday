"use client";

import { useLanguage } from "@/context/LanguageProvider";

interface TimelineTextProps {
  en: string;
  ja: string;
}

export default function TimelineText({
  en,
  ja,
}: TimelineTextProps) {
  const { language } = useLanguage();

  return <>{language === "ja" ? ja || en : en}</>;
}