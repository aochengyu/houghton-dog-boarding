"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldAlert, ShieldOff, CalendarHeart, ArrowRight } from "lucide-react";

// ── types ───────────────────────────────────────────────────

export type PetCardPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  dob?: string | null;
  weight_lbs: number | null;
  photo_url: string | null;
  rabies_exp: string | null;
  bordetella_exp: string | null;
  created_at: string;
};

// ── helpers ─────────────────────────────────────────────────

export function calcAge(dob: string | null): string | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}yr`;
  return `${years}yr ${months}mo`;
}

export type VaxStatus = "ok" | "soon" | "expired" | "missing";

export function worstVaxStatus(rabies: string | null, bordetella: string | null): VaxStatus {
  const statuses = [rabies, bordetella].map((exp) => {
    if (!exp) return "missing" as VaxStatus;
    const daysUntil = Math.floor((new Date(exp).getTime() - Date.now()) / 86400000);
    if (daysUntil < 0)  return "expired" as VaxStatus;
    if (daysUntil <= 30) return "soon" as VaxStatus;
    return "ok" as VaxStatus;
  });
  const priority: VaxStatus[] = ["expired", "soon", "missing", "ok"];
  return priority.find((s) => statuses.includes(s)) ?? "ok";
}

export const VAX_CONFIG: Record<VaxStatus, { label: string; icon: typeof ShieldCheck; className: string }> = {
  ok:      { label: "Vaccines current",  icon: ShieldCheck, className: "text-teal bg-teal/10 border-teal/15"      },
  soon:    { label: "Expires soon",      icon: ShieldAlert, className: "text-gold-dark bg-gold/10 border-gold/20" },
  expired: { label: "Vaccine expired",   icon: ShieldOff,   className: "text-rose-dark bg-rose/10 border-rose/15"  },
  missing: { label: "Records missing",   icon: ShieldOff,   className: "text-forest/35 bg-forest/5 border-forest/10" },
};

export const SPECIES_CONFIG: Record<string, { emoji: string; ring: string; bg: string }> = {
  dog: { emoji: "🐶", ring: "ring-gold/20",  bg: "bg-gold/5"  },
  cat: { emoji: "🐱", ring: "ring-teal/20",  bg: "bg-teal/5"  },
};

// ── component ───────────────────────────────────────────────

export function PetCard({ pet }: { pet: PetCardPet }) {
  const router = useRouter();
  const species = SPECIES_CONFIG[pet.species] ?? SPECIES_CONFIG.dog;
  const age = calcAge(pet.dob ?? null);
  const vaxStatus = worstVaxStatus(pet.rabies_exp ?? null, pet.bordetella_exp ?? null);
  const vax = VAX_CONFIG[vaxStatus];
  const VaxIcon = vax.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/account/pets/${pet.id}`)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(`/account/pets/${pet.id}`); }}
      className="group relative bg-white rounded-2xl border border-forest/[0.07] overflow-hidden hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      {/* Top photo strip / avatar area */}
      <div className={`relative h-28 ${pet.photo_url ? "" : species.bg} flex items-center justify-center overflow-hidden`}>
        {pet.photo_url ? (
          <Image
            src={pet.photo_url}
            alt={pet.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-6xl opacity-30 select-none">{species.emoji}</span>
        )}
        {/* Species pill top-left */}
        <span className="absolute top-3 left-3 font-body text-[10px] font-bold uppercase tracking-wider text-forest/50 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full capitalize">
          {pet.species}
        </span>
        {/* Age top-right if known */}
        {age && (
          <span className="absolute top-3 right-3 font-body text-[10px] font-bold text-forest/50 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {age}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-forest truncate group-hover:text-teal transition-colors duration-150">
              {pet.name}
            </p>
            <p className="font-body text-xs text-forest/45 capitalize truncate">
              {pet.breed ?? pet.species}
              {pet.weight_lbs ? ` · ${pet.weight_lbs} lbs` : ""}
            </p>
          </div>
        </div>

        {/* Vaccine status badge */}
        <div className={`inline-flex items-center gap-1.5 font-body text-[11px] font-semibold px-2.5 py-1 rounded-full border ${vax.className}`}>
          <VaxIcon size={11} />
          {vax.label}
        </div>

        {/* Footer row */}
        <div className="mt-3 pt-3 border-t border-forest/[0.06] flex items-center justify-between">
          <Link
            href={`/account/bookings?pet_id=${pet.id}`}
            onClick={(e) => e.stopPropagation()}
            className="group/btn inline-flex items-center gap-1 font-body text-xs text-teal/70 hover:text-teal transition-colors"
          >
            <CalendarHeart size={11} />
            Book a stay
            <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <span className="font-body text-xs text-forest/30 group-hover:text-teal/60 transition-colors">
            View profile →
          </span>
        </div>
      </div>
    </div>
  );
}
