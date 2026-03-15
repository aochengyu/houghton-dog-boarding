import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  const admin = createAdminClient();

  const [{ data: settings }, { data: blackoutDates }] = await Promise.all([
    admin.from("app_settings").select("key, value"),
    admin.from("blackout_dates").select("id, date, reason").order("date", { ascending: true }),
  ]);

  const maxCapacity = parseInt(
    settings?.find((s) => s.key === "max_capacity")?.value ?? "3",
    10
  );

  const icalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ical?token=${process.env.ICAL_SECRET ?? ""}`

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Admin</p>
        <h1 className="font-display text-3xl font-bold text-forest">Settings</h1>
      </div>
      <SettingsClient
        maxCapacity={maxCapacity}
        blackoutDates={(blackoutDates ?? []) as { id: string; date: string; reason: string | null }[]}
        icalUrl={icalUrl}
      />
    </div>
  );
}
