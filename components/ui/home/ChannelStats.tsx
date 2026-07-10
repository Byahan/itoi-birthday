import { getChannelStatistics } from "@/lib/youtube";

const debutYear = "12/12/2022";

function formatCount(value: number | null): string {
  if (value === null) {
    return "Hidden";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function ChannelStats() {
  const statistics = await getChannelStatistics();

  const items = [
    {
      value: statistics
        ? formatCount(statistics.subscriberCount)
        : "—",
      label: "Subscribers",
    },
    {
      value: statistics
        ? formatCount(statistics.videoCount)
        : "—",
      label: "Videos",
    },
    {
      value: debutYear,
      label: "Debut",
    },
  ];

  return (
    <div className="w-full border-t border-[#79cef2]/15 pt-5">
      <div className="grid grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={
              index === 0
                ? "text-center"
                : "border-l border-[#79cef2]/10 text-center"
            }
          >
            <p className="text-xl font-black tracking-tight text-[#f7fbfd] md:text-2xl">
              {item.value}
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#9eb0ba]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}