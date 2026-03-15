import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    return new NextResponse(`Webhook error: ${msg}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session    = event.data.object as Stripe.Checkout.Session;
    const bookingId  = session.metadata?.booking_id;

    if (bookingId) {
      const admin = createAdminClient();
      await admin
        .from("bookings")
        .update({
          paid_at:        new Date().toISOString(),
          payment_method: "Stripe",
          status:         "completed",  // auto-complete when paid
        })
        .eq("id", bookingId);
    }
  }

  return NextResponse.json({ received: true });
}
