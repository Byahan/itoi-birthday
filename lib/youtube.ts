import type {
  ChannelStatistics,
  YouTubeStream,
} from "@/types/youtube";

interface YouTubeChannelResponse {
  items?: Array<{
    statistics?: {
      subscriberCount?: string;
      hiddenSubscriberCount?: boolean;
      videoCount?: string;
    };
  }>;
}

interface YouTubeSearchResponse {
  items?: Array<{
    id: {
      videoId?: string;
    };
  }>;
}

interface YouTubeVideoResponse {
  items?: Array<{
    id: string;

    snippet?: {
      title?: string;
      description?: string;
      liveBroadcastContent?: "live" | "upcoming" | "none";

      thumbnails?: {
        maxres?: {
          url: string;
        };
        standard?: {
          url: string;
        };
        high?: {
          url: string;
        };
        medium?: {
          url: string;
        };
        default?: {
          url: string;
        };
      };
    };

    liveStreamingDetails?: {
      scheduledStartTime?: string;
      actualStartTime?: string;
      actualEndTime?: string;
    };
  }>;
}

function decodeYouTubeText(text: string): string {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export async function getCurrentOrUpcomingStream(): Promise<YouTubeStream | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error(
      "YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID is missing from .env.local.",
    );

    return null;
  }

  try {
    const searchParams = new URLSearchParams({
      part: "snippet",
      channelId,
      type: "video",
      order: "date",
      maxResults: "10",
      key: apiKey,
    });

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${searchParams}`,
      {
        next: {
          revalidate: 600,
        },
      },
    );

    if (!searchResponse.ok) {
      console.error(
        "YouTube search request failed:",
        searchResponse.status,
        await searchResponse.text(),
      );

      return null;
    }

    const searchData =
      (await searchResponse.json()) as YouTubeSearchResponse;

    const videoIds = (searchData.items ?? [])
      .map((item) => item.id.videoId)
      .filter((id): id is string => Boolean(id));

    if (videoIds.length === 0) {
      return null;
    }

    const videoParams = new URLSearchParams({
      part: "snippet,liveStreamingDetails",
      id: videoIds.join(","),
      key: apiKey,
    });

    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${videoParams}`,
      {
        next: {
          revalidate: 600,
        },
      },
    );

    if (!videoResponse.ok) {
      console.error(
        "YouTube video request failed:",
        videoResponse.status,
        await videoResponse.text(),
      );

      return null;
    }

    const videoData =
      (await videoResponse.json()) as YouTubeVideoResponse;

    const videos = videoData.items ?? [];

    const liveVideo = videos.find(
      (video) =>
        video.snippet?.liveBroadcastContent === "live" &&
        Boolean(video.liveStreamingDetails?.actualStartTime) &&
        !video.liveStreamingDetails?.actualEndTime,
    );

    const upcomingVideos = videos
      .filter(
        (video) =>
          video.snippet?.liveBroadcastContent === "upcoming" &&
          Boolean(video.liveStreamingDetails?.scheduledStartTime),
      )
      .sort((first, second) => {
        const firstTime = new Date(
          first.liveStreamingDetails?.scheduledStartTime ?? 0,
        ).getTime();

        const secondTime = new Date(
          second.liveStreamingDetails?.scheduledStartTime ?? 0,
        ).getTime();

        return firstTime - secondTime;
      });

    const selectedVideo = liveVideo ?? upcomingVideos[0];

    if (!selectedVideo?.snippet) {
      return null;
    }

    const thumbnails = selectedVideo.snippet.thumbnails;

    const thumbnail =
      thumbnails?.maxres?.url ??
      thumbnails?.standard?.url ??
      thumbnails?.high?.url ??
      thumbnails?.medium?.url ??
      thumbnails?.default?.url ??
      "";

    const status: YouTubeStream["status"] =
      selectedVideo.snippet.liveBroadcastContent === "live"
        ? "live"
        : "upcoming";

    return {
      videoId: selectedVideo.id,
      title: decodeYouTubeText(
        selectedVideo.snippet.title ?? "Itoi Toi Stream",
      ),
      description: decodeYouTubeText(
        selectedVideo.snippet.description ?? "",
      ),
      thumbnail,
      url: `https://www.youtube.com/watch?v=${selectedVideo.id}`,
      status,
      scheduledStartTime:
        selectedVideo.liveStreamingDetails?.scheduledStartTime ?? null,
      actualStartTime:
        selectedVideo.liveStreamingDetails?.actualStartTime ?? null,
    };
  } catch (error) {
    console.error("Unable to retrieve stream status:", error);
    return null;
  }
}

export async function getChannelStatistics(): Promise<ChannelStatistics | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error(
      "YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID is missing from .env.local.",
    );

    return null;
  }

  try {
    const params = new URLSearchParams({
      part: "statistics",
      id: channelId,
      key: apiKey,
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?${params}`,
      {
        next: {
          revalidate: 600,
        },
      },
    );

    if (!response.ok) {
      console.error(
        "YouTube channel request failed:",
        response.status,
        await response.text(),
      );

      return null;
    }

    const data = (await response.json()) as YouTubeChannelResponse;

    const statistics = data.items?.[0]?.statistics;
    const subscriberCount = statistics?.subscriberCount
      ? parseInt(statistics.subscriberCount, 10)
      : null;
    const videoCount = statistics?.videoCount ? parseInt(statistics.videoCount, 10) : 0;

    return {
      subscriberCount,
      videoCount,
    };
  } catch (error) {
    console.error("Unable to retrieve channel statistics:", error);
    return null;
  }
}