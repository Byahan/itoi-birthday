"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function createPageNumbers(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (currentPage > 4) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pageInput, setPageInput] = useState(
    String(currentPage),
  );

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = createPageNumbers(
    currentPage,
    totalPages,
  );

  function getPageHref(page: number): string {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set("page", String(page));

    return `${pathname}?${params.toString()}`;
  }

  function handlePageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requestedPage = Number.parseInt(pageInput, 10);

    if (Number.isNaN(requestedPage)) {
      setPageInput(String(currentPage));
      return;
    }

    const safePage = Math.min(
      Math.max(requestedPage, 1),
      totalPages,
    );

    setPageInput(String(safePage));
    router.push(getPageHref(safePage));
  }

  return (
    <div className="mt-12 space-y-5">
      <nav
        aria-label="Archive pagination"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={getPageHref(currentPage - 1)}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-[#dceaf5] bg-white px-3 text-sm font-semibold text-[#202b50] transition hover:border-[#48a9f8]/50 hover:bg-[#f3f9ff]"
          >
            <ChevronLeft size={16} />
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-1 rounded-xl border border-[#e7edf2] bg-[#f5f7f9] px-3 text-sm font-semibold text-[#a5aaba]">
            <ChevronLeft size={16} />
            Previous
          </span>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center text-[#7b839d]"
              >
                …
              </span>
            );
          }

          const active = page === currentPage;

          return (
            <Link
              key={page}
              href={getPageHref(page)}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#48a9f8] px-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(72,169,248,0.25)]"
                  : "flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dceaf5] bg-white px-3 text-sm font-semibold text-[#202b50] transition hover:border-[#48a9f8]/50 hover:bg-[#f3f9ff]"
              }
            >
              {page}
            </Link>
          );
        })}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={getPageHref(currentPage + 1)}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-[#dceaf5] bg-white px-3 text-sm font-semibold text-[#202b50] transition hover:border-[#48a9f8]/50 hover:bg-[#f3f9ff]"
          >
            Next
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-1 rounded-xl border border-[#e7edf2] bg-[#f5f7f9] px-3 text-sm font-semibold text-[#a5aaba]">
            Next
            <ChevronRight size={16} />
          </span>
        )}
      </nav>

      {/* Jump to page */}
      <form
        onSubmit={handlePageSubmit}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <label
          htmlFor="archive-page-input"
          className="text-sm font-semibold text-[#6f7893]"
        >
          Go to page
        </label>

        <input
          id="archive-page-input"
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={(event) =>
            setPageInput(event.target.value)
          }
          className="h-10 w-24 rounded-xl border border-[#dceaf5] bg-white px-3 text-center text-sm font-semibold text-[#202b50] outline-none transition focus:border-[#48a9f8] focus:ring-2 focus:ring-[#48a9f8]/20"
        />

        <button
          type="submit"
          className="h-10 rounded-xl bg-[#48a9f8] px-5 text-sm font-bold text-white transition hover:bg-[#318ee8]"
        >
          Go
        </button>

        <span className="text-sm text-[#7b839d]">
          of {totalPages}
        </span>
      </form>
    </div>
  );
}