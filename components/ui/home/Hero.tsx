import LiveStatus from "./LiveStatus";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen px-8 pt-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <LiveStatus />

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-200">
              Next Stream
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Birthday Countdown
            </h3>

            <div className="mt-5 grid grid-cols-4 gap-2 text-center">
              {["02", "15", "10", "23"].map((item, index) => (
                <div key={index} className="rounded-2xl bg-white/15 p-3">
                  <p className="text-2xl font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <p className="text-2xl font-semibold text-pink-300">
            Welcome to
          </p>

          <h1 className="mt-3 text-6xl font-black tracking-tight md:text-8xl">
            Itoi Toi
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/70">
            A cozy birthday website filled with memories, wishes, music,
            and little surprises for Itoi Toi.
          </p>

          <div className="mt-8 flex justify-center gap-4 lg:justify-start">
            <Button size="lg">Explore Website</Button>
            <Button size="lg" variant="secondary">
              Send Wishes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}