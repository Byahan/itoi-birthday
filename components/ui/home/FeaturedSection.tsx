import MusicSpotlight from "./MusicSpotlight";
import FeaturedVideo from "./FeaturedVideo";
import PinnedPost from "./PinnedPost";
import WeeklySchedule from "./WeeklySchedule";

export default function FeaturedSection() {
  return (
    <section className="relative z-10 mx-auto mt-10 max-w-7xl px-6 pb-32 md:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#48a9f8]">
          Highlights
        </p>

        <h2 className="mt-3 text-5xl font-black text-[#202b50]">
          Featured Content
        </h2>

        <p className="mt-5 max-w-2xl text-lg text-[#6f7893]">
          Watch the latest featured content, see recent updates,
          and listen to selected music.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <WeeklySchedule />
        <FeaturedVideo />
        <PinnedPost />
        <MusicSpotlight />
      </div>
    </section>
  );
}