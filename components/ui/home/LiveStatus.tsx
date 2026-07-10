import { socials } from "@/data/Socials";

export default function LiveStatus() {
  return (
    <section className="rounded-3xl border border-[#79cef2]/15 bg-[#151e26]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#79cef2]">
        Live Status
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#79cef2] opacity-40" />

          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#42aee2]" />
        </span>

        <h2 className="text-3xl font-bold tracking-tight text-[#f7fbfd]">
          Offline
        </h2>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#9eb0ba]">
        Itoi Toi is currently offline. Follow her social accounts and turn on
        notifications for the next stream.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {socials.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#79cef2]/15 bg-[#202c36]/80 text-[#b9ddec] transition duration-200 hover:-translate-y-0.5 hover:border-[#79cef2]/40 hover:bg-[#42aee2]/15 hover:text-[#79cef2]"
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </section>
  );
}