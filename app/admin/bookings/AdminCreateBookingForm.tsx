"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { adminCreateBooking } from "@/app/actions/bookings";
import { SERVICE_LABELS, STATUS_LABELS, SERVICE_PRICES } from "@/lib/db/types";

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30";
const labelClass = "font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="bg-teal text-cream font-body font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-60">
      {pending ? "Creating…" : "Create Booking"}
    </button>
  );
}

type Client = { id: string; name?: string; email: string };
type Pet = { id: string; name: string; client_id: string };

export function AdminCreateBookingForm({ clients, pets }: { clients: Client[]; pets: Pet[] }) {
  const [state, formAction] = useFormState(adminCreateBooking, null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedService, setSelectedService] = useState("boarding");

  const clientPets = pets.filter((p) => p.client_id === selectedClientId);
  const suggestedPrice = ((SERVICE_PRICES as Record<string, number>)[selectedService] ?? 0) / 100;

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
          {state.error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Client *</label>
          <select
            name="client_id" required className={inputClass}
            value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Pet *</label>
          <select name="pet_id" required className={inputClass} disabled={!selectedClientId}>
            <option value="">Select pet…</option>
            {clientPets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Service *</label>
          <select name="service" required className={inputClass}
            value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            {(Object.entries(SERVICE_LABELS) as [string, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Start date *</label>
          <input type="date" name="start_date" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>End date</label>
          <input type="date" name="end_date" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Price ($)</label>
          <input type="number" name="price" step="0.01" min="0"
            defaultValue={suggestedPrice} key={selectedService}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status *</label>
          <select name="status" required className={inputClass}>
            {(["inquiry", "confirmed", "active", "completed", "cancelled"] as const).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Credit applied ($)</label>
          <input type="number" name="credit_applied" step="0.01" min="0" defaultValue="0" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Notes</label>
          <input type="text" name="notes" placeholder="Internal notes…" className={inputClass} />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
