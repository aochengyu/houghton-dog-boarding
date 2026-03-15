import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminCalendar } from "./AdminCalendar";

export const metadata: Metadata = { title: "Calendar | Admin" };

export default async function AdminCalendarPage() {
  const admin = createAdminClient();

  const [{ data: raw }, { data: settings }, { data: blackoutDates }] = await Promise.all([
    admin
      .from("bookings")
      .select("id, status, service, start_date, end_date, price_cents, credit_applied_cents, paid_at, notes, client:client_id(name, email), pet:pet_id(name, species, breed, rabies_exp, bordetella_exp)")
      .neq("status", "cancelled")
      .order("start_date", { ascending: true }),
    admin.from("app_settings").select("key, value"),
    admin.from("blackout_dates").select("id, date, reason").order("date"),
  ]);

  const maxCapacity = parseInt(
    settings?.find((s: any) => s.key === "max_capacity")?.value ?? "3",
    10
  );

  return (
    <AdminCalendar
      bookings={(raw ?? []) as any}
      maxCapacity={maxCapacity}
      blackoutDates={(blackoutDates ?? []) as any}
    />
  );
}
