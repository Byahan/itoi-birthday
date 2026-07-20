import {
  ExternalLink,
  Play,
} from "lucide-react";

import type {
  NewsMedia,
  NewsPost,
} from "@/data/news";

import {
  getGoogleDriveImageUrl,
  getNewsMediaTarget,
  getNewsMediaThumbnail,
} from "@/lib/media";

interface NewsCardProps {
  post: NewsPost;
}

interface MediaItemProps {
  media: NewsMedia;
  postUrl: string;
}

function MediaItem({
  media,
  postUrl,
}: MediaItemProps) {
  const thumbnail = getNewsMediaThumbnail(media);
  const targetUrl = getNewsMediaTarget(media, postUrl);

  if (!thumbnail) {
    return null;
  }

  const isVideo =
    media.type === "youtube" ||
    media.type === "x-video";

  return (
    <a
      href={targetUrl || postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full min-h-44 overflow-hidden bg-slate-100"
      aria-label={
        isVideo
          ? "Open video"
          : "Open image"
      }
    >
      <img
        src={thumbnail}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />

      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition group-hover:bg-black/25">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
            <Play
              className="ml-1 h-6 w-6 text-slate-900"
              fill="currentColor"
            />
          </div>
        </div>
      )}
    </a>
  );
}

function NewsMediaGrid({
  post,
}: {
  post: NewsPost;
}) {
  const media = post.media.slice(0, 4);
  const count = media.length;

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <div className="aspect-video">
          <MediaItem
            media={media[0]}
            postUrl={post.url}
          />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="mt-4 grid aspect-video grid-cols-2 gap-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
        {media.map((item, index) => (
          <MediaItem
            key={`${item.type}-${index}`}
            media={item}
            postUrl={post.url}
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="mt-4 grid aspect-video grid-cols-2 gap-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
        <div className="row-span-2">
          <MediaItem
            media={media[0]}
            postUrl={post.url}
          />
        </div>

        <MediaItem
          media={media[1]}
          postUrl={post.url}
        />

        <MediaItem
          media={media[2]}
          postUrl={post.url}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 grid aspect-video grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
      {media.map((item, index) => (
        <MediaItem
          key={`${item.type}-${index}`}
          media={item}
          postUrl={post.url}
        />
      ))}
    </div>
  );
}

export default function NewsCard({
  post,
}: NewsCardProps) {
  const profileImage = post.profileImage
    ? getGoogleDriveImageUrl(post.profileImage)
    : "/images/default-profile.png";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <header className="flex items-center gap-3">
        <img
          src={profileImage}
          alt={`${post.displayName} profile`}
          loading="lazy"
          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
        />

        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">
            {post.displayName}
          </p>

          <p className="truncate text-sm text-slate-500">
            {post.username}
          </p>
        </div>
      </header>

      {post.text && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {post.text}
        </p>
      )}

      <NewsMediaGrid post={post} />

      <footer className="mt-auto flex items-center justify-between gap-4 pt-5">
        <time className="text-xs text-slate-500">
          {post.date}
        </time>

        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            View post
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </footer>
    </article>
  );
}