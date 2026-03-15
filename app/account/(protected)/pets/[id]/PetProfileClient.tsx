"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Pencil, X, CalendarHeart, Weight,
  CheckCircle2, XCircle, Cpu, Cake, Phone,
  Stethoscope, BookOpen, Smile, CalendarDays,
  ShieldCheck, ShieldAlert, ShieldOff, Camera,
} from "lucide-react";
import type { Pet } from "@/lib/db/types";
import { PetForm } from "../PetForm";
import { updatePet, updatePetPhoto } from "@/app/actions/pets";
import { Spinner } from "@/components/Spinner";

// ── helpers ────────────────────────────────────────────────

function calcAge(dob: string | null): string {
  if (!dob) return "Unknown age";
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years === 0) return `${months} month${months !== 1 ? "s" : ""} old`;
  if (months === 0) return `${years} year${years !== 1 ? "s" : ""} old`;
  return `${years} yr ${months} mo old`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

type VaxStatus = "ok" | "soon" | "expired" | "missing";

function vaccineStatus(expDate: string | null): VaxStatus {
  if (!expDate) return "missing";
  const days = Math.floor((new Date(expDate).getTime() - Date.now()) / 86400000);
  if (days < 0)   return "expired";
  if (days <= 30) return "soon";
  return "ok";
}

const VAX_ICON: Record<VaxStatus, typeof ShieldCheck> = {
  ok: ShieldCheck, soon: ShieldAlert, expired: ShieldOff, missing: ShieldOff,
};
const VAX_COLOR: Record<VaxStatus, string> = {
  ok: "text-teal/60", soon: "text-gold", expired: "text-rose-dark", missing: "text-forest/25",
};
const VAX_LABEL: Record<VaxStatus, string> = {
  ok: "Up to date", soon: "Expires soon", expired: "Expired", missing: "Not recorded",
};

// ── component ──────────────────────────────────────────────

