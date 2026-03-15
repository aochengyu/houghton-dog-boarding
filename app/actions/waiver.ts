"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signWaiver(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  await supabase
    .from("clients")
    .update({ waiver_signed_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/account");
  redirect("/account/dashboard");
}
