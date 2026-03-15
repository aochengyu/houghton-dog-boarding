"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, SERVICE_LABELS, type Booking, type BookingStatus } from "@/lib/db/types";
import { AdminBookingActions } from "./AdminBookingActions";
import { AdminBillingPanel } from "./AdminBillingPanel";
import { CheckInOutButtons } from "./CheckInOutButtons";
import { StayPhotosPanel } from "./StayPhotosPanel";

type StayPhoto = {
  id: string;
  photo_url: string;
  caption: string | null;
};

type RawBooking = Booking & {
  client?: { name?: string; email?: string };
  pet?: { name?: string; species?: string };
  stay_photos?: StayPhoto[];
  stripe_session_id?: string | null;
};

const STATUSES: BookingStatus[] = ["inquiry", "confirmed", "active", "completed", "cancelled"];

const WORKFLOW = [
  { status: "inquiry",   label: "Inquiry",   desc: "Client has submitted a request" },
  { status: "confirmed", label: "Confirmed", desc: "You've accepted — dates locked in" },
  { status: "active",    label: "Active",     desc: "Pet is currently in your care" },
  { status: "completed", label: "Completed", desc: "Stay finished, ready to invoice" },
  { status: "cancelled", label: "Cancelled", desc: "Booking was cancelled" },
];

