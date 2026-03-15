"use client";

import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { useState } from "react";
import type { Pet } from "@/lib/db/types";

type ActionFn = (
  prev: { error?: string; success?: boolean } | null,
  formData: FormData
) => Promise<{ error?: string; success?: boolean } | never>;

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30";
const labelClass =
  "font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block";
const sectionClass = "pt-6 border-t border-forest/[0.07]";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="bg-teal text-cream font-body font-semibold text-sm rounded-xl px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-60">
      {pending ? "Saving…" : label}
    </button>
  );
}

export function PetForm({ pet, action, submitLabel }: { pet?: Pet; action: ActionFn; submitLabel: string }) {
  const [state, formAction] = useFormState(action, null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(pet?.photo_url ?? null);

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {pet && <input type="hidden" name="pet_id" value={pet.id} />}

      {state?.error && (
        <div className="px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="px-4 py-3 rounded-xl bg-teal/10 border border-teal/20 text-sm font-body text-teal">
          Saved successfully!
        </div>
      )}

      {/* Photo */}
      <div>
        <label className={labelClass}>Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
            {previewUrl ? (
              <Image src={previewUrl} alt="Pet" width={64} height={64} className="object-cover w-full h-full" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
            )}
          </div>
          <input
            name="photo" type="file" accept="image/*"
            className="font-body text-xs text-forest/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal/10 file:text-teal hover:file:bg-teal/20"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreviewUrl(URL.createObjectURL(f));
            }}
          />
        </div>
      </div>

      {/* Name + Species */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>Name *</label>
          <input id="name" name="name" type="text" required defaultValue={pet?.name} placeholder="Buddy" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Species *</label>
          <div className="flex gap-3">
            {(["dog", "cat"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="species" value={s} defaultChecked={pet ? pet.species === s : s === "dog"}
                  className="accent-teal w-4 h-4" />
                <span className="font-body text-sm text-forest capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Breed + DOB */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="breed" className={labelClass}>Breed</label>
          <input id="breed" name="breed" type="text" defaultValue={pet?.breed ?? ""} placeholder="Golden Retriever" className={inputClass} />
        </div>
        <div>
          <label htmlFor="dob" className={labelClass}>Date of birth</label>
          <input id="dob" name="dob" type="date" defaultValue={pet?.dob ?? ""} className={inputClass} />
        </div>
      </div>

      {/* Weight + Microchip */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="weight_lbs" className={labelClass}>Weight (lbs)</label>
          <input id="weight_lbs" name="weight_lbs" type="number" step="0.1" min="0" defaultValue={pet?.weight_lbs ?? ""} placeholder="35.0" className={inputClass} />
        </div>
        <div>
          <label htmlFor="microchip_id" className={labelClass}>Microchip ID</label>
          <input id="microchip_id" name="microchip_id" type="text" defaultValue={pet?.microchip_id ?? ""} placeholder="Optional" className={inputClass} />
        </div>
      </div>

      {/* Spayed/neutered */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="spayed_neutered" defaultChecked={pet?.spayed_neutered ?? false} className="accent-teal w-4 h-4" />
        <span className="font-body text-sm text-forest">Spayed / Neutered</span>
      </label>

      {/* Vet info */}
      <div className={sectionClass}>
        <p className={labelClass}>Veterinarian</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="vet_name" type="text" defaultValue={pet?.vet_name ?? ""} placeholder="Vet clinic name" className={inputClass} />
          <input name="vet_phone" type="tel" defaultValue={pet?.vet_phone ?? ""} placeholder="Vet phone number" className={inputClass} />
        </div>
      </div>

      {/* Vaccinations */}
      <div className={sectionClass}>
        <p className={labelClass}>Vaccination records</p>
        <p className="font-body text-xs text-forest/40 mb-3">Expiry dates help us ensure all guests are up to date for a safe stay.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rabies_exp" className={labelClass}>Rabies expires</label>
            <input id="rabies_exp" name="rabies_exp" type="date" defaultValue={pet?.rabies_exp ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="bordetella_exp" className={labelClass}>Bordetella expires</label>
            <input id="bordetella_exp" name="bordetella_exp" type="date" defaultValue={pet?.bordetella_exp ?? ""} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className={sectionClass}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="medical_notes" className={labelClass}>Medical notes</label>
            <textarea id="medical_notes" name="medical_notes" rows={3} defaultValue={pet?.medical_notes ?? ""}
              placeholder="Medications, allergies, conditions…" className={inputClass + " resize-none"} />
          </div>
          <div>
            <label htmlFor="behavioral_notes" className={labelClass}>Behavioral notes</label>
            <textarea id="behavioral_notes" name="behavioral_notes" rows={3} defaultValue={pet?.behavioral_notes ?? ""}
              placeholder="Separation anxiety, reactivity, quirks…" className={inputClass + " resize-none"} />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
