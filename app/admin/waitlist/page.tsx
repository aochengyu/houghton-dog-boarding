import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminWaitlistClient } from "./AdminWaitlistClient";

export const metadata: Metadata = { title: "Waitlist | Admin" };

export default async function AdminWaitlistPage() {
  const admin = createAdminClient();

  const { data: entries } = await admin
    .from("waitlist")
    .select("id, service, start_date, end_date, notes, created_at, client:client_id(name, email)")
    .order("start_date", { ascending: true });

  type WaitlistRow = {
    id: string;
    service: string;
    start_date: string;
    end_date: string | null;
    notes: string | null;
    created_at: string;
    client: { name: string | null; email: string | null } | null;
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Manage</p>
        <h1 className="font-display text-3xl font-bold text-forest">Waitlist</h1>
        <p className="font-body text-sm text-forest/45 mt-1">
          {entries?.length ?? 0} {entries?.length === 1 ? "entry" : "entries"} — sorted by start date
        </p>
      </div>

      <AdminWaitlistClient entries={(entries ?? []) as unknown as WaitlistRow[]} />
    </div>
  );
}
