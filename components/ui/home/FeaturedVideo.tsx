"use client";

import Image from "next/image";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

import { featuredVideo } from "@/data/featuredVideo";

export default function FeaturedVideo() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <article className="group overflow-hidden rounded-3xl border border-[#dceaf5] bg-white/90 shadow-[0_18px_50px_rgba(66,103,145,0.10)] transition duration-300 hover:-translate-y-1 hover:border-[#48a9f8]/30">
        <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative block aspect-video w-full overflow-hidden bg-[#f8fbff]"
            aria-label={`Play ${featuredVideo.title}`}
        >
          <Image
            src={featuredVideo.thumbnail}
            alt={featuredVideo.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-contain p-3 transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/35" />

          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#48a9f8] text-[#081017] shadow-lg transition group-hover:scale-110">
            <Play size={25} className="ml-1" />
          </span>
        </button>

        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#48a9f8]">
            Featured Video
          </p>

          <h3 className="mt-3 text-xl font-bold text-[#202b50]">
            {featuredVideo.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#6f7893]">
            {featuredVideo.description}
          </p>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-[#fffff] px-5 text-sm font-semibold text-[#48a9f8] transition hover:border-[#89caff]/40 hover:bg-[#5cb6ff]/15"
          >
            <Play size={17} />
            Watch Video
          </button>
        </div>
      </article>

      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={featuredVideo.title}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-[#48a9f8]/20 bg-[#f8fbff] shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close video player"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              <X size={20} />
            </button>

            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1`}
                title={featuredVideo.title}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#202b50]">
                {featuredVideo.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f7893]">
                {featuredVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}