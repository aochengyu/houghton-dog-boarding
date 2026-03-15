"use server";

import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/validate";
import { SERVICE_LABELS, type ServiceType } from "@/lib/db/types";
import { sendPaymentLink } from "@/lib/email";

// ── Shared helper — called automatically or manually ──────

export async function createAndSendStripeSession(bookingId: string): Promise<string | null> {
  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select(`
      id, service, start_date, end_date, price_cents, credit_applied_cents,
      stripe_session_id, paid_at,
      client:client_id(id, name, email),
      pet:pet_id(name)
    `)
    .eq("id", bookingId)
    .single();

  if (!booking) return null;
  if (booking.paid_at) return null; // already paid

  const client = (booking.client as unknown) as { id: string; name: string; email: string } | null;
  const pet    = (booking.pet    as unknown) as { name: string } | null;
  if (!client?.email) return null;

  const priceCents  = booking.price_cents as number;
  const creditCents = booking.credit_applied_cents as number;
  const amountCents = Math.max(priceCents - creditCents, 0);
  if (amountCents === 0) return null; // no price set yet

  // If a session already exists and isn't expired, reuse it
  if (booking.stripe_session_id) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(booking.stripe_session_id as string);
      if (existing.status === "open" && existing.url) return existing.url;
    } catch { /* session expired or invalid — create a new one */ }
  }

  const service   = booking.service as ServiceType;
  const startDate = new Date(booking.start_date as string).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const endDate = booking.end_date
    ? new Date(booking.end_date as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const description = [
    SERVICE_LABELS[service] ?? service,
    pet?.name ? `for ${pet.name}` : "",
    endDate ? `${startDate} – ${endDate}` : startDate,
  ].filter(Boolean).join(" · ");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: client.email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: amountCents,
        product_data: {
          name: `${SERVICE_LABELS[service] ?? service} — Paws and Petals`,
          description,
        },
      },
    }],
    metadata: { booking_id: bookingId, client_id: client.id },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/bookings?paid=1`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/account/bookings`,
    expires_at:  Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 h
  });

  await admin.from("bookings").update({ stripe_session_id: session.id }).eq("id", bookingId);

  try {
    await sendPaymentLink({
      clientEmail: client.email,
      clientName:  client.name,
      petName:     pet?.name ?? "your pet",
      description,
      amountCents,
      paymentUrl:  session.url!,
    });
  } catch { /* non-critical */ }

  return session.url!;
}

// ── Admin: manually send / resend payment link ────────────

export async function sendStripePaymentLink(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean; url?: string }> {
  const bookingId = formData.get("booking_id") as string;
  if (!isValidUUID(bookingId)) return { error: "Invalid booking." };

  const url = await createAndSendStripeSession(bookingId);
  if (!url) {
    // Check why it failed
    const admin = createAdminClient();
    const { data: b } = await admin
      .from("bookings")
      .select("price_cents, credit_applied_cents, paid_at")
      .eq("id", bookingId)
      .single();
    if (b?.paid_at) return { error: "This booking is already paid." };
    if (!b || (b.price_cents as number) === 0) return { error: "Set a price before sending a payment link." };
    return { error: "Failed to create payment session. Check Stripe configuration." };
  }

  revalidatePath("/admin/bookings");
  return { success: true, url };
}
