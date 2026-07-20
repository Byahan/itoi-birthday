import type { NewsMedia } from "@/data/news";

export function getGoogleDriveImageUrl(url: string): string {
  const fileIdMatch =
    url.match(/\/file\/d\/([^/]+)/) ??
    url.match(/[?&]id=([^&]+)/);

  const fileId = fileIdMatch?.[1];

  if (!fileId) {
    return url;
  }

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1).split("/")[0] || null;
    }

    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/shorts/")
    ) {
      return parsedUrl.pathname.split("/")[2] || null;
    }

    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/embed/")
    ) {
      return parsedUrl.pathname.split("/")[2] || null;
    }
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname.startsWith("/live/")
    ) {
      return parsedUrl.pathname.split("/")[2] || null;
    }

    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeVideoId(url);

  return videoId
  ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  : null;
}

export function getTimelineImage(
  imageUrl: string | null,
  youtubeUrl: string | null,
): string | null {
  if (imageUrl) {
    return getGoogleDriveImageUrl(imageUrl);
  }

  if (youtubeUrl) {
    return getYouTubeThumbnail(youtubeUrl);
  }

  return null;
}

export function getNewsMediaThumbnail(media: NewsMedia): string | null {
  switch (media.type) {
    case "image":
      return getGoogleDriveImageUrl(media.url);

    case "youtube":
      return getYouTubeThumbnail(media.url);

    case "x-video":
      // media.url is the thumbnail image
      return getGoogleDriveImageUrl(media.url);

    default:
      return null;
  }
}

export function getNewsMediaTarget(
  media: NewsMedia,
  postUrl: string,
): string {
  switch (media.type) {
    case "image":
      return getGoogleDriveImageUrl(media.url);

    case "youtube":
      return media.url;

    case "x-video":
      return postUrl;

    default:
      return postUrl;
  }
}