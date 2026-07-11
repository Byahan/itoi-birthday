export interface TwitchLiveStream {
  platform: "twitch";
  id: string;
  title: string;
  username: string;
  gameName: string;
  viewerCount: number;
  thumbnail: string;
  url: string;
  startedAt: string;
}