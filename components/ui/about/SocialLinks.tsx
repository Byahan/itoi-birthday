import { FaTwitch, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = {
  youtube: "https://www.youtube.com/@itoitoi_Q",
  twitch: "https://www.twitch.tv/itoitoi_Q",
  xMain: "https://x.com/itoitoi_Q",
  xSub: "https://x.com/toitoi0801",
};

export default function SocialLinks() {
  return (
    <section className="mt-12">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#48a9f8]">
        Official Links
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {/* YouTube */}
        <a
          href={socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#ffd0d0] bg-white/90 font-semibold text-[#ff0000] transition hover:-translate-y-0.5 hover:border-[#ff0000]/40 hover:bg-[#fff7f7]"
        >
          <FaYoutube size={21} />
          YouTube
        </a>

        {/* X accounts */}
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#dceaf5] bg-white/90">
          <a
            href={socialLinks.xMain}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-2 border-r border-[#dceaf5] font-semibold text-[#202b50] transition hover:bg-[#f3f6f8]"
          >
            <FaXTwitter size={18} />
            Main
          </a>

          <a
            href={socialLinks.xSub}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-2 font-semibold text-[#202b50] transition hover:bg-[#f3f6f8]"
          >
            <FaXTwitter size={18} />
            Sub
          </a>
        </div>

        {/* Twitch */}
        <a
          href={socialLinks.twitch}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#dccfff] bg-white/90 font-semibold text-[#9146ff] transition hover:-translate-y-0.5 hover:border-[#9146ff]/40 hover:bg-[#faf7ff]"
        >
          <FaTwitch size={20} />
          Twitch
        </a>
      </div>
    </section>
  );
}