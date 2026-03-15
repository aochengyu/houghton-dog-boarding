import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = { title: "Settings | My Account" };

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: client } = await supabase
    .from("clients")
    .select("name, phone, emergency_contact_name, emergency_contact_phone")
    .eq("id", user.id)
    .single();

  return (
    <SettingsClient
      name={client?.name ?? ""}
      phone={client?.phone ?? ""}
      emergency_contact_name={client?.emergency_contact_name ?? ""}
      emergency_contact_phone={client?.emergency_contact_phone ?? ""}
    />
  );
}
