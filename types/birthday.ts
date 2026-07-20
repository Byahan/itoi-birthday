import type {
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export type BirthdayWishType = "message" | "drawing";

export type BirthdayWishStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  color: string;
  size: number;
  tool: "brush" | "eraser";
  points: DrawingPoint[];
}

export interface BirthdayWish {
  id: string;
  type: BirthdayWishType;
  name: string;
  message: string | null;
  drawing: DrawingStroke[] | null;
  status: BirthdayWishStatus;
  createdAt: Timestamp | null;
}

export interface CreateMessageWishInput {
  name?: string;
  message: string;
}

export interface CreateDrawingWishInput {
  name?: string;
  drawing: DrawingStroke[];
}

export interface BirthdayWishPage {
  wishes: BirthdayWish[];
  lastDocument: DocumentSnapshot | null;
  hasMore: boolean;
}