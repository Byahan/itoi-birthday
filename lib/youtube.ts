import type {
  ChannelStatistics,
  YouTubeStream,
} from "@/types/youtube";

import { getArchiveCategoryOverrides } from "@/lib/archiveCategories";

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

interface YouTubeArchiveMetadataResponse {
  items?: Array<{
    id: string;

    contentDetails?: {
      duration?: string;
    };

    liveStreamingDetails?: {
      actualStartTime?: string;
      actualEndTime?: string;
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

import type { ArchiveVideo } from "@/types/archive";

interface YouTubeUploadsPlaylistResponse {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
}

interface YouTubePlaylistItemsResponse {
  nextPageToken?: string;

  items?: Array<{
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;

      resourceId?: {
        videoId?: string;
      };

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
  }>;
}

async function getUploadsPlaylistId(): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error(
      "YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID is missing.",
    );

    return null;
  }

  const params = new URLSearchParams({
    part: "contentDetails",
    id: channelId,
    key: apiKey,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${params}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    console.error(
      "YouTube uploads playlist request failed:",
      response.status,
      await response.text(),
    );

    return null;
  }

  const data =
    (await response.json()) as YouTubeUploadsPlaylistResponse;

  return (
    data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ??
    null
  );
}

function parseYouTubeDuration(duration?: string): number {
  if (!duration) {
    return 0;
  }

  const match = duration.match(
    /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/,
  );

  if (!match) {
    return 0;
  }

  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);

  return (
    days * 86400 +
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

export async function getArchiveVideos(): Promise<ArchiveVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("YOUTUBE_API_KEY is missing.");
    return [];
  }

  try {
    const uploadsPlaylistId = await getUploadsPlaylistId();

    if (!uploadsPlaylistId) {
      return [];
    }

    const categoryOverrides =
      await getArchiveCategoryOverrides();

    const playlistVideos: ArchiveVideo[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: "50",
        key: apiKey,
      });

      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
        {
          next: {
            revalidate: 600,
          },
        },
      );

      if (!response.ok) {
        console.error(
          "YouTube archive request failed:",
          response.status,
          await response.text(),
        );

        break;
      }

      const data =
        (await response.json()) as YouTubePlaylistItemsResponse;

      const pageVideos = (data.items ?? [])
        .map((item): ArchiveVideo | null => {
          const snippet = item.snippet;
          const videoId = snippet?.resourceId?.videoId;

          if (!snippet || !videoId) {
            return null;
          }

          const thumbnails = snippet.thumbnails;

          const thumbnail =
            thumbnails?.maxres?.url ??
            thumbnails?.standard?.url ??
            thumbnails?.high?.url ??
            thumbnails?.medium?.url ??
            thumbnails?.default?.url ??
            "";

          const video: ArchiveVideo = {
            videoId,
            title: decodeYouTubeText(
              snippet.title ?? "Untitled Video",
            ),
            description: decodeYouTubeText(
              snippet.description ?? "",
            ),
            publishedAt: snippet.publishedAt ?? "",
            thumbnail,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            categories: ["video"],
            durationSeconds: 0,
            timestamps: [],
          };

          return video;
        })
        .filter(
          (video): video is ArchiveVideo =>
            video !== null &&
            video.title !== "Deleted video" &&
            video.title !== "Private video",
        );

      playlistVideos.push(...pageVideos);
      pageToken = data.nextPageToken;
    } while (pageToken);

    const metadataById = new Map<
      string,
      {
        durationSeconds: number;
        isStream: boolean;
      }
    >();

    for (
      let index = 0;
      index < playlistVideos.length;
      index += 50
    ) {
      const batch = playlistVideos.slice(index, index + 50);
      const videoIds = batch.map((video) => video.videoId);

      const params = new URLSearchParams({
        part: "contentDetails,liveStreamingDetails",
        id: videoIds.join(","),
        key: apiKey,
      });

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?${params}`,
        {
          next: {
            revalidate: 600,
          },
        },
      );

      if (!response.ok) {
        console.error(
          "YouTube metadata request failed:",
          response.status,
          await response.text(),
        );

        continue;
      }

      const data =
        (await response.json()) as YouTubeArchiveMetadataResponse;

      for (const item of data.items ?? []) {
        const durationSeconds = parseYouTubeDuration(
          item.contentDetails?.duration,
        );

        const isStream = Boolean(
          item.liveStreamingDetails?.actualStartTime ||
            item.liveStreamingDetails?.actualEndTime ||
            item.liveStreamingDetails?.scheduledStartTime,
        );

        metadataById.set(item.id, {
          durationSeconds,
          isStream,
        });
      }
    }

    return playlistVideos.map((video) => {
      const metadata = metadataById.get(video.videoId);

      const durationSeconds =
        metadata?.durationSeconds ?? 0;

      let categories: ArchiveVideo["categories"] = [
        "video",
      ];

      const normalizedText =
        `${video.title} ${video.description}`.toLowerCase();

      // const hasShortKeyword =
      //   normalizedText.includes("#shorts") ||
      //   normalizedText.includes("#short") ||
      //   normalizedText.includes("youtube shorts");

      const hasStreamKeyword =
        normalizedText.includes("live stream") ||
        normalizedText.includes("livestream") ||
        normalizedText.includes("配信") ||
        normalizedText.includes("生放送");

      const looksLikeShort =
        durationSeconds > 0 &&
        durationSeconds <= 180;

      const looksLikeStream =
        Boolean(metadata?.isStream) &&
        (
          durationSeconds >= 1200 ||
          hasStreamKeyword
        );

      if (looksLikeStream) {
        categories = ["stream"];
      } else if (looksLikeShort) {
        categories = ["short"];
      }

      /*
      * A Google Sheets row completely replaces
      * the automatic category.
      */
      const sheetOverride =
        categoryOverrides.get(video.videoId);

      if (sheetOverride?.categories.length) {
        categories = sheetOverride.categories;
      }

      const timestamps =
        sheetOverride?.timestamps ?? [];

      return {
        ...video,
        categories,
        durationSeconds,
        timestamps,
      };
    });
  } catch (error) {
    console.error("Unable to retrieve archive videos:", error);
    return [];
  }
}