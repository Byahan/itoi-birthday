import BirthdayTabs from "@/components/wishes/BirthdayTabs";
import WishesGallery from "@/components/wishes/WishesGallery";

export default function WishesPage() {
  return (
    <main className="relative min-h-screen px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#48a9f8]">
            Limited Birthday Event
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#202b50] sm:text-5xl md:text-6xl">
            Birthday Wishes
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#707a95] md:text-lg">
            Leave a special memory for Itoi Toi by writing a message or
            creating a drawing.
          </p>
        </header>

        <div className="mt-10">
          <BirthdayTabs />
        </div>

        <section className="mt-20">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#48a9f8]">
              Community
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#202b50]">
              Birthday Memories
            </h2>

            <p className="mt-3 text-sm text-[#7b839d]">
              Approved messages and drawings will appear together here.
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