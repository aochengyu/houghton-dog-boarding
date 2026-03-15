import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_LABELS, formatCents, type ServiceType } from "@/lib/db/types";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = { title: "Receipt | My Account" };

function formatDate(ds: string): string {
  const d = new Date(ds + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, pet:pet_id(name, species, breed)")
    .eq("id", params.id)
    .eq("client_id", user.id)
    .single();

  if (!booking) notFound();
  if (!booking.paid_at) notFound();

  const { data: client } = await supabase
    .from("clients")
    .select("name, email")
    .eq("id", user.id)
    .single();

  const pet = booking.pet as { name: string; species: string; breed: string | null } | null;

  return (
    <div className="max-w-xl">
      {/* Header actions — hidden when printing */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <a
            href="/account/bookings"
            className="font-body text-xs text-teal font-semibold hover:underline"
          >
            ← Back to Bookings
          </a>
        </div>
        <PrintButton />
      </div>

      {/* Receipt card */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-8 print:border-0 print:p-0 print:rounded-none">
        {/* Letterhead */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-forest/[0.07]">
          <div>
            <p className="font-display text-xl font-bold text-forest">Paws and Petals</p>
            <p className="font-body text-xs text-forest/45 mt-0.5">Home Dog Boarding</p>
          </div>
          <div className="text-right">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-teal/70">Receipt</p>
            <p className="font-body text-xs text-forest/40 mt-0.5">{booking.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Client info */}
        {client && (
          <div className="mb-6">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-forest/40 mb-1">Billed to</p>
            <p className="font-body text-sm font-semibold text-forest">{client.name}</p>
            <p className="font-body text-xs text-forest/50">{client.email}</p>
          </div>
        )}

        {/* Booking details */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
            <span className="font-body text-xs text-forest/50">Service</span>
            <span className="font-body text-sm font-semibold text-forest">
              {SERVICE_LABELS[booking.service as ServiceType] ?? booking.service}
            </span>
          </div>

          {pet && (
            <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
              <span className="font-body text-xs text-forest/50">Pet</span>
              <span className="font-body text-sm text-forest">
                {pet.species === "cat" ? "🐱" : "🐶"} {pet.name}
                {pet.breed && <span className="text-forest/40 ml-1">({pet.breed})</span>}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
            <span className="font-body text-xs text-forest/50">Dates</span>
            <span className="font-body text-sm text-forest">
              {formatDate(booking.start_date)}
              {booking.end_date && ` – ${formatDate(booking.end_date)}`}
            </span>
          </div>

          {booking.price_cents > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
              <span className="font-body text-xs text-forest/50">Price</span>
              <span className="font-body text-sm text-forest">{formatCents(booking.price_cents)}</span>
            </div>
          )}

          {booking.credit_applied_cents > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
              <span className="font-body text-xs text-forest/50">Credit applied</span>
              <span className="font-body text-sm text-teal font-semibold">
                −{formatCents(booking.credit_applied_cents)}
              </span>
            </div>
          )}

          {booking.payment_method && (
            <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
              <span className="font-body text-xs text-forest/50">Payment method</span>
              <span className="font-body text-sm text-forest capitalize">{booking.payment_method}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-forest/[0.05]">
            <span className="font-body text-xs text-forest/50">Paid on</span>
            <span className="font-body text-sm text-forest">{formatDateTime(booking.paid_at)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between bg-teal/5 border border-teal/15 rounded-xl px-5 py-4">
          <span className="font-body text-sm font-semibold text-forest/70">Total paid</span>
          <span className="font-display text-2xl font-bold text-forest">
            {formatCents(booking.price_cents - (booking.credit_applied_cents ?? 0))}
          </span>
        </div>

        {/* Footer */}
        <p className="font-body text-xs text-forest/30 text-center mt-8">
          Thank you for choosing Paws and Petals!
        </p>
      </div>
    </div>
  );
}
