import { redirect } from "next/navigation";
import ArchiveVideoGrid from "@/components/ui/archives/ArchiveVideoGrid";
import ArchiveFilters from "@/components/ui/archives/ArchiveFilters";
import type { ArchiveCategory } from "@/types/archive";

import Pagination from "@/components/ui/archives/Pagination";
import { getArchiveVideos } from "@/lib/youtube";

const VIDEOS_PER_PAGE = 12;

interface ArchivesPageProps {
  searchParams: Promise<{
    page?: string | string[];
    q?: string | string[];
    filter?: string | string[];
  }>;
}

function formatDate(dateString: string): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ArchivesPage({
  searchParams,
}: ArchivesPageProps) {
  const params = await searchParams;

  const rawPage = Array.isArray(params.page)
    ? params.page[0]
    : params.page;

  const requestedPage = Number.parseInt(
    rawPage ?? "1",
    10,
  );

  const rawQuery = Array.isArray(params.q)
    ? params.q[0]
    : params.q;

  const rawFilter = Array.isArray(params.filter)
    ? params.filter[0]
    : params.filter;

  const query = rawQuery?.trim() ?? "";

  const validFilters = [
    "all",
    "stream",
    "video",
    "music",
    "karaoke",
    "short",
  ];

  const activeFilter = validFilters.includes(
    rawFilter ?? "",
  )
    ? rawFilter!
    : "all";

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const allVideos = await getArchiveVideos();

  const normalizedQuery = query.toLowerCase();

  const videos = allVideos.filter((video) => {
    const matchesQuery =
      !normalizedQuery ||
      video.title.toLowerCase().includes(normalizedQuery) ||
      video.description
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesFilter =
      activeFilter === "all" ||
      video.categories.includes(
        activeFilter as ArchiveCategory,
      )

    return matchesQuery && matchesFilter;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(videos.length / VIDEOS_PER_PAGE),
  );

  if (videos.length > 0 && currentPage > totalPages) {
    redirect(`/archives?page=${totalPages}`);
  }

  const startIndex =
    (currentPage - 1) * VIDEOS_PER_PAGE;

  const visibleVideos = videos.slice(
    startIndex,
    startIndex + VIDEOS_PER_PAGE,
  );

  return (
    <main className="min-h-screen px-6 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#48a9f8]">
            Video Library
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-[#202b50] md:text-7xl">
            Archives
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#6f7893]">
            Browse Itoi Toi&apos;s streams, videos, covers, and other
            uploaded content.
          </p>
        </header>

        <ArchiveFilters
          initialQuery={query}
          activeFilter={activeFilter}
        />

        {videos.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#dceaf5] bg-white/90 p-10 text-center">
            <h2 className="text-xl font-black text-[#202b50]">
              No videos found
            </h2>

            <p className="mt-3 text-sm text-[#6f7893]">
              The archive could not be loaded from YouTube.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#6f7893]">
                Showing{" "}
                <span className="font-bold text-[#202b50]">
                  {startIndex + 1}–
                  {Math.min(
                    startIndex + VIDEOS_PER_PAGE,
                    videos.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#202b50]">
                  {videos.length}
                </span>{" "}
                videos
              </p>

              <p className="text-sm font-semibold text-[#318ee8]">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <ArchiveVideoGrid videos={visibleVideos} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </main>
  );
}