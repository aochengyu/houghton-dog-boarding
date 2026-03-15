"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitReview } from "@/app/actions/reviews";
import { Spinner } from "@/components/Spinner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-body text-xs font-semibold px-4 py-2 rounded-lg bg-forest text-cream hover:bg-forest/85 transition-colors disabled:opacity-50 flex items-center gap-1.5"
    >
      {pending && <Spinner size={12} className="text-cream" />}
      {pending ? "Submitting…" : "Submit Review"}
    </button>
  );
}

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const [state, formAction] = useFormState(submitReview, null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (state?.success) {
    return (
      <div className="mt-3 px-4 py-3 rounded-xl bg-teal/10 border border-teal/20 animate-[bounce-in_0.3s_ease-out]">
        <p className="font-body text-xs text-teal font-semibold">
          ✓ Review submitted! It will appear after approval.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-cream rounded-xl border border-forest/[0.07] p-4">
      <p className="font-body text-xs font-semibold text-forest/60 mb-3 uppercase tracking-wide">
        Leave a Review
      </p>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="booking_id" value={bookingId} />
        <input type="hidden" name="rating" value={rating} />

        {/* Star rating */}
        <div className="flex items-center gap-1" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl leading-none transition-all duration-100 focus:outline-none hover:scale-110 active:scale-110"
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <span
                className={`transition-all duration-100 ${
                  star <= (hovered || rating)
                    ? "text-gold"
                    : "text-forest/20"
                }`}
              >
                ★
              </span>
            </button>
          ))}
        </div>

        {/* Optional written review */}
        <textarea
          name="body"
          rows={3}
          placeholder="Share your experience (optional)"
          className="w-full border border-forest/15 rounded-lg px-3 py-2 font-body text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-forest placeholder:text-forest/30 resize-none"
        />

        <div className="flex items-center gap-3">
          <SubmitButton />
          {state?.error && (
            <p className="font-body text-xs text-rose-dark">{state.error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
