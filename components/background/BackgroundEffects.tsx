const sparkles = [
  { symbol: "✦", top: "7%", left: "7%", size: "1.45rem", delay: "-1s" },
  { symbol: "✧", top: "13%", left: "25%", size: "1rem", delay: "-4s" },
  { symbol: "✦", top: "9%", left: "70%", size: "1.7rem", delay: "-2s" },
  { symbol: "✧", top: "18%", left: "91%", size: "1.2rem", delay: "-5s" },

  { symbol: "✦", top: "29%", left: "5%", size: "1.1rem", delay: "-3s" },
  { symbol: "✧", top: "35%", left: "31%", size: "1.45rem", delay: "-7s" },
  { symbol: "✦", top: "27%", left: "61%", size: "1rem", delay: "-1.5s" },
  { symbol: "✧", top: "39%", left: "84%", size: "1.55rem", delay: "-6s" },

  { symbol: "✦", top: "51%", left: "12%", size: "1.3rem", delay: "-2.5s" },
  { symbol: "✧", top: "55%", left: "43%", size: "1rem", delay: "-4.5s" },
  { symbol: "✦", top: "48%", left: "75%", size: "1.5rem", delay: "-8s" },
  { symbol: "✧", top: "59%", left: "94%", size: "1.1rem", delay: "-3.5s" },

  { symbol: "✦", top: "70%", left: "7%", size: "1.55rem", delay: "-6.5s" },
  { symbol: "✧", top: "74%", left: "29%", size: "1rem", delay: "-2s" },
  { symbol: "✦", top: "67%", left: "64%", size: "1.25rem", delay: "-5.5s" },
  { symbol: "✧", top: "77%", left: "87%", size: "1.55rem", delay: "-1s" },

  { symbol: "✦", top: "89%", left: "16%", size: "1.2rem", delay: "-7s" },
  { symbol: "✧", top: "92%", left: "48%", size: "1.55rem", delay: "-3s" },
  { symbol: "✦", top: "87%", left: "71%", size: "1rem", delay: "-5s" },
  { symbol: "✧", top: "94%", left: "93%", size: "1.3rem", delay: "-2.5s" },
];

export default function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="background-base" />

      <div className="background-blob background-blob-primary" />
      <div className="background-blob background-blob-secondary" />
      <div className="background-blob background-blob-bottom" />

      <div className="background-grid" />

      <div className="background-sparkles">
        {sparkles.map((sparkle, index) => (
          <span
            key={`${sparkle.symbol}-${index}`}
            className={
              index % 3 === 0
                ? "background-sparkle background-sparkle-strong"
                : "background-sparkle"
            }
            style={{
              top: sparkle.top,
              left: sparkle.left,
              fontSize: sparkle.size,
              animationDelay: sparkle.delay,
            }}
          >
            {sparkle.symbol}
          </span>
        ))}
      </div>

      <span className="background-circle background-circle-1" />
      <span className="background-circle background-circle-2" />
    </div>
  );
}