export function PetProfileClient({ pet: initialPet }: { pet: Pet }) {
  const [pet, setPet]         = useState(initialPet);
  const [editing, setEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPet.photo_url);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadPending, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const speciesEmoji = pet.species === "cat" ? "🐱" : "🐶";
  const subtitle = [pet.species, pet.breed].filter(Boolean).map((s) => s!.trim()).join(" · ");

  // After a successful edit save, update local state so view mode reflects changes
  // without a full page reload
  const handleSaved = (updated: Pet) => {
    setPet(updated);
    setEditing(false);
  };

  // Photo click → file picker → optimistic preview → server upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setPhotoUrl(URL.createObjectURL(file)); // instant preview
    const fd = new FormData();
    fd.append("pet_id", pet.id);
    fd.append("photo", file);
    startUpload(async () => {
      const result = await updatePetPhoto(null, fd);
      if (result?.error) {
        setPhotoError(result.error);
        setPhotoUrl(pet.photo_url); // revert on error
      }
    });
  };

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/account/pets"
        className="inline-flex items-center gap-1.5 font-body text-xs text-forest/40 hover:text-teal transition-colors mb-6"
      >
        <ArrowLeft size={12} /> Back to My Pets
      </Link>

      {/* ── EDIT MODE ── */}
      {editing && (
        <div className="animate-[fade-slide-in_0.2s_ease-out]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-0.5">Editing profile</p>
              <h1 className="font-display text-3xl font-bold text-forest">{pet.name}</h1>
            </div>
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 font-body text-sm text-forest/50 hover:text-forest border border-forest/15 rounded-xl px-4 py-2.5 hover:bg-forest/5 transition-colors"
            >
              <X size={14} /> Cancel
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8">
            <PetForm
              pet={pet}
              action={async (prev, fd) => {
                const result = await updatePet(prev, fd);
                if (!result?.error && result?.success) {
                  // Re-read updated values from formData to update local state
                  // The server revalidates, so a soft update here is sufficient
                  setEditing(false);
                }
                return result;
              }}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      )}

      {/* ── VIEW MODE ── */}
      {!editing && (
        <div className="animate-[fade-slide-in_0.2s_ease-out]">
          {/* Hero card */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
            <div className="flex items-start gap-6">

              {/* Clickable photo avatar */}
              <div className="relative flex-shrink-0 group/photo">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadPending}
                  className="w-24 h-24 rounded-2xl overflow-hidden bg-cream border border-forest/[0.07] block focus:outline-none focus-visible:ring-2 focus-visible:ring-teal relative"
                  title="Click to update photo"
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={pet.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {speciesEmoji}
                    </div>
                  )}
                  {/* Upload pending overlay */}
                  {uploadPending && (
                    <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                      <Spinner size={20} className="text-teal" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  {!uploadPending && (
                    <div className="absolute inset-0 bg-forest/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-150 rounded-2xl">
                      <Camera size={20} className="text-white" />
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Name & meta */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1 capitalize">
                  {pet.species} profile
                </p>
                <h1 className="font-display text-3xl font-bold text-forest mb-1">{pet.name}</h1>
                <p className="font-body text-sm text-forest/50 capitalize mb-2">{subtitle}</p>
                {pet.dob && (
                  <p className="font-body text-xs text-teal/80 font-semibold">{calcAge(pet.dob)}</p>
                )}
                {photoError && (
                  <p className="font-body text-xs text-rose-dark mt-1">{photoError}</p>
                )}
              </div>

              {/* Edit toggle */}
              <button
                onClick={() => setEditing(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-forest/50 hover:text-teal border border-forest/10 hover:border-teal/30 rounded-xl px-3 py-2 transition-colors active:scale-95 transition-transform"
              >
                <Pencil size={12} /> Edit
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
            <h2 className="font-display text-base font-bold text-forest mb-4">Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Weight size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Weight</p>
                  <p className="font-body text-sm text-forest">{pet.weight_lbs ? `${pet.weight_lbs} lbs` : "Not recorded"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {pet.spayed_neutered
                  ? <CheckCircle2 size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
                  : <XCircle size={16} className="text-forest/25 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Spayed / Neutered</p>
                  <p className="font-body text-sm text-forest">{pet.spayed_neutered ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Cpu size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Microchip ID</p>
                  <p className="font-body text-sm text-forest font-mono">{pet.microchip_id || "Not recorded"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Cake size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Date of Birth</p>
                  <p className="font-body text-sm text-forest">{formatDate(pet.dob)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccinations */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
            <h2 className="font-display text-base font-bold text-forest mb-4">Vaccinations</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                { label: "Rabies",     exp: pet.rabies_exp },
                { label: "Bordetella", exp: pet.bordetella_exp },
              ] as const).map(({ label, exp }) => {
                const status = vaccineStatus(exp ?? null);
                const Icon = VAX_ICON[status];
                return (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={16} className={`${VAX_COLOR[status]} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">{label}</p>
                      <p className={`font-body text-sm ${status === "ok" ? "text-forest" : VAX_COLOR[status]}`}>
                        {exp ? `Expires ${formatDate(exp)}` : "Not recorded"}
                      </p>
                      {status !== "ok" && status !== "missing" && (
                        <p className={`font-body text-[11px] font-semibold mt-0.5 ${VAX_COLOR[status]}`}>
                          {VAX_LABEL[status]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vet */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope size={16} className="text-teal/60" />
              <h2 className="font-display text-base font-bold text-forest">Veterinarian</h2>
            </div>
            {pet.vet_name || pet.vet_phone ? (
              <div className="flex flex-col gap-2">
                {pet.vet_name && <p className="font-body text-sm text-forest">{pet.vet_name}</p>}
                {pet.vet_phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-teal/50" />
                    <a href={`tel:${pet.vet_phone}`} className="font-body text-sm text-teal hover:underline">{pet.vet_phone}</a>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-body text-sm text-forest/40 italic">No vet on file</p>
            )}
          </div>

          {/* Medical notes */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-teal/60" />
              <h2 className="font-display text-base font-bold text-forest">Medical Notes</h2>
            </div>
            {pet.medical_notes
              ? <p className="font-body text-sm text-forest/80 whitespace-pre-wrap leading-relaxed">{pet.medical_notes}</p>
              : <p className="font-body text-sm text-forest/40 italic">None on file</p>}
          </div>

          {/* Behavioral notes */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Smile size={16} className="text-teal/60" />
              <h2 className="font-display text-base font-bold text-forest">Behavioral Notes</h2>
            </div>
            {pet.behavioral_notes
              ? <p className="font-body text-sm text-forest/80 whitespace-pre-wrap leading-relaxed">{pet.behavioral_notes}</p>
              : <p className="font-body text-sm text-forest/40 italic">None on file</p>}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-5">
            <Link
              href={`/account/bookings?pet_id=${pet.id}`}
              className="inline-flex items-center gap-2 bg-teal text-cream font-body font-semibold text-sm rounded-xl px-5 py-3 hover:bg-teal-dark transition-colors"
            >
              <CalendarHeart size={14} /> Book a Stay
            </Link>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-forest/30">
            <CalendarDays size={13} />
            <p className="font-body text-xs">Profile created {formatDate(pet.created_at)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
