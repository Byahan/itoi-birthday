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
    <article className="group relative overflow-hidden rounded-3xl border border-[#48a9f8]/15 bg-[#ffffff]/80 transition duration-300 hover:-translate-y-1 hover:border-[#48a9f8]/30">
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
        <h3 className="text-xl font-bold text-[#202b50]">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#6f7893]">
          {description}
        </p>

        <div className="relative z-20 mt-6">
          {action}
        </div>
      </div>
    </article>
  );
}