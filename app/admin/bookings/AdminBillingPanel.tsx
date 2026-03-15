"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateBookingBilling } from "@/app/actions/bookings";
import { DollarSign, CheckCircle2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { SendPaymentLinkButton } from "./SendPaymentLinkButton";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";

const inputClass =
  "w-full border border-forest/15 rounded-lg px-3 py-1.5 font-body text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-forest placeholder:text-forest/30";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-4 py-1.5 rounded-lg bg-teal text-cream hover:bg-teal-dark transition-colors disabled:opacity-50 whitespace-nowrap">
      {pending && <Spinner size={11} className="text-cream" />}
      {pending ? "Saving…" : "Save billing"}
    </button>
  );
}

const PAYMENT_METHODS = ["Stripe", "Cash", "Venmo", "Zelle", "Check", "Other"];

export function AdminBillingPanel({
  bookingId, priceCents, creditCents, paidAt, paymentMethod, stripeSessionId,
}: {
  bookingId: string;
  priceCents: number;
  creditCents: number;
  paidAt: string | null;
  paymentMethod: string | null;
  stripeSessionId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(updateBookingBilling, null);
  const toast = useToast();
  const isPaid = !!paidAt;
  const total = priceCents - creditCents;

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast.error(state.error);
    } else if (!state.error) {
      toast.success("Billing saved");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="mt-3 pt-3 border-t border-forest/[0.06]">
      {/* Summary row — always visible */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-forest/40 hover:text-teal transition-colors group"
        >
          <DollarSign size={12} />
          <span className="font-body text-[11px] font-semibold text-forest/40 group-hover:text-teal">
            {priceCents > 0 ? `$${(priceCents / 100).toFixed(0)}` : "Set price"}
            {creditCents > 0 && <span className="text-forest/25"> − ${(creditCents / 100).toFixed(0)} credit</span>}
          </span>
          <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {isPaid ? (
          <span className="inline-flex items-center gap-1 font-body text-[10px] font-semibold text-teal bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={9} /> Paid · {paymentMethod}
          </span>
        ) : priceCents > 0 ? (
          <span className="font-body text-[10px] text-rose-dark bg-rose/10 border border-rose/15 px-2 py-0.5 rounded-full font-semibold">
            Unpaid · ${(total / 100).toFixed(0)} due
          </span>
        ) : null}

        {!isPaid && (
          <SendPaymentLinkButton
            bookingId={bookingId}
            priceCents={priceCents}
            creditCents={creditCents}
            isPaid={isPaid}
            hasSession={!!stripeSessionId}
          />
        )}
      </div>

      {/* Expandable billing form */}
      {open && (
        <form action={formAction} className="mt-3 bg-cream rounded-xl p-4 space-y-3">
          <input type="hidden" name="booking_id" value={bookingId} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1 block">Price ($)</label>
              <input type="number" name="price" step="0.01" min="0"
                defaultValue={(priceCents / 100).toFixed(2)} className={inputClass} />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1 block">Credit ($)</label>
              <input type="number" name="credit_applied" step="0.01" min="0"
                defaultValue={(creditCents / 100).toFixed(2)} className={inputClass} />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1 block">Method</label>
              <select name="payment_method" defaultValue={paymentMethod ?? ""} className={inputClass}>
                <option value="">—</option>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer mb-0.5">
                <input type="hidden" name="mark_paid" value="false" />
                <input type="checkbox" name="mark_paid" value="true"
                  defaultChecked={isPaid} className="accent-teal w-3.5 h-3.5" />
                <span className="font-body text-xs text-forest/55">Mark paid</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {total > 0 && (
              <p className="font-body text-xs text-forest/40">
                Total: <span className="font-semibold text-forest/60">${(total / 100).toFixed(2)}</span>
              </p>
            )}
            <SaveButton />
          </div>
        </form>
      )}
    </div>
  );
}
