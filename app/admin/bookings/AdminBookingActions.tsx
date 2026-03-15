"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/bookings";
import type { BookingStatus } from "@/lib/db/types";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  inquiry:   ["confirmed", "cancelled"],
  confirmed: ["active", "cancelled"],
  active:    ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const TRANSITION_LABELS: Partial<Record<BookingStatus, string>> = {
  confirmed: "Confirm",
  active:    "Mark Active",
  completed: "Complete",
  cancelled: "Cancel",
};

export function AdminBookingActions({ bookingId, currentStatus }: { bookingId: string; currentStatus: BookingStatus }) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();
  const next = TRANSITIONS[currentStatus];
  if (!next.length) return null;

  const performUpdate = (status: BookingStatus) => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status);
      if (status === "confirmed") {
        toast.success("Booking confirmed");
      } else if (status === "cancelled") {
        toast.info("Booking cancelled");
      }
    });
  };

  const handleClick = (status: BookingStatus) => {
    if (status === "cancelled") {
      setConfirmOpen(true);
    } else {
      performUpdate(status);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {next.map((status) => (
          <button
            key={status}
            onClick={() => handleClick(status)}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 ${
              status === "cancelled"
                ? "bg-rose/10 text-rose-dark hover:bg-rose/20"
                : "bg-teal/10 text-teal hover:bg-teal/20"
            }`}
          >
            {isPending && <Spinner size={10} />}
            {TRANSITION_LABELS[status]}
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this booking?"
        description="This will mark the booking as cancelled. This action cannot be undone."
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        danger
        onConfirm={() => {
          setConfirmOpen(false);
          performUpdate("cancelled");
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
