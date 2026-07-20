import Papa from "papaparse";

import type {
  NewsMedia,
  NewsMediaType,
  NewsPost,
} from "@/data/news";

type NewsSheetRow = {
  id?: string;

  displayName?: string;
  username?: string;
  profileImage?: string;

  text?: string;
  date?: string;
  url?: string;

  media1?: string;
  media1Type?: string;

  media2?: string;
  media2Type?: string;

  media3?: string;
  media3Type?: string;

  media4?: string;
  media4Type?: string;

  published?: string | boolean;
};

const VALID_MEDIA_TYPES: NewsMediaType[] = [
  "image",
  "youtube",
  "x-video",
];

function cleanValue(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeUsername(username: string): string {
  const cleanedUsername = cleanValue(username);

  if (!cleanedUsername) {
    return "";
  }

  return cleanedUsername.startsWith("@")
    ? cleanedUsername
    : `@${cleanedUsername}`;
}

function normalizeMediaType(value: unknown): NewsMediaType | null {
  const normalized = cleanValue(value).toLowerCase();

  if (VALID_MEDIA_TYPES.includes(normalized as NewsMediaType)) {
    return normalized as NewsMediaType;
  }

  return null;
}

function isPublished(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = cleanValue(value).toLowerCase();

  return ["true", "yes", "1", "published"].includes(normalized);
}

function createMediaArray(row: NewsSheetRow): NewsMedia[] {
  const mediaItems = [
    {
      url: row.media1,
      type: row.media1Type,
    },
    {
      url: row.media2,
      type: row.media2Type,
    },
    {
      url: row.media3,
      type: row.media3Type,
    },
    {
      url: row.media4,
      type: row.media4Type,
    },
  ];

  return mediaItems.flatMap((item): NewsMedia[] => {
    const url = cleanValue(item.url);
    const type = normalizeMediaType(item.type);

    if (!url || !type) {
      return [];
    }

    return [
      {
        type,
        url,
      },
    ];
  });
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const sheetUrl = process.env.NEWS_SHEET_CSV_URL;

  if (!sheetUrl) {
    console.error(
      "NEWS_SHEET_CSV_URL is missing from your environment variables.",
    );

    return [];
  }

  try {
    const response = await fetch(sheetUrl, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch News sheet: ${response.status} ${response.statusText}`,
      );
    }

    const csv = await response.text();

    const parsed = Papa.parse<NewsSheetRow>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error("News sheet parsing errors:", parsed.errors);
    }

    return parsed.data
      .filter((row) => isPublished(row.published))
      .map((row, index): NewsPost => {
        const id = cleanValue(row.id) || `news-${index + 1}`;

        return {
          id,
          displayName:
            cleanValue(row.displayName) || "Unknown account",

          username:
            normalizeUsername(row.username ?? "") || "@unknown",

          profileImage:
            cleanValue(row.profileImage) || null,

          text: cleanValue(row.text),
          date: cleanValue(row.date),
          url: cleanValue(row.url),

          media: createMediaArray(row),

          published: true,
        };
      })
    .sort(
        (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Unable to load News posts:", error);

    return [];
  }
}