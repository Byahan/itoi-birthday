import Papa from "papaparse";

import type {
  TimelineCategory,
  TimelineEvent,
} from "@/data/timeline";

interface TimelineSheetRow {
  id?: string;
  date?: string;

  title_en?: string;
  title_ja?: string;

  description_en?: string;
  description_ja?: string;

  category?: string;

  imageUrl?: string;
  youtubeUrl?: string;
  externalUrl?: string;
}

const validCategories: TimelineCategory[] = [
  "debut",
  "milestone",
  "music",
  "costume",
  "event",
];

function normalizeCategory(value?: string): TimelineCategory {
  const category = value?.trim().toLowerCase();

  return validCategories.includes(category as TimelineCategory)
    ? (category as TimelineCategory)
    : "event";
}

function emptyToNull(value?: string): string | null {
  const cleaned = value?.trim();

  return cleaned ? cleaned : null;
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const csvUrl = process.env.TIMELINE_SHEET_CSV_URL;

  if (!csvUrl) {
    console.error(
      "TIMELINE_SHEET_CSV_URL is missing from .env.local.",
    );

    return [];
  }

  try {
    const response = await fetch(csvUrl, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      console.error(
        "Timeline sheet request failed:",
        response.status,
        await response.text(),
      );

      return [];
    }

    const csv = await response.text();

    const result = Papa.parse<TimelineSheetRow>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      console.error("Timeline CSV parsing errors:", result.errors);
    }

  return result.data
    .filter(
      (row) =>
        row.title_en?.trim() ||
        row.title_ja?.trim()
    )
    .map((row, index) => ({
      id: row.id?.trim() || `timeline-${index}`,
      date: row.date?.trim() || "",

      titleEn:
        row.title_en?.trim() ||
        row.title_ja?.trim() ||
        "Untitled Event",

      titleJa:
        row.title_ja?.trim() || "",

      descriptionEn:
        row.description_en?.trim() || "",

      descriptionJa:
        row.description_ja?.trim() || "",

      category: normalizeCategory(row.category),
      imageUrl: emptyToNull(row.imageUrl),
      youtubeUrl: emptyToNull(row.youtubeUrl),
      externalUrl: emptyToNull(row.externalUrl),
    }));
  } catch (error) {
    console.error("Unable to load timeline events:", error);
    return [];
  }
}