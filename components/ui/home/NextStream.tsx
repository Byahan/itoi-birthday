import Image from "next/image";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Radio,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUpcomingStream } from "@/lib/youtube";

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
  const stream = await getUpcomingStream();

  if (!stream) {
    return (
      <section className="rounded-3xl border border-[#79cef2]/15 bg-[#151e26]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md">
        <div className="flex items-center gap-2 text-[#79cef2]">
          <Radio size={16} />

          <p className="text-xs font-semibold uppercase tracking-[0.3em]">
            Next Stream
          </p>
        </div>

        <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#f7fbfd]">
          No stream scheduled
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#9eb0ba]">
          There is currently no upcoming stream listed on Itoi Toi&apos;s
          YouTube channel. Please check again later.
        </p>
      </section>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-[#79cef2]/15 bg-[#151e26]/80 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md">
      <a
        href={stream.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video overflow-hidden"
      >
        <Image
          src={stream.thumbnail}
          alt={stream.title}
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#081017] via-[#081017]/15 to-transparent" />

        <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1117]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e8f8ff] backdrop-blur-md">
          <Radio size={13} className="text-[#79cef2]" />
          Next Stream
        </span>
      </a>

      <div className="p-6">
        <h3 className="line-clamp-2 text-xl font-bold leading-snug text-[#f7fbfd]">
          {stream.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-[#9eb0ba]">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[#79cef2]" />

            <span>
              {formatStreamDate(stream.scheduledStartTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#79cef2]" />

            <span>
              {formatStreamTime(stream.scheduledStartTime)}
            </span>
          </div>
        </div>

        <a
          href={stream.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-6 w-full bg-[#42aee2] text-[#081017] hover:bg-[#79cef2]",
          )}
        >
          View on YouTube
          <ExternalLink size={16} />
        </a>
      </div>
    </article>
  );
}