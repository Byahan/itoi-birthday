"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

import FeatureCard from "./FeatureCard";
import {
  musicTracks,
  type MusicTrack,
} from "@/data/music";
import { useMusicPlayer } from "@/components/ui/music/MusicPlayerProvider";

function getRandomTrack(): MusicTrack | null {
  if (musicTracks.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * musicTracks.length);

  return musicTracks[randomIndex];
}

export default function MusicSpotlight() {
  const [randomTrack, setRandomTrack] =
    useState<MusicTrack | null>(null);

  const {
    currentTrack,
    isPlaying,
    playTrack,
  } = useMusicPlayer();

  // Select a random track when the component first loads.
  useEffect(() => {
    setRandomTrack(getRandomTrack());
  }, []);

  /*
   * When music is already selected, show the active track.
   * Before anything is played, show the randomly selected track.
   */
  const displayTrack =
    currentTrack ??
    randomTrack ??
    musicTracks[0];

  if (!displayTrack) {
    return (
      <div className="rounded-3xl border border-[#79cef2]/15 bg-[#151e26]/80 p-6">
        <h3 className="text-xl font-bold text-[#f7fbfd]">
          Music Spotlight
        </h3>

        <p className="mt-3 text-sm text-[#9eb0ba]">
          No music has been added yet.
        </p>
      </div>
    );
  }

  const isDisplayedTrackPlaying =
    currentTrack?.id === displayTrack.id && isPlaying;

  return (
    <FeatureCard
      title={displayTrack.title}
      description={`Music spotlight by ${displayTrack.artist}.`}
      image={displayTrack.cover}
      action={
        <button
          type="button"
          onClick={() => playTrack(displayTrack)}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#42aee2] px-5 text-sm font-semibold text-[#081017] transition hover:bg-[#79cef2]"
        >
          {isDisplayedTrackPlaying ? (
            <>
              <Pause size={17} />
              Pause
            </>
          ) : (
            <>
              <Play size={17} />
              Play Music
            </>
          )}
        </button>
      }
    />
  );
}