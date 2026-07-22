export type TimelineCategory =
  | "debut"
  | "milestone"
  | "music"
  | "costume"
  | "event";

export interface TimelineEvent {
  id: string;
  date: string;

  titleEn: string;
  titleJa: string;

  descriptionEn: string;
  descriptionJa: string;

  category: TimelineCategory;

  imageUrl: string | null;
  youtubeUrl: string | null;
  externalUrl: string | null;
}