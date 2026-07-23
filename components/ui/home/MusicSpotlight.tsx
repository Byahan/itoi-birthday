"use client";

import Image from "next/image";
import { Music2, Pause, Play, Shuffle } from "lucide-react";

import { musicTracks } from "@/data/music";
import { useMusicPlayer } from "@/components/ui/music/MusicPlayerProvider";

export default function MusicSpotlight() {
  const {
    currentTrack,
    isPlaying,
    shuffleEnabled,
    playTrack,
  } = useMusicPlayer();

  const displayTrack = currentTrack ?? musicTracks[0];

  if (!displayTrack) {
    return (
      <article className="rounded-3xl border border-[#48a9f8]/15 bg-[#ffffff]/80 p-6">
        <h3 className="text-xl font-bold text-[#202b50]">
          Music
        </h3>

        <p className="mt-3 text-sm text-[#6f7893]">
          No songs have been added yet.
        </p>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#dceaf5] bg-[#f7fbff] shadow-[0_18px_50px_rgba(66,103,145,0.10)] transition duration-300 hover:border-[#48a9f8]/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#48a9f8]/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <Music2 size={20} className="text-[#48a9f8]" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#48a9f8]">
              Music
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#202b50]">
              Available Songs
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#48a9f8]/15 bg-[#f3f9ff]/70 px-3 py-1.5 text-xs text-[#038eff]">
          <Shuffle size={13} />

          {shuffleEnabled ? "Shuffle On" : "Sequential"}
        </div>
      </div>

      {/* Featured Album Cover */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={displayTrack.cover}
          alt={displayTrack.title}
          fill
          sizes="(max-width:1024px) 100vw, 400px"
          className="object-cover transition duration-500"
        />
      </div>

      {/* Current Song */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#48a9f8]">
          {currentTrack ? "Now Playing" : "Start Listening"}
        </p>

        <h3 className="mt-2 text-2xl font-black text-[#202b50]">
          {displayTrack.title}
        </h3>

        <p className="mt-1 text-sm text-[#6f7893]">
          {displayTrack.artist}
        </p>
      </div>

      {/* Scrollable song list */}
      <div className="mx-6 mb-6 max-h-[300px] space-y-2 overflow-y-auto pr-2">
        {musicTracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => playTrack(track)}
              className={
                isCurrent
                  ? "flex w-full items-center gap-3 rounded-2xl border border-[#48a9f8]/30 bg-[#48a9f8]/10 p-3 text-left"
                  : "flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition hover:border-[#038eff]/40 hover:bg-[#48a9f8]/15"
              }
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={track.cover}
                  alt={track.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={
                    isCurrent
                      ? "truncate font-semibold text-[#48a9f8]"
                      : "truncate font-semibold text-[#202b50]"
                  }
                >
                  {track.title}
                </p>

                <p className="truncate text-sm text-[#6f7893]">
                  {track.artist}
                </p>
              </div>

              <div
                className={
                  isCurrent
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#48a9f8] text-[#081017]"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f2ff] text-[#45c5fa]"
                }
              >
                {isCurrentPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} className="ml-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </article>
  );
}