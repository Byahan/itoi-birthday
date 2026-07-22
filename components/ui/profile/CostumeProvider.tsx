"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { profile } from "@/data/profile";

interface CostumeContextValue {
  selectedCostumeId: string;
  visible: boolean;
  changing: boolean;
  changeCostume: (costumeId: string) => Promise<void>;
}

const CostumeContext = createContext<CostumeContextValue | null>(null);

export function CostumeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedCostumeId, setSelectedCostumeId] = useState(
    profile.costumes[0].id,
  );

  const [visible, setVisible] = useState(true);
  const [changing, setChanging] = useState(false);

  async function changeCostume(costumeId: string) {
    if (changing || costumeId === selectedCostumeId) {
      return;
    }

    setChanging(true);
    setVisible(false);

    await new Promise((resolve) => setTimeout(resolve, 200));

    setSelectedCostumeId(costumeId);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    setTimeout(() => {
      setChanging(false);
    }, 500);
  }

  return (
    <CostumeContext.Provider
      value={{
        selectedCostumeId,
        visible,
        changing,
        changeCostume,
      }}
    >
      {children}
    </CostumeContext.Provider>
  );
}

export function useCostume() {
  const context = useContext(CostumeContext);

  if (!context) {
    throw new Error(
      "useCostume must be used inside CostumeProvider",
    );
  }

  return context;
}