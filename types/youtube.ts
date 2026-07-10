export interface UpcomingStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  scheduledStartTime: string;
  url: string;
}

export interface ChannelStatistics {
  subscriberCount: number | null;
  videoCount: number;
}