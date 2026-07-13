"use client";

import Image from "next/image";

import { profile } from "@/data/profile";
import { useCostume } from "./CostumeProvider";

export default function CostumeSelector() {
  const {
    selectedCostumeId,
    changing,
    changeCostume,
  } = useCostume();

  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7b839d]">
        Select Costume
      </p>

      <div className="mt-2 grid grid-cols-3 gap-4">
        {profile.costumes.map((costume) => {
          const active =
            costume.id === selectedCostumeId;

          return (
            <button
              key={costume.id}
              type="button"
              disabled={changing}
              onClick={() => changeCostume(costume.id)}
              className={
                active
                  ? "rounded-2xl border border-[#48a9f8] bg-[#dff1ff] p-3 text-[#318ee8]"
                  : "rounded-2xl border border-[#dceaf5] bg-white p-3 text-[#6f7893] transition hover:border-[#48a9f8]/50 hover:bg-[#f8fbff] disabled:cursor-not-allowed"
              }
            >
              <div
                className={`relative mx-auto overflow-hidden rounded-xl bg-[#f3f9ff] transition-all duration-300 ${
                  active
                    ? "h-24 scale-105"
                    : "h-20 scale-100"
                }`}
              >
                <Image
                  src={costume.image}
                  alt={costume.name}
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>

              <p className="mt-1 text-sm font-semibold">
                {costume.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}