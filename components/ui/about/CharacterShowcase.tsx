"use client";

import Image from "next/image";

import { profile } from "@/data/profile";
import { useCostume } from "./CostumeProvider";

export default function CharacterShowcase() {
  const { selectedCostumeId, visible } = useCostume();

  const selectedCostume =
    profile.costumes.find(
      (costume) => costume.id === selectedCostumeId,
    ) ?? profile.costumes[0];

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="relative">
        <div className="absolute inset-x-12 bottom-8 h-64 rounded-full bg-[#dff1ff]/70 blur-[80px]" />

        <Image
          src={selectedCostume.image}
          alt={`${profile.name} - ${selectedCostume.name}`}
          width={520}
          height={760}
          priority
          className={`relative z-10 h-auto w-full object-contain transition-all duration-300 ease-out ${
            visible
              ? "scale-100 opacity-100"
              : "scale-[0.97] opacity-0"
          }`}
        />
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        Image source from{" "}
        <a
          href="https://neo-porte.jp/member/itoi-toi"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sky-600 underline underline-offset-2 hover:text-sky-700"
        >
          Neo-Porte Official Website
        </a>
        .
      </p>
    </div>
  );
}