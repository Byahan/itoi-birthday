import Image from "next/image";
import {
  CalendarDays,
  Flag,
  Medal,
  Music2,
  Shirt,
  Sparkles,
} from "lucide-react";

import type { TimelineEvent } from "@/data/timeline";
import { getTimelineEvents } from "@/lib/timeline";
import { getTimelineImage } from "@/lib/media";

function getCategoryAppearance(category: TimelineEvent["category"]) {
  switch (category) {
    case "debut":
      return {
        icon: Flag,
        iconClass: "bg-[#ffe3f0] text-[#f493c2]",
        dotClass: "bg-[#f493c2]",
      };

    case "music":
      return {
        icon: Music2,
        iconClass: "bg-[#dff1ff] text-[#318ee8]",
        dotClass: "bg-[#48a9f8]",
      };

    case "costume":
      return {
        icon: Shirt,
        iconClass: "bg-[#fff0f7] text-[#ed78b2]",
        dotClass: "bg-[#f493c2]",
      };

    case "milestone":
      return {
        icon: Medal,
        iconClass: "bg-[#eef8ff] text-[#318ee8]",
        dotClass: "bg-[#48a9f8]",
      };

    default:
      return {
        icon: Sparkles,
        iconClass: "bg-[#f1f6ff] text-[#536da5]",
        dotClass: "bg-[#8195bf]",
      };
  }
}

export default async function ProfileTimeline() {
  const timelineEvents = await getTimelineEvents();

  return (
    <section>
      <header className="max-w-2xl">
        <div className="flex items-center gap-2 text-[#48a9f8]">
          <CalendarDays size={18} />

          <p className="text-sm font-semibold uppercase tracking-[0.3em]">
            Timeline
          </p>
        </div>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-[#202b50]">
          Itoi Toi Timeline
        </h2>
      </header>

      {timelineEvents.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-[#dceaf5] bg-white/90 p-8 text-center shadow-[0_14px_40px_rgba(66,103,145,0.08)]">
          <p className="font-bold text-[#202b50]">
            No timeline events available
          </p>

          <p className="mt-2 text-sm text-[#6f7893]">
            Timeline entries will appear here after they are added to Google
            Sheets.
          </p>
        </div>
      ) : (
        <div className="relative mt-10">
          {/* Vertical timeline line */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-[#cccccc] lg:left-1/2 lg:-translate-x-1/2" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => {
                const appearance = getCategoryAppearance(event.category);
                const Icon = appearance.icon;

                const mediaUrl = getTimelineImage(
                    event.imageUrl,
                    event.youtubeUrl,
                );

                const destinationUrl =
                    event.externalUrl ?? event.youtubeUrl;

                const isLeft = index % 2 === 0;

                const cardContent = (
                <div
                    className={`rounded-3xl border p-4 shadow-[0_12px_35px_rgba(66,103,145,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(66,103,145,0.11)] ${
                    event.category === "debut"
                        ? "border-[#f6cfe1] bg-[#fff7fb]"
                        : event.category === "music"
                        ? "border-[#dceaf5] bg-[#f8fcff]"
                        : event.category === "costume"
                            ? "border-[#f4dce8] bg-[#fff9fd]"
                            : "border-[#dceaf5] bg-white/90"
                    }`}
                >
                    {/* Small image above the text */}
                    {mediaUrl && (
                    <div className="relative mb-4 h-67 w-full overflow-hidden rounded-2xl bg-[#f3f9ff]">
                        <Image
                        src={mediaUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 480px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                        />
                    </div>
                    )}

                    {/* Event content */}
                    <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${appearance.iconClass}`}
                        >
                        <Icon size={14} />
                        </span>

                        <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${appearance.iconClass}`}
                        >
                        {event.category}
                        </span>
                    </div>

                    <h3 className="mt-3 text-lg font-black leading-snug text-[#202b50]">
                        {event.title}
                    </h3>

                    {event.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6f7893]">
                        {event.description}
                        </p>
                    )}

                    {destinationUrl && (
                        <span className="mt-3 inline-flex text-sm font-semibold text-[#318ee8]">
                        View event →
                        </span>
                    )}
                    </div>
                </div>
                );

                return (
                    <article
                    key={event.id}
                    className="relative pl-12 lg:grid lg:grid-cols-12 lg:pl-0"
                    >
                    {/* Mobile/tablet */}
                    <div className="lg:hidden">
                        <p className="mb-3 text-sm font-bold text-[#318ee8]">
                        {event.date}
                        </p>

                        {destinationUrl ? (
                        <a
                            href={destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                        >
                            {cardContent}
                        </a>
                        ) : (
                        cardContent
                        )}
                    </div>

                    {/* Desktop left card */}
                    {isLeft && (
                        <div className="hidden lg:col-span-5 lg:block">
                        <p className="mb-3 text-right text-sm font-bold text-[#318ee8]">
                            {event.date}
                        </p>

                        {destinationUrl ? (
                            <a
                            href={destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                            >
                            {cardContent}
                            </a>
                        ) : (
                            cardContent
                        )}
                        </div>
                    )}

                    {/* Center timeline space */}
                    <div className="hidden lg:col-span-2 lg:block" />

                    {/* Desktop right card */}
                    {!isLeft && (
                        <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
                        <p className="mb-3 text-sm font-bold text-[#318ee8]">
                            {event.date}
                        </p>

                        {destinationUrl ? (
                            <a
                            href={destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                            >
                            {cardContent}
                            </a>
                        ) : (
                            cardContent
                        )}
                        </div>
                    )}

                    {/* Timeline marker */}
                    <div className="absolute left-[14px] top-1 lg:left-1/2 lg:-translate-x-1/2">
                        <div
                        className={`relative z-10 h-3 w-3 rounded-full ring-4 ring-[#e5e5e5] ${appearance.dotClass}`}
                        />
                    </div>
                    </article>
                );
                })}
          </div>
        </div>
      )}
    </section>
  );
}