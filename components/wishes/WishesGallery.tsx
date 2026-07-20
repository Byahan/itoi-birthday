"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import WishCard from "@/components/wishes/WishCard";

import { getApprovedWishes } from "@/lib/wishes/getWishes";

import type {
  BirthdayWish,
} from "@/types/birthday";

import type {
  DocumentSnapshot,
} from "firebase/firestore";

export default function WishesGallery() {
  const [wishes, setWishes] = useState<
    BirthdayWish[]
  >([]);

  const [lastDocument, setLastDocument] =
    useState<DocumentSnapshot | null>(null);

  const [hasMore, setHasMore] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingMore, setIsLoadingMore] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const hasLoadedRef = useRef(false);

  const loadInitialWishes =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result =
          await getApprovedWishes();

        setWishes(result.wishes);

        setLastDocument(
          result.lastDocument,
        );

        setHasMore(result.hasMore);
      } catch (loadingError) {
        console.error(
          "Unable to load birthday wishes:",
          loadingError,
        );

        setError(
          loadingError instanceof Error
            ? loadingError.message
            : "Unable to load birthday wishes.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;

    void loadInitialWishes();
  }, [loadInitialWishes]);

  async function loadMoreWishes() {
    if (
      !lastDocument ||
      isLoadingMore ||
      !hasMore
    ) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const result =
        await getApprovedWishes(
          lastDocument,
        );

      setWishes((currentWishes) => {
        const existingIds = new Set(
          currentWishes.map(
            (wish) => wish.id,
          ),
        );

        const newWishes =
          result.wishes.filter(
            (wish) =>
              !existingIds.has(wish.id),
          );

        return [
          ...currentWishes,
          ...newWishes,
        ];
      });

      setLastDocument(
        result.lastDocument,
      );

      setHasMore(result.hasMore);
    } catch (loadingError) {
      console.error(
        "Unable to load more wishes:",
        loadingError,
      );

      setError(
        loadingError instanceof Error
          ? loadingError.message
          : "Unable to load more wishes.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-[#e3edf6] bg-white/70 px-6 py-16 text-center">
        <LoaderCircle
          size={30}
          className="mx-auto animate-spin text-[#48a9f8]"
        />

        <p className="mt-4 text-sm font-bold text-[#7b839d]">
          Loading birthday memories...
        </p>
      </div>
    );
  }

  if (error && wishes.length === 0) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-12 text-center">
        <p className="font-bold text-red-600">
          The birthday memories could not be
          loaded.
        </p>

        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            hasLoadedRef.current = true;
            void loadInitialWishes();
          }}
          className="mx-auto mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-red-600 shadow-sm transition hover:bg-red-100"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#cfe2f1] bg-white/60 px-6 py-14 text-center">
        <Sparkles
          size={32}
          className="mx-auto text-[#f493c2]"
        />

        <h3 className="mt-4 text-lg font-black text-[#202b50]">
          No memories yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b839d]">
          Approved birthday messages and
          drawings will appear together here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        {wishes.map((wish) => (
          <WishCard
            key={wish.id}
            wish={wish}
          />
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={loadMoreWishes}
            disabled={isLoadingMore}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8e8f5] bg-white px-7 text-sm font-black text-[#318ee8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#48a9f8] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore && (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            )}

            {isLoadingMore
              ? "Loading..."
              : "Load More Memories"}
          </button>
        </div>
      )}

      {!hasMore && wishes.length > 8 && (
        <p className="mt-10 text-center text-sm font-semibold text-[#8a91a8]">
          You have reached the end of the
          birthday memories.
        </p>
      )}
    </div>
  );
}