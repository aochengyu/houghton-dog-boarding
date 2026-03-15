"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Download, Users, CalendarOff, CalendarDays, Copy, Check } from "lucide-react";
import { updateCapacity, addBlackoutDate, removeBlackoutDate } from "@/app/actions/settings";

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-2.5 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest";

function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-body text-xs font-semibold px-4 py-2.5 rounded-xl bg-teal text-cream hover:bg-teal-dark transition-colors disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-body text-xs font-semibold px-4 py-2.5 rounded-xl bg-teal text-cream hover:bg-teal-dark transition-colors disabled:opacity-60 whitespace-nowrap"
    >
      {pending ? "Adding…" : "Add date"}
    </button>
  );
}

function RemoveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-body text-[10px] font-semibold text-rose-dark hover:text-rose transition-colors disabled:opacity-50 px-2 py-1 rounded-lg hover:bg-rose/10"
    >
      {pending ? "…" : "Remove"}
    </button>
  );
}

function formatDate(ds: string): string {
  const d = new Date(ds + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

function CalendarCopyButton({ icalUrl }: { icalUrl: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(icalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-2 rounded-xl bg-teal/10 text-teal border border-teal/20 hover:bg-teal/20 transition-colors flex-shrink-0"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy URL"}
    </button>
  );
}

type BlackoutEntry = { id: string; date: string; reason: string | null };

type Props = {
  maxCapacity: number;
  blackoutDates: BlackoutEntry[];
  icalUrl: string;
};

export function SettingsClient({ maxCapacity, blackoutDates, icalUrl }: Props) {
  const [capacityState, capacityAction] = useFormState(updateCapacity, null);
  const [blackoutState, blackoutAction] = useFormState(addBlackoutDate, null);

  return (
    <div className="space-y-6">
      {/* Section 1: Capacity */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Users size={15} className="text-teal" />
          <h2 className="font-display text-base font-bold text-forest">Capacity</h2>
        </div>
        <p className="font-body text-xs text-forest/45 mb-5">
          Maximum pets you can host simultaneously. Days at or above this count show a warning on the calendar.
        </p>

        <form action={capacityAction}>
          {capacityState?.error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
              {capacityState.error}
            </div>
          )}
          {capacityState?.success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-teal/10 border border-teal/20 text-sm font-body text-teal">
              Capacity updated.
            </div>
          )}
          <div className="flex items-end gap-4">
            <div>
              <label htmlFor="max_capacity" className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1.5 block">
                Max pets at once
              </label>
              <input
                id="max_capacity"
                name="max_capacity"
                type="number"
                min="1"
                max="50"
                defaultValue={maxCapacity}
                className="w-24 border border-forest/15 rounded-xl px-4 py-2.5 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest"
              />
            </div>
            <SaveButton />
          </div>
        </form>
      </div>

      {/* Section 2: Blackout Dates */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <div className="flex items-center gap-2 mb-1">
          <CalendarOff size={15} className="text-teal" />
          <h2 className="font-display text-base font-bold text-forest">Blackout Dates</h2>
        </div>
        <p className="font-body text-xs text-forest/45 mb-5">
          Dates when you&apos;re unavailable. Clients won&apos;t be able to request bookings on these dates.
        </p>

        <form action={blackoutAction} className="mb-5">
          {blackoutState?.error && (
            <div className="mb-3 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
              {blackoutState.error}
            </div>
          )}
          {blackoutState?.success && (
            <div className="mb-3 px-4 py-3 rounded-xl bg-teal/10 border border-teal/20 text-sm font-body text-teal">
              Date blocked successfully.
            </div>
          )}
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label htmlFor="blackout_date" className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1.5 block">
                Date
              </label>
              <input
                id="blackout_date"
                name="date"
                type="date"
                required
                className={inputClass + " w-auto"}
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label htmlFor="blackout_reason" className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1.5 block">
                Reason (optional)
              </label>
              <input
                id="blackout_reason"
                name="reason"
                type="text"
                placeholder="e.g. Vacation"
                className={inputClass}
              />
            </div>
            <AddButton />
          </div>
        </form>

        {/* List of existing blackout dates */}
        {blackoutDates.length === 0 ? (
          <p className="font-body text-sm text-forest/35 text-center py-4">No dates blocked yet.</p>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {blackoutDates.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-forest">{formatDate(d.date)}</p>
                  {d.reason && (
                    <p className="font-body text-xs text-forest/45">{d.reason}</p>
                  )}
                </div>
                <form action={removeBlackoutDate.bind(null, d.id)}>
                  <RemoveButton />
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Calendar Integration */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={15} className="text-teal" />
          <h2 className="font-display text-base font-bold text-forest">Calendar Integration</h2>
        </div>
        <p className="font-body text-xs text-forest/45 mb-5">
          Subscribe to this iCal feed in Google Calendar, Apple Calendar, or Outlook to see all confirmed and active bookings.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <code className="font-body text-xs bg-[#f5f0eb] border border-forest/[0.07] rounded-xl px-4 py-2.5 text-forest/60 break-all flex-1 min-w-0">
            {icalUrl}
          </code>
          <CalendarCopyButton icalUrl={icalUrl} />
        </div>
      </div>

      {/* Section 4: Export */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Download size={15} className="text-teal" />
          <h2 className="font-display text-base font-bold text-forest">Export Data</h2>
        </div>
        <p className="font-body text-xs text-forest/45 mb-5">
          Download your booking and client data for accounting or record-keeping.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/api/admin/export/bookings"
            download
            className="font-body text-xs font-semibold px-4 py-2 rounded-xl bg-teal/10 text-teal border border-teal/20 hover:bg-teal/20 transition-colors"
          >
            Export bookings (CSV)
          </a>
          <a
            href="/api/admin/export/clients"
            download
            className="font-body text-xs font-semibold px-4 py-2 rounded-xl bg-teal/10 text-teal border border-teal/20 hover:bg-teal/20 transition-colors"
          >
            Export clients (CSV)
          </a>
        </div>
      </div>
    </div>
  );
}
