import NewsCard from "@/components/ui/news/NewsCard";
import { getNewsPosts } from "@/lib/news";

export default async function NewsPage() {
  const posts = await getNewsPosts();

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
          <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <NewsCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}