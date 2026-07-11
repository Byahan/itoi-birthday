export interface YouTubeStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  status: "live" | "upcoming";
  scheduledStartTime: string | null;
  actualStartTime: string | null;
}

export interface ChannelStatistics {
  subscriberCount: number | null;
  videoCount: number;
}