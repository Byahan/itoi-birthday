import Image from "next/image";
import { Button } from "@/components/ui/button";
import LiveStatus from "./LiveStatus";
import NextStream from "./NextStream";
import ChannelStats from "./ChannelStats";

export default function Hero() {
  return (
    <section id="home" className="px-6 pb-8 pt-28 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[320px_1fr_500px]">

        {/* Left Panel */}
        <div className="space-y-5">
          <LiveStatus />
          <NextStream />
        </div>

        {/* Center Panel */}
        <div className="text-center lg:text-left">

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#48a9f8]">
            NEO-PORTE GEN 2
          </p>

          <h1 className="mt-5 text-6xl font-black tracking-tight text-[#202b50] md:text-8xl">
            Itoi Toi
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6f7893]">
            Welcome to a special website dedicated to celebrating
            Itoi Toi's birthday. Explore memories, messages,
            music, and many little surprises prepared with love.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button
              size="lg"
              className="bg-[#48a9f8] text-white hover:bg-[#318ee8]"
            >
              Explore
            </Button>

            <Button
              className="border-[#b9dcf7] bg-white text-[#318ee8] hover:bg-[#f3f9ff]"
              size="lg"
              variant="secondary"
            >
              Send Wishes
            </Button>
          </div>

        </div>

        {/* Right Panel */}
        <div className="hidden flex-col items-center lg:flex">
          <Image
            src="/images/itoi.png"
            alt="Itoi Toi"
            width={500}
            height={700}
            priority
            className="pointer-events-none h-auto w-full max-w-[500px] select-none"
          />

          <div className="mt-2 w-full max-w-[440px]">
            <ChannelStats />
          </div>
        </div>

      </div>
    </section>
  );
}