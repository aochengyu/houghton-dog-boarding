import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_COLORS, STATUS_LABELS, SERVICE_LABELS, formatCents, type Booking } from "@/lib/db/types";
import { BookingRequestForm } from "./BookingRequestForm";
import { ReviewForm } from "./ReviewForm";
import { CancelBookingButton } from "./CancelBookingButton";
import { SuccessBanner } from "./SuccessBanner";

export const metadata: Metadata = { title: "Bookings | My Account" };

type StayPhoto = { id: string; photo_url: string; caption: string | null };
type Review = { id: string; booking_id: string };

type RichBooking = Booking & {
  pet?: { name: string; species: string } | null;
  stay_photos?: StayPhoto[];
};

export default async function BookingsPage({ searchParams }: { searchParams: { success?: string; pet_id?: string; rebook?: string; paid?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const [{ data: bookings }, { data: pets }, { data: reviews }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, pet:pet_id(name, species), stay_photos(id, photo_url, caption, uploaded_at)")
      .eq("client_id", user.id)
      .order("start_date", { ascending: false }),
    supabase
      .from("pets")
      .select("id, name, species, rabies_exp, bordetella_exp")
      .eq("client_id", user.id)
      .order("name"),
    supabase
      .from("reviews")
      .select("id, booking_id")
      .eq("client_id", user.id),
  ]);

  const reviewedBookingIds = new Set((reviews ?? []).map((r: Review) => r.booking_id));

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Your stays & services</p>
        <h1 className="font-display text-3xl font-bold text-forest">Bookings</h1>
      </div>

      {searchParams.success && (
        <SuccessBanner message="Your booking request has been submitted! We'll be in touch to confirm." />
      )}

      {searchParams.paid && (
        <SuccessBanner message="Payment received — thank you! Your receipt is below." variant="gold" />
      )}

      {/* Request form */}
      {(pets?.length ?? 0) > 0 ? (
        <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-8">
          <h2 className="font-display text-base font-bold text-forest mb-5">Request a Booking</h2>
          <BookingRequestForm pets={pets ?? []} defaultPetId={searchParams.pet_id} defaultService={searchParams.rebook} />
        </div>
      ) : (
        <div className="bg-teal/5 border border-teal/15 rounded-2xl px-6 py-5 mb-8 text-sm font-body text-forest/60">
          <a href="/account/pets/new" className="text-teal font-semibold hover:underline">Add a pet profile</a> before requesting a booking.
        </div>
      )}

      {/* Booking list */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-forest/[0.06]">
          <h2 className="font-display text-base font-bold text-forest">History</h2>
        </div>
        {!bookings?.length ? (
          <div className="px-6 py-12 text-center">
            <p className="font-body text-sm text-forest/40">No bookings yet. Request your first stay above.</p>
          </div>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {(bookings as RichBooking[]).map((b, i) => (
              <div
                key={b.id}
                className="px-6 py-4 animate-[fade-slide-in_0.3s_ease-out_both]"
                style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body text-sm font-semibold text-forest">{SERVICE_LABELS[b.service]}</p>
                      {b.pet && (
                        <span className="font-body text-xs text-forest/50 bg-cream px-2 py-0.5 rounded-full">
                          {b.pet.species === "cat" ? "🐱" : "🐶"} {b.pet.name}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-forest/45 mt-0.5">
                      {new Date(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {b.end_date && ` – ${new Date(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </p>
                    {b.price_cents > 0 && (
                      <p className="font-body text-xs text-forest/35 mt-0.5">{formatCents(b.price_cents)}</p>
                    )}
                  </div>
                  <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex-shrink-0 ${STATUS_COLORS[b.status]}`}>
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>
                {/* Payment CTA — confirmed + price set + not yet paid */}
                {!b.paid_at && b.status === "confirmed" && b.price_cents > 0 && (
                  (b as RichBooking & { stripe_session_id?: string | null }).stripe_session_id ? (
                    <div className="mt-3 px-4 py-3 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-between gap-3 flex-wrap animate-[fade-slide-in_0.3s_ease-out]">
                      <div>
                        <p className="font-body text-xs font-semibold text-gold-dark">
                          Your booking is confirmed — payment due
                        </p>
                        <p className="font-body text-xs text-forest/50 mt-0.5">
                          ${((b.price_cents - b.credit_applied_cents) / 100).toFixed(2)} · secure checkout via Stripe
                        </p>
                      </div>
                      <a
                        href={`/account/bookings/${b.id}/pay`}
                        className="font-body text-sm font-bold text-cream bg-forest px-5 py-2 rounded-xl hover:bg-forest/80 transition-all whitespace-nowrap shadow-[0_0_0_0_rgba(26,58,42,0.4)] animate-[pay-pulse_2s_ease-in-out_infinite]"
                      >
                        Pay now →
                      </a>
                    </div>
                  ) : (
                    <div className="mt-3 px-4 py-2 rounded-xl bg-teal/5 border border-teal/15">
                      <p className="font-body text-xs text-forest/50">
                        Booking confirmed — payment details coming soon.
                      </p>
                    </div>
                  )
                )}
                {b.paid_at && (
                  <a href={`/account/bookings/${b.id}/invoice`}
                    className="font-body text-xs text-teal font-semibold hover:underline">
                    View Receipt →
                  </a>
                )}
                {b.notes && (
                  <p className="font-body text-xs text-forest/40 mt-2 bg-cream rounded-lg px-3 py-2">{b.notes}</p>
                )}

                {/* Stay photos strip */}
                {b.stay_photos && b.stay_photos.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {b.stay_photos.map((p: StayPhoto) => (
                      <img key={p.id} src={p.photo_url} alt={p.caption || "Stay photo"}
                        className="w-16 h-16 rounded-lg object-cover border border-forest/10" />
                    ))}
                  </div>
                )}

                {/* Cancel option for pending/confirmed bookings */}
                {(b.status === "inquiry" || b.status === "confirmed") && !b.paid_at && (
                  <div className="mt-2">
                    <CancelBookingButton bookingId={b.id} />
                  </div>
                )}

                {b.status === "completed" && (
                  <a href={`/account/bookings?rebook=${b.service}&pet_id=${b.pet_id}`}
                    className="mt-2 inline-flex items-center gap-1.5 font-body text-xs text-teal font-semibold hover:underline">
                    ↻ Book again
                  </a>
                )}

                {/* Review form for completed bookings without a review */}
                {b.status === "completed" && !reviewedBookingIds.has(b.id) && (
                  <ReviewForm bookingId={b.id} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
