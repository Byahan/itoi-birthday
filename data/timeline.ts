export type TimelineCategory =
  | "debut"
  | "milestone"
  | "music"
  | "costume"
  | "event";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: TimelineCategory;
  imageUrl: string | null;
  youtubeUrl: string | null;
  externalUrl: string | null;
}