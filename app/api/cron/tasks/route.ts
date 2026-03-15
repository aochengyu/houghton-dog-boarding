import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDayBeforeReminder } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Verify CRON_SECRET
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results: Record<string, unknown> = {};

  // 1. Keep-alive ping — prevents Supabase free-tier from pausing
  const { error: pingError } = await supabase.from("clients").select("id").limit(1);
  results.keepAlive = pingError ? "failed" : "ok";

  // 2. Send day-before reminders for bookings starting tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10); // "YYYY-MM-DD"

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(`
      id,
      service,
      start_date,
      dropoff_time,
      clients ( name, email ),
      pets ( name )
    `)
    .eq("start_date", tomorrowStr)
    .in("status", ["confirmed"])
    .eq("reminder_sent", false);

  if (bookingsError) {
    results.reminders = { error: bookingsError.message };
  } else {
    let sent = 0;
    for (const booking of bookings ?? []) {
      const client = Array.isArray(booking.clients) ? booking.clients[0] : booking.clients;
      const pet = Array.isArray(booking.pets) ? booking.pets[0] : booking.pets;
      if (!client?.email || !client?.name || !pet?.name) continue;

      await sendDayBeforeReminder({
        clientEmail: client.email,
        clientName: client.name,
        petName: pet.name,
        service: booking.service,
        startDate: booking.start_date,
        dropoffTime: booking.dropoff_time ?? null,
      });

      // Mark reminder as sent
      await supabase
        .from("bookings")
        .update({ reminder_sent: true })
        .eq("id", booking.id);

      sent++;
    }
    results.reminders = { sent, total: (bookings ?? []).length };
  }

  // 3. Auto-cancel stale inquiries older than 7 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const { data: stale, error: staleError } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("status", "inquiry")
    .lt("created_at", cutoff.toISOString())
    .select("id");

  results.staleCancelled = staleError
    ? { error: staleError.message }
    : { count: (stale ?? []).length };

  return NextResponse.json({ ok: true, ...results });
}
