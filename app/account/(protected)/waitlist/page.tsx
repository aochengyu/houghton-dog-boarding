import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WaitlistEntry } from "@/lib/db/types";
import { WaitlistClient } from "./WaitlistClient";

export const metadata: Metadata = { title: "Waitlist | My Account" };

export default async function WaitlistPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: entries } = await supabase
    .from("waitlist")
    .select("*")
    .eq("client_id", user.id)
    .order("start_date", { ascending: true });

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">
          Stay informed
        </p>
        <h1 className="font-display text-3xl font-bold text-forest">Waitlist</h1>
        <p className="font-body text-sm text-forest/55 mt-2 max-w-lg">
          When our regular booking calendar is full, you can join the waitlist for your preferred dates.
          We&apos;ll reach out if a spot opens up that matches your request.
        </p>
      </div>

      <WaitlistClient entries={(entries ?? []) as WaitlistEntry[]} />
    </div>
  );
}
