"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { cancelBookingAsClient } from "@/app/actions/bookings";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { error: toastError, success } = useToast();

  function handleConfirm() {
    setOpen(false);
    startTransition(async () => {
      const result = await cancelBookingAsClient(bookingId);
      if (result.error) {
        toastError(result.error);
      } else {
        success("Booking cancelled.");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 font-body text-xs text-rose-dark/70 hover:text-rose-dark transition-colors disabled:opacity-50"
      >
        {isPending ? <Spinner size={12} /> : null}
        Cancel booking
      </button>

      <ConfirmDialog
        open={open}
        title="Cancel this booking?"
        description="This will cancel your booking request. The host will be notified. This action cannot be undone."
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        danger
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
