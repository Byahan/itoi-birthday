import NewsCard from "@/components/ui/news/NewsCard";
import Pagination from "@/components/ui/archives/Pagination";
import { getNewsPosts } from "@/lib/news";

const POSTS_PER_PAGE = 9;

interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function NewsPage({
  searchParams,
}: NewsPageProps) {
  const posts = await getNewsPosts();

  const params = await searchParams;

  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / POSTS_PER_PAGE),
  );

  const currentPage = Math.min(
    Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1),
    totalPages,
  );

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;

  const currentPosts = posts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  return (
    <main className="min-h-screen px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-2xl">
        </header>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center">
            <p className="font-medium text-slate-800">
              No news posts are available yet.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Check the Google Sheet URL and published column.
            </p>
          </div>
        ) : (
          <>
            <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {currentPosts.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

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