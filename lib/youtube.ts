import type {
  ChannelStatistics,
  UpcomingStream,
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
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        maxres?: {
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
  }>;
}

interface YouTubeVideoResponse {
  items?: Array<{
    liveStreamingDetails?: {
      scheduledStartTime?: string;
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

export async function getUpcomingStream(): Promise<UpcomingStream | null> {
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
      eventType: "upcoming",
      type: "video",
      order: "date",
      maxResults: "1",
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

    const searchResult = searchData.items?.[0];
    const videoId = searchResult?.id.videoId;

    if (!searchResult || !videoId) {
      return null;
    }

    const videoParams = new URLSearchParams({
      part: "liveStreamingDetails",
      id: videoId,
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

    const scheduledStartTime =
      videoData.items?.[0]?.liveStreamingDetails?.scheduledStartTime;

    if (!scheduledStartTime) {
      return null;
    }

    const thumbnails = searchResult.snippet.thumbnails;

    const thumbnail =
      thumbnails.maxres?.url ??
      thumbnails.high?.url ??
      thumbnails.medium?.url ??
      thumbnails.default?.url ??
      "";

    return {
      videoId,
      title: decodeYouTubeText(searchResult.snippet.title),
      description: decodeYouTubeText(searchResult.snippet.description),
      thumbnail,
      scheduledStartTime,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("Unable to retrieve the upcoming stream:", error);
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