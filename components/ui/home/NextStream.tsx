import Image from "next/image";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Radio,
} from "lucide-react";

import { FaTwitch, FaYoutube } from "react-icons/fa";
import { getActiveStream } from "@/lib/streaming";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentOrUpcomingStream } from "@/lib/youtube";

const activeStream = await getActiveStream();
const youtubeStream = await getCurrentOrUpcomingStream();

const livePlatform = activeStream?.platform;
const isLive = Boolean(activeStream);

function formatStreamDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(dateString));
}

function formatStreamTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }).format(new Date(dateString));
}

export default async function NextStream() {
  const [activeStream, youtubeStream] = await Promise.all([
    getActiveStream(),
    getCurrentOrUpcomingStream(),
  ]);

  const isLive = Boolean(activeStream);

  if (!activeStream && !youtubeStream) {
    return (
      <section className="rounded-3xl border border-[#48a9f8]/15 bg-[#ffffff]/80 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#48a9f8]">
          Next Stream
        </p>

        <h3 className="mt-4 text-2xl font-bold text-[#202b50]">
          No stream scheduled
        </h3>
      </section>
    );
  }

  const title = activeStream?.title ?? youtubeStream!.title;
  const thumbnail =
    activeStream?.thumbnail ?? youtubeStream!.thumbnail;
  const url = activeStream?.url ?? youtubeStream!.url;

  return (
    <article
      className={
        isLive
          ? "overflow-hidden rounded-3xl border border-[#f6cfe1] bg-white/90 shadow-[0_18px_50px_rgba(66,103,145,0.10)]"
          : "overflow-hidden rounded-3xl border border-[#dceaf5] bg-white/90 shadow-[0_18px_50px_rgba(66,103,145,0.10)]"
      }
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video overflow-hidden"
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t"/>

        <span
          className={
            isLive
              ? "absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold uppercase text-white"
              : "absolute left-4 top-4 rounded-full border border-[#dceaf5] bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase text-[#48a9f8] backdrop-blur-md"
          }
        >
          {isLive ? "LIVE" : "Next Stream"}
        </span>
      </a>

      <div className="p-6">
        {isLive && activeStream && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#394360]">
            {activeStream.platform === "youtube" ? (
              <FaYoutube />
            ) : (
              <FaTwitch className="text-purple-400" />
            )}

            <span>
              Live on{" "}
              {activeStream.platform === "youtube"
                ? "YouTube"
                : "Twitch"}
            </span>
          </div>
        )}

        <h3 className="mt-3 line-clamp-2 text-xl font-bold text-[#202b50]">
          {title}
        </h3>

        {!isLive && youtubeStream?.scheduledStartTime && (
          <div className="mt-4 space-y-2 text-sm text-[#6f7893]">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#48a9f8]" />
              <span>
                {formatStreamDate(
                  youtubeStream.scheduledStartTime,
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#48a9f8]" />
              <span>
                {formatStreamTime(
                  youtubeStream.scheduledStartTime,
                )}
              </span>
            </div>
          </div>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            isLive
              ? "mt-6 w-full bg-red-500 text-white hover:bg-red-400"
              : "mt-6 w-full bg-[#48a9f8] text-white hover:bg-[#318ee8]",
          )}
        >
          {isLive
            ? `Watch on ${
                activeStream?.platform === "youtube"
                  ? "YouTube"
                  : "Twitch"
              }`
            : "View on YouTube"}

          <ExternalLink size={16} />
        </a>
      </div>
    </article>
  );
}