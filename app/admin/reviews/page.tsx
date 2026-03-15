import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SERVICE_LABELS, type ServiceType } from "@/lib/db/types";
import { ReviewActions } from "./ReviewActions";

export const metadata: Metadata = { title: "Reviews | Admin" };

type ReviewRow = {
  id: string;
  rating: number;
  body: string | null;
  approved: boolean;
  created_at: string;
  booking_id: string;
  client: { name?: string; email?: string } | null;
  booking: {
    service: ServiceType;
    start_date: string;
    end_date: string | null;
  } | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold font-body text-base leading-none" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-gold" : "text-forest/20"}>★</span>
      ))}
    </span>
  );
}

export default async function AdminReviewsPage() {
  const admin = createAdminClient();

  const { data: raw } = await admin
    .from("reviews")
    .select(`
      id, rating, body, approved, created_at, booking_id,
      client:client_id(name, email),
      booking:booking_id(service, start_date, end_date)
    `)
    .order("created_at", { ascending: false });

  const reviews = (raw ?? []) as unknown as ReviewRow[];

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Manage</p>
        <h1 className="font-display text-3xl font-bold text-forest">Reviews</h1>
      </div>

      {pendingCount > 0 && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-gold/10 border border-gold/20 font-body text-xs font-semibold text-gold-dark">
          {pendingCount} review{pendingCount !== 1 ? "s" : ""} pending approval
        </div>
      )}

      {!reviews.length ? (
        <div className="bg-white rounded-2xl border border-forest/[0.07] px-6 py-12 text-center">
          <p className="font-body text-sm text-forest/35">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-forest/[0.07] px-5 py-4">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <Stars rating={r.rating} />
                  {!r.approved && (
                    <span className="font-body text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-gold/10 text-gold-dark border-gold/20">
                      Pending
                    </span>
                  )}
                </div>
                <p className="font-body text-[10px] text-forest/35 flex-shrink-0">
                  {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              {r.body && (
                <p className="font-body text-sm text-forest/70 mt-1 mb-2 leading-relaxed">&ldquo;{r.body}&rdquo;</p>
              )}

              <div className="flex items-center gap-2 flex-wrap text-xs font-body text-forest/45">
                {r.client && (
                  <span className="font-semibold text-forest/60">{r.client.name || r.client.email}</span>
                )}
                {r.booking && (
                  <>
                    <span className="text-forest/20">·</span>
                    <span>{SERVICE_LABELS[r.booking.service as ServiceType] ?? r.booking.service}</span>
                    <span className="text-forest/20">·</span>
                    <span>
                      {new Date(r.booking.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {r.booking.end_date && ` – ${new Date(r.booking.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </span>
                  </>
                )}
              </div>

              <ReviewActions reviewId={r.id} approved={r.approved} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
