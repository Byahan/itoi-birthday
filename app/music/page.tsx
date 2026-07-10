export default function MusicPage() {
  return (
    <main className="min-h-screen px-6 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#79cef2]">
          Songs and Covers
        </p>

        <h1 className="mt-3 text-5xl font-black">
          Music
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Selected songs and covers will be added manually and played
          through an embedded pop-up player.
        </p>
      </div>
    </main>
  );
}