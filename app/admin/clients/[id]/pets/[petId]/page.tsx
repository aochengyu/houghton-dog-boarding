import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Weight, CheckCircle2, XCircle, Cpu, Cake,
  Phone, Stethoscope, BookOpen, Smile, CalendarDays,
  ShieldCheck, ShieldAlert, ShieldOff,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Pet, Client } from "@/lib/db/types";

export const metadata: Metadata = { title: "Pet Profile | Admin" };

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

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

type VaxStatus = "ok" | "soon" | "expired" | "missing";

function vaccineStatus(expDate: string | null): VaxStatus {
  if (!expDate) return "missing";
  const daysUntil = Math.floor((new Date(expDate).getTime() - Date.now()) / 86400000);
  if (daysUntil < 0)   return "expired";
  if (daysUntil <= 30) return "soon";
  return "ok";
}

const VAX_ICON: Record<VaxStatus, typeof ShieldCheck> = {
  ok: ShieldCheck, soon: ShieldAlert, expired: ShieldOff, missing: ShieldOff,
};
const VAX_COLOR: Record<VaxStatus, string> = {
  ok:      "text-teal/60",
  soon:    "text-gold-dark",
  expired: "text-rose-dark",
  missing: "text-forest/25",
};
const VAX_LABEL: Record<VaxStatus, string> = {
  ok:      "Up to date",
  soon:    "Expires soon",
  expired: "Expired",
  missing: "Not recorded",
};

export default async function AdminPetProfilePage({
  params,
}: {
  params: { id: string; petId: string };
}) {
  const admin = createAdminClient();

  const [{ data: pet }, { data: client }] = await Promise.all([
    admin.from("pets").select("*").eq("id", params.petId).eq("client_id", params.id).single(),
    admin.from("clients").select("name, email").eq("id", params.id).single(),
  ]);

  if (!pet || !client) notFound();

  const p = pet as Pet;
  const c = client as Pick<Client, "name" | "email">;
  const speciesEmoji = p.species === "cat" ? "🐱" : "🐶";
  const subtitle = [p.species, p.breed].filter(Boolean).map((s) => (s as string).trim()).join(" · ");

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-body text-xs text-forest/40 mb-6">
        <Link href="/admin/clients" className="hover:text-teal transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/admin/clients/${params.id}`} className="hover:text-teal transition-colors">{c.name || c.email}</Link>
        <span>/</span>
        <span className="text-forest/60">{p.name}</span>
      </div>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-cream flex-shrink-0 border border-forest/[0.07]">
            {p.photo_url ? (
              <Image src={p.photo_url} alt={p.name} width={96} height={96} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">{speciesEmoji}</div>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1 capitalize">
              {p.species} profile
            </p>
            <h1 className="font-display text-3xl font-bold text-forest mb-1">{p.name}</h1>
            <p className="font-body text-sm text-forest/50 capitalize mb-2">{subtitle}</p>
            {p.dob && (
              <p className="font-body text-xs text-teal/80 font-semibold">{calcAge(p.dob)}</p>
            )}
            {/* Owner attribution */}
            <p className="font-body text-xs text-forest/35 mt-2">
              Owner: <Link href={`/admin/clients/${params.id}`} className="text-teal/70 hover:text-teal transition-colors">{c.name || c.email}</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
        <h2 className="font-display text-base font-bold text-forest mb-4">Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Weight size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Weight</p>
              <p className="font-body text-sm text-forest">{p.weight_lbs ? `${p.weight_lbs} lbs` : "Not recorded"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            {p.spayed_neutered
              ? <CheckCircle2 size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
              : <XCircle size={16} className="text-forest/25 mt-0.5 flex-shrink-0" />}
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Spayed / Neutered</p>
              <p className="font-body text-sm text-forest">{p.spayed_neutered ? "Yes" : "No"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Cpu size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Microchip ID</p>
              <p className="font-body text-sm text-forest font-mono">{p.microchip_id || "Not recorded"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Cake size={16} className="text-teal/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-xs uppercase tracking-wide text-forest/40 font-semibold mb-0.5">Date of Birth</p>
              <p className="font-body text-sm text-forest">{formatDate(p.dob)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccinations */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
        <h2 className="font-display text-base font-bold text-forest mb-4">Vaccinations</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Rabies",      exp: p.rabies_exp ?? null },
            { label: "Bordetella",  exp: p.bordetella_exp ?? null },
          ].map(({ label, exp }) => {
            const status = vaccineStatus(exp);
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
        {p.vet_name || p.vet_phone ? (
          <div className="flex flex-col gap-2">
            {p.vet_name && <p className="font-body text-sm text-forest">{p.vet_name}</p>}
            {p.vet_phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-teal/50" />
                <a href={`tel:${p.vet_phone}`} className="font-body text-sm text-teal hover:underline">{p.vet_phone}</a>
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
        {p.medical_notes ? (
          <p className="font-body text-sm text-forest/80 whitespace-pre-wrap leading-relaxed">{p.medical_notes}</p>
        ) : (
          <p className="font-body text-sm text-forest/40 italic">None on file</p>
        )}
      </div>

      {/* Behavioral notes */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Smile size={16} className="text-teal/60" />
          <h2 className="font-display text-base font-bold text-forest">Behavioral Notes</h2>
        </div>
        {p.behavioral_notes ? (
          <p className="font-body text-sm text-forest/80 whitespace-pre-wrap leading-relaxed">{p.behavioral_notes}</p>
        ) : (
          <p className="font-body text-sm text-forest/40 italic">None on file</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-forest/30">
        <CalendarDays size={13} />
        <p className="font-body text-xs">Profile created {formatDate(p.created_at)}</p>
      </div>
    </div>
  );
}
