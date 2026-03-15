"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingStatus } from "@/lib/db/types";
import { isValidUUID, isValidDate, isValidService, isValidStatus, sanitize } from "@/lib/validate";
import { sendBookingInquiryAdmin, sendBookingConfirmedClient, sendBookingCancelledClient } from "@/lib/email";
import { createAndSendStripeSession } from "@/app/actions/stripe";

// ── Client: request a booking ─────────────────────────────

export async function requestBooking(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Support multiple pets — formData.getAll returns an array
  const petIds      = (formData.getAll("pet_id") as string[]).filter(Boolean);
  const service     = formData.get("service") as string;
  const startDate   = formData.get("start_date") as string;
  const endDate     = (formData.get("end_date") as string) || null;
  const notes       = sanitize(formData.get("notes") as string, 2000);
  const dropoffTime = (formData.get("dropoff_time") as string) || null;

  if (petIds.length === 0)               return { error: "Select at least one pet." };
  if (petIds.some((id) => !isValidUUID(id))) return { error: "Invalid pet selection." };
  if (!isValidService(service))          return { error: "Invalid service type." };
  if (!isValidDate(startDate))           return { error: "Invalid start date." };
  if (endDate && !isValidDate(endDate))  return { error: "Invalid end date." };

  // Check blackout dates (once — shared across all pets)
  if (endDate) {
    const { data: rangeBlackout } = await supabase
      .from("blackout_dates")
      .select("date, reason")
      .gte("date", startDate)
      .lte("date", endDate)
      .limit(1);
    if (rangeBlackout && rangeBlackout.length > 0) {
      const bd = rangeBlackout[0];
      return { error: `${bd.date} is unavailable${bd.reason ? ` (${bd.reason})` : ""}. Please choose different dates.` };
    }
  } else {
    const { data: blackout } = await supabase
      .from("blackout_dates")
      .select("date, reason")
      .eq("date", startDate)
      .limit(1);
    if (blackout && blackout.length > 0) {
      const bd = blackout[0];
      return { error: `${bd.date} is unavailable${bd.reason ? ` (${bd.reason})` : ""}. Please choose different dates.` };
    }
  }

  // Insert one booking per selected pet atomically
  const { error } = await supabase.from("bookings").insert(
    petIds.map((petId) => ({
      client_id:    user.id,
      pet_id:       petId,
      service,
      start_date:   startDate,
      end_date:     endDate,
      status:       "inquiry",
      price_cents:  0,
      notes:        notes || null,
      dropoff_time: dropoffTime,
    }))
  );

  if (error) return { error: error.message };

  // Send admin notification (fire-and-forget, don't block redirect)
  try {
    const { data: petData } = await supabase.from("pets").select("name").eq("id", petIds[0]).single();
    const { data: clientData } = await supabase.from("clients").select("name, email").eq("id", user.id).single();
    if (petData && clientData) {
      void sendBookingInquiryAdmin({
        clientName: clientData.name,
        clientEmail: clientData.email,
        petName: petData.name + (petIds.length > 1 ? ` +${petIds.length - 1} more` : ""),
        service,
        startDate,
        endDate,
        notes,
      });
    }
  } catch { /* non-critical */ }

  redirect("/account/bookings?success=1");
}

// ── Admin: create booking for any client ─────────────────

