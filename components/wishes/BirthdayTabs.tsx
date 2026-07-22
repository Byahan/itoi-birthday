"use client";

import { useState } from "react";
import { MessageCircle, Paintbrush } from "lucide-react";

import DrawingForm from "@/components/wishes/DrawingForm";
import MessageForm from "@/components/wishes/MessageForm";
import { useLanguage } from "@/context/LanguageProvider";

type WishTab = "write" | "draw";

export default function BirthdayTabs() {
  const [activeTab, setActiveTab] =
    useState<WishTab>("write");

  const { t } = useLanguage();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#e3edf6] bg-white/90 shadow-[0_24px_70px_rgba(64,92,130,0.12)] backdrop-blur">
      <div className="grid grid-cols-2 border-b border-[#e3edf6] bg-[#f8fbff] p-2">
        <button
          type="button"
          onClick={() => setActiveTab("write")}
          aria-pressed={activeTab === "write"}
          className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black transition ${
            activeTab === "write"
              ? "bg-white text-[#318ee8] shadow-sm"
              : "text-[#7b839d] hover:text-[#318ee8]"
          }`}
        >
          <MessageCircle size={18} />
          {t.wishes.tabs.message}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("draw")}
          aria-pressed={activeTab === "draw"}
          className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black transition ${
            activeTab === "draw"
              ? "bg-white text-[#e873ad] shadow-sm"
              : "text-[#7b839d] hover:text-[#e873ad]"
          }`}
        >
          <Paintbrush size={18} />
          {t.wishes.tabs.draw}
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "write" ? (
          <MessageForm />
        ) : (
          <DrawingForm />
        )}
      </div>
    </section>
  );
}