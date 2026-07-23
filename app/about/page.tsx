import {
  Archive,
  Gift,
  Heart,
  House,
  Newspaper,
  Palette,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import Translate from "@/components/ui/language/Translate";

type WebsitePage = {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
};

const websitePages = [
  {
    icon: House,
    title: "about.home",
    description: "about.homeDescription",
  },
  {
    icon: UserRound,
    title: "about.profile",
    description: "about.profileDescription",
  },
  {
    icon: Archive,
    title: "about.archives",
    description: "about.archivesDescription",
  },
  {
    icon: Palette,
    title: "about.timeline",
    description: "about.timelineDescription",
  },
  {
    icon: Newspaper,
    title: "about.news",
    description: "about.newsDescription",
  },
  {
    icon: Gift,
    title: "about.wishes",
    description: "about.wishesDescription",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-24 pt-28 md:px-8 md:pt-36">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#e8f6ff]/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-80 h-80 w-80 rounded-full bg-[#e3f4ff]/70 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Page heading */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-md text-4xl font-black uppercase tracking-[0.3em] text-[#48a9f8]">
            <Translate t="about.badge" />
          </p>
        </header>

        {/* Website page descriptions */}
        <section className="mt-14 overflow-hidden rounded-[2rem] border border-[#dcecf8] bg-white/90 shadow-[0_22px_65px_rgba(64,92,130,0.09)] backdrop-blur-sm">
          <div className="divide-y divide-[#e8eef5]">
            {websitePages.map((page) => {
              const Icon = page.icon;

              return (
                <article
                  key={page.title}
                  className="px-6 py-8 sm:px-8 sm:py-9 md:px-10"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#48a9f8]">
                      <Icon size={22} strokeWidth={2.2} />
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <h2 className="text-xl font-black text-[#202b50] md:text-2xl">
                        <Translate t={page.title} />
                      </h2>

                      {page.title === "about.timeline" ? (
                        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#707a95] md:text-base md:leading-8">
                          <Translate t="about.timelineDescription.timelineDescription1" />
                          {"\n"}
                          ✦ <Translate t="about.timelineDescription.timelineDescription2" />{" "}
                          <a
                            href="https://wikiwiki.jp/neo-porte/絲依とい"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#48a9f8] underline"
                          >
                            wikiwiki.jp
                          </a>
                        </p>
                      ) : (
                        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#707a95] md:text-base md:leading-8">
                          <Translate t={page.description} />
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Fan project disclaimer */}
        <section className="mt-5 rounded-[2rem] border border-[#d5eafa] bg-[#f2faff] px-3 py-5 shadow-[0_18px_55px_rgba(72,169,248,0.08)] sm:px-10">
          <p className="mt-4 max-w-4xl whitespace-pre-line text-left text-sm leading-7 text-[#707a95] md:text-base">
            <Translate t="about.projectDescription.projectDescription1" />
            <a
              href="https://x.com/shk88995"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#48a9f8] hover:underline"
            >
              Byahan (@shk88995)
            </a>
            <Translate t="about.projectDescription.projectDescription2" />
          </p>
        </section>
      </div>
    </main>
  );
}