export function getGoogleDriveImageUrl(url: string): string {
  const fileIdMatch =
    url.match(/\/file\/d\/([^/]+)/) ??
    url.match(/[?&]id=([^&]+)/);

  const fileId = fileIdMatch?.[1];

  if (!fileId) {
    return url;
  }

  return `https://lh3.googleusercontent.com/d/${fileId}`;
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

    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeVideoId(url);

  return videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
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