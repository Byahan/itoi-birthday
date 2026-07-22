import BirthdayTabs from "@/components/wishes/BirthdayTabs";
import WishesGallery from "@/components/wishes/WishesGallery";
import Translate from "@/components/ui/language/Translate";

export default function WishesPage() {
  return (
    <main className="relative min-h-screen px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#48a9f8]">
            <Translate t="wishes.hero.badge" />
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#202b50] sm:text-5xl md:text-6xl">
            <Translate t="wishes.hero.title" />
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#707a95] md:text-lg">
            <Translate t="wishes.hero.description" />
          </p>
        </header>

        <div className="mt-10">
          <BirthdayTabs />
        </div>

        <section className="mt-20">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#48a9f8]">
              <Translate t="wishes.gallery.badge" />
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#202b50]">
              <Translate t="wishes.gallery.title" />
            </h2>

            <p className="mt-3 text-sm text-[#7b839d]">
              <Translate t="wishes.gallery.description" />
            </p>
          </div>

          <div className="mt-8">
            <WishesGallery />
          </div>
        </section>
      </div>
    </main>
  );
}