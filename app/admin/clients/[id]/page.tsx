import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, ShieldOff } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { STATUS_COLORS, STATUS_LABELS, SERVICE_LABELS, formatCents, type Client, type Pet, type Booking } from "@/lib/db/types";

export const metadata: Metadata = { title: "Client Detail | Admin" };

export default async function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const admin = createAdminClient();

  const [{ data: client }, { data: pets }, { data: bookings }] = await Promise.all([
    admin.from("clients").select("*").eq("id", params.id).single(),
    admin.from("pets").select("*").eq("client_id", params.id).order("name"),
    admin.from("bookings").select("*").eq("client_id", params.id).order("start_date", { ascending: false }),
  ]);

  if (!client) notFound();

  const c = client as Client;

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 font-body text-xs text-forest/40 hover:text-teal transition-colors mb-6"
      >
        <ArrowLeft size={12} /> All clients
      </Link>

      {/* Client info */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-forest">{c.name || "—"}</h1>
            <p className="font-body text-sm text-forest/50 mt-0.5">{c.email}</p>
            {c.phone && <p className="font-body text-xs text-forest/35 mt-0.5">{c.phone}</p>}
          </div>
          {c.referral_credits > 0 && (
            <span className="font-body text-sm font-semibold bg-teal/10 text-teal px-3 py-1.5 rounded-full">
              {formatCents(c.referral_credits)} credit
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-forest/[0.06]">
          <div>
            <p className="font-body text-xs text-forest/35 uppercase tracking-wide mb-0.5">Referral code</p>
            <p className="font-body text-sm font-semibold text-forest">{c.referral_code}</p>
          </div>
          <div>
            <p className="font-body text-xs text-forest/35 uppercase tracking-wide mb-0.5">Member since</p>
            <p className="font-body text-sm text-forest">
              {new Date(c.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Pets */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-forest/[0.06]">
          <h2 className="font-display text-base font-bold text-forest">Pets ({pets?.length ?? 0})</h2>
        </div>
        {!pets?.length ? (
          <p className="px-6 py-6 font-body text-sm text-forest/40">No pets added.</p>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {(pets as Pet[]).map((p) => {
              const vaxStatus = (() => {
                const statuses = [p.rabies_exp, p.bordetella_exp].map((exp) => {
                  if (!exp) return "missing";
                  const days = Math.floor((new Date(exp).getTime() - Date.now()) / 86400000);
                  if (days < 0)   return "expired";
                  if (days <= 30) return "soon";
                  return "ok";
                });
                return (["expired", "soon", "missing", "ok"] as const).find((s) => statuses.includes(s)) ?? "ok";
              })();
              const VaxIcon = vaxStatus === "ok" ? ShieldCheck : vaxStatus === "soon" ? ShieldAlert : ShieldOff;
              const vaxClass = vaxStatus === "ok"
                ? "text-teal/50 bg-teal/8 border-teal/15"
                : vaxStatus === "soon"
                ? "text-gold-dark bg-gold/10 border-gold/20"
                : vaxStatus === "expired"
                ? "text-rose-dark bg-rose/8 border-rose/15"
                : "text-forest/30 bg-forest/5 border-forest/10";
              const vaxLabel = { ok: "Vaccines current", soon: "Expires soon", expired: "Vaccine expired", missing: "Records missing" }[vaxStatus];

              return (
                <Link
                  key={p.id}
                  href={`/admin/clients/${params.id}/pets/${p.id}`}
                  className="group px-6 py-4 flex items-center gap-4 hover:bg-forest/[0.015] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                    {p.photo_url ? (
                      <Image src={p.photo_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        {p.species === "cat" ? "🐱" : "🐶"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-forest group-hover:text-teal transition-colors">{p.name}</p>
                    <p className="font-body text-xs text-forest/45 capitalize">
                      {p.species}{p.breed ? ` · ${p.breed}` : ""}
                      {p.weight_lbs ? ` · ${p.weight_lbs} lbs` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.medical_notes && (
                      <span className="font-body text-[10px] bg-rose/10 text-rose-dark border border-rose/15 rounded-full px-2 py-0.5">Medical</span>
                    )}
                    <span className={`inline-flex items-center gap-1 font-body text-[10px] font-semibold px-2 py-0.5 rounded-full border ${vaxClass}`}>
                      <VaxIcon size={10} />
                      {vaxLabel}
                    </span>
                    <ArrowRight size={13} className="text-forest/20 group-hover:text-teal transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-forest/[0.06]">
          <h2 className="font-display text-base font-bold text-forest">Bookings ({bookings?.length ?? 0})</h2>
        </div>
        {!bookings?.length ? (
          <p className="px-6 py-6 font-body text-sm text-forest/40">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {(bookings as Booking[]).map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm font-semibold text-forest">{SERVICE_LABELS[b.service]}</p>
                  <p className="font-body text-xs text-forest/45 mt-0.5">
                    {new Date(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {b.end_date && ` – ${new Date(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    {b.price_cents > 0 && ` · ${formatCents(b.price_cents)}`}
                  </p>
                </div>
                <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
