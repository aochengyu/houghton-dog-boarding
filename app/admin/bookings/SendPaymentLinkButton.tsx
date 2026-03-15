"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sendStripePaymentLink } from "@/app/actions/stripe";
import { CreditCard, CheckCircle2, ExternalLink, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-lg
        bg-forest text-cream hover:bg-forest/80 transition-colors active:scale-95 transition-transform disabled:opacity-50 whitespace-nowrap"
    >
      {pending ? <Spinner size={11} className="text-cream" /> : <CreditCard size={11} />}
      {pending ? "Sending…" : "Send payment link"}
    </button>
  );
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 font-body text-[10px] text-forest/40 hover:text-teal transition-colors"
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

export function SendPaymentLinkButton({
  bookingId,
  priceCents,
  creditCents,
  isPaid,
  hasSession,
}: {
  bookingId:   string;
  priceCents:  number;
  creditCents: number;
  isPaid:      boolean;
  hasSession:  boolean;
}) {
  const [state, formAction] = useFormState(sendStripePaymentLink, null);
  const toast = useToast();
  const amountDue = priceCents - creditCents;

  useEffect(() => {
    if (state?.success && state.url) {
      toast.success("Payment link sent to client!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Already paid via Stripe
  if (isPaid) return null;

  // Price not set yet
  if (amountDue <= 0) return null;

  return (
    <form action={formAction} className="inline-flex items-center gap-2 flex-wrap">
      <input type="hidden" name="booking_id" value={bookingId} />

      {state?.success && state.url ? (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-body text-[10px] font-semibold text-teal">
            <CheckCircle2 size={11} /> Link sent
          </span>
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-body text-[10px] text-teal hover:text-teal-dark transition-colors"
          >
            <ExternalLink size={10} /> Open
          </a>
          <CopyButton url={state.url} />
        </div>
      ) : (
        <>
          <SubmitBtn />
          {hasSession && (
            <span className="font-body text-[10px] text-forest/35">Link already sent</span>
          )}
        </>
      )}
    </form>
  );
}