export async function adminCreateBooking(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const admin = createAdminClient();

  const clientId  = formData.get("client_id") as string;
  const petId     = formData.get("pet_id") as string;
  const service   = formData.get("service") as string;
  const startDate = formData.get("start_date") as string;
  const endDate   = (formData.get("end_date") as string) || null;
  const status    = (formData.get("status") as string) || "confirmed";

  if (!isValidUUID(clientId))      return { error: "Invalid client." };
  if (!isValidUUID(petId))         return { error: "Invalid pet." };
  if (!isValidService(service))    return { error: "Invalid service type." };
  if (!isValidDate(startDate))     return { error: "Invalid start date." };
  if (endDate && !isValidDate(endDate)) return { error: "Invalid end date." };
  if (!isValidStatus(status))      return { error: "Invalid status." };

  const priceDollars  = parseFloat(formData.get("price") as string) || 0;
  const creditDollars = parseFloat(formData.get("credit_applied") as string) || 0;
  const notes = sanitize(formData.get("notes") as string, 2000);

  const { error } = await admin.from("bookings").insert({
    client_id:            clientId,
    pet_id:               petId,
    service,
    start_date:           startDate,
    end_date:             endDate,
    status:               status as BookingStatus,
    price_cents:          Math.round(Math.abs(priceDollars) * 100),
    credit_applied_cents: Math.round(Math.abs(creditDollars) * 100),
    notes:                notes || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  redirect("/admin/bookings");
}

// ── Admin: update booking status ──────────────────────────

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  if (!isValidUUID(bookingId)) return;
  if (!isValidStatus(status))  return;
  const admin = createAdminClient();
  await admin.from("bookings").update({ status }).eq("id", bookingId);
  revalidatePath("/admin/bookings");

  // Send status emails (fire-and-forget)
  try {
    const { data: b } = await admin
      .from("bookings")
      .select("service, start_date, pet:pet_id(name), client:client_id(name, email)")
      .eq("id", bookingId)
      .single();
    if (b) {
      const pet = (b.pet as unknown) as { name: string } | null;
      const client = (b.client as unknown) as { name: string; email: string } | null;
      if (client && pet) {
        if (status === "confirmed") {
          void sendBookingConfirmedClient({
            clientEmail: client.email,
            clientName: client.name,
            petName: pet.name,
            service: b.service as string,
            startDate: b.start_date as string,
            endDate: null,
          });
          // Auto-create Stripe checkout session if price is already set
          void createAndSendStripeSession(bookingId);
        } else if (status === "cancelled") {
          void sendBookingCancelledClient({
            clientEmail: client.email,
            clientName: client.name,
            petName: pet.name,
            service: b.service as string,
            startDate: b.start_date as string,
          });
        }
      }
    }
  } catch { /* non-critical */ }
}

// ── Admin: update billing (price + payment) ───────────────

export async function updateBookingBilling(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const bookingId = formData.get("booking_id") as string;
  if (!isValidUUID(bookingId)) return { error: "Invalid booking ID." };

  const admin = createAdminClient();
  const priceDollars  = parseFloat(formData.get("price") as string) || 0;
  const creditDollars = parseFloat(formData.get("credit_applied") as string) || 0;
  const markPaid      = formData.get("mark_paid") === "true";
  const paymentMethod = sanitize(formData.get("payment_method") as string, 50) || null;

  if (priceDollars < 0 || creditDollars < 0) return { error: "Amounts cannot be negative." };

  const update: Record<string, unknown> = {
    price_cents:          Math.round(priceDollars * 100),
    credit_applied_cents: Math.round(creditDollars * 100),
  };

  if (markPaid) {
    update.paid_at        = new Date().toISOString();
    update.payment_method = paymentMethod;
  } else {
    update.paid_at        = null;
    update.payment_method = null;
  }

  const { error } = await admin.from("bookings").update(update).eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");

  // If price was just set on a confirmed booking (and not marking paid manually),
  // auto-create Stripe session so client can pay immediately
  if (!markPaid && Math.round(priceDollars * 100) > 0) {
    const { data: current } = await admin
      .from("bookings")
      .select("status, stripe_session_id, paid_at")
      .eq("id", bookingId)
      .single();
    if (current?.status === "confirmed" && !current.paid_at) {
      void createAndSendStripeSession(bookingId);
    }
  }

  return { success: true };
}

// ── Admin: update booking notes ───────────────────────────

export async function updateBookingNotes(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const bookingId = formData.get("booking_id") as string;
  if (!isValidUUID(bookingId)) return { error: "Invalid booking ID." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("bookings")
    .update({ notes: sanitize(formData.get("notes") as string, 2000) || null })
    .eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  return { success: true };
}

// ── Client: cancel own booking ────────────────────────────
export async function cancelBookingAsClient(bookingId: string): Promise<{ error?: string }> {
  if (!isValidUUID(bookingId)) return { error: "Invalid booking." };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Verify ownership and cancellable status
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, client_id, service, start_date, pet:pet_id(name), client:client_id(name, email)")
    .eq("id", bookingId)
    .eq("client_id", user.id)
    .single();

  if (!booking) return { error: "Booking not found." };
  if (!["inquiry", "confirmed"].includes(booking.status)) {
    return { error: "This booking cannot be cancelled." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) return { error: error.message };
  revalidatePath("/account/bookings");

  // Notify admin
  try {
    const pet = (booking.pet as unknown) as { name: string } | null;
    const client = (booking.client as unknown) as { name: string; email: string } | null;
    if (pet && client) {
      void sendBookingCancelledClient({
        clientEmail: client.email,
        clientName: client.name,
        petName: pet.name,
        service: booking.service as string,
        startDate: booking.start_date as string,
      });
    }
  } catch { /* non-critical */ }

  return {};
}

// ── Admin: check in ─────────────────────────────────────────
export async function checkInBooking(bookingId: string) {
  if (!isValidUUID(bookingId)) return;
  const admin = createAdminClient();
  await admin.from("bookings").update({ checked_in_at: new Date().toISOString(), status: "active" }).eq("id", bookingId);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
}

// ── Admin: check out ────────────────────────────────────────
export async function checkOutBooking(bookingId: string) {
  if (!isValidUUID(bookingId)) return;
  const admin = createAdminClient();
  await admin.from("bookings").update({ checked_out_at: new Date().toISOString(), status: "completed" }).eq("id", bookingId);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
}
