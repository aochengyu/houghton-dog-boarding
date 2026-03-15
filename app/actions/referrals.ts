"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/validate";

export async function adminCreateReferral(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const admin = createAdminClient();
  const referrerId = formData.get("referrer_id") as string;
  const referredId = formData.get("referred_id") as string;

  if (!referrerId || !referredId)        return { error: "Both clients are required." };
  if (!isValidUUID(referrerId))          return { error: "Invalid referrer." };
  if (!isValidUUID(referredId))          return { error: "Invalid referred client." };
  if (referrerId === referredId)         return { error: "Referrer and referred must be different clients." };

  // Verify both clients actually exist
  const { data: clientCheck } = await admin
    .from("clients")
    .select("id")
    .in("id", [referrerId, referredId]);

  if (!clientCheck || clientCheck.length < 2) {
    return { error: "One or both clients not found." };
  }

  const { error } = await admin.from("referrals").insert({
    referrer_id: referrerId,
    referred_id: referredId,
    status: "pending",
  });

  if (error) {
    if (error.message.includes("unique")) return { error: "A referral between these two clients already exists." };
    return { error: error.message };
  }

  revalidatePath("/admin/referrals");
  return { success: true };
}

const REFERRAL_CREDIT_CENTS = 2000; // $20 per party

export async function applyReferralCredit(referralId: string) {
  if (!isValidUUID(referralId)) return { error: "Invalid referral ID." };

  const admin = createAdminClient();

  // ── Atomic update: set status to "credited" ONLY if it's still "pending" ──
  // This prevents race conditions — if two calls fire simultaneously, only one
  // can match the .eq("status", "pending") predicate and update the row.
  const { data: referral, error: updateErr } = await admin
    .from("referrals")
    .update({ status: "credited", credited_at: new Date().toISOString() })
    .eq("id", referralId)
    .eq("status", "pending") // ← atomic guard
    .select("referrer_id, referred_id")
    .single();

  if (updateErr || !referral) {
    return { error: "Referral not found or already credited." };
  }

  // Both parties get credit — safe to run after atomic status update
  await Promise.all([
    admin.rpc("increment_credits", { row_id: referral.referrer_id, amount: REFERRAL_CREDIT_CENTS }),
    admin.rpc("increment_credits", { row_id: referral.referred_id, amount: REFERRAL_CREDIT_CENTS }),
  ]);

  revalidatePath("/admin/referrals");
  return { success: true };
}
