import Image from "next/image";
import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  action: ReactNode;
}

export default function FeatureCard({
  title,
  description,
  image,
  action,
}: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#79cef2]/15 bg-[#151e26]/80 transition duration-300 hover:-translate-y-1 hover:border-[#79cef2]/30">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="pointer-events-none object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="relative z-10 p-6">
        <h3 className="text-xl font-bold text-[#f7fbfd]">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#9eb0ba]">
          {description}
        </p>

        <div className="relative z-20 mt-6">
          {action}
        </div>
      </div>
    </article>
  );
}