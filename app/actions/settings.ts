"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitize, isValidUUID, isValidDate } from "@/lib/validate";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) throw new Error("Unauthorized");
}

export async function updateCapacity(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try { await requireAdmin(); } catch { return { error: "Unauthorized." }; }
  const val = parseInt(formData.get("max_capacity") as string, 10);
  if (isNaN(val) || val < 1 || val > 50) return { error: "Capacity must be between 1 and 50." };
  const admin = createAdminClient();
  await admin.from("app_settings").upsert({ key: "max_capacity", value: String(val), updated_at: new Date().toISOString() });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/calendar");
  return { success: true };
}

export async function addBlackoutDate(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try { await requireAdmin(); } catch { return { error: "Unauthorized." }; }
  const date   = formData.get("date") as string;
  const reason = sanitize(formData.get("reason") as string || "", 200);
  if (!isValidDate(date)) return { error: "Invalid date." };
  const admin = createAdminClient();
  const { error } = await admin.from("blackout_dates").insert({ date, reason: reason || null });
  if (error) {
    if (error.message.includes("unique")) return { error: "That date is already blocked." };
    return { error: error.message };
  }
  revalidatePath("/admin/settings");
  revalidatePath("/admin/calendar");
  return { success: true };
}

export async function removeBlackoutDate(id: string): Promise<void> {
  if (!isValidUUID(id)) return;
  const admin = createAdminClient();
  await admin.from("blackout_dates").delete().eq("id", id);
  revalidatePath("/admin/settings");
  revalidatePath("/admin/calendar");
}
