import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export default async function PayBookingPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: booking } = await supabase
    .from("bookings")
    .select("stripe_session_id, paid_at, client_id")
    .eq("id", params.id)
    .eq("client_id", user.id)
    .single();

  if (!booking) redirect("/account/bookings");
  if (booking.paid_at) redirect(`/account/bookings/${params.id}/invoice`);
  if (!booking.stripe_session_id) redirect("/account/bookings");

  // Retrieve the Stripe session to get the current URL
  const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id as string);

  if (session.status === "complete") {
    redirect(`/account/bookings/${params.id}/invoice`);
  }

  if (session.url) {
    redirect(session.url);
  }

  redirect("/account/bookings");
}
