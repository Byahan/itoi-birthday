"use client";

import {
  useState,
  type FormEvent,
} from "react";

import { submitMessageWish } from "@/lib/wishes/birthdayWishes";

export default function MessageForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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

    try {
      setIsSubmitting(true);

      await submitMessageWish({
        name,
        message,
      });

      setName("");
      setMessage("");

      setSuccess(
        "Your birthday wish was submitted and is waiting for approval.",
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your wish.",
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
          htmlFor="birthday-name"
          className="block text-sm font-bold text-[#202b50]"
        >
          Name
        </label>

        <p className="mt-1 text-xs text-[#7b839d]">
          Optional. Leave it blank to submit as Anonymous.
        </p>

        <input
          id="birthday-name"
          type="text"
          maxLength={50}
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Your name"
          className="mt-3 h-12 w-full rounded-2xl border border-[#dceaf5] bg-[#f8fbff] px-4 text-sm text-[#202b50] outline-none transition focus:border-[#48a9f8] focus:ring-4 focus:ring-[#48a9f8]/10"
        />
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <label
            htmlFor="birthday-message"
            className="block text-sm font-bold text-[#202b50]"
          >
            Birthday message
          </label>

          <span className="text-xs text-[#8a91a8]">
            {message.length}/200
          </span>
        </div>

        <textarea
          id="birthday-message"
          rows={7}
          maxLength={200}
          required
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          placeholder="Write a birthday message for Itoi Toi..."
          className="mt-3 w-full resize-none rounded-2xl border border-[#dceaf5] bg-[#f8fbff] p-4 text-sm leading-7 text-[#202b50] outline-none transition placeholder:text-[#a4abc0] focus:border-[#48a9f8] focus:ring-4 focus:ring-[#48a9f8]/10"
        />
      </div>

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
          ? "Sending..."
          : "Send Birthday Wish"}
      </button>
    </form>
  );
}