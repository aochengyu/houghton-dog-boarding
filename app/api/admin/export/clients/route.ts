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
  const { data: clients } = await admin
    .from("clients")
    .select("*, pets(id)")
    .order("created_at", { ascending: false });

  if (!clients) return new NextResponse("Failed to fetch", { status: 500 });

  const HEADERS = ["ID","Name","Email","Phone","Referral Code","Referral Credits ($)","Pets","Joined"];

  const rows = clients.map((c: any) => [
    c.id,
    c.name ?? "",
    c.email,
    c.phone ?? "",
    c.referral_code,
    (c.referral_credits / 100).toFixed(2),
    Array.isArray(c.pets) ? c.pets.length : 0,
    c.created_at,
  ].map(csvEscape).join(","));

  const csv = [HEADERS.map(csvEscape).join(","), ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clients-${date}.csv"`,
    },
  });
}
