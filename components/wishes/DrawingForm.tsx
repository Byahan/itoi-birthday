"use client";

import {
  useRef,
  useState,
  type FormEvent,
} from "react";

import DrawingCanvas, {
  type DrawingCanvasHandle,
} from "@/components/wishes/DrawingCanvas";

import { submitDrawingWish } from "@/lib/wishes/birthdayWishes";
import { useLanguage } from "@/context/LanguageProvider";

export default function DrawingForm() {
  const { t } = useLanguage();

  const drawingCanvasRef =
    useRef<DrawingCanvasHandle | null>(null);

  const [name, setName] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const drawing =
      drawingCanvasRef.current?.getStrokes() ??
      [];

    if (drawing.length === 0) {
      setError(
        t.wishes.drawingForm.emptyError,
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await submitDrawingWish({
        name,
        drawing,
      });

      setName("");
      drawingCanvasRef.current?.clearCanvas();

      setSuccess(
        t.wishes.drawingForm.success,
      );
    } catch (submissionError) {
      console.error(submissionError);
      setError(
        t.wishes.drawingForm.error,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="drawing-name"
          className="block text-sm font-black text-[#202b50]"
        >
          {t.wishes.drawingForm.nameLabel}
        </label>

        <p className="mt-1 text-xs text-[#7b839d]">
          {t.wishes.drawingForm.nameHelp}
        </p>

        <input
          id="drawing-name"
          type="text"
          maxLength={50}
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder={
            t.wishes.drawingForm.namePlaceholder
          }
          className="mt-3 h-12 w-full rounded-2xl border border-[#dceaf5] bg-[#f8fbff] px-4 text-sm text-[#202b50] outline-none transition focus:border-[#48a9f8] focus:ring-4 focus:ring-[#48a9f8]/10"
        />
      </div>

      <DrawingCanvas ref={drawingCanvasRef} />

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-2xl bg-[#48a9f8] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(72,169,248,0.20)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(72,169,248,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? t.wishes.drawingForm.submitting
          : t.wishes.drawingForm.submit}
      </button>
    </form>
  );
}