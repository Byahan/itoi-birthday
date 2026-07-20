export type NewsMediaType = "image" | "youtube" | "x-video";

export interface NewsMedia {
  type: NewsMediaType;

  /*
   * image:
   *   Google Drive image link or direct image URL
   *
   * youtube:
   *   YouTube video or Shorts URL
   *
   * x-video:
   *   Thumbnail image URL, usually stored on Google Drive
   */
  url: string;
}

export interface NewsPost {
  id: string;

  displayName: string;
  username: string;

  /*
   * Use a Google Drive image link, direct image URL,
   * or a local image such as /images/default-profile.png
   */
  profileImage: string | null;

  text: string;
  date: string;

  /*
   * Original X post URL.
   * X videos will open this URL when clicked.
   */
  url: string;

  media: NewsMedia[];

  published: boolean;
}