import { profile } from "@/data/profile";
import CharacterShowcase from "@/components/ui/profile/CharacterShowcase";
import CostumeSelector from "@/components/ui/profile/CostumeSelector";
import { CostumeProvider } from "@/components/ui/profile/CostumeProvider";
import SocialLinks from "@/components/ui/profile/SocialLinks";
import Translate from "@/components/ui/language/Translate";

export default function ProfilePage() {
  const details = [
    {
      label: "profile.details.birthday",
      value: profile.birthday,
    },
    {
      label: "profile.details.debut",
      value: profile.debutDate,
    },
    {
      label: "profile.details.height",
      value: profile.height,
    },
    {
      label: "profile.details.fanName",
      value: profile.fanName,
    },
    {
      label: "profile.details.fanMark",
      value: profile.oshiMark,
    },
    {
      label: "profile.details.generation",
      value: profile.generation,
    },
  ];

  return (
    <main className="min-h-screen px-6 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#48a9f8]">
            Profile
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-[#202b50] md:text-7xl">
            About Itoi Toi
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#6f7893]">
            <Translate t="profile.description" />
          </p>
        </header>

        {/* Main profile */}
        <CostumeProvider>
          <section className="mt-2 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Character */}
            <CharacterShowcase />

            {/* Costume selector and profile information */}
            <div>
              <CostumeSelector />

              <div className="mt-4 rounded-3xl border border-[#dceaf5] bg-white/90 p-7 shadow-[0_18px_50px_rgba(66,103,145,0.10)] md:p-9">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#48a9f8]">
                  {profile.role}
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight text-[#202b50] md:text-5xl">
                  {profile.name}
                </h2>

                <p className="mt-2 text-xl font-semibold text-[#48a9f8]">
                  {profile.japaneseName}
                </p>

                <p className="mt-6 text-base leading-8 text-[#6f7893]">
                  <Translate t="profile.greeting" />
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="rounded-2xl border border-[#dceaf5] bg-[#f8fbff] px-5 py-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b839d]">
                        <Translate t={detail.label} />
                      </p>

                      <p className="mt-2 font-bold text-[#202b50]">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </CostumeProvider>

        {/* Biography */}
        <section className="mt-16 rounded-3xl border border-[#dceaf5] bg-white/90 p-7 shadow-[0_18px_50px_rgba(66,103,145,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#48a9f8]">
            Background
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#202b50]">
            About Her
          </h2>

          <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#5f6881]">
            <Translate t="profile.biography" />
          </p>
        </section>

        {/* Hashtags */}
        <section className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#48a9f8]">
            Community
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#202b50]">
            Official Hashtags
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.hashtags.map((hashtag) => (
              <div
                key={hashtag.label}
                className="rounded-2xl border border-[#dceaf5] bg-white/90 px-6 py-5 shadow-[0_12px_35px_rgba(66,103,145,0.07)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b839d]">
                 <Translate t={hashtag.label} />
                </p>

                <p className="mt-2 text-lg font-bold text-[#318ee8]">
                  {hashtag.value}
                </p>
              </div>
            ))}
          </div>
        </section>
        <SocialLinks />
      </div>
    </main>
  );
}