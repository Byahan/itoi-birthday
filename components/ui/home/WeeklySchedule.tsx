import Image from "next/image";
import Link from "next/link";

export default function WeeklySchedule() {
  return (
    <div className="rounded-3xl border border-[#d6e9fb] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#48a9f8]">
          Schedule
        </p>

        <h3 className="mt-2 text-2xl font-bold text-[#202b50]">
          Weekly Schedule
        </h3>
      </div>

      <Link
        href="https://www.youtube.com/watch?v=RXz3wFA503I"
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-2xl"
      >
        <Image
          src="https://img.youtube.com/vi/RXz3wFA503I/maxresdefault.jpg"
          alt="Weekly Schedule"
          width={1280}
          height={720}
          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
    </div>
  );
}