export function AdminBookingsList({
  bookings,
  inquiryCount,
  activeCount,
  unpaidCount,
}: {
  bookings: RawBooking[];
  inquiryCount: number;
  activeCount: number;
  unpaidCount: number;
}) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [q, setQ] = useState("");
  const [listKey, setListKey] = useState(0);

  const filtered = useMemo(() => {
    let list = bookings;

    if (statusFilter) {
      list = list.filter((b) => b.status === statusFilter);
    }

    if (q.trim()) {
      const lower = q.trim().toLowerCase();
      list = list.filter((b) => {
        const clientName  = (b.client?.name  || "").toLowerCase();
        const clientEmail = (b.client?.email || "").toLowerCase();
        const petName     = (b.pet?.name     || "").toLowerCase();
        const service     = b.service.toLowerCase();
        const serviceLabel = (SERVICE_LABELS[b.service] || "").toLowerCase();
        const status      = b.status.toLowerCase();
        const statusLabel = (STATUS_LABELS[b.status as BookingStatus] || "").toLowerCase();
        const notes       = (b.notes         || "").toLowerCase();
        const payment     = (b.payment_method || "").toLowerCase();

        return (
          clientName.includes(lower)   ||
          clientEmail.includes(lower)  ||
          petName.includes(lower)      ||
          service.includes(lower)      ||
          serviceLabel.includes(lower) ||
          status.includes(lower)       ||
          statusLabel.includes(lower)  ||
          notes.includes(lower)        ||
          payment.includes(lower)
        );
      });
    }

    return list;
  }, [bookings, statusFilter, q]);

  // Re-animate list when filter changes
  useEffect(() => {
    setListKey((k) => k + 1);
  }, [statusFilter, q]);

  return (
    <>
      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap mb-6">
        {inquiryCount > 0 && (
          <button
            onClick={() => setStatusFilter("inquiry")}
            className="font-body text-xs font-semibold bg-gold/15 text-gold-dark border border-gold/20 px-3 py-1.5 rounded-full hover:bg-gold/25 transition-colors"
          >
            {inquiryCount} pending {inquiryCount === 1 ? "inquiry" : "inquiries"}
          </button>
        )}
        {activeCount > 0 && (
          <button
            onClick={() => setStatusFilter("active")}
            className="font-body text-xs font-semibold bg-teal text-cream px-3 py-1.5 rounded-full hover:bg-teal-dark transition-colors"
          >
            {activeCount} active {activeCount === 1 ? "stay" : "stays"} now
          </button>
        )}
        {unpaidCount > 0 && (
          <button
            onClick={() => setStatusFilter("completed")}
            className="font-body text-xs font-semibold bg-rose/10 text-rose-dark border border-rose/20 px-3 py-1.5 rounded-full hover:bg-rose/20 transition-colors"
          >
            {unpaidCount} unpaid completed {unpaidCount === 1 ? "booking" : "bookings"}
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("")}
            className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              !statusFilter ? "bg-forest text-cream" : "bg-white border border-forest/15 text-forest/60 hover:text-forest"
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
              className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                statusFilter === s ? "bg-forest text-cream" : "bg-white border border-forest/15 text-forest/60 hover:text-forest"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Search — now searches everything */}
        <div className="ml-auto flex-shrink-0 relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/30 pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Client, pet, service, notes…"
            className="pl-8 pr-8 py-1.5 border border-forest/15 rounded-full font-body text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30 w-52"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-forest/30 hover:text-forest/60 transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Workflow legend */}
      <details className="mb-4 group">
        <summary className="font-body text-xs text-forest/35 cursor-pointer hover:text-forest/60 transition-colors select-none list-none flex items-center gap-1">
          <span className="group-open:rotate-90 transition-transform inline-block">›</span>
          What do the status buttons mean?
        </summary>
        <div className="mt-2 bg-white rounded-xl border border-forest/[0.06] p-4 grid sm:grid-cols-2 gap-2">
          {WORKFLOW.map(({ status, label, desc }) => (
            <div key={status} className="flex items-start gap-2.5">
              <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${STATUS_COLORS[status as BookingStatus]}`}>
                {label}
              </span>
              <p className="font-body text-xs text-forest/50">{desc}</p>
            </div>
          ))}
        </div>
      </details>

      {/* Result count when filtering */}
      {(q || statusFilter) && (
        <p className="font-body text-xs text-forest/40 mb-3">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {q && <> for &ldquo;<span className="text-forest/60 font-medium">{q}</span>&rdquo;</>}
          {statusFilter && <> · {STATUS_LABELS[statusFilter as BookingStatus]}</>}
          <button onClick={() => { setQ(""); setStatusFilter(""); }} className="ml-2 text-teal hover:text-teal-dark underline">
            Clear
          </button>
        </p>
      )}

      {/* Bookings list */}
      {!filtered.length ? (
        <div className="bg-white rounded-2xl border border-forest/[0.07] px-6 py-12 text-center">
          <p className="font-body text-sm text-forest/35">
            {q ? `No bookings matching "${q}"` : "No bookings yet."}
          </p>
        </div>
      ) : (
        <div key={listKey} className="space-y-3">
          {filtered.map((b, index) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-forest/[0.07] px-5 py-4 animate-[fade-slide-in_0.25s_ease-out_both]"
              style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-body text-sm font-semibold text-forest">{SERVICE_LABELS[b.service]}</p>
                    <span className="text-forest/20 text-xs">·</span>
                    <p className="font-body text-xs font-medium text-forest/65">{b.client?.name || b.client?.email}</p>
                    {b.pet?.name && (
                      <>
                        <span className="text-forest/20 text-xs">·</span>
                        <p className="font-body text-xs text-forest/45">{b.pet.name}</p>
                      </>
                    )}
                  </div>
                  <p className="font-body text-xs text-forest/40">
                    {new Date(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {b.end_date && ` – ${new Date(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </p>
                </div>
                <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex-shrink-0 ${STATUS_COLORS[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>

              {b.notes && (
                <p className="font-body text-xs text-forest/45 bg-forest/[0.04] rounded-lg px-3 py-2 mb-2 italic">{b.notes}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <AdminBookingActions bookingId={b.id} currentStatus={b.status} />
                <CheckInOutButtons
                  bookingId={b.id}
                  status={b.status}
                  checkedInAt={b.checked_in_at}
                  checkedOutAt={b.checked_out_at}
                />
              </div>
              <AdminBillingPanel
                bookingId={b.id}
                priceCents={b.price_cents}
                creditCents={b.credit_applied_cents}
                paidAt={b.paid_at}
                paymentMethod={b.payment_method}
                stripeSessionId={b.stripe_session_id}
              />
              <StayPhotosPanel
                bookingId={b.id}
                photos={b.stay_photos ?? []}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
