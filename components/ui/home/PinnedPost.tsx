import Image from "next/image";
import { ExternalLink, Pin } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

import { pinnedPost } from "@/data/pinnedPost";

function getImageGridClass(imageCount: number): string {
  if (imageCount === 1) {
    return "grid-cols-1";
  }

  return "grid-cols-2";
}

function getImageWrapperClass(
  imageCount: number,
  index: number,
): string {
  if (imageCount === 1) {
    return "aspect-video";
  }

  if (imageCount === 2) {
    return "aspect-[4/5]";
  }

  if (imageCount === 3 && index === 0) {
    return "row-span-2 aspect-auto min-h-[320px]";
  }

  return "aspect-square";
}

export default function PinnedPost() {
  const images = pinnedPost.images ?? [];
  const visibleImages = images.slice(0, 4);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#cfe5f6] bg-[#f5f6ff]/90 shadow-[0_18px_50px_rgba(66,103,145,0.10)] transition duration-300 hover:-translate-y-1 hover:border-[#48a9f8]/30">
      <div className="flex flex-1 flex-col p-6">
        {/* Profile header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#48a9f8]/20">
              <Image
                src={pinnedPost.profileImage}
                alt={pinnedPost.displayName}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold text-[#202b50]">
                {pinnedPost.displayName}
              </p>

              <p className="truncate text-sm text-[#6f7893]">
                {pinnedPost.username}
              </p>
            </div>
          </div>

          <FaXTwitter
            size={20}
            className="shrink-0 text-[#48a9f8]"
          />
        </div>

        {/* Pinned label */}
        <div className="mt-5 flex items-center gap-2 text-[#23b0ff]">
          <Pin size={14} />

          <p className="text-xs font-semibold uppercase tracking-[0.22em]">
            Pinned Post
          </p>
        </div>

        {/* Post text */}
        <div className="relative mt-4 max-h-[250px] overflow-hidden">
          <p className="whitespace-pre-line text-sm leading-7 text-[#394360]">
            {pinnedPost.text}
          </p>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t" />
        </div>

        {/* Post images */}
        {visibleImages.length > 0 && (
          <div
            className={`mt-5 grid overflow-hidden rounded-2xl border border-[#48a9f8]/10 ${getImageGridClass(
              visibleImages.length,
            )}`}
          >
            {visibleImages.map((image, index) => {
              const remainingImages =
                images.length > 4 && index === 3
                  ? images.length - 4
                  : 0;

              return (
                <a
                  key={`${image}-${index}`}
                  href={pinnedPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden bg-[#f8fbff] ${
                    visibleImages.length > 1
                      ? "border border-[#48a9f8]/5"
                      : ""
                  } ${getImageWrapperClass(
                    visibleImages.length,
                    index,
                  )}`}
                >
                  <Image
                    src={image}
                    alt={`Pinned post image ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 17vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                  {remainingImages > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <span className="text-2xl font-bold text-white">
                        +{remainingImages}
                      </span>
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-6">
          <p className="text-xs text-[#728792]">
            {pinnedPost.date}
          </p>

          <a
            href={pinnedPost.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#23ceff]/20 bg-[#f3f9ff]/70 px-5 text-sm font-semibold text-[#23a7ff] transition hover:border-[#23baff]/40 hover:bg-[#62d5ff]/15 hover:text-[#239dff]"
          >
            View on X
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}