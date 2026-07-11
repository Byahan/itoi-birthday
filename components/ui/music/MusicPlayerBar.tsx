"use client";

import Image from "next/image";
import {
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";

import { useMusicPlayer } from "./MusicPlayerProvider";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function MusicPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffleEnabled,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    seek,
    setVolume,
    stop,
  } = useMusicPlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#48a9f8]/15 bg-[#f8fbff]/95 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Song progress"
          className="mb-3 h-1 w-full cursor-pointer accent-[#48a9f8]"
        />

        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={currentTrack.cover}
                alt={currentTrack.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold text-[#202b50]">
                {currentTrack.title}
              </p>

              <p className="truncate text-sm text-[#6f7893]">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggleShuffle}
                aria-label={
                    shuffleEnabled ? "Disable shuffle" : "Enable shuffle"
                }
                title={
                    shuffleEnabled ? "Shuffle enabled" : "Shuffle disabled"
                }
                className={
                    shuffleEnabled
                    ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#48a9f8]/15 text-[#48a9f8] transition"
                    : "flex h-10 w-10 items-center justify-center rounded-full text-[#b9ddec] transition hover:bg-white/5 hover:text-[#48a9f8]"
                }
                >
                <Shuffle size={18} />
            </button>
            
            <button
              type="button"
              onClick={playPrevious}
              aria-label="Previous song"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#b9ddec] hover:bg-white/5 hover:text-[#48a9f8]"
            >
              <SkipBack size={19} />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause song" : "Play song"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#48a9f8] text-[#081017] hover:bg-[#48a9f8]"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              type="button"
              onClick={playNext}
              aria-label="Next song"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#aedcef] hover:bg-white/5 hover:text-[#48a9f8]"
            >
              <SkipForward size={19} />
            </button>
          </div>

          <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
            <span className="text-xs text-[#6f7893]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center gap-2">
              <Volume2 size={17} className="text-[#6f7893]" />

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) =>
                  setVolume(Number(event.target.value))
                }
                aria-label="Volume"
                className="h-1 w-24 cursor-pointer accent-[#48a9f8]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={stop}
            aria-label="Close music player"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6f7893] hover:bg-white/5 hover:text-[#45c5fa]"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}