import { getCurrentOrUpcomingStream } from "@/lib/youtube";
import { getTwitchLiveStream } from "@/lib/twitch";

export type ActiveStream =
  | {
      platform: "youtube";
      title: string;
      thumbnail: string;
      url: string;
      startedAt: string | null;
    }
  | {
      platform: "twitch";
      title: string;
      thumbnail: string;
      url: string;
      startedAt: string;
      gameName: string;
      viewerCount: number;
    };

export async function getActiveStream(): Promise<ActiveStream | null> {
  const [youtubeStream, twitchStream] = await Promise.all([
    getCurrentOrUpcomingStream(),
    getTwitchLiveStream(),
  ]);

  if (youtubeStream?.status === "live") {
    return {
      platform: "youtube",
      title: youtubeStream.title,
      thumbnail: youtubeStream.thumbnail,
      url: youtubeStream.url,
      startedAt: youtubeStream.actualStartTime,
    };
  }

  if (twitchStream) {
    return {
      platform: "twitch",
      title: twitchStream.title,
      thumbnail: twitchStream.thumbnail,
      url: twitchStream.url,
      startedAt: twitchStream.startedAt,
      gameName: twitchStream.gameName,
      viewerCount: twitchStream.viewerCount,
    };
  }

  return null;
}