"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminCreateReferral } from "@/app/actions/referrals";
import { CheckCircle } from "lucide-react";

const selectClass =
  "w-full border border-forest/15 rounded-xl px-4 py-2.5 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="bg-teal text-cream font-body font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-60">
      {pending ? "Creating…" : "Create Referral"}
    </button>
  );
}

type Client = { id: string; name?: string; email: string };

export function AdminCreateReferralForm({ clients }: { clients: Client[] }) {
  const [state, formAction] = useFormState(adminCreateReferral, null);

  if (state?.success) {
    return (
      <div className="flex items-center gap-2 text-teal font-body text-sm">
        <CheckCircle size={15} /> Referral created — use "Apply $20 Credit" below when ready to credit both parties.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <p className="font-body text-xs text-rose-dark bg-rose/10 border border-rose/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block">
            Who referred?
          </label>
          <select name="referrer_id" required className={selectClass}>
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block">
            Who was referred?
          </label>
          <select name="referred_id" required className={selectClass}>
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.email}</option>
            ))}
          </select>
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
