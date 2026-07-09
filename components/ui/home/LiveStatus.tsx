import { socials } from "@/data/Socials";

export default function LiveStatus() {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">
        Live Status
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-pink-500" />

        <h2 className="text-4xl font-bold">
          Offline
        </h2>
      </div>

      <p className="mt-4 text-sm text-white/70">
        Follow Itoi Toi and turn on notifications.
      </p>

      <div className="mt-6 flex gap-3">
        {socials.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
              aria-label={social.name}
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </div>
  );
}