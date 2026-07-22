"use client";

import { FaTwitch, FaYoutube } from "react-icons/fa";

import { socials } from "@/data/Socials";
import { useLanguage } from "@/context/LanguageProvider";

type ActiveStream = {
  platform: "youtube" | "twitch";
  title: string;
};

type LiveStatusContentProps = {
  activeStream: ActiveStream | null;
};

export default function LiveStatusContent({
  activeStream,
}: LiveStatusContentProps) {
  const { t } = useLanguage();
  const isLive = Boolean(activeStream);

  return (
    <section
      className={
        isLive
          ? "rounded-3xl border border-[#f6cfe1] bg-white/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md"
          : "rounded-3xl border border-[#48a9f8]/15 bg-white/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md"
      }
    >
      <p
        className={
          isLive
            ? "text-xs font-semibold uppercase tracking-[0.3em] text-[#fa64ad]"
            : "text-xs font-semibold uppercase tracking-[0.3em] text-[#48a9f8]"
        }
      >
        {t.liveStatus.label}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          {isLive && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f493c2] opacity-60" />
          )}

          <span
            className={
              isLive
                ? "relative inline-flex h-3 w-3 rounded-full bg-[#f493c2]"
                : "relative inline-flex h-3 w-3 rounded-full bg-[#48a9f8]"
            }
          />
        </span>

        <h2 className="text-3xl font-bold tracking-tight text-[#202b50]">
          {isLive ? t.liveStatus.online : t.liveStatus.offline}
        </h2>
      </div>

      {activeStream ? (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#394360]">
            {activeStream.platform === "youtube" ? (
              <FaYoutube className="text-red-400" />
            ) : (
              <FaTwitch className="text-purple-400" />
            )}

            <span>
              {t.liveStatus.liveNowOn}{" "}
              {activeStream.platform === "youtube" ? "YouTube" : "Twitch"}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6f7893]">
            {activeStream.title}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-[#6f7893]">
          {t.liveStatus.offlineDescription}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {socials.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#48a9f8]/15 bg-[#f3f9ff]/80 text-[#67b2fd] transition hover:-translate-y-0.5 hover:border-[#48a9f8]/40 hover:bg-[#48a9f8]/15 hover:text-[#48a9f8]"
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </section>
  );
}