"use client";

import Image from "next/image";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { ArchiveVideo } from "@/types/archive";

interface ArchiveVideoGridProps {
  videos: ArchiveVideo[];
}

function formatDate(dateString: string): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return [
      hours,
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ].join(":");
  }

  return [
    minutes,
    remainingSeconds.toString().padStart(2, "0"),
  ].join(":");
}

export default function ArchiveVideoGrid({
  videos,
}: ArchiveVideoGridProps) {
  const [selectedVideo, setSelectedVideo] =
    useState<ArchiveVideo | null>(null);

  const [activeStartSeconds, setActiveStartSeconds] =
    useState(0);

  function openVideo(video: ArchiveVideo) {
    setSelectedVideo(video);
    setActiveStartSeconds(0);
  }

  function closeVideo() {
    setSelectedVideo(null);
    setActiveStartSeconds(0);
  }

  useEffect(() => {
    if (!selectedVideo) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeVideo();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVideo]);

  return (
    <>
      <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <article
            key={video.videoId}
            className="group overflow-hidden rounded-3xl border border-[#dceaf5] bg-white/90 shadow-[0_14px_40px_rgba(66,103,145,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[#48a9f8]/40"
          >
            <button
              type="button"
              onClick={() => openVideo(video)}
              aria-label={`Play ${video.title}`}
              className="relative block aspect-video w-full cursor-pointer overflow-hidden bg-[#f3f9ff]"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />

              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#48a9f8] text-white shadow-lg transition group-hover:scale-110">
                <Play size={20} className="ml-0.5" />
              </span>
            </button>

            <div className="p-5">
              <button
                type="button"
                onClick={() => openVideo(video)}
                className="line-clamp-2 text-left text-base font-black leading-6 text-[#202b50] transition hover:text-[#318ee8]"
              >
                {video.title}
              </button>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#7b839d]">
                {formatDate(video.publishedAt)}
              </p>
            </div>
          </article>
        ))}
      </section>

      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#202b50]/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeVideo();
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-white shadow-[0_30px_90px_rgba(32,43,80,0.35)]">
            <button
              type="button"
              onClick={closeVideo}
              aria-label="Close"
              className="absolute -top-14 right-0 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#202b50] shadow-lg transition hover:scale-105 hover:bg-[#f8fbff]"
            >
              <X size={20} />
            </button>

            <div className="aspect-video bg-black">
              <iframe
                key={`${selectedVideo.videoId}-${activeStartSeconds}`}
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&start=${activeStartSeconds}`}
                title={selectedVideo.title}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6 md:p-8">
              <h2 className="pr-12 text-2xl font-black leading-tight text-[#202b50]">
                {selectedVideo.title}
              </h2>

              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#7b839d]">
                {formatDate(selectedVideo.publishedAt)}
              </p>

              {selectedVideo.timestamps.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b839d]">
                    Karaoke Timestamps
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedVideo.timestamps.map((timestamp) => (
                      <button
                        key={`${timestamp.label}-${timestamp.seconds}`}
                        type="button"
                        onClick={() =>
                          setActiveStartSeconds(timestamp.seconds)
                        }
                        className={
                          activeStartSeconds === timestamp.seconds
                            ? "rounded-xl bg-[#48a9f8] px-4 py-2 text-sm font-bold text-white"
                            : "rounded-xl border border-[#dceaf5] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#318ee8] transition hover:border-[#48a9f8]/50 hover:bg-[#dff1ff]"
                        }
                      >
                        {timestamp.label}
                        <span className="ml-2 text-xs opacity-75">
                          {formatTimestamp(timestamp.seconds)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedVideo.description && (
                <p className="mt-5 line-clamp-4 whitespace-pre-line text-sm leading-7 text-[#6f7893]">
                  {selectedVideo.description}
                </p>
              )}

              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#48a9f8] px-5 text-sm font-bold text-white transition hover:bg-[#318ee8]"
              >
                Open on YouTube
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}