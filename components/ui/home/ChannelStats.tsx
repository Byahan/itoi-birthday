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
    <div className="w-full border-t border-[#dceaf5] pt-5">
      <div className="grid grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={
              index === 0
                ? "text-center"
                : "border-l border-[#dceaf5] text-center"
            }
          >
            <p
              className={`text-xl font-black tracking-tight md:text-2xl ${
                item.label === "Subscribers"
                  ? "text-[#202b50]"
                  : item.label === "Videos"
                  ? "text-[#48a9f8]"
                  : "text-[#202b50]"
              }`}
            >
              {item.value}
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#7b839d]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}