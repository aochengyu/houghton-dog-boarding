"use client";

import { useTransition } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import { approveReview, deleteReview } from "@/app/actions/reviews";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";

export function ReviewActions({
  reviewId,
  approved,
}: {
  reviewId: string;
  approved: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleApprove() {
    startTransition(async () => {
      await approveReview(reviewId);
      toast.success("Review approved and published");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteReview(reviewId);
      toast.info("Review deleted");
    });
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      {!approved && (
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal text-cream hover:bg-teal-dark transition-colors active:scale-95 disabled:opacity-50"
        >
          {isPending ? <Spinner size={12} className="text-cream" /> : <CheckCircle2 size={12} />}
          Approve
        </button>
      )}
      {approved && (
        <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
          <CheckCircle2 size={11} /> Approved
        </span>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose/10 text-rose-dark border border-rose/20 hover:bg-rose/20 transition-colors active:scale-95 disabled:opacity-50"
      >
        {isPending ? <Spinner size={12} /> : <Trash2 size={12} />}
        Delete
      </button>
    </div>
  );
}
