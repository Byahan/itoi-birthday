export type ArchiveCategory =
  | "stream"
  | "video"
  | "short"
  | "music"
  | "karaoke";

export interface ArchiveTimestamp {
  label: string;
  seconds: number;
}

export interface ArchiveVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  categories: ArchiveCategory[];
  durationSeconds: number;
  timestamps: ArchiveTimestamp[];
}