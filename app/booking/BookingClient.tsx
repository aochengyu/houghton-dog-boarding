"use client";

import { useState } from "react";
import Link from "next/link";
import { content } from "@/content";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Lock } from "lucide-react";

const bk = content.booking;

export function BookingClient() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-8 border border-forest/10 shadow-sm">
      <h2 className="font-display text-2xl font-bold text-forest mb-4">{bk.waiverTitle}</h2>
      <p className="font-body text-forest/60 mb-6 text-sm leading-relaxed">
        Please review our policies before submitting your request.{" "}
        <Link href="/legal/liability-waiver" className="text-terra underline underline-offset-2">
          Liability Waiver
        </Link>{" "}
        ·{" "}
        <Link href="/legal/cancellation" className="text-terra underline underline-offset-2">
          Cancellation Policy
        </Link>
      </p>

      <label htmlFor="waiver-agree" className="flex items-start gap-3 cursor-pointer group mb-8">
        <input
          type="checkbox"
          id="waiver-agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            agreed
              ? "bg-forest border-forest"
              : "border-forest/30 bg-white group-hover:border-forest"
          }`}
        >
          {agreed && (
            <Check
              size={14}
              className="text-cream animate-scale-in"
              strokeWidth={3}
              style={{ animation: 'scaleIn 0.2s ease forwards' }}
            />
          )}
        </div>
        <span className="font-body text-forest text-sm leading-relaxed">
          {bk.waiverCheckboxLabel}
        </span>
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <a
          href={agreed ? content.business.bookingFormUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={agreed ? 0 : -1}
          aria-disabled={!agreed}
          className={agreed ? undefined : "pointer-events-none"}
        >
          <Button size="lg" disabled={!agreed} className="gap-2">
            {!agreed && <Lock size={14} className="opacity-60" />}
            {bk.buttonLabel}
            {agreed && <ExternalLink size={16} />}
          </Button>
        </a>
        {!agreed && (
          <p className="text-sm font-body text-forest/40 italic">
            Please check the box above to enable the form.
          </p>
        )}
      </div>

      {/* Form area fades in smoothly when agreed */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          agreed && content.business.bookingFormEmbedSrc !== "YOUR_GOOGLE_FORM_EMBED_SRC"
            ? "opacity-100 max-h-[1000px] mt-8"
            : "opacity-0 max-h-0"
        }`}
      >
        <p className="text-xs text-forest/40 font-body mb-3 italic hidden sm:block">
          {bk.embedNote}
        </p>
        <iframe
          src={content.business.bookingFormEmbedSrc}
          className="w-full hidden sm:block rounded-2xl border border-forest/10"
          height="900"
          title="Booking Request Form"
          loading="lazy"
        />
      </div>
    </div>
  );
}
