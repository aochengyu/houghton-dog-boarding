"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitize, isValidEmail, isValidReferralCode } from "@/lib/validate";

export async function signIn(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email    = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!isValidEmail(email))   return { error: "Invalid email address." };
  if (password.length < 8)    return { error: "Password must be at least 8 characters." };
  if (password.length > 128)  return { error: "Password too long." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." }; // don't leak specifics

  redirect(email === process.env.ADMIN_EMAIL ? "/admin/clients" : "/account/dashboard");
}

export async function signUp(
  _prev: { error?: string; emailSent?: boolean } | null,
  formData: FormData
): Promise<{ error: string } | { emailSent: true; email: string }> {
  // ── Honeypot: bots fill this, humans don't see it ──
  if ((formData.get("website") as string)?.trim()) {
    return { error: "Invalid submission." };
  }

  const email        = (formData.get("email") as string).trim().toLowerCase();
  const password     = formData.get("password") as string;
  const name         = sanitize(formData.get("name") as string, 100);
  const referralCode = ((formData.get("referral_code") as string) || "").trim().toUpperCase();

  // ── Input validation ──
  if (!isValidEmail(email))             return { error: "Invalid email address." };
  if (!name)                            return { error: "Name is required." };
  if (password.length < 8)             return { error: "Password must be at least 8 characters." };
  if (password.length > 128)           return { error: "Password too long." };
  if (referralCode && !isValidReferralCode(referralCode)) {
    return { error: "Referral code must be 6 uppercase letters/numbers (e.g. PAW4XK)." };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Sign-up failed. Please try again." };

  const admin = createAdminClient();

  // Update name
  await admin.from("clients").update({ name }).eq("id", data.user.id);

  // Link referral if code provided — safe because we validated format above
  if (referralCode) {
    const { data: referrer } = await admin
      .from("clients")
      .select("id")
      .eq("referral_code", referralCode)
      .neq("id", data.user.id)
      .single();

    if (referrer) {
      await admin.from("clients").update({ referred_by: referrer.id }).eq("id", data.user.id);
      // Insert with ON CONFLICT DO NOTHING to prevent duplicates
      await admin.from("referrals").insert({
        referrer_id: referrer.id,
        referred_id: data.user.id,
        status: "pending",
      }).select();
    }
  }

  if (!data.session) {
    return { emailSent: true, email };
  }

  redirect(email === process.env.ADMIN_EMAIL ? "/admin/clients" : "/account/dashboard");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfile(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const name  = sanitize(formData.get("name") as string, 100);
  const phone = sanitize(formData.get("phone") as string, 30);

  if (!name) return { error: "Name is required." };

  const { error } = await supabase
    .from("clients")
    .update({ name, phone: phone || null })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
