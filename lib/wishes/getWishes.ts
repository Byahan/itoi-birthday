import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  BirthdayWish,
  BirthdayWishPage,
  BirthdayWishStatus,
  BirthdayWishType,
  DrawingStroke,
} from "@/types/birthday";

const COLLECTION_NAME = "birthdayWishes";
const PAGE_SIZE = 8;

function parseWishDocument(
  document: DocumentSnapshot,
): BirthdayWish {
  const data = document.data();

  if (!data) {
    throw new Error("Birthday wish data is missing.");
  }

  return {
    id: document.id,
    type: data.type as BirthdayWishType,
    name:
      typeof data.name === "string"
        ? data.name
        : "Anonymous",
    message:
      typeof data.message === "string"
        ? data.message
        : null,
    drawing: Array.isArray(data.drawing)
      ? (data.drawing as DrawingStroke[])
      : null,
    status:
      data.status as BirthdayWishStatus,
    createdAt: data.createdAt ?? null,
  };
}

export async function getApprovedWishes(
  lastDocument?: DocumentSnapshot | null,
): Promise<BirthdayWishPage> {
  const wishesCollection = collection(
    db,
    COLLECTION_NAME,
  );

  const constraints = [
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE + 1),
  ];

  const wishesQuery = lastDocument
    ? query(
        wishesCollection,
        where("status", "==", "approved"),
        orderBy("createdAt", "desc"),
        startAfter(lastDocument),
        limit(PAGE_SIZE + 1),
      )
    : query(
        wishesCollection,
        ...constraints,
      );

  const snapshot = await getDocs(wishesQuery);

  const hasMore =
    snapshot.docs.length > PAGE_SIZE;

  const visibleDocuments = hasMore
    ? snapshot.docs.slice(0, PAGE_SIZE)
    : snapshot.docs;

  return {
    wishes: visibleDocuments.map(
      parseWishDocument,
    ),
    lastDocument:
      visibleDocuments.length > 0
        ? visibleDocuments[
            visibleDocuments.length - 1
          ]
        : null,
    hasMore,
  };
}