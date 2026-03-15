import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Booking } from "@/lib/db/types";
import { AdminBookingsList } from "./AdminBookingsList";

export const metadata: Metadata = { title: "Bookings | Admin" };

export default async function AdminBookingsPage() {
  const admin = createAdminClient();

  const { data: raw } = await admin
    .from("bookings")
    .select("*, client:client_id(name, email), pet:pet_id(name, species), stay_photos(id, photo_url, caption)")
    .order("start_date", { ascending: false });

  const bookings = (raw ?? []) as (Booking & {
    client?: { name?: string; email?: string };
    pet?: { name?: string; species?: string };
    stay_photos?: { id: string; photo_url: string; caption: string | null }[];
  })[];

  const inquiryCount = bookings.filter((b) => b.status === "inquiry").length;
  const activeCount  = bookings.filter((b) => b.status === "active").length;
  const unpaidCount  = bookings.filter((b) => b.status === "completed" && !b.paid_at).length;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Manage</p>
        <h1 className="font-display text-3xl font-bold text-forest">Bookings</h1>
      </div>

      <AdminBookingsList
        bookings={bookings}
        inquiryCount={inquiryCount}
        activeCount={activeCount}
        unpaidCount={unpaidCount}
      />
    </div>
  );
}
