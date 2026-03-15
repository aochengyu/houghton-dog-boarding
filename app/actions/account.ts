"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sanitize } from "@/lib/validate";

export async function updateProfile(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const name                    = sanitize(formData.get("name") as string || "", 500);
  const phone                   = sanitize(formData.get("phone") as string || "", 20);
  const emergency_contact_name  = sanitize(formData.get("emergency_contact_name") as string || "", 500);
  const emergency_contact_phone = sanitize(formData.get("emergency_contact_phone") as string || "", 20);

  if (!name) return { error: "Name is required." };

  const { error } = await supabase
    .from("clients")
    .update({ name, phone: phone || null, emergency_contact_name: emergency_contact_name || null, emergency_contact_phone: emergency_contact_phone || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account/settings");
  return { success: true };
}

export async function updatePassword(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const new_password     = formData.get("new_password") as string;
  const confirm_password = formData.get("confirm_password") as string;

  if (!new_password || new_password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (new_password !== confirm_password) {
    return { error: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password: new_password });
  if (error) return { error: error.message };

  return { success: true };
}
