import Papa from "papaparse";

import type {
  ArchiveCategory,
  ArchiveTimestamp,
} from "@/types/archive";

interface ArchiveCategoryRow {
  videoId?: string;
  categories?: string;
  timestamps?: string;
  note?: string;
}

export interface ArchiveOverride {
  categories: ArchiveCategory[];
  timestamps: ArchiveTimestamp[];
}

const validCategories: ArchiveCategory[] = [
  "stream",
  "video",
  "short",
  "music",
  "karaoke",
];

function isArchiveCategory(
  value: string,
): value is ArchiveCategory {
  return validCategories.includes(
    value as ArchiveCategory,
  );
}

function timestampToSeconds(value: string): number | null {
  const parts = value
    .trim()
    .split(":")
    .map((part) => Number.parseInt(part, 10));

  if (
    parts.length === 0 ||
    parts.some((part) => Number.isNaN(part))
  ) {
    return null;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;

    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;

    return minutes * 60 + seconds;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return null;
}

function parseTimestamps(
  value?: string,
): ArchiveTimestamp[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((line) => {
      const separatorIndex = line.lastIndexOf("|");

      if (separatorIndex === -1) {
        return null;
      }

      const label = line
        .slice(0, separatorIndex)
        .trim();

      const timestamp = line
        .slice(separatorIndex + 1)
        .trim();

      const seconds = timestampToSeconds(timestamp);

      if (!label || seconds === null) {
        return null;
      }

      return {
        label,
        seconds,
      };
    })
    .filter(
      (timestamp): timestamp is ArchiveTimestamp =>
        timestamp !== null,
    );
}

export async function getArchiveCategoryOverrides(): Promise<
  Map<string, ArchiveOverride>
> {
  const csvUrl =
    process.env.ARCHIVE_CATEGORY_SHEET_CSV_URL;

  if (!csvUrl) {
    console.error(
      "ARCHIVE_CATEGORY_SHEET_CSV_URL is missing.",
    );

    return new Map();
  }

  try {
    const response = await fetch(csvUrl, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      console.error(
        "Archive category sheet request failed:",
        response.status,
        await response.text(),
      );

      return new Map();
    }

    const csv = await response.text();

    const result = Papa.parse<ArchiveCategoryRow>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      console.error(
        "Archive category CSV errors:",
        result.errors,
      );
    }

    const overrides = new Map<
      string,
      ArchiveOverride
    >();

    for (const row of result.data) {
      const videoId = row.videoId?.trim();

      if (!videoId) {
        continue;
      }

      const categories = (row.categories ?? "")
        .split(",")
        .map((category) =>
          category.trim().toLowerCase(),
        )
        .filter(isArchiveCategory);

      const timestamps = parseTimestamps(
        row.timestamps,
      );

      if (
        categories.length > 0 ||
        timestamps.length > 0
      ) {
        overrides.set(videoId, {
          categories: Array.from(
            new Set(categories),
          ),
          timestamps,
        });
      }
    }

    return overrides;
  } catch (error) {
    console.error(
      "Unable to load archive overrides:",
      error,
    );

    return new Map();
  }
}