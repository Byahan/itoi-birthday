"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { MusicTrack } from "@/data/music";
import { musicTracks } from "@/data/music";

interface MusicPlayerContextValue {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffleEnabled: boolean;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
}

const MusicPlayerContext =
  createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<MusicTrack | null>(null);

  const [currentTrack, setCurrentTrack] =
    useState<MusicTrack | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  function toggleShuffle() {
    setShuffleEnabled((current) => !current);
  }

  function updateCurrentTrack(track: MusicTrack | null) {
    currentTrackRef.current = track;
    setCurrentTrack(track);
  }

  function loadAndPlay(track: MusicTrack) {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio player has not been initialized.");
      return;
    }

    updateCurrentTrack(track);

    audio.pause();
    audio.src = track.audio;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.load();

    setCurrentTime(0);
    setDuration(0);

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Unable to play audio:", error);
        setIsPlaying(false);
      });
  }

function getAdjacentTrack(direction: "next" | "previous") {
  const activeTrack = currentTrackRef.current;

  if (!activeTrack || musicTracks.length === 0) {
    return null;
  }

  const currentIndex = musicTracks.findIndex(
    (track) => track.id === activeTrack.id,
  );

  if (currentIndex === -1) {
    return musicTracks[0];
  }

  if (shuffleEnabled && musicTracks.length > 1) {
    const availableTracks = musicTracks.filter(
      (track) => track.id !== activeTrack.id,
    );

    const randomIndex = Math.floor(
      Math.random() * availableTracks.length,
    );

    return availableTracks[randomIndex];
  }

  if (direction === "next") {
    return musicTracks[(currentIndex + 1) % musicTracks.length];
  }

  return musicTracks[
    (currentIndex - 1 + musicTracks.length) % musicTracks.length
  ];
}

  useEffect(() => {
    const audio = new Audio();

    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;

    function handleTimeUpdate() {
      setCurrentTime(audio.currentTime);
    }

    function handleLoadedMetadata() {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleEnded() {
      const nextTrack = getAdjacentTrack("next");

      if (nextTrack) {
        loadAndPlay(nextTrack);
      }
    }

    function handleError() {
      console.error(
        "Audio file failed to load:",
        audio.currentSrc || audio.src,
        audio.error,
      );

      setIsPlaying(false);
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();

      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);

      audioRef.current = null;
    };
  }, []);

  function playTrack(track: MusicTrack) {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio player is unavailable.");
      return;
    }

    if (currentTrackRef.current?.id === track.id) {
      togglePlay();
      return;
    }

    loadAndPlay(track);
  }

  function togglePlay() {
    const audio = audioRef.current;

    if (!audio || !currentTrackRef.current) {
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Unable to resume audio:", error);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
    }
  }

  function playNext() {
    const nextTrack = getAdjacentTrack("next");

    if (nextTrack) {
      loadAndPlay(nextTrack);
    }
  }

  function playPrevious() {
    const previousTrack = getAdjacentTrack("previous");

    if (previousTrack) {
      loadAndPlay(previousTrack);
    }
  }

  function seek(time: number) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const safeTime = Math.max(
      0,
      Math.min(time, Number.isFinite(audio.duration) ? audio.duration : time),
    );

    audio.currentTime = safeTime;
    setCurrentTime(safeTime);
  }

  function setVolume(newVolume: number) {
    const safeVolume = Math.min(1, Math.max(0, newVolume));

    setVolumeState(safeVolume);

    if (audioRef.current) {
      audioRef.current.volume = safeVolume;
    }
  }

  function stop() {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    }

    updateCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffleEnabled,
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        toggleShuffle,
        seek,
        setVolume,
        stop,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error(
      "useMusicPlayer must be used inside MusicPlayerProvider",
    );
  }

  return context;
}