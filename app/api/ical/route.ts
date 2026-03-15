import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

function escapeIcal(str: string) {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  if (token !== process.env.ICAL_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const admin = createAdminClient()
  const { data: bookings } = await admin
    .from("bookings")
    .select("id, start_date, end_date, service, status, pet:pet_id(name), client:client_id(name)")
    .in("status", ["confirmed", "active"])
    .order("start_date")

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Paws and Petals//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Paws and Petals Bookings",
    "X-WR-TIMEZONE:America/New_York",
  ]

  for (const b of bookings || []) {
    const pet = (b.pet as unknown) as { name: string } | null
    const client = (b.client as unknown) as { name: string } | null
    const dtstart = (b.start_date as string).replace(/-/g, "")
    const dtend = b.end_date ? (b.end_date as string).replace(/-/g, "") : dtstart
    const summary = escapeIcal(`${pet?.name || "Pet"} — ${b.service} (${client?.name || ""})`)
    lines.push(
      "BEGIN:VEVENT",
      `UID:booking-${b.id}@pawsandpetals`,
      `DTSTART;VALUE=DATE:${dtstart}`,
      `DTEND;VALUE=DATE:${dtend}`,
      `SUMMARY:${summary}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT"
    )
  }

  lines.push("END:VCALENDAR")

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bookings.ics"',
    },
  })
}
