"use client";

import {
  MessageCircle,
  Paintbrush,
} from "lucide-react";

import DrawingPreview from "@/components/wishes/DrawingPreview";

import type {
  BirthdayWish,
} from "@/types/birthday";

interface WishCardProps {
  wish: BirthdayWish;
}

function formatWishDate(
  wish: BirthdayWish,
): string {
  if (!wish.createdAt) {
    return "Recently submitted";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(wish.createdAt.toDate());
}

export default function WishCard({
  wish,
}: WishCardProps) {
  const isDrawing =
    wish.type === "drawing";

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#e3edf6] bg-white shadow-[0_16px_45px_rgba(64,92,130,0.09)]">
      {isDrawing &&
        wish.drawing &&
        wish.drawing.length > 0 && (
          <div className="border-b border-[#e3edf6]">
            <DrawingPreview
              drawing={wish.drawing}
              name={wish.name}
            />
          </div>
        )}

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-[#202b50]">
              {wish.name}
            </h3>

            <p className="mt-1 text-xs font-medium text-[#8a91a8]">
              {formatWishDate(wish)}
            </p>
          </div>

          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${
              isDrawing
                ? "bg-[#fff0f7] text-[#df6ca5]"
                : "bg-[#eaf6ff] text-[#318ee8]"
            }`}
          >
            {isDrawing ? (
              <Paintbrush size={13} />
            ) : (
              <MessageCircle size={13} />
            )}

            {isDrawing
              ? "Drawing"
              : "Message"}
          </span>
        </div>

        {!isDrawing && wish.message && (
          <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-[#606b86]">
            {wish.message}
          </p>
        )}

        {isDrawing &&
          (!wish.drawing ||
            wish.drawing.length === 0) && (
            <p className="mt-5 text-sm text-[#8a91a8]">
              This drawing could not be displayed.
            </p>
          )}
      </div>
    </article>
  );
}