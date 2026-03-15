"use client";

import { useState, useTransition } from "react";
import { signWaiver } from "@/app/actions/waiver";

export default function WaiverPage() {
  const [agreed, setAgreed] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSign() {
    startTransition(async () => {
      await signWaiver();
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-2">
          Before you continue
        </p>
        <h1 className="font-display text-3xl font-bold text-forest">Client Service Agreement</h1>
        <p className="font-body text-sm text-forest/55 mt-2">
          Please read and sign our waiver before accessing your account.
        </p>
      </div>

      {/* Scrollable waiver text */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-6">
        <div className="h-96 overflow-y-auto pr-2 space-y-4 text-sm font-body text-forest/70 leading-relaxed">
          <h2 className="font-display text-base font-bold text-forest">
            Paws and Petals — Dog Boarding &amp; Pet Care Service Agreement
          </h2>

          <p>
            This Client Service Agreement (&quot;Agreement&quot;) is entered into between Paws and Petals
            (&quot;Provider&quot;) and the undersigned client (&quot;Client&quot;). By signing this Agreement,
            Client agrees to all terms and conditions set forth herein.
          </p>

          <h3 className="font-semibold text-forest mt-4">1. Services</h3>
          <p>
            Provider agrees to furnish pet care services including but not limited to boarding, day care,
            dog walking, and drop-in visits for Client&apos;s pet(s) as agreed upon at the time of
            booking. All services are subject to availability.
          </p>

          <h3 className="font-semibold text-forest mt-4">2. Health and Vaccinations</h3>
          <p>
            Client certifies that all pets in their care are current on required vaccinations, including
            but not limited to Rabies, Bordetella (kennel cough), and DHPP. Client agrees to provide
            proof of vaccination upon request. Any pet showing signs of illness may be refused service
            or separated from other animals at the Provider&apos;s discretion.
          </p>

          <h3 className="font-semibold text-forest mt-4">3. Emergency Veterinary Care</h3>
          <p>
            In the event of a medical emergency, Provider will make every effort to contact Client and
            the designated emergency contact. If Client cannot be reached, Provider is authorized to
            seek immediate veterinary care at the nearest available veterinary clinic. Client agrees
            to be responsible for all veterinary costs incurred on behalf of their pet(s).
          </p>

          <h3 className="font-semibold text-forest mt-4">4. Assumption of Risk</h3>
          <p>
            Client acknowledges that the care of pets involves inherent risks, including injury,
            illness, escape, or death. Client assumes full responsibility for any and all such risks.
            Client agrees that Provider shall not be held liable for any loss, injury, or death of a
            pet resulting from causes beyond Provider&apos;s reasonable control.
          </p>

          <h3 className="font-semibold text-forest mt-4">5. Limitation of Liability</h3>
          <p>
            Provider&apos;s liability to Client for any claim arising from the services provided shall be
            limited to the total fees paid for the specific service during which the incident occurred.
            Provider shall not be liable for indirect, incidental, or consequential damages.
          </p>

          <h3 className="font-semibold text-forest mt-4">6. Behavior and Temperament</h3>
          <p>
            Client warrants that their pet(s) are not known to be dangerous or excessively aggressive.
            Client agrees to disclose any history of biting, aggression, or behavioral issues prior to
            service. Provider reserves the right to refuse or discontinue service for any pet that
            poses a risk to people or other animals.
          </p>

          <h3 className="font-semibold text-forest mt-4">7. Personal Property</h3>
          <p>
            Client agrees to label all items brought for their pet (food, medications, bedding, toys).
            Provider is not responsible for loss or damage to personal items brought into the facility.
          </p>

          <h3 className="font-semibold text-forest mt-4">8. Cancellation Policy</h3>
          <p>
            Cancellations must be made at least 48 hours in advance of the scheduled service. Late
            cancellations or no-shows may be subject to a cancellation fee as outlined in the current
            fee schedule.
          </p>

          <h3 className="font-semibold text-forest mt-4">9. Photography and Media</h3>
          <p>
            Client grants Provider permission to photograph and/or video Client&apos;s pet(s) for use in
            social media, marketing materials, and the Provider&apos;s website. Client may opt out of this
            permission by notifying Provider in writing.
          </p>

          <h3 className="font-semibold text-forest mt-4">10. Governing Law</h3>
          <p>
            This Agreement shall be governed by the laws of the state in which Provider operates.
            Any disputes arising from this Agreement shall be resolved through binding arbitration.
          </p>

          <p className="text-forest/45 text-xs mt-6">
            Last updated: March 2026
          </p>
        </div>
      </div>

      {/* Agreement checkbox + sign button */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 space-y-5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                agreed
                  ? "bg-teal border-teal"
                  : "bg-white border-forest/25 group-hover:border-forest/50"
              }`}
            >
              {agreed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="white"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="font-body text-sm text-forest/70 leading-relaxed">
            I have read and agree to the Paws and Petals Client Service Agreement, including the
            assumption of risk, emergency care authorization, and cancellation policy.
          </span>
        </label>

        <button
          onClick={handleSign}
          disabled={!agreed || isPending}
          className="w-full bg-teal text-cream font-body font-semibold text-sm rounded-xl px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {isPending ? "Signing…" : "Sign Waiver & Continue"}
        </button>

        <p className="font-body text-xs text-forest/35 text-center">
          Your digital signature is legally binding and recorded with a timestamp.
        </p>
      </div>
    </div>
  );
}
