"use client";

import { Search } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState, type FormEvent } from "react";

const filters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Streams",
    value: "stream",
  },
  {
    label: "Videos",
    value: "video",
  },
  {
    label: "Music",
    value: "music",
  },
  {
    label: "Karaoke",
    value: "karaoke",
  },
  {
    label: "Shorts",
    value: "short",
  },
] as const;

interface ArchiveFiltersProps {
  initialQuery: string;
  activeFilter: string;
}

export default function ArchiveFilters({
  initialQuery,
  activeFilter,
}: ArchiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);

  function updateUrl(
    nextQuery: string,
    nextFilter: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const cleanedQuery = nextQuery.trim();

    if (cleanedQuery) {
      params.set("q", cleanedQuery);
    } else {
      params.delete("q");
    }

    if (nextFilter !== "all") {
      params.set("filter", nextFilter);
    } else {
      params.delete("filter");
    }

    params.delete("page");

    const queryString = params.toString();

    router.push(
      queryString ? `${pathname}?${queryString}` : pathname,
    );
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl(query, activeFilter);
  }

  return (
    <div className="mt-10 rounded-3xl border border-[#dceaf5] bg-white/90 p-4 shadow-[0_12px_35px_rgba(66,103,145,0.07)] md:p-5">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b839d]"
          />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search archive videos..."
            className="h-12 w-full rounded-2xl border border-[#dceaf5] bg-[#f8fbff] pl-11 pr-4 text-sm text-[#202b50] outline-none transition placeholder:text-[#9aa3b8] focus:border-[#48a9f8] focus:ring-2 focus:ring-[#48a9f8]/15"
          />
        </div>

        <button
          type="submit"
          className="h-12 rounded-2xl bg-[#48a9f8] px-6 text-sm font-bold text-white transition hover:bg-[#318ee8]"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter.value === activeFilter;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                updateUrl(query, filter.value)
              }
              className={
                active
                  ? "h-10 rounded-xl bg-[#202b50] px-4 text-sm font-bold text-white"
                  : "h-10 rounded-xl border border-[#dceaf5] bg-white px-4 text-sm font-semibold text-[#6f7893] transition hover:border-[#48a9f8]/50 hover:bg-[#f3f9ff] hover:text-[#318ee8]"
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}