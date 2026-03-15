"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useTransition, useEffect } from "react";
import { joinWaitlist, removeFromWaitlist } from "@/app/actions/waitlist";
import { SERVICE_LABELS, type ServiceType, type WaitlistEntry } from "@/lib/db/types";
import { PawLoader } from "@/components/PawLoader";
import { useToast } from "@/components/Toast";

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30";
const labelClass =
  "font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-teal text-cream font-body font-semibold text-sm rounded-xl px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {pending && <PawLoader size="sm" className="text-cream" />}
      {pending ? "Adding…" : "Join Waitlist"}
    </button>
  );
}

function RemoveButton({ entryId }: { entryId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => removeFromWaitlist(entryId))}
      className="font-body text-[10px] font-semibold text-rose-dark hover:text-rose transition-colors disabled:opacity-50 px-2 py-1 rounded-lg hover:bg-rose/10 active:scale-95"
    >
      {isPending ? "…" : "Remove"}
    </button>
  );
}

function formatDate(ds: string): string {
  const d = new Date(ds + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  entries: WaitlistEntry[];
};

export function WaitlistClient({ entries }: Props) {
  const [state, formAction] = useFormState<{ error?: string; success?: boolean } | null, FormData>(joinWaitlist, null);
  const { success: toastSuccess } = useToast();

  useEffect(() => {
    if (state?.success) {
      toastSuccess("You're on the waitlist!");
    }
  }, [state?.success, toastSuccess]);

  return (
    <div className="space-y-6">
      {/* Join form */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <h2 className="font-display text-base font-bold text-forest mb-5">Add to Waitlist</h2>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
              {state.error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wl_service" className={labelClass}>Service *</label>
              <select
                id="wl_service"
                name="service"
                required
                className={inputClass}
                defaultValue="boarding"
              >
                {(Object.entries(SERVICE_LABELS) as [string, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="wl_start" className={labelClass}>Start *</label>
                <input
                  id="wl_start"
                  type="date"
                  name="start_date"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="wl_end" className={labelClass}>End</label>
                <input
                  id="wl_end"
                  type="date"
                  name="end_date"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="wl_notes" className={labelClass}>Notes / special requests</label>
            <textarea
              id="wl_notes"
              name="notes"
              rows={3}
              placeholder="Any details about your pet's needs, flexibility on dates, etc."
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="pt-1">
            <SubmitButton />
          </div>
        </form>
      </div>

      {/* Current entries */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-forest/[0.06]">
          <h2 className="font-display text-base font-bold text-forest">Your Waitlist Entries</h2>
        </div>
        {entries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-body text-sm text-forest/40">No waitlist entries yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className="px-6 py-4 flex items-start justify-between gap-4 animate-[fade-slide-in_0.2s_ease-out_both]"
                style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
              >
                <div>
                  <p className="font-body text-sm font-semibold text-forest">
                    {SERVICE_LABELS[entry.service as ServiceType]}
                  </p>
                  <p className="font-body text-xs text-forest/45 mt-0.5">
                    {formatDate(entry.start_date)}
                    {entry.end_date && ` – ${formatDate(entry.end_date)}`}
                  </p>
                  {entry.notes && (
                    <p className="font-body text-xs text-forest/40 mt-1.5 bg-cream rounded-lg px-3 py-2">
                      {entry.notes}
                    </p>
                  )}
                </div>
                <RemoveButton entryId={entry.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
