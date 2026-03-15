"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { requestBooking } from "@/app/actions/bookings";
import { SERVICE_LABELS, SERVICE_PRICES, type ServiceType } from "@/lib/db/types";
import { PawLoader } from "@/components/PawLoader";

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30 transition-all duration-200";
const labelClass =
  "font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block";

function SubmitButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  const label = count > 1
    ? `Request for ${count} Pets`
    : "Request Booking";
  return (
    <button type="submit" disabled={pending || count === 0}
      className="inline-flex items-center bg-teal text-cream font-body font-semibold text-sm rounded-xl px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50">
      {pending ? (
        <><PawLoader size="sm" className="mr-1.5" /> Submitting…</>
      ) : label}
    </button>
  );
}

type Pet = { id: string; name: string; species: string; rabies_exp: string | null; bordetella_exp: string | null };

export function BookingRequestForm({ pets, defaultPetId, defaultService }: { pets: Pet[]; defaultPetId?: string; defaultService?: string }) {
  const [state, formAction] = useFormState(requestBooking, null);

  // Pre-select defaultPetId if valid, otherwise pre-select all pets (common case: one pet)
  const initialSelected = pets.length === 1
    ? new Set([pets[0].id])
    : defaultPetId && pets.some((p) => p.id === defaultPetId)
    ? new Set([defaultPetId])
    : new Set<string>();

  const [selected, setSelected] = useState<Set<string>>(initialSelected);
  const [selectedService, setSelectedService] = useState<string>(defaultService || "boarding");

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const today = new Date().toISOString().split("T")[0];
  const vaccineWarningPets = pets.filter((p) => selected.has(p.id) && (
    !p.rabies_exp || p.rabies_exp < today ||
    !p.bordetella_exp || p.bordetella_exp < today
  ));

  return (
    <form action={formAction} className={`space-y-4 ${state?.error ? "animate-shake" : ""}`}>
      {state?.error && (
        <div key={state.error} className="px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
          {state.error}
        </div>
      )}

      {/* ── Pet picker ── */}
      <div>
        <label className={labelClass}>
          {pets.length === 1 ? "Pet" : "Pets *"}
          {pets.length > 1 && (
            <span className="ml-1.5 text-forest/30 normal-case font-normal tracking-normal">
              — select all that apply
            </span>
          )}
        </label>

        {pets.length === 1 ? (
          /* Single pet — show as a read-only pill, no UI needed */
          <>
            <input type="hidden" name="pet_id" value={pets[0].id} />
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 text-teal font-body text-sm font-semibold px-3 py-1.5 rounded-xl">
              {pets[0].species === "cat" ? "🐱" : "🐶"} {pets[0].name}
            </div>
          </>
        ) : (
          /* Multi-pet — checkbox cards */
          <div className="flex flex-wrap gap-2">
            {pets.map((p) => {
              const checked = selected.has(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-150 font-body text-sm font-semibold select-none active:scale-95 ${
                    checked
                      ? "bg-teal/10 border-teal/30 text-teal"
                      : "bg-white border-forest/15 text-forest/60 hover:border-forest/30 hover:text-forest"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="pet_id"
                    value={p.id}
                    checked={checked}
                    onChange={() => toggle(p.id)}
                    className="sr-only"
                  />
                  <span className="text-base leading-none">
                    {p.species === "cat" ? "🐱" : "🐶"}
                  </span>
                  {p.name}
                  {checked && (
                    <span className="w-4 h-4 rounded-full bg-teal flex items-center justify-center flex-shrink-0 animate-[scale-in_0.15s_ease-out]">
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Vaccine warnings ── */}
      {vaccineWarningPets.map((p) => (
        <div key={p.id} className="px-3 py-2 rounded-xl bg-gold/10 border border-gold/20 text-xs font-body text-gold-dark animate-[fade-slide-in_0.2s_ease-out]">
          ⚠️ {p.name}&apos;s vaccinations may need updating before booking.
        </div>
      ))}

      {/* ── Service + dates ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Service *</label>
          <select
            name="service"
            required
            className={inputClass}
            defaultValue={defaultService || "boarding"}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {(Object.entries(SERVICE_LABELS) as [string, string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <p key={selectedService} className="font-body text-xs text-forest/45 mt-1 animate-[fade-slide-in_0.2s_ease-out]">
            Estimated: ${(SERVICE_PRICES[selectedService as ServiceType] / 100).toFixed(0)}/night (varies by dates)
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Start *</label>
            <input type="date" name="start_date" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End</label>
            <input type="date" name="end_date" className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Preferred Drop-off Time</label>
        <select name="dropoff_time" className={inputClass}>
          <option value="">No preference</option>
          <option value="morning">Morning (7am–10am)</option>
          <option value="midday">Midday (10am–1pm)</option>
          <option value="afternoon">Afternoon (1pm–5pm)</option>
          <option value="evening">Evening (5pm–7pm)</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Notes / special requests</label>
        <textarea name="notes" rows={3} placeholder="Medications, drop-off time, anything else…"
          className={inputClass + " resize-none"} />
      </div>

      <div className="pt-1">
        <SubmitButton count={pets.length === 1 ? 1 : selected.size} />
        {selected.size === 0 && pets.length > 1 && (
          <p className="font-body text-xs text-forest/40 mt-2">Select at least one pet to continue.</p>
        )}
      </div>
    </form>
  );
}
