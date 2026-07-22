import Image from "next/image";
import LiveStatus from "./LiveStatus";
import NextStream from "./NextStream";
import ChannelStats from "./ChannelStats";
import HeroText from "./HeroText";

export default function Hero() {
  return (
    <section id="home" className="px-6 pb-8 pt-28 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[320px_1fr_500px]">

        {/* Left Panel */}
        <div className="order-3 space-y-5 lg:order-1">
          <LiveStatus />
          <NextStream />
        </div>

        {/* Center Panel */}
        <div className="order-1 text-center lg:order-2 lg:text-left">
          <HeroText />
        </div>

        {/* Right Panel */}
        <div className="order-2 flex flex-col items-center lg:order-3">
          <Image
            src="/images/itoi2.png"
            alt="Itoi Toi"
            width={500}
            height={700}
            priority
            className="pointer-events-none h-auto w-full max-w-[320px] select-none sm:max-w-[380px] lg:max-w-[500px]"
          />

          <div className="mt-2 w-full max-w-[360px] sm:max-w-[440px]">
            <ChannelStats />
          </div>
        </div>

      </div>
    </section>
  );
}