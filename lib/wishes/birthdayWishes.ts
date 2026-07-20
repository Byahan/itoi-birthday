import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  CreateDrawingWishInput,
  CreateMessageWishInput,
} from "@/types/birthday";

const COLLECTION_NAME = "birthdayWishes";

function normalizeName(name?: string): string {
  const cleanName = name?.trim();

  if (!cleanName) {
    return "Anonymous";
  }

  return cleanName.slice(0, 50);
}

export async function submitMessageWish(
  input: CreateMessageWishInput,
): Promise<string> {
  const message = input.message.trim();

  if (!message) {
    throw new Error("Please write a birthday message.");
  }

  if (message.length > 1000) {
    throw new Error(
      "Your message must be 1,000 characters or fewer.",
    );
  }

  const documentReference = await addDoc(
    collection(db, COLLECTION_NAME),
    {
      type: "message",
      name: normalizeName(input.name),
      message,
      drawing: null,
      status: "pending",
      createdAt: serverTimestamp(),
    },
  );

  return documentReference.id;
}

export async function submitDrawingWish(
  input: CreateDrawingWishInput,
): Promise<string> {
  if (input.drawing.length === 0) {
    throw new Error(
      "Please draw something first.",
    );
  }

  if (input.drawing.length > 300) {
    throw new Error(
      "Your drawing contains too many strokes.",
    );
  }

  const totalPoints = input.drawing.reduce(
    (total, stroke) =>
      total + stroke.points.length,
    0,
  );

  if (totalPoints > 12_000) {
    throw new Error(
      "Your drawing is too detailed. Try using fewer strokes.",
    );
  }

  const documentReference = await addDoc(
    collection(db, COLLECTION_NAME),
    {
      type: "drawing",
      name: normalizeName(input.name),
      message: null,
      drawing: input.drawing,
      status: "pending",
      createdAt: serverTimestamp(),
    },
  );

  return documentReference.id;
}