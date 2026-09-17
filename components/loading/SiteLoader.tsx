"use client";

import { useEffect, useState } from "react";

const stickers = [
  "/images/toiload1.png",
  "/images/toiload2.png",
  "/images/toiload3.png",
];

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [sticker, setSticker] = useState<string | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    // Pick one sticker once after hydration
    setSticker(
      stickers[Math.floor(Math.random() * stickers.length)]
    );

    // Loading duration: 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Animate the three dots
    const dotTimer = setInterval(() => {
      setActiveDot((current) => (current + 1) % 3);
    }, 450);

    return () => {
      clearTimeout(timer);
      clearInterval(dotTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#f8fbff]">
      <div className="relative flex flex-col items-center">

        {/* Soft blue glow */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#48a9f8]/20 blur-[90px]" />

        {/* Itoi sticker */}
        {sticker && (
          <img
            src={sticker}
            alt="Itoi Toi"
            className="h-52 w-52 object-contain animate-itoi-float sm:h-64 sm:w-64"
          />
        )}

        {/* Loading text */}
        <p className="mt-3 text-sm font-semibold text-[#7b839d]">
          Loading...
        </p>

        {/* Animated dots */}
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                activeDot === dot
                  ? "scale-125 bg-[#48a9f8]"
                  : "bg-[#b9dcf5]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}