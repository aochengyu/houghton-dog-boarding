import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export const metadata: Metadata = { title: "Analytics | Admin" };

export default async function AdminAnalyticsPage() {
  const admin = createAdminClient();

  const [{ data: bookings }, { data: clients }, { data: pets }, { data: referrals }] =
    await Promise.all([
      admin
        .from("bookings")
        .select(
          "id, status, service, price_cents, credit_applied_cents, paid_at, payment_method, created_at, start_date, end_date, notes, client:client_id(name, email), pet:pet_id(name, species)"
        )
        .order("start_date", { ascending: false }),
      admin.from("clients").select("id, name, email, created_at, referral_credits"),
      admin.from("pets").select("id, species, created_at"),
      admin.from("referrals").select("id, status, created_at, credited_at"),
    ]);

  return (
    <AnalyticsDashboard
      bookings={(bookings ?? []) as any}
      clients={(clients ?? []) as any}
      pets={pets ?? []}
      referrals={referrals ?? []}
    />
  );
}
