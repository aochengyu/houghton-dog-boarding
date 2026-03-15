import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function csvEscape(v: unknown): string {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export async function GET(_req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const { data: bookings } = await admin
    .from("bookings")
    .select("*, client:client_id(name, email), pet:pet_id(name, species)")
    .order("start_date", { ascending: false });

  if (!bookings) return new NextResponse("Failed to fetch", { status: 500 });

  const HEADERS = [
    "ID","Client Name","Client Email","Pet Name","Species",
    "Service","Start Date","End Date","Status",
    "Price ($)","Credit ($)","Net ($)","Paid At","Payment Method","Notes","Created At",
  ];

  const rows = bookings.map((b: any) => [
    b.id,
    b.client?.name ?? "",
    b.client?.email ?? "",
    b.pet?.name ?? "",
    b.pet?.species ?? "",
    b.service,
    b.start_date,
    b.end_date ?? "",
    b.status,
    (b.price_cents / 100).toFixed(2),
    (b.credit_applied_cents / 100).toFixed(2),
    ((b.price_cents - b.credit_applied_cents) / 100).toFixed(2),
    b.paid_at ?? "",
    b.payment_method ?? "",
    b.notes ?? "",
    b.created_at,
  ].map(csvEscape).join(","));

  const csv = [HEADERS.map(csvEscape).join(","), ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${date}.csv"`,
    },
  });
}
