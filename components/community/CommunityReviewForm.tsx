"use client";

import { useState } from "react";
import { createCommunityReview } from "@/app/communities/[slug]/actions";

interface Props {
  communityId: number;
}

export default function CommunityReviewForm({
  communityId,
}: Props) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!content.trim()) {
      setError("Please write a review.");
      return;
    }

    try {
      setLoading(true);

      await createCommunityReview(
        communityId,
        rating,
        content
      );

      setContent("");
      setRating(0);
      setSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-8 mb-10">
      <h3 className="text-2xl font-bold">
        ✍️ Leave a Review
      </h3>

      <p className="mt-2 text-gray-400">
        Share your experience with this community.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Your Rating
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition hover:scale-110 ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="review"
            className="text-sm text-gray-400"
          >
            Your Review
          </label>

          <textarea
            id="review"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            maxLength={500}
            rows={5}
            placeholder="Tell everyone what you think about this community..."
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-4
              text-white
              placeholder:text-gray-600
              outline-none
              focus:border-purple-500/50
              resize-none
            "
          />

          <p className="mt-2 text-right text-xs text-gray-500">
            {content.length}/500
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
            Your review has been submitted and is waiting for approval.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            mt-6
            rounded-xl
            bg-linear-to-r
            from-purple-600
            to-blue-600
            px-7
            py-3
            font-bold
            transition
            hover:scale-105
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </form>
    </div>
  );